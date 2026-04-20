"""
SVD + Walsh-Hadamard watermark embedding and extraction.

Based on the paper by Valdés García & Morales Santiesteban:
  "Incrustación y extracción de una marca de agua invisible en una imagen
   utilizando Descomposición SV" (Universidad de La Habana).

The paper operates on grayscale images. This module extends the algorithm
to BGR colour images by running the same embedding on every colour
channel independently. During extraction, every (block, channel) sample
that maps to the same watermark singular-value index is pooled together
and the robust median is used — this tolerates attacks that damage a
subset of channels or blocks.

All heavy work is vectorised with batched NumPy matmul broadcasting and
batched SVD so a 512×512 image runs in a single pass over ~1000 blocks
instead of a Python-level loop.
"""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache
from typing import Tuple

import cv2
import numpy as np
from scipy.linalg import hadamard

from . import blocks

# Embedding strength.
#
# The paper experiments use α = 0.7 on 512×512 grayscale images. On BGR
# colour images the perturbation is applied to every channel, so a much
# smaller value is sufficient to make the watermark recoverable while
# staying imperceptible. The value below is the project's tuned default;
# larger values give more robustness at the cost of visible artefacts.
ALPHA = 0.00005


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

@lru_cache(maxsize=4)
def _hadamard_matrix(n: int) -> np.ndarray:
    """Cached Hadamard matrix (float64). ``n`` must be a power of two."""
    return hadamard(n).astype(np.float64)


def _to_gray(image: np.ndarray) -> np.ndarray:
    """Convert BGR to grayscale; pass through if already 2-D."""
    if image.ndim == 3 and image.shape[2] == 3:
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    if image.ndim == 2:
        return image
    raise ValueError(f"watermark must be grayscale or BGR, got shape {image.shape}")


def _watermark_svd(watermark: np.ndarray, *, full: bool) -> Tuple[np.ndarray, ...]:
    """
    SVD of the grayscale version of the watermark.

    Returns (U, S, Vt) if ``full`` else just (S,).
    """
    gray = _to_gray(watermark).astype(np.float64)
    if full:
        U, S, Vt = np.linalg.svd(gray, full_matrices=False)
        return U, S, Vt
    return (np.linalg.svd(gray, compute_uv=False),)


def _batched_hadamard(blocks_4d: np.ndarray, H: np.ndarray, n: int) -> np.ndarray:
    """Apply ``B' = (H B H) / n`` to every (channel, block) simultaneously."""
    # blocks_4d: (B, C, n, n).
    # numpy's ``@`` broadcasts H (n, n) across the leading (B, C) dims,
    # which is ~28× faster than the equivalent einsum for large batch sizes.
    return (H @ blocks_4d @ H) / n


def _validate_image(image: np.ndarray, role: str) -> None:
    if image is None:
        raise ValueError(f"{role} is missing")
    if image.ndim != 3 or image.shape[2] != 3:
        raise ValueError(
            f"{role} must be a 3-channel BGR image, got shape {image.shape}"
        )
    if min(image.shape[:2]) < blocks.BLOCK_SIZE:
        raise ValueError(
            f"{role} is smaller than one {blocks.BLOCK_SIZE}×{blocks.BLOCK_SIZE} block"
        )


# ---------------------------------------------------------------------------
# Embedding
# ---------------------------------------------------------------------------

