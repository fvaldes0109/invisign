# Invisign: Embedding and Extraction of an Invisible Watermark in an Image

*Fernando Valdés García*

## Problem statement

Digital watermarking embeds information into a medium so it can later be recovered to verify the authenticity or trace the distribution of that medium. A good invisible watermark must not degrade the perceptible quality of the original and must be robust against attacks that aim to erase it. This project implements an **SVD-domain** (block singular-value) watermarking method that embeds an invisible, attack-resistant mark into an image and can later extract it.

## Relevance

The solution targets **organisations that distribute images they hold the original of and need to trace where a leaked copy came from**: a film studio shipping a different copy to each cinema, a stock agency or press wire issuing per-licensee copies, a content platform seeding per-partner copies. By the time a leaked copy resurfaces it has usually been re-compressed, resized and blurred, and the obvious defences fail: a visible watermark defaces the asset (and is cropped out anyway), and metadata tags are stripped the moment the file is re-saved. Because Invisign embeds the mark in the **singular values of small image blocks** rather than in raw pixels, it is invisible to the eye (~50 dB) yet survives exactly those lossy edits; and since the owner holds the master, the original-image requirement of extraction costs them nothing. The honest scope is *owner-held forensic tracing*, not settling *contested ownership* between two parties (see **Usage**).

## Input and output

**Inputs**

- **Host image**: a standard raster image (PNG/JPEG/WebP), grayscale or color (color is handled per-channel).
- **Watermark image**: must be **square**; auto-resized to the nearest **power-of-2** side length.
- Optional **`alpha`** embedding-strength parameter (float) per engraving.
- For extraction: the **marked image**, the **original (un-marked) image**, and the **original watermark** are all required.

**Outputs**

- **Engrave:** a marked image with the **same dimensions** as the host, visually indistinguishable from it.
- **Extract:** a recovered grayscale watermark **plus a Normalized Cross-Correlation (NCC) similarity score in [0, 1]**.

## Metrics

- **Robustness: NCC** between the recovered and the reference watermark, clamped to **[0, 1]** (also used internally to pick the best of the 8 dihedral orientations during extraction).
- **Imperceptibility: PSNR and SSIM** of the marked image against the original cover.

One subtlety governs how robustness is read: extraction reconstructs the mark from the original watermark's own singular vectors, so even an **unmarked** cover yields a watermark-shaped output with NCC ≈ 0.49. Robustness is therefore reported as **lift = NCC(marked) − NCC(zero-embedding control)**. Both metrics are measured on real data (USC-SIPI); achieved values (~51 dB PSNR / SSIM 0.999, with lift +0.44 on clean images and +0.32…+0.36 under noise/JPEG/blur) appear under **Experiments**.

## Data

Host (cover) images come from the **USC-SIPI Image Database**, the standard test-image suite of the watermarking literature; the **Miscellaneous** volume is the working set. One object = one standard test image. **39 images**: 22 × 512×512, 14 × 256×256, 3 × 1024×1024; 25 grayscale (8 bpp) + 14 color (24 bpp); uncompressed TIFF, **losslessly converted to 8-bit PNG** so pixel values are preserved for fair measurement. It is a curated test suite, not a labeled ML dataset (class imbalance does not apply), deliberately spanning high-frequency texture (Baboon) to smooth low-frequency portraits. Two caveats: USC-SIPI does not own the copyright of most images, and the historically common **Lena** image has been removed from the current distribution. **Watermark images** are square logos supplied separately (the shipped `mark.png` is a 128×128 solid star). The remaining USC-SIPI volumes (Aerials, Textures, Sequences: 210 TIFFs) are available for broader testing.

### Links to datasets

- **USC-SIPI Image Database** (primary, adopted): https://sipi.usc.edu/database/
- **Kodak True Color Image Suite** (considered, not yet used): https://r0k.us/graphics/kodak/
- **BOWS-2** (considered, not yet used), 10,000 grayscale 512×512 images, CC BY 4.0: https://data.mendeley.com/datasets/kb3ngxfmjw/1

## Validation

Validation is a **robustness battery** over the 39 covers: each image is watermarked, subjected to eight attacks (**rotation, mirror, Gaussian noise, brightness, JPEG compression, exposure/gamma, blur, pixelation**) and the watermark is re-extracted (trying all 8 dihedral orientations, keeping the best NCC). Recovery is **not** judged by raw NCC: each attack is validated against a **zero-embedding control**, the same cover attacked with no watermark embedded, and success is measured as **lift = NCC(marked) − NCC(control)**, which isolates the genuine contribution of the watermark from the reconstruction floor (≈ 0.49).

## Solutions overview

### A robust block-based image watermarking scheme using fast Hadamard transform and singular value decomposition

