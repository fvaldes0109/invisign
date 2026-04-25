"""HTTP-layer glue for the /extract endpoint."""
from __future__ import annotations

import cv2
import numpy as np

from services import masking


def _decode(image_bytes: bytes, role: str) -> np.ndarray:
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"could not decode {role} — expected a valid image file")
    return image


def process(
    marked_image_bytes: bytes,
    original_image_bytes: bytes,
    watermark_bytes: bytes,
) -> tuple[np.ndarray, float]:
    marked = _decode(marked_image_bytes, "marked image")
    original = _decode(original_image_bytes, "original image")
    mark = _decode(watermark_bytes, "watermark")
    return masking.extract_mask(marked, original, mark)
