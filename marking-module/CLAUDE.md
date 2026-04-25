# marking-module

Python 3.12, FastAPI, stateless watermarking microservice.

## Structure

```
server.py          # FastAPI app, CORS, error handling (ValueError→400)
controllers/       # Decode request bytes → call service → return ndarray
services/
  blocks.py        # Block split/stitch (deconstruct / reconstruct)
  masking.py       # SVD + Walsh-Hadamard core algorithm
  attacks.py       # Image attack transformations (rotate, mirror, noise, brightness, compression, exposition, blur, pixelate)
```

## Algorithm

SVD + Walsh-Hadamard watermarking (Valdés García & Morales Santiesteban, UH).

**Key constants:**
- `BLOCK_SIZE = 16` — image is split into 16×16 blocks
- `ALPHA = 0.00005` — default embedding strength; passed as `alpha` parameter to `mask_image()` and `extract_mask()` so callers can override it per-engraving

**Embedding (`mask_image`):** deconstruct → forward Hadamard → batched SVD → modify largest SV per block → inverse Hadamard → reconstruct. Output has same dimensions as input (edge pixels outside block grid copied from original).

**Extraction (`extract_mask`):** both images are cropped to the largest common block-aligned region before comparison. Robust **median** aggregation across blocks/channels recovers watermark SVs.

## Performance rules

- All operations are vectorized — **no Python-level loops** over blocks.
- Use the `@` operator for Hadamard transforms: `(H @ blocks @ H) / n`. **Do not use `np.einsum`** — it is ~28× slower for this pattern.
- `_hadamard_matrix()` is `@lru_cache`'d.

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