Abdallah, Ben Hamza, Bhattacharya, *ICPR'06*, 2006. The **primary basis** for the embedding/extraction formulas used here. https://doi.org/10.1109/ICPR.2006.167

### Robust digital watermarking techniques for multimedia protection

Abdallah, PhD thesis, Concordia University, 2009. Extends the block-SVD scheme to geometric-attack robustness and 3D/video. https://spectrum.library.concordia.ca/976203/

### An adaptive digital image watermarking technique for copyright protection

Lee & Lee, *IEEE Trans. Consumer Electronics* 45(4), 1999. Representative **frequency-domain, perceptually-adaptive** scheme; context for the robustness goals here. https://ieeexplore.ieee.org/document/809176/

### Reversible data hiding

Ni, Shi, Ansari, Su, *IEEE TCSVT* 16(3), 2006. Representative **spatial-domain** scheme; stands in for the pixel-domain category the LSB baseline embodies. https://doi.org/10.1109/TCSVT.2006.869964

## Experiments

### Baseline

Two baselines ran through the **same battery** (39 images, same watermark, same attacks), each reported as lift over its own zero-embedding control:

- **Baseline A (additive spatial overlay, non-blind):** faintly add the mean-centred watermark, `marked = clip(cover + g·Wᶜ)`; recover by subtraction (with the same dihedral resync). The gain `g` is matched per image to the SVD method's perturbation energy (~48 dB), isolating the question: *what does the SVD domain buy over adding the watermark in pixels?*
- **Baseline B (LSB substitution, blind):** the watermark's most-significant bit written into the cover's least-significant bit, recovered by majority vote across channels; needs neither the original image nor watermark.

#### Baseline metrics and results

Lift over each method's own control, mean over 39 images (SVD/additive at α = 0.01; row maximum in **bold**; in parentheses, the lift as a share of that method's own maximum achievable lift):

| Attack | Additive (spatial) | LSB (blind) | SVD (main) |
|---|---:|---:|---:|
| No attack | +0.958 (96%) | **+0.987 (99%)** | +0.441 (87%) |
| Rotate 90° | **+0.958 (96%)** | +0.560 (56%) | +0.441 (87%) |
| Mirror | +0.958 (96%) | **+0.981 (98%)** | +0.441 (87%) |
| Gaussian noise (std 25) | +0.129 (13%) | +0.001 (0%) | **+0.321 (63%)** |
| Brightness (×1.3) | **+0.038 (4%)** | +0.032 (3%) | +0.002 (0%) |
| JPEG compression (q=20) | +0.224 (22%) | +0.003 (0%) | **+0.356 (70%)** |
| Exposure (γ=1.5) | +0.133 (13%) | **+0.134 (13%)** | −0.003 (−1%) |
| Blur (radius 5) | +0.121 (12%) | +0.032 (3%) | **+0.349 (69%)** |
| Pixelate (block 8) | +0.030 (3%) | +0.080 (8%) | **+0.137 (27%)** |

**Note that the maximum achievable lift differs per method** (it is 1 minus the method's own control floor). Additive and LSB extract nothing watermark-shaped from an unmarked image (floor ≈ 0, ceiling ≈ 1.0), whereas the SVD extraction rebuilds a watermark-shaped output by construction (floor ≈ 0.49, ceiling ≈ 0.51). The percentages express each lift against its own ceiling; read this way, SVD sits near its maximum on clean images (87%) and its lead on the lossy attacks only widens (noise: 63% vs. additive's 13%).

Imperceptibility is comparable across all three (additive 48.2 dB, LSB 51.0, SVD 51.1; all invisible). **Findings.** The non-blind additive overlay matches or beats SVD on clean recovery, geometry and tone (subtracting the original cancels the cover); blind LSB is weakest, collapsing under any value change. The SVD method wins decisively exactly on the **lossy/diffusive attacks (noise, JPEG, blur, pixelate)**: the largest singular value carries each block's low-frequency energy, which compression, blur and averaging preserve. Since real redistribution almost always involves re-compression, resizing and blur, the SVD representation earns its place on precisely the distortions a leaked image undergoes; its advantage is real but specifically **robustness to lossy processing**.

### Main model

