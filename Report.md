# Invisign: Embedding and Extraction of an Invisible Watermark in an Image

*Fernando Valdés García*

## Problem statement

With the growing flow of digital multimedia on the internet, protecting media against unauthorized copying and distribution has become important. One technique to address this is digital watermarking: embedding information into a medium that can later be recovered to verify the authenticity/ownership of that medium. A watermark should not degrade the perceptible quality of the original medium (ideally it is imperceptible/undetectable) and should be robust against attacks that aim to erase it.

This project implements an **SVD-domain** (block singular-value) watermarking method that embeds an invisible, attack-resistant mark into an image and can later extract it.

## Relevance

The solution is relevant to any case requiring **copyright protection, ownership proof, or authenticity verification** of digital images, e.g. photographers, news/press agencies, stock-image providers, and content platforms. Because the mark is embedded in the **singular values of small image blocks** rather than in the raw pixels, it is invisible to the eye yet survives common lossy edits such as compression and blur, which is what makes it useful for these stakeholders.

## Input and output

**Inputs**
- **Host image**: a standard raster image (PNG/JPEG), grayscale or color (color is handled per-channel by the implementation).
- **Watermark image**: must be **square**; the system auto-resizes it to the nearest **power-of-2** side length before embedding.
- Optional **`alpha`** embedding-strength parameter (float) per engraving.
- For extraction: the **marked image**, the **original (un-marked) image**, and the **original watermark** are all required.

**Outputs**
- **Engrave:** a marked image with the **same dimensions** as the input host image, visually indistinguishable from it (edge pixels outside the 16×16 block grid are copied from the original).
- **Extract:** a recovered grayscale watermark image (same size as the original watermark) **plus a Normalized Cross-Correlation (NCC) similarity score in [0, 1]** indicating recovery quality.

## Metrics

Two complementary metrics are used, matching the two goals of an invisible watermark:

- **Robustness: Normalized Cross-Correlation (NCC)** between the recovered and the reference watermark, clamped to **[0, 1]** (higher = closer match). NCC is also used internally to pick the best candidate among the 8 dihedral (rotation/mirror) orientations during extraction.
- **Imperceptibility: PSNR and SSIM** of the marked image against the original cover. Higher PSNR (in dB) and SSIM (closer to 1) indicate a less perceptible mark.

Both metrics are measured on real data (the USC-SIPI battery); the values appear under **Main model metrics and results** and **Baseline metrics and results** below. As reported there, jointly measuring imperceptibility and robustness also revealed that NCC alone can be misleading for this scheme: extraction reconstructs the mark from the original watermark's own singular vectors, which produces a watermark-shaped output (and a non-trivial NCC floor) even when nothing was embedded; robustness is therefore meaningful only as *lift* above that floor.

## Data

Host (cover) images come from the **USC-SIPI Image Database**, the standard test-image suite used across the image-watermarking literature. The **Miscellaneous** volume is the primary working set, as it contains the canonical watermarking test images (Mandrill/Baboon, Peppers, House, Boat, etc.). One object = one standard test image.

**Miscellaneous volume, 39 images:**
- **Resolution:** 22 × 512×512, 14 × 256×256, 3 × 1024×1024.
- **Channels:** 25 grayscale (8 bpp) + 14 color (24 bpp RGB).
- **Format:** uncompressed TIFF. Since the service's uploader accepts only PNG/JPEG/WebP, the volume has been **losslessly converted to 8-bit PNG** (`datasets/usc-sipi/misc_png/`, 39 images) so pixel values are preserved for fair imperceptibility/recovery measurement.

The remaining USC-SIPI volumes are also available for broader testing: **Aerials** (38 images), **Textures** (64 Brodatz textures/mosaics), and **Sequences** (69 video frames), 210 TIFF images in total.

**Watermark images** are not drawn from a dataset: they are square logo images supplied separately (the shipped `mark.png` is a **128×128 solid star**); the system auto-resizes each to the nearest power-of-2 square before embedding.

**Special traits:** this is a curated *test-image suite*, not a labeled/balanced ML dataset, so class imbalance does not apply. It deliberately spans diverse frequency content (e.g. Baboon = high-frequency texture, smooth portraits = low-frequency) and a grayscale/color mix, which stresses the per-block singular-value structure this method operates on. Two caveats: USC-SIPI does **not** own the copyright to most images (status listed as "unknown" for many), and the historically common **Lena** image (`4.2.04`) has been **removed** from the current distribution.

### Links to datasets

- **USC-SIPI Image Database** (primary, adopted): https://sipi.usc.edu/database/

Additional public datasets considered for larger-scale / color-specific testing (not yet downloaded):

