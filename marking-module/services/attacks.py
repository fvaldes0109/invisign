"""Image attack transformations for watermark robustness testing."""
from __future__ import annotations

import cv2
import numpy as np

SUPPORTED_ATTACKS = ("rotate", "mirror", "noise", "brightness", "compression", "exposition", "blur", "pixelate")


def apply_attack(image: np.ndarray, attack: str, **params) -> np.ndarray:
    if attack == "rotate":
        return _rotate(image, int(params.get("angle", 90)))
    if attack == "mirror":
        return cv2.flip(image, 1)
    if attack == "noise":
        return _add_gaussian_noise(image, float(params.get("std", 25.0)))
    if attack == "brightness":
        return _adjust_brightness(image, float(params.get("factor", 1.3)))
    if attack == "compression":
        return _jpeg_compress(image, int(params.get("quality", 20)))
    if attack == "exposition":
        return _adjust_exposition(image, float(params.get("gamma", 1.5)))
    if attack == "blur":
        return _gaussian_blur(image, int(params.get("radius", 5)))
    if attack == "pixelate":
        return _pixelate(image, int(params.get("block_size", 8)))
    raise ValueError(f"unknown attack '{attack}'; supported: {', '.join(SUPPORTED_ATTACKS)}")


def _rotate(image: np.ndarray, angle: int) -> np.ndarray:
    angle = angle % 360
    if angle == 90:
        return cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    if angle == 180:
        return cv2.rotate(image, cv2.ROTATE_180)
    if angle == 270:
        return cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    h, w = image.shape[:2]
    M = cv2.getRotationMatrix2D((w / 2, h / 2), -angle, 1.0)
    return cv2.warpAffine(image, M, (w, h))


def _add_gaussian_noise(image: np.ndarray, std: float) -> np.ndarray:
    noise = np.random.normal(0, std, image.shape).astype(np.float32)
    return np.clip(image.astype(np.float32) + noise, 0, 255).astype(np.uint8)


def _adjust_brightness(image: np.ndarray, factor: float) -> np.ndarray:
    return np.clip(image.astype(np.float32) * factor, 0, 255).astype(np.uint8)


def _jpeg_compress(image: np.ndarray, quality: int) -> np.ndarray:
    quality = max(1, min(100, quality))
    ok, encoded = cv2.imencode(".jpg", image, [cv2.IMWRITE_JPEG_QUALITY, quality])
    if not ok:
        raise ValueError("failed to JPEG-encode image for compression attack")
    return cv2.imdecode(encoded, cv2.IMREAD_COLOR)


def _adjust_exposition(image: np.ndarray, gamma: float) -> np.ndarray:
    gamma = max(0.1, gamma)
    lut = (np.power(np.arange(256) / 255.0, gamma) * 255).astype(np.uint8)
    return lut[image]


def _gaussian_blur(image: np.ndarray, radius: int) -> np.ndarray:
    radius = max(1, radius)
    ksize = 2 * radius + 1
    return cv2.GaussianBlur(image, (ksize, ksize), 0)


def _pixelate(image: np.ndarray, block_size: int) -> np.ndarray:
    block_size = max(2, block_size)
    h, w = image.shape[:2]
    small = cv2.resize(image, (max(1, w // block_size), max(1, h // block_size)), interpolation=cv2.INTER_LINEAR)
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