A **block-based SVD watermarking scheme**, applied per colour channel; the watermark is reduced to grayscale, square at `m × m`. (The source paper's Walsh-Hadamard step is **omitted**: `H/√n` is orthogonal and singular values are invariant under orthogonal transforms, so it changes nothing the scheme reads or writes; an ablation confirmed identical results within uint8 rounding.)

- **Embedding (`mask_image`):** split the image into 16×16 blocks; SVD each block (`B = U·S·Vᵀ`) and the watermark; modify each block's largest singular value, `σᵢᵏ = σᵢᴮ + (α·b/m)·σᵢᵂ` (block index `b`, strength `α`, watermark singular values cycled across blocks); reconstruct and stitch.
- **Extraction (`extract_mask`):** requires the original image and watermark. Block-SVD both images (cropped to the common block-aligned region), solve back `σᵢᵂ = (σᵢᵏ − σᵢᴮ) / ((α·b)/m)`, aggregate with the robust **median** across blocks/channels, reconstruct `W = Uᵂ·diag(S)·Vᵀᵂ` from the watermark's own singular vectors, and return the best-NCC result over all 8 dihedral orientations. All operations are vectorised (a single batched `np.linalg.svd`).

#### Main model metrics and results

Aggregated over the 39 covers with the 128×128 star watermark; attack parameters fixed (noise seed pinned for reproducibility).

**Imperceptibility (marked vs. original, mean over 39 images):**

| Embedding strength | Mean PSNR (dB) | SSIM | Verdict |
|---|---:|---:|---|
| α = 5×10⁻⁵ (old default) | 55.4 | 0.9994 | imperceptible, but nothing recoverable (lift ≈ 0) |
| **α = 0.01 (current default)** | 51.1 | 0.9990 | imperceptible, recoverable |
| α = 0.7 (paper) | 22.3 | 0.9380 | clearly visible |

**Robustness as lift over the zero-embedding control (mean over 39 images);** the control floor is independent of α:

| Attack | Control floor | NCC @ α=0.01 | **lift @ 0.01** | NCC @ α=0.7 | **lift @ 0.7** |
|---|---:|---:|---:|---:|---:|
| No attack | 0.492 | 0.933 | **+0.441** | 0.870 | +0.378 |
| Rotate 90° | 0.492 | 0.933 | +0.441 | 0.870 | +0.378 |
| Mirror | 0.492 | 0.933 | +0.441 | 0.870 | +0.378 |
| Gaussian noise (std 25) | 0.492 | 0.813 | +0.321 | 0.837 | +0.345 |
| Brightness (×1.3) | 0.552 | 0.554 | +0.002 | 0.679 | +0.127 |
| JPEG compression (q=20) | 0.506 | 0.862 | **+0.356** | 0.847 | +0.341 |
| Exposure (γ=1.5) | 0.314 | 0.311 | −0.003 | 0.737 | **+0.423** |
| Gaussian blur (radius 5) | 0.495 | 0.844 | +0.349 | 0.857 | +0.362 |
| Pixelate (block 8) | 0.507 | 0.644 | +0.137 | 0.839 | +0.332 |

**Reading the results.** At α = 0.01 (~51 dB, invisible) the watermark recovers with strong lift on clean images (+0.441); geometric attacks are free (the dihedral search inverts these lossless permutations exactly), and the lossy attacks that matter survive: noise +0.321, JPEG +0.356, blur +0.349. The weak spots are **brightness and exposure** (≈ 0): global tone curves shift the block singular values in a way the linear extraction cannot undo, and they only recover at the clearly visible α = 0.7. Stronger embedding is not uniformly better: clean recovery *peaks* at α = 0.01 (NCC 0.933 vs. 0.870 at 0.7). The old α = 5×10⁻⁵ default illustrates why lift matters: it perturbs ~148 000 pixels yet embeds nothing recoverable (lift +0.000 on every attack).

### Code repository

https://github.com/fvaldes0109/invisign. The project is a three-service stack: React + TypeScript frontend, Laravel REST API (users, storage, orchestration), and a Python/FastAPI watermarking microservice, orchestrated via Docker Compose.

## Usage

Website: https://invisign.com. The solution is consumed as a **web application**: users register, upload host images and (square) watermarks, trigger **engravings** and **extractions**, and review results in a dashboard. The marking microservice is stateless.

**Value proposition and honest scope.** The owner embeds a *different* invisible mark in each recipient's copy; when a copy leaks, the responsible recipient is identified by testing the leak against the known marks (closed-set arg-max of the recovery lift; the reconstruction floor is roughly common across candidates and cancels in the comparison). Unlike visible marks (cropped out), metadata (stripped on re-save) or LSB-style marks (wiped by re-encoding), the block-singular-value mark survives the noise, JPEG re-encoding and blur of a web re-upload at ~50 dB with no visible defacement; and non-blind extraction is no obstacle, since the owner holds the master. The scheme's honest home is therefore **owner-held forensic tracing**. It is a *weak* fit for contested-ownership proof: extraction rebuilds the mark from the watermark's own singular vectors, so an adversary can "extract" *their* watermark just as convincingly. This is the classic invertibility/ambiguity attack on SVD watermarking (Zhang & Li, 2005), directly demonstrated by our ≈ 0.49 floor. Production-grade tracing would additionally require video/camcorder robustness, anti-collusion fingerprint codes (e.g. Tardos), and coded serial capacity for thousands of distinct marks.