def mask_image(image: np.ndarray, watermark: np.ndarray) -> np.ndarray:
    """
    Embed ``watermark`` into ``image`` using the SVD + Hadamard scheme.

    Both inputs are BGR uint8 arrays.  The returned image has the same
    dimensions as ``image`` — edge pixels outside the block grid are
    copied unchanged from the original.
    """
    _validate_image(image, "cover image")
    (S_w,) = _watermark_svd(watermark, full=False)
    if S_w.size == 0:
        raise ValueError("watermark has no singular values (empty array)")

    # Paper: ``m`` is the width of the watermark. We use the smaller
    # dimension for rectangular marks so the embedding strength stays
    # bounded on long-and-thin watermarks.
    gray_shape = _to_gray(watermark).shape
    m = float(min(gray_shape))

    n = blocks.BLOCK_SIZE
    H = _hadamard_matrix(n)

    # (B, 3, n, n) block stack.
    stack = blocks.deconstruct(image).astype(np.float64)
    num_blocks = stack.shape[0]
    num_sv = S_w.size

    # Forward Hadamard over every block and channel in a single pass.
    B_prime = _batched_hadamard(stack, H, n)

    # Batched SVD: NumPy interprets the trailing two dims as matrices.
    U, S, Vt = np.linalg.svd(B_prime, full_matrices=False)

    # σ_k = σ_B' + (α·b / m) · σ_W, applied to the largest SV of every
    # block. ``b`` starts at 1 so block 0 still carries a signal.
    b_idx = np.arange(1, num_blocks + 1, dtype=np.float64)
    sigma_w_per_block = S_w[np.arange(num_blocks) % num_sv]
    term = (ALPHA * b_idx / m) * sigma_w_per_block              # (B,)
    S[:, :, 0] += term[:, None]                                 # broadcast over C

    # Reconstruct B'_new = U · diag(S) · Vt, batched.
    #   (B, C, n, k) · (B, C, k, n) -> (B, C, n, n)
    B_prime_new = (U * S[:, :, None, :]) @ Vt

    # Inverse Hadamard.
    M = _batched_hadamard(B_prime_new, H, n)

    # Clip to valid pixel range and cast.
    M = np.clip(M, 0.0, 255.0).astype(np.uint8)

    watermarked = blocks.reconstruct(M, image.shape)

    # Paste the watermarked blocks back onto the original so the output
    # preserves the original dimensions.  Edge pixels that fall outside
    # any complete block are kept from the original untouched.
    result = image.copy()
    rh, rw = watermarked.shape[:2]
    result[:rh, :rw] = watermarked
    return result


# ---------------------------------------------------------------------------
# Extraction
# ---------------------------------------------------------------------------