- **Kodak True Color Image Suite**, 24 color PNG photos, 768×512, released for unrestricted use: https://r0k.us/graphics/kodak/
- **BOWS-2 (Break Our Watermarking System, 2nd ed.)**, 10,000 grayscale 512×512 images, purpose-built for watermarking, CC BY 4.0: https://data.mendeley.com/datasets/kb3ngxfmjw/1

## Validation

Validation is performed as a **robustness battery** over the 39 USC-SIPI cover images: each image is watermarked, subjected to a set of attacks, and the watermark is re-extracted. The implemented attacks are: **rotation, mirror, additive Gaussian noise, brightness change, JPEG compression, exposure/gamma, blur, and pixelation** (eight in total). Extraction is made robust to rotation/mirror by trying all 8 elements of the dihedral group and keeping the variant with the highest NCC.

Crucially, recovery is **not** validated by raw NCC. Because extraction reconstructs the mark from the original watermark's own singular vectors, an *unmarked* cover already yields a watermark-shaped output with a non-trivial NCC (≈ 0.49). Each attack is therefore validated against a **zero-embedding control**, the same cover put through the same attack with no watermark embedded, and success is measured as **lift = NCC(marked) − NCC(control)**, which isolates the genuine contribution of the embedded watermark from this reconstruction floor.

## Solutions overview

The method builds on block-based singular-value-decomposition (SVD) watermarking, and is positioned against earlier spatial-domain and adaptive frequency-domain schemes.

### A robust block-based image watermarking scheme using fast Hadamard transform and singular value decomposition

