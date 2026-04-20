"""HTTP-layer glue for the /apply-attack endpoint."""
from __future__ import annotations

import cv2
import numpy as np

from services import attacks


def _decode(image_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("could not decode image — expected a valid image file")
    return image


def process(image_bytes: bytes, attack_type: str, params: dict) -> np.ndarray:
    image = _decode(image_bytes)
    return attacks.apply_attack(image, attack_type, **params)