def _extract_once(
    masked_image: np.ndarray,
    original_image: np.ndarray,
    Uw: np.ndarray,
    Vtw: np.ndarray,
    num_sv: int,
    m: float,
) -> np.ndarray:
    """Single-orientation extraction. Assumes the marked image is already
    in the same geometric frame as the original."""
    n = blocks.BLOCK_SIZE

    # Crop both images to the largest common block-aligned region so
    # extraction still works if dimensions differ by a few pixels.
    h = min(masked_image.shape[0], original_image.shape[0])
    w = min(masked_image.shape[1], original_image.shape[1])
    h_crop = (h // n) * n
    w_crop = (w // n) * n

    if h_crop == 0 or w_crop == 0:
        raise ValueError(
            f"images are too small to share any full {n}\u00d7{n} block region"
        )

    masked_c = masked_image[:h_crop, :w_crop]
    original_c = original_image[:h_crop, :w_crop]

    H = _hadamard_matrix(n)

    masked_stack = blocks.deconstruct(masked_c).astype(np.float64)
    orig_stack = blocks.deconstruct(original_c).astype(np.float64)
    num_blocks = masked_stack.shape[0]

    Bm = _batched_hadamard(masked_stack, H, n)
    Bo = _batched_hadamard(orig_stack, H, n)

    Sm = np.linalg.svd(Bm, compute_uv=False)       # (B, C, k)
    So = np.linalg.svd(Bo, compute_uv=False)

    b_idx = np.arange(1, num_blocks + 1, dtype=np.float64)
    factors = (ALPHA * b_idx / m)

    diff_largest = Sm[..., 0] - So[..., 0]         # (B, C)
    samples = diff_largest / factors[:, None]

    channels = samples.shape[1]
    w_index_per_block = np.arange(num_blocks) % num_sv
    w_index_per_sample = np.repeat(w_index_per_block, channels)
    samples_flat = samples.reshape(-1)

    S_final = np.zeros(num_sv, dtype=np.float64)
    for i in range(num_sv):
        bucket = samples_flat[w_index_per_sample == i]
        if bucket.size:
            S_final[i] = np.median(bucket)

    np.clip(S_final, 0.0, None, out=S_final)

    W_rec = (Uw * S_final) @ Vtw
    W_rec = cv2.normalize(W_rec, None, 0, 255, cv2.NORM_MINMAX)
    return W_rec.astype(np.uint8)


def _ncc(a: np.ndarray, b: np.ndarray) -> float:
    """Normalized cross-correlation in [-1, 1]; higher = closer match."""
    x = a.astype(np.float64).ravel()
    y = b.astype(np.float64).ravel()
    if x.size != y.size:
        return float("-inf")
    x = x - x.mean()
    y = y - y.mean()
    denom = float(np.sqrt((x * x).sum() * (y * y).sum()))
    if denom == 0.0:
        return float("-inf")
    return float((x * y).sum() / denom)


def _dihedral_variants(img: np.ndarray):
    """Yield the 8 rotation/mirror variants (dihedral group of the square).

    Rotations and mirrors are lossless pixel permutations, so applying the
    inverse of any such attack recovers the exact engraved image.
    """
    yield np.ascontiguousarray(img)
    yield np.ascontiguousarray(np.rot90(img, 1))
    yield np.ascontiguousarray(np.rot90(img, 2))
    yield np.ascontiguousarray(np.rot90(img, 3))
    flipped = np.fliplr(img)
    yield np.ascontiguousarray(flipped)
    yield np.ascontiguousarray(np.rot90(flipped, 1))
    yield np.ascontiguousarray(np.rot90(flipped, 2))
    yield np.ascontiguousarray(np.rot90(flipped, 3))


def extract_mask(
    masked_image: np.ndarray,
    original_image: np.ndarray,
    original_watermark: np.ndarray,
) -> np.ndarray:
    """
    Recover the watermark from ``masked_image`` using the un-marked
    ``original_image`` and the original watermark (needed for U, V^T).

    The two images do not need pixel-exact matching dimensions — both are
    cropped to the largest common block-aligned region before comparison.

    Robust to rotations and mirroring: the algorithm tries every element of
    the dihedral group applied to the marked image and returns the candidate
    whose reconstructed watermark best matches the reference (via NCC). For
    a non-attacked image the identity variant wins naturally.

    Returns a grayscale uint8 image the same size as the watermark.
    """
    _validate_image(masked_image, "marked image")
    _validate_image(original_image, "original image")

    Uw, Sw, Vtw = _watermark_svd(original_watermark, full=True)
    num_sv = Sw.size
    if num_sv == 0:
        raise ValueError("watermark has no singular values (empty array)")

    ref_gray = _to_gray(original_watermark)
    m = float(min(ref_gray.shape))

    def _run(variant: np.ndarray):
        # NumPy SVD / matmul release the GIL, so threads give real parallelism.
        try:
            candidate = _extract_once(variant, original_image, Uw, Vtw, num_sv, m)
        except ValueError as e:
            return None, float("-inf"), e
        return candidate, _ncc(candidate, ref_gray), None

    variants = list(_dihedral_variants(masked_image))
    with ThreadPoolExecutor(max_workers=len(variants)) as pool:
        results = list(pool.map(_run, variants))

    best_extract: np.ndarray | None = None
    best_score = float("-inf")
    last_error: ValueError | None = None

    for candidate, score, error in results:
        if error is not None:
            last_error = error
            continue
        if score > best_score:
            best_score = score
            best_extract = candidate

    if best_extract is None:
        raise last_error or ValueError("extraction failed: no valid candidate produced")

    return best_extract
