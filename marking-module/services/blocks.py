import numpy as np
import math

BLOCK_SIZE = 512

def deconstruct(image):

    blocks = []
    h, w, _ = image.shape

    for y in range(0, h, BLOCK_SIZE):
        for x in range(0, w, BLOCK_SIZE):
            block = image[y:y + BLOCK_SIZE, x:x + BLOCK_SIZE]
            blocks.append(block)

    return blocks

def reconstruct(divided_image):

    num_blocks = len(divided_image)
    grid_size = int(math.sqrt(num_blocks))

    rows = []
    for i in range(0, num_blocks, grid_size):
        row = np.hstack(divided_image[i:i + grid_size])
        rows.append(row)

    full_image = np.vstack(rows)

    return full_image