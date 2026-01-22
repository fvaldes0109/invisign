import numpy as np
import cv2
import random
from services import blocks

def mask_image(image, watermark):

    image_blocks = blocks.deconstruct(image)

    processed_blocks = []

    for block in image_blocks:
        random_color = (
            random.randint(0, 255),
            random.randint(0, 255),
            random.randint(0, 255)
        )

        color_block = np.full(block.shape, random_color, dtype=np.uint8)

        filtered_block = cv2.addWeighted(block, 0.7, color_block, 0.3, 0)

        processed_blocks.append(filtered_block)

    result = blocks.reconstruct(processed_blocks)
    return result