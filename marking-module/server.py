"""
FastAPI entry point for the marking-module service.

Exposes three endpoints:

* ``POST /engrave``       — embed a watermark into a cover image.
* ``POST /extract``       — recover the watermark from a marked image, given the
  original image and the original watermark.
* ``POST /apply-attack``  — apply a named attack transformation to an image
  (rotate, mirror, noise, brightness, compression).

Errors coming from invalid user input (``ValueError``) are surfaced as
``400 Bad Request`` with a short, sanitized message. Unexpected errors
return ``500`` with a generic body; the real exception is logged so an
operator can inspect it without leaking internals to the client.
"""
from __future__ import annotations

import json
import logging
import os

import cv2
import numpy as np
import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from controllers import apply_attack_controller, engrave_mask_controller, extract_mask_controller

logger = logging.getLogger("marking-module")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Marking Module", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _encode_jpeg(image: np.ndarray) -> bytes:
    ok, encoded = cv2.imencode(".jpg", image)
    if not ok:
        raise HTTPException(status_code=500, detail="failed to encode result image")
    return encoded.tobytes()


@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Watermarking service is healthy."}


@app.post("/engrave")
async def engrave_images(
    image: UploadFile = File(...),
    watermark: UploadFile = File(...),
):
    image_bytes = await image.read()
    watermark_bytes = await watermark.read()

    try:
        result_image = engrave_mask_controller.process(image_bytes, watermark_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception:
        logger.exception("/engrave failed")
        raise HTTPException(status_code=500, detail="internal error")

    return Response(content=_encode_jpeg(result_image), media_type="image/jpeg")


@app.post("/extract")
async def extract_images(
    marked_image: UploadFile = File(...),
    original_image: UploadFile = File(...),
    watermark: UploadFile = File(...),
):
    marked_image_bytes = await marked_image.read()
    original_image_bytes = await original_image.read()
    watermark_bytes = await watermark.read()

    try:
        result_image = extract_mask_controller.process(
            marked_image_bytes, original_image_bytes, watermark_bytes
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception:
        logger.exception("/extract failed")
        raise HTTPException(status_code=500, detail="internal error")

    return Response(content=_encode_jpeg(result_image), media_type="image/jpeg")


@app.post("/apply-attack")
async def apply_attack(
    image: UploadFile = File(...),
    attack: str = Form(...),
    params: str = Form("{}"),
):
    image_bytes = await image.read()

    try:
        parsed_params = json.loads(params)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"invalid params JSON: {e}") from e

    try:
        result_image = apply_attack_controller.process(image_bytes, attack, parsed_params)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception:
        logger.exception("/apply-attack failed")
        raise HTTPException(status_code=500, detail="internal error")

    return Response(content=_encode_jpeg(result_image), media_type="image/jpeg")


if __name__ == "__main__":
    host = os.getenv("WATERMARK_SERVICE_HOST", "0.0.0.0")
    port = int(os.getenv("WATERMARK_SERVICE_PORT", "8000"))
    uvicorn.run(app, host=host, port=port)