Emad E. Abdallah, A. Ben Hamza, Prabir Bhattacharya, *IEEE 18th International Conference on Pattern Recognition (ICPR'06)*, 2006. The **primary basis** for the embedding/extraction formulas used here (distributing the watermark's singular values over the image's per-block SVD). https://doi.org/10.1109/ICPR.2006.167

### Robust digital watermarking techniques for multimedia protection

Emad Eddien Awad Abdallah, PhD thesis, Concordia University, 2009. The second foundational work the methodology is based on; extends the block-based SVD scheme to geometric-attack robustness and 3D/video. https://spectrum.library.concordia.ca/976203/

### An adaptive digital image watermarking technique for copyright protection

Chang-Hsing Lee, Yeuan-Kuen Lee, *IEEE Trans. Consumer Electronics* 45(4):1005–1015, 1999. Representative **frequency-domain, perceptually-adaptive** scheme that survives low-pass/median filtering, resampling and lossy JPEG, context for the robustness goals here. https://ieeexplore.ieee.org/document/809176/

### Reversible data hiding

Z. Ni, Y.-Q. Shi, N. Ansari, W. Su, *IEEE Trans. Circuits and Systems for Video Technology* 16(3):354–362, 2006. Representative **spatial-domain** scheme (histogram-shifting); stands in for the "simple pixel-domain" category that the LSB baseline embodies and that transform-domain methods aim to beat on robustness. https://doi.org/10.1109/TCSVT.2006.869964

## Experiments

### Baseline

Two baselines were implemented and run through the **same battery** (39 USC-SIPI images, same watermark, same attacks), reported as **lift over each method's own zero-embedding control** so all three sit on the same footing:

**Baseline A: additive (spatial overlay).** The simplest watermark imaginable, and the *non-blind pixel-space twin* of the SVD method: faintly add the mean-centred watermark to the cover, `marked = clip(cover + g·Wᶜ)`, and recover by subtraction, `est = marked − original` (with the same dihedral resync). The gain `g` is matched per image to the SVD method's perturbation energy, so imperceptibility is comparable (~48 dB). This isolates the core question: **what does embedding in the SVD domain buy over just adding the watermark in pixels?**

**Baseline B: LSB substitution (blind).** The classic spatial baseline (cf. *Reversible data hiding* in Solutions overview): the watermark's most-significant bit is written into the cover's least-significant bit, recovered by majority vote across channels. Unlike the other two it is **blind**: it needs neither the original image nor watermark.

#### Baseline metrics and results

Lift over each method's own control, mean over 39 images, at the working strength (SVD/additive at α = 0.01; higher = more genuine recovery; row maximum in **bold**):

| Attack | Additive (spatial) | LSB (blind) | SVD (main) |
|---|---:|---:|---:|
| No attack | +0.958 | **+0.987** | +0.441 |
| Rotate 90° | **+0.958** | +0.560 | +0.441 |
| Mirror | +0.958 | **+0.981** | +0.441 |
| Gaussian noise (std 25) | +0.129 | +0.001 | **+0.321** |
| Brightness (×1.3) | **+0.038** | +0.032 | +0.002 |
| JPEG compression (q=20) | +0.224 | +0.003 | **+0.356** |
| Exposition (γ=1.5) | +0.133 | **+0.134** | −0.003 |
| Blur (radius 5) | +0.121 | +0.032 | **+0.349** |
| Pixelate (block 8) | +0.030 | +0.080 | **+0.137** |

**Imperceptibility (mean over 39 images):** additive 48.2 dB / SSIM 0.9994 · LSB 51.0 dB / 0.9983 · SVD 51.1 dB / 0.9990, all visually imperceptible.

**Finding 1: a one-line additive overlay matches or beats the SVD method everywhere except lossy/diffusive attacks.** Because additive is non-blind, subtracting the original cancels the cover and returns the watermark almost perfectly on clean images (+0.958) and, with the dihedral resync, on rotation and mirroring (+0.958), far above SVD's +0.441; it also edges ahead on the (weak) tone attacks, where SVD is near-zero (exposition +0.133 vs −0.003). The SVD method pulls ahead on only **noise (+0.321 vs +0.129), JPEG (+0.356 vs +0.224) and blur (+0.349 vs +0.121)**, the lossy, energy-spreading distortions where operating on block singular values genuinely helps. This is the sharpest statement of the method's value: the SVD representation buys robustness to lossy processing, and little else over trivial pixel differencing.

**Finding 2: LSB is the weakest of the three.** Being *blind* it cannot subtract the cover, so it has no defence against value changes (noise +0.001, JPEG +0.003, blur +0.032) and no geometric re-synchronisation (rotation only +0.560 vs additive's +0.958). Its single strength, high-fidelity clean recovery (+0.987), it shares with additive.

**Finding 3: the SVD method's advantage is real but narrow.** Across nine attacks it wins decisively on four (noise, JPEG, blur, pixelate) and is matched or beaten by the trivial additive overlay on clean recovery, geometry and tone. The value of the SVD representation is specifically **robustness to lossy/diffusive distortion**, not capacity, fidelity, or geometric/tonal resilience.

**Finding 4: the embedders are complementary, and the SVD method is *not* made obsolete by the simpler ones.** Each domain owns a different attack class, the classic spatial-vs-transform-domain trade-off:

| Attack class | Best embedder | Reason |
|---|---|---|
| Clean fidelity / capacity | additive ≈ LSB | they store the watermark *image* directly; SVD stores ~one scalar per block |
| Geometry (rotate/mirror) | additive | additive and SVD both re-synchronise via the dihedral search, so geometry leaves their clean lift intact; LSB has no resync |
| Global tone (brightness/exposition) | additive ≈ LSB | tone curves rescale singular values multiplicatively/non-linearly, breaking SVD's additive model |
| **Lossy / diffusive (noise, JPEG, blur, pixelate)** | **SVD** | the largest singular value is each block's low-frequency *energy*, which compression/blur/averaging preserve, and cross-block median pooling averages out the zero-mean corruption that pixel-differencing absorbs directly |

The crucial point is *which* class matters in practice. Real-world redistribution almost always involves **re-compression, resizing and blur**, not pristine copies, which is exactly the regime where SVD is the only one of the three to survive (and exactly the channel a camcorder capture or web re-upload imposes; see *Threat model & use cases*). So the simpler baselines win the *benign* cases, but the SVD representation earns its place on the distortions a leaked image actually undergoes.

### Main model

The deployed solution is a **block-based SVD watermarking scheme**. The host image `M` is processed per colour channel (a grayscale image is treated as a single channel); the watermark `W` is reduced to grayscale and is square at resolution `m × m`.

> **Note on the original paper's Walsh-Hadamard step.** The source method applies a Walsh-Hadamard transform to each block before the SVD; it is disregarded here. `H/√n` is orthogonal, and singular values are invariant under orthogonal transforms, so the transform leaves the block singular values, the only quantity this scheme reads or writes, unchanged; a one-time ablation confirmed identical results (within uint8 rounding) with and without it. The steps below are the shipped, Hadamard-free method.

**Embedding (`mask_image`):**
1. Split the image into `n × n` blocks (`BLOCK_SIZE = 16`).
2. Compute the SVD of each block, `B = U·S·Vᵀ`, and of the watermark, `W = Uᵂ·Sᵂ·Vᵀᵂ`.
3. Modify each block's largest singular value: `σᵢᵏ = σᵢᴮ + (α·b/m)·σᵢᵂ`, where `α` is the embedding strength, `b` the block index, `m` the watermark width, and `σᵢᵂ` a watermark singular value (iterated across blocks; reused when there are more blocks than watermark SVs).
4. Reconstruct each block and stitch them back into the marked image `K`.

**Extraction (`extract_mask`):** requires the original image, the original watermark, and the target marked image. Both images are cropped to the largest common block-aligned region and SVD'd per block; the inserted singular values are solved back out via `σᵢᵂ = (σᵢᵏ − σᵢᴮ) / ((α·b)/m)`, aggregated robustly across blocks/channels using the **median**, and the watermark is reconstructed as `W = Uᵂ·diag(S)·Vᵀᵂ` using the original watermark's `Uᵂ`/`Vᵀᵂ`. The procedure is run over all 8 dihedral orientations and the best-NCC result is returned. (Reconstructing from the watermark's own `Uᵂ/Vᵀᵂ` is also the origin of the reconstruction floor discussed above.)

*All operations are vectorised (no per-block Python loops): a single batched `np.linalg.svd` over the `(blocks, channels, 16, 16)` stack.*

#### Main model metrics and results

All results are aggregated over the **39 cover images** of the USC-SIPI Miscellaneous volume (`datasets/usc-sipi/misc_png/`), using the **128×128 watermark `mark.png` (a solid star)** and each attack's default parameters (Gaussian-noise seed fixed for reproducibility). Imperceptibility is measured by **PSNR/SSIM** of the marked image vs. the original; robustness by **NCC ∈ [0, 1]** of the recovered watermark.

**Imperceptibility (marked vs. original, mean over 39 images):**

| Embedding strength | Mean PSNR (dB) | Mean px changed | SSIM | Verdict |
|---|---:|---:|---:|---|
| α = 5×10⁻⁵ (old default) | 55.4 | ~148 000 | 0.9994 | imperceptible, but nothing recoverable (lift ≈ 0) |
| **α = 0.01 (current default)** | 51.1 | ~173 000 | 0.9990 | imperceptible, recoverable |
| α = 0.7 (paper) | 22.3 | ~529 000 | 0.9380 | clearly visible |
| *Additive baseline (for scale)* | 48.2 | n/a | 0.9994 | imperceptible |
| *LSB baseline (for scale)* | 51.0 | ~392 000 | 0.9983 | imperceptible |

**Why robustness is reported as *lift*, not raw NCC.** Extraction rebuilds the mark as `Uᵂ · diag(S) · Vᵀᵂ` from the *original watermark's own* singular vectors, so the output is watermark-shaped regardless of the recovered singular values, and the dihedral search keeps whichever orientation maximizes that resemblance. Consequently **extracting from a completely unmarked cover already yields a mean NCC ≈ 0.49**, a reconstruction floor. Raw NCC is dominated by this floor, so genuine recovery is reported as **lift = NCC(marked) − NCC(unmarked control)**, with the control put through the same attack. The **old default α = 5×10⁻⁵** illustrates the point: it perturbs ~148 000 pixels, but at a magnitude too small to survive uint8 rounding in the singular-value domain, so its lift is **+0.000** on every attack: it embeds nothing *recoverable*.

**Robustness as lift over the zero-embedding control (mean over 39 images).** The control floor is independent of α (no signal embedded), so it is shown once:

| Attack | Control floor | NCC @ α=0.01 | **lift @ 0.01** | NCC @ α=0.7 | **lift @ 0.7** |
|---|---:|---:|---:|---:|---:|
| No attack | 0.492 | 0.933 | **+0.441** | 0.870 | +0.378 |
| Rotate 90° | 0.492 | 0.933 | +0.441 | 0.870 | +0.378 |
| Mirror | 0.492 | 0.933 | +0.441 | 0.870 | +0.378 |
| Gaussian noise (std 25) | 0.492 | 0.813 | +0.321 | 0.837 | +0.345 |
| Brightness (×1.3) | 0.552 | 0.554 | +0.002 | 0.679 | +0.127 |
| JPEG compression (q=20) | 0.506 | 0.862 | **+0.356** | 0.847 | +0.341 |
| Exposition (γ=1.5) | 0.314 | 0.311 | −0.003 | 0.737 | **+0.423** |
| Gaussian blur (radius 5) | 0.495 | 0.844 | +0.349 | 0.857 | +0.362 |
| Pixelate (block 8) | 0.507 | 0.644 | +0.137 | 0.839 | +0.332 |

**Reading the results:**
- **The method genuinely works at an imperceptible strength.** At α = 0.01 (~51 dB, invisible) the watermark recovers with strong lift on clean images (+0.441) and survives the lossy/value attacks that matter: noise +0.321, JPEG +0.356, blur +0.349.
- **Geometric attacks are essentially free.** Rotation (90°) and mirroring keep the full no-attack lift (+0.441): the dihedral-orientation search inverts these lossless permutations exactly.
- **The weak spots at α = 0.01 are brightness and exposition** (+0.002 / −0.003). Both rescale the global tone curve, which shifts the block singular values in a way the linear extraction can't undo; they only recover at the strong α = 0.7 (+0.127 / +0.423).
- **Stronger embedding is not uniformly better.** Clean recovery actually *peaks* at α = 0.01 (NCC 0.933) and is lower at α = 0.7 (0.870, where the heavy perturbation starts to distort the blocks). α = 0.7 spreads robustness more evenly across *all* attacks, including brightness/exposition/pixelate, but at clearly visible cost (22 dB).
- **Net.** At a genuinely imperceptible strength the scheme recovers the watermark well and resists geometry, noise, JPEG and blur; its remaining weakness is global tone changes (brightness/exposition), which need a visible embedding strength to survive.

*Reproducible via the battery scripts driving `services.masking` / `services.attacks` directly over the converted PNG set; the control floor is `extract(attack(cover), cover, watermark)`.*

### Code repository

https://github.com/fvaldes0109/invisign

The project is a three-service stack: a React + TypeScript frontend, a Laravel REST API (users, file storage, orchestration), and a Python/FastAPI watermarking microservice, orchestrated via Docker Compose.

## Usage

Website: https://invisign.com

When ready, the solution is consumed as a **web application**. Users register/authenticate, upload host images and (square) watermarks, then trigger **engravings** (embed) and **extractions** (recover) and view the results in a dashboard.

**Storage formats.** All artifacts are stored as standard raster images (**PNG/JPEG/WebP**) on the Laravel `public` disk, organized by resource and owner as `{resource}/{userId}/{id}.{ext}` (e.g. `images/…`, `watermarks/…`, with watermarks additionally kept as a power-of-2 square plus a thumbnail). Records (users, images, watermarks, engravings, extractions) and their relationships live in the MariaDB database with UUID primary keys; the marking microservice itself is stateless and persists nothing.

## Threat model & use cases

Watermarking here proves that a suspect image derives from a specific marked master, not, by itself, *authorship*. The two candidate applications differ sharply in how well this scheme serves them.

**Ownership / copyright proof: weak fit.** This is the scheme's blind spot, and it is the same mechanism as the reconstruction floor: extraction rebuilds the mark from the *watermark's own* singular vectors `Uᵂ/Vᵀᵂ`, so an adversary can present *their* `Uᵂ/Vᵀᵂ` and "extract" *their* watermark from the same image just as convincingly. This is the well-known **invertibility / ambiguity attack** on SVD watermarking (Zhang & Li, 2005), and our measured ≈ 0.49 floor is a direct demonstration of it. Without a trusted timestamp or registry, the scheme cannot settle a contested ownership claim.

**Forensic / traitor tracing: the natural fit.** Example: a studio distributes a film to many cinemas, each copy carrying a *different* mark; on a leak, the studio identifies the responsible cinema. This scenario suits the scheme well:
- **Non-blind extraction is a non-issue**: the studio holds the master by construction, so requiring the original is free.
- **It becomes closed-set identification, not detection**: test the leak against the *N* known per-cinema marks and take the arg-max of the lift. The reconstruction floor is roughly common across candidates and largely cancels in the comparison, which is exactly where this scheme is weakest as an absolute detector but adequate as a classifier.

**Open requirements before the tracing use case is real.** The experiments here cover still images under eight mild attacks; cinema forensics adds harder demands the current scheme is **not yet shown to meet**:
- **Video + camcorder capture** (the dominant leak vector): projective geometry, perspective, tone/gamma shifts and heavy re-compression, far beyond the tested attacks, and the method already fails brightness/exposition at an invisible strength.
- **Collusion**: several recipients averaging their differently-marked copies to wash out the mark; defeating this needs anti-collusion fingerprint codes (e.g. Tardos), which the scheme has none of.
- **Capacity / separation** for potentially thousands of distinct, attack-survivable marks, which would require carrying a coded serial number rather than a single logo image.

**Verdict.** The SVD core is a legitimate, working watermark at an imperceptible strength (≈ 50 dB), with genuine robustness to geometry, noise, JPEG and blur, and its honest home is **owner-held forensic tracing**, not contested ownership proof. That said, the additive-baseline comparison shows its margin is narrow: a one-line additive overlay matches or beats it on everything *except* the lossy/diffusive attacks (noise, JPEG, blur), so the marginal value of the SVD representation is specifically **robustness to lossy processing**.
