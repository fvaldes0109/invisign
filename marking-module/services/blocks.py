"""
Block splitting / stitching for the SVD + Walsh-Hadamard watermarker.

The algorithm from the paper works on n×n blocks with n a power of two.
These helpers turn a (H, W, 3) BGR image into a (num_blocks, 3, n, n)
array (and back) using pure NumPy strides — no Python-level loops.

Images whose dimensions are not multiples of ``BLOCK_SIZE`` are cropped
to the nearest multiple; the cropped extent is returned via the shape
of the reconstruction so the caller can re-pad if desired.
"""
from __future__ import annotations

from typing import Tuple

import numpy as np

# 16×16 blocks match the experiments in the paper.
BLOCK_SIZE = 16


def _grid(image_shape: Tuple[int, ...]) -> Tuple[int, int]:
    """Return (blocks_per_col, blocks_per_row) for a given image shape."""
    h, w = image_shape[:2]
    return h // BLOCK_SIZE, w // BLOCK_SIZE


def deconstruct(image: np.ndarray) -> np.ndarray:
    """
    Split a BGR image into non-overlapping n×n blocks.

    Returns an array of shape ``(num_blocks, channels, n, n)`` in row-major
    order (left to right, top to bottom). Partial blocks at the right/bottom
    edges are dropped.
    """
    if image.ndim != 3:
        raise ValueError(f"deconstruct expects a 3-D array, got shape {image.shape}")

    h, w, c = image.shape
    blocks_per_col, blocks_per_row = _grid(image.shape)
    n = BLOCK_SIZE

    if blocks_per_col == 0 or blocks_per_row == 0:
        raise ValueError(
            f"image is smaller than one {n}×{n} block (got {h}×{w})"
        )

    # Crop to an exact multiple of BLOCK_SIZE on both sides.
    cropped = image[: blocks_per_col * n, : blocks_per_row * n]

    # (H, W, C) -> (rows_of_blocks, n, cols_of_blocks, n, C)
    # -> (rows_of_blocks, cols_of_blocks, C, n, n)
    # -> (num_blocks, C, n, n)
    return np.ascontiguousarray(
        cropped
        .reshape(blocks_per_col, n, blocks_per_row, n, c)
        .transpose(0, 2, 4, 1, 3)
        .reshape(-1, c, n, n)
    )


def reconstruct(blocks_array: np.ndarray, original_shape: Tuple[int, ...]) -> np.ndarray:
    """
    Stitch a ``(num_blocks, channels, n, n)`` array back into a
    ``(new_h, new_w, channels)`` image, cropped to the largest multiple of
    ``BLOCK_SIZE`` that fits in ``original_shape``.
    """
    if blocks_array.ndim != 4:
        raise ValueError(
            f"reconstruct expects a 4-D array, got shape {blocks_array.shape}"
        )

    num_blocks, c, n, n2 = blocks_array.shape
    if n != BLOCK_SIZE or n2 != BLOCK_SIZE:
        raise ValueError(
            f"blocks must be {BLOCK_SIZE}×{BLOCK_SIZE}, got {n}×{n2}"
        )

    blocks_per_col, blocks_per_row = _grid(original_shape)
    expected = blocks_per_col * blocks_per_row
    if num_blocks != expected:
        raise ValueError(
            f"block count mismatch: got {num_blocks}, expected "
            f"{expected} for shape {original_shape}"
        )

    # Inverse of deconstruct's transpose/reshape.
    return (
        blocks_array
        .reshape(blocks_per_col, blocks_per_row, c, n, n)
        .transpose(0, 3, 1, 4, 2)
        .reshape(blocks_per_col * n, blocks_per_row * n, c)
    )
