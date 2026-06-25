# marking-module

Python 3.12, FastAPI, stateless watermarking microservice.

## Structure

```
server.py          # FastAPI app, CORS, error handling (ValueError→400)
controllers/       # Decode request bytes → call service → return ndarray
services/
  blocks.py        # Block split/stitch (deconstruct / reconstruct)
  masking.py       # SVD core algorithm
  attacks.py       # Image attack transformations (rotate, mirror, noise, brightness, compression, exposition, blur, pixelate)
```

## Algorithm

SVD-based watermarking (after Valdés García & Morales Santiesteban, UH).

> The source paper applies a Walsh-Hadamard transform to each block before the
> SVD. It has been **removed**: `H/√n` is orthogonal and singular values are
> invariant under orthogonal transforms, so the transform leaves every quantity
> the scheme uses (the block singular values) unchanged — an ablation over the
> USC-SIPI set confirmed identical results within uint8 rounding. The code
> operates directly on the raw block SVD.

**Key constants:**
- `BLOCK_SIZE = 16` — image is split into 16×16 blocks
- `ALPHA = 0.01` — default embedding strength (imperceptible at ~50 dB PSNR, still recoverable); passed as `alpha` to `mask_image()` / `extract_mask()` so callers can override per-engraving. Values ≪ 0.01 embed nothing recoverable; larger values trade imperceptibility for robustness.

**Embedding (`mask_image`):** deconstruct → batched SVD → modify largest SV per block → reconstruct. Output has same dimensions as input (edge pixels outside block grid copied from original).

**Extraction (`extract_mask`):** both images are cropped to the largest common block-aligned region before comparison. Robust **median** aggregation across blocks/channels recovers watermark SVs. Extraction reconstructs from the watermark's own `U/Vᵀ`, so it yields a watermark-shaped output even for an *unmarked* cover — judge recovery by **lift over a zero-embedding control**, not raw NCC.

## Performance rules

- All operations are vectorized — **no Python-level loops** over blocks; use batched `np.linalg.svd` over the `(blocks, channels, n, n)` stack.

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness check |
| `POST` | `/engrave` | Embed watermark into image (form: `image`, `watermark`, optional `alpha` float) |
| `POST` | `/extract` | Recover watermark from marked image (form: `marked_image`, `original_image`, `watermark`, optional `alpha` float) |
| `POST` | `/apply-attack` | Apply attack transformation to image (form: `image`, `attack`, `params` JSON) |

**Supported attacks:** `rotate` (param: `angle` degrees), `mirror`, `noise` (param: `std`), `brightness` (param: `factor`), `compression` (param: `quality` 1–100), `exposition` (param: `gamma` 0.1–3.0), `blur` (param: `radius` px), `pixelate` (param: `block_size` px).

## No tests

No test framework is configured.

## Running

```bash
uvicorn server:app --reload          # local
docker compose up backend            # via compose
```
