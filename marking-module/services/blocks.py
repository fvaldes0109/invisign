import numpy as np
import cv2

# Set block size to 16x16 as per the paper's experiment
BLOCK_SIZE = 16


def deconstruct(image):
    """
    1. Splits the image into square blocks.
    2. Splits each block into 3 separate channels (B, G, R).
    Returns: A list of lists. Each item is [channel_b, channel_g, channel_r]
    """
    divided_data = []
    h, w, _ = image.shape

    # Iterate in row-major order
    for y in range(0, h, BLOCK_SIZE):
        for x in range(0, w, BLOCK_SIZE):
            # Check if the remaining area is smaller than BLOCK_SIZE (handling edges)
            # The algorithm requires n x n blocks where n is power of 2.
            # We skip partial blocks at edges to maintain stability.
            if (y + BLOCK_SIZE) > h or (x + BLOCK_SIZE) > w:
                continue

            block = image[y:y + BLOCK_SIZE, x:x + BLOCK_SIZE]
            b, g, r = cv2.split(block)
            divided_data.append([b, g, r])

    return divided_data


def reconstruct(divided_channels, original_shape):
    """
    1. Merges the 3 channels back into color blocks.
    2. Stitches the blocks back into the full image using original dimensions.
    """
    h, w, _ = original_shape

    # Calculate how many full blocks fit in width and height
    blocks_per_row = w // BLOCK_SIZE
    blocks_per_col = h // BLOCK_SIZE

    # Reconstruct individual blocks
    reconstructed_blocks = []
    for channels in divided_channels:
        merged_block = cv2.merge(channels)
        reconstructed_blocks.append(merged_block)

    # Prepare a blank canvas
    # Note: If original image wasn't divisible by BLOCK_SIZE,
    # the result will be slightly cropped to the nearest block multiple.
    new_h = blocks_per_col * BLOCK_SIZE
    new_w = blocks_per_row * BLOCK_SIZE
    full_image = np.zeros((new_h, new_w, 3), dtype=np.uint8)

    # Stitch blocks
    idx = 0
    for y in range(0, new_h, BLOCK_SIZE):
        for x in range(0, new_w, BLOCK_SIZE):
            if idx < len(reconstructed_blocks):
                full_image[y:y + BLOCK_SIZE, x:x + BLOCK_SIZE] = reconstructed_blocks[idx]
                idx += 1

    return full_image