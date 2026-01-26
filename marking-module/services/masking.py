import numpy as np
import cv2
from scipy.linalg import hadamard
from . import blocks

# Constant alpha = 0.7 used in experiments
ALPHA = 0.0001


def mask_image(image, watermark):
    """
    Embeds the watermark into the image using SVD + Hadamard.
    Algorithm based on [cite: 27-39].
    """
    # --- 1. Process Watermark (Grayscale) ---
    if len(watermark.shape) == 3:
        W_gray = cv2.cvtColor(watermark, cv2.COLOR_BGR2GRAY)
    else:
        W_gray = watermark

    # Resize watermark if needed or just use SVs.
    # Paper uses m as the width of the watermark[cite: 37].
    m = W_gray.shape[0]

    # Get singular values (S_w)
    # SVD: W = U S V^T [cite: 33]
    S_w = np.linalg.svd(W_gray.astype(np.float64), compute_uv=False)

    # --- 2. Deconstruct Image ---
    # Image is divided into n x n blocks [cite: 28]
    channel_groups = blocks.deconstruct(image)
    processed_groups = []

    # Hadamard Matrix Setup
    # n is the block size [cite: 19]
    n = blocks.BLOCK_SIZE
    H = hadamard(n).astype(np.float64)

    # --- 3. Iterate Blocks ---
    for b_index, channels in enumerate(channel_groups):
        modified_channels = []

        # We cycle through singular values if there are more blocks than SVs
        # Paper notes singular values might be assigned to more than one block [cite: 38]
        w_idx = b_index % len(S_w)
        sigma_w = S_w[w_idx]

        for single_channel in channels:
            # A. Forward Hadamard Transform: B' = (H B H) / n [cite: 30]
            B = single_channel.astype(np.float64)
            B_prime = (H @ B @ H) / n

            # B. SVD Decomposition of the block [cite: 34]
            U, S, Vt = np.linalg.svd(B_prime, full_matrices=False)

            # C. Embed Watermark
            # Formula: sigma_k = sigma_B + (alpha * b / m) * sigma_W
            # b is the index of the block. We use b_index + 1 to avoid b=0.
            b = b_index + 1
            term = (ALPHA * b / m) * sigma_w

            # Modify the largest singular value (index 0) [cite: 37]
            S[0] = S[0] + term

            # D. Reconstruct B'
            B_prime_new = U @ np.diag(S) @ Vt

            # E. Inverse Hadamard Transform
            # M = (H Z H) / n [cite: 20]
            M = (H @ B_prime_new @ H) / n

            # Clip and cast
            M = np.clip(M, 0, 255).astype(np.uint8)

            modified_channels.append(M)

        processed_groups.append(modified_channels)

    # --- 4. Reconstruct Image ---
    result = blocks.reconstruct(processed_groups, image.shape)

    return result


def extract_mask(masked_image, original_image, original_watermark):
    """
    Recover the watermark from the masked image using the original image as reference.
    Extraction logic based on [cite: 40-47].
    """

    # --- 1. Process Original Watermark to get U and Vt ---
    if len(original_watermark.shape) == 3:
        W_gray = cv2.cvtColor(original_watermark, cv2.COLOR_BGR2GRAY)
    else:
        W_gray = original_watermark

    m = W_gray.shape[0]

    # We need U and Vt from the original watermark to reconstruct it later [cite: 32, 43]
    Uw, Sw_original, Vtw = np.linalg.svd(W_gray.astype(np.float64), full_matrices=False)

    num_singular_values = len(Sw_original)
    extracted_values_map = {i: [] for i in range(num_singular_values)}

    # --- 2. Deconstruct Both Images ---
    masked_groups = blocks.deconstruct(masked_image)
    original_groups = blocks.deconstruct(original_image)

    n = blocks.BLOCK_SIZE
    H = hadamard(n).astype(np.float64)

    # --- 3. Iterate Blocks ---
    # Ensure we only iterate up to the minimum count (in case crop happened)
    limit = min(len(masked_groups), len(original_groups))

    for b_index in range(limit):
        masked_channels = masked_groups[b_index]
        original_channels = original_groups[b_index]

        w_idx = b_index % num_singular_values
        b = b_index + 1  # Match embedding indexing

        # Calculate the embedding factor: (alpha * b) / m
        factor = (ALPHA * b) / m

        # Iterate through channels (R, G, B)
        for i in range(3):
            # Get Blocks
            B_masked = masked_channels[i].astype(np.float64)
            B_orig = original_channels[i].astype(np.float64)

            # A. Hadamard Transform
            B_prime_masked = (H @ B_masked @ H) / n
            B_prime_orig = (H @ B_orig @ H) / n

            # B. SVD - Only need singular values (S)
            S_masked = np.linalg.svd(B_prime_masked, compute_uv=False)
            S_orig = np.linalg.svd(B_prime_orig, compute_uv=False)

            # C. Extract Watermark Singular Value
            # Formula: sigma_W = (sigma_k - sigma_B') / ((alpha * b) / m) [cite: 45]
            omega_k = S_masked[0]  # Marked largest SV
            omega_b = S_orig[0]  # Original largest SV

            omega_w_extracted = (omega_k - omega_b) / factor

            extracted_values_map[w_idx].append(omega_w_extracted)

    # --- 4. Reconstruct Singular Values Vector ---
    S_final = np.zeros(num_singular_values)

    for i in range(num_singular_values):
        values = extracted_values_map[i]
        if values:
            S_final[i] = np.mean(values)
        else:
            S_final[i] = 0

    # --- 5. Reconstruct Watermark Image ---
    # W = U * S * Vt [cite: 33]
    W_reconstructed = Uw @ np.diag(S_final) @ Vtw

    W_reconstructed = cv2.normalize(W_reconstructed, None, 0, 255, norm_type=cv2.NORM_MINMAX)
    W_reconstructed = W_reconstructed.astype(np.uint8)

    return W_reconstructed