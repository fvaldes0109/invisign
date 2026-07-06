# Invisign — Defense Preparation Notes

A study companion to **`Invisign-Defense.pptx`**. For each slide: *the point* you're
making, the *facts to know cold*, and the *questions likely to come up* with crisp
answers. A final section collects the big-picture questions a committee tends to ask
at the end, plus a strategy for handling anything you don't know.

> Keep **`Report.md`** open during the defense — every number here traces back to it.
> Golden rule: **answer in 1–2 sentences first, then offer to go deeper.** Don't
> volunteer weaknesses, but never hide them when asked — this project's credibility
> comes from how honestly it's measured.

---

## Numbers to know cold

| Quantity | Value | Where |
|---|---|---|
| Embedding strength (default) | **α = 0.01** | ships here |
| Imperceptibility @ α=0.01 | **51.1 dB PSNR, SSIM 0.9990** | mean over 39 images |
| Invisibility threshold | **~40 dB** (above it, the eye can't tell) | rule of thumb |
| α = 0.7 (original paper) | 22.3 dB — **visibly degraded** | the knob's far end |
| α = 5×10⁻⁵ (old default) | 55.4 dB but **lift ≈ 0** (nothing recoverable) | why it was changed |
| Block size | **16 × 16** | constant |
| Reconstruction floor (unmarked) | **NCC ≈ 0.49** | why we report *lift* |
| Clean recovery, mean over 39 | NCC **0.933**, **lift +0.441** | the aggregate result |
| Clean recovery, *Peppers demo* (slide 7) | NCC **0.97** | the single shown image |
| Dataset | **USC-SIPI**, 39 images (25 gray + 14 color) | the benchmark |
| Watermark | 128×128 solid **star**, resized to power-of-2 | shipped `mark.png` |
| Attacks tested | **8** (rotate, mirror, noise, brightness, JPEG, exposure, blur, pixelate) | the battery |

**Lift over control @ α = 0.01 (mean, 39 images):** clean / rotate / mirror **+0.44**;
JPEG **+0.36**; blur **+0.35**; noise **+0.32**; pixelate **+0.14**; brightness **+0.002**;
exposure **−0.003**.

**Baseline lift on lossy attacks (SVD / additive / LSB):** noise 0.32 / 0.13 / 0.00 ·
JPEG 0.36 / 0.22 / 0.00 · blur 0.35 / 0.12 / 0.03 · pixelate 0.14 / 0.03 / 0.08.
**SVD wins all four.**

**The stack:** React frontend (5173) → Laravel API (8080) → Python/FastAPI marking
service (8000) → MariaDB (3306), via Docker Compose.

---

## One-paragraph elevator pitch (memorize)

> Invisign hides an invisible, recoverable watermark in an image by nudging the
> dominant singular value of each 16×16 block. It's imperceptible (~51 dB) yet
> survives the re-compression, resize and blur a leaked image really goes through.
> Its honest home is **owner-held forensic tracing** — give each recipient a
> differently-marked copy, and a leak points back to its source. I validated it on the
> standard 39-image USC-SIPI benchmark, measuring recovery as *lift over a no-mark
> control*, and built it into a full three-service web application.

---

## Per-slide breakdown

### Slide 1 — Title
**The point:** Set the frame — an invisible *forensic* watermark, and that you'll cover
problem → method → results → product → market.
**Know cold:** "Invisign" = *invisible* + *sign*. It's a capstone demonstrator with a
working deployed product, not a finished commercial tool.

---

### Slide 2 — The problem: who leaked it?
**The point:** Owners share images and copies escape; the obvious defenses all fail on
the journey a leaked file takes.
**Know cold:** Visible marks → cropped; metadata/EXIF → stripped on re-save; naive
hidden marks (LSB) → wiped by recompression/blur. The gap is *attribution after the
leak*, not prevention.
**Likely questions**
- *Isn't this DRM?* — No. DRM tries to **prevent** copying; we assume copying happened
  and do **attribution**. Complementary.
- *Why not hash each copy?* — A hash breaks on any edit (one pixel changes it). We need
  something that survives lossy edits — that's the watermark.

---

### Slide 3 — The idea
**The point:** The mark lives in the image's mathematical structure, not painted on top.
Four properties: invisible, recoverable, survives real edits, per-recipient.
**Know cold:** The original and marked images on the right are genuinely the same to the
eye (~51 dB). "Per-recipient" is what enables tracing.
**Likely questions**
- *Is the marked image really unmodified-looking?* — It's modified, but below the eye's
  threshold: ~51 dB PSNR, SSIM 0.999. The displayed pair is the actual output.

---

### Slide 4 — Who it's for
**The point:** Built for owners who **hold the master**: studios→cinemas, agencies→
licensees, platforms→partners. Tracing becomes "which recipient matches best?"
**Know cold:** Because the owner holds the original, extraction needing the original is
**free**. This is *closed-set identification* (compare against N known marks), not blind
detection in the wild.
**Likely questions**
- *Extraction needs the original image **and** watermark — isn't that crippling?* — Not
  for this use case; the owner has both by construction. It would only matter for blind
  detection, which is explicitly **not** the target.
- *Why is tracing easier than proving ownership?* — Tracing is a comparison among your
  own marks (the reconstruction floor cancels across candidates). Ownership proof needs
  to convince a third party — see slide 8 / the closing questions.

---

### Slide 5 — How it works
**The point:** Tile into 16×16 blocks → each block has one dominant "energy" value (from
the SVD) → nudge it by a microscopic amount driven by the watermark → reassemble.
**Know cold (the real mechanism):**
- Formula: `σ_largest ← σ_largest + (α·b/m)·σ_W` per block, where `b` = block index,
  `m` = watermark width, `σ_W` = a watermark singular value (cycled across blocks).
- Color: the **same embedding runs on each channel independently**.
- The amplified ×30 difference map shows *where* the change lives; at 1× it's invisible.
**Likely questions**
- *Why the **largest** singular value?* — It carries the block's low-frequency energy,
  which compression, blur and averaging **preserve** — that's exactly why the mark
  survives lossy edits.
- *Your source paper used a Walsh-Hadamard transform first — where is it?* — Removed
  deliberately. `H/√n` is **orthogonal**, and singular values are **invariant under
  orthogonal transforms**, so it can't change anything the scheme reads or writes. An
  ablation confirmed identical results within 8-bit rounding. Same output, less compute.
- *Why 16×16?* — Balances block count (capacity/redundancy) against keeping each block
  locally coherent so one value represents it well.
- *What is the SVD, simply?* — A standard factorization `B = U·S·Vᵀ`; the `S` values
  (singular values) rank a block's structure from most to least dominant. We touch the
  top one.

---

### Slide 6 — Imperceptibility
**The point:** At the shipping strength it's invisible (51 dB / SSIM 0.999); strength is
a single tunable knob.
**Know cold:** PSNR higher = better; >40 dB ≈ imperceptible. SSIM (≈1 = no perceived
structural change) reported alongside so a good PSNR can't hide an artifact. α=0.7 hits
22 dB with visible banding (the bottom-right image) — reserve for hostile channels.
**Likely questions**
- *Why exactly α = 0.01?* — Sweet spot. 5×10⁻⁵ was too small to survive 8-bit rounding
  (embedded nothing recoverable, lift ≈ 0); 0.7 is robust but visibly degrades to 22 dB;
  0.01 is invisible (~51 dB) yet recoverable.
- *Is PSNR a good imperceptibility measure?* — It's the field standard; I pair it with
  SSIM precisely because PSNR alone can miss structured/perceptual artifacts.

---

### Slide 7 — It comes back out
**The point:** Feed marked + original into extraction → recover the star; scored by NCC
(1.0 = identical). Clean copy ≈ **0.97**.
**Know cold — important nuance:** The **0.97 is the Peppers demo image** shown on the
slide. The **mean clean recovery over all 39 images is NCC 0.933 (lift +0.441)** — know
both, and that 0.97 is one example, not the aggregate.
- NCC clamped to [0,1]: negatives mean anti-correlation/noise; we only care about [0,1].
**Likely questions**
- *0.97 is clean — what about attacks?* — That's slides 9–10; it stays strong through
  geometry, JPEG, blur and noise.
- *What's NCC in plain terms?* — Similarity between recovered and true mark: 1 identical,
  0 unrelated. Standard robustness metric here.

---

### Slide 8 — Measured honestly (methodology)
**The point:** This is the rigor slide. Extraction rebuilds a *watermark-shaped* image
from the watermark's own structure, so even an **unmarked** image scores ≈ 0.49 — a
floor. So I never report raw NCC; I report **lift = NCC(marked) − NCC(unmarked control)**,
control put through the *same* attack.
**Know cold:** The ≈0.49 floor comes from reconstructing with the watermark's own
`Uᵂ/Vᵀᵂ`. This same mechanism is the ownership-proof weakness (slide-4/closing). Dataset:
USC-SIPI, the standard suite, deliberately spanning high-freq (baboon) and low-freq
(portraits) and gray/color.
**Likely questions**
- *Why ≈0.49 with no watermark?* — Reconstruction floor: output is always
  watermark-shaped because we use the watermark's own singular vectors. Lift removes it.
- *Is 39 images enough?* — It's the field-standard benchmark and spans diverse content.
  Bigger purpose-built sets (BOWS-2 = 10,000; Kodak) are available and the pipeline
  supports them — a natural extension.
- *Doesn't subtracting a baseline inflate your numbers?* — Opposite. It's the
  conservative choice: raw NCC looks far better (0.8–0.9). Lift strips out everything the
  method doesn't actually earn.
- *Reproducible?* — Yes — fixed noise seed, deterministic battery scripts over the
  converted PNG set; control = `extract(attack(cover), cover, watermark)`.

---

### Slide 9 — Robustness
**The point:** Lift over control across 8 attacks. Geometry is free; JPEG/blur/noise
recover strongly; brightness/exposure are the honest weak spot (≈0).
**Know cold:** Geometry (rotate 90°, mirror) keeps the full +0.441 because extraction
**tries all 8 dihedral orientations and keeps the best-NCC one** — lossless permutations
invert exactly. Brightness/exposure ≈ 0 because they're global tone curves.
**Likely questions**
- *Brightness/exposure ≈ 0 — isn't that a failure?* — They rescale the singular values
  **non-linearly**, breaking the additive model; they recover only at higher (visible)
  strength. For still-image tracing the dominant channel is recompression/resize/blur —
  which we handle — so it's a bounded, known limitation, not a showstopper.
- *How undo rotation without knowing the angle?* — For the lossless 90°/mirror family we
  try all 8 orientations and keep the best match; the correct one wins naturally.
- *What about arbitrary-angle rotation (e.g., 7°)?* — Not handled by the dihedral search
  (it covers only 90°/mirror); arbitrary rotation needs a registration/resync step — a
  known extension, and the report scopes geometry to the dihedral group.

**Deep-dive: the non-surviving attacks — do they occur in leaks, and what's the fix?**
The strongest framing exploits the non-blind setting: *the owner holds the original, so
most failures can be undone by preprocessing the suspect image before extraction —
without touching the watermarking core.*

| Failure | Occurs in real leaks? | Mitigation | Cost |
|---|---|---|---|
| Brightness / exposure | Yes — auto-enhance, screenshots, filters | **Tone-normalize first**: histogram-match suspect → original, then extract | Cheap preprocessing |
| Arbitrary rotation / scale / crop / perspective | Yes — screenshots, re-framing, photographing a screen | **Register first**: feature-based alignment (SIFT/ORB) suspect → original to restore block alignment | Standard technique; fits non-blind model |
| Weak overall margin | — | Raise α (per-region/adaptive to stay invisible) | Trades invisibility |
| Collusion (recipients average copies) | Rare — needs coordination — but the classic forensic attack | **Coded serial marks + anti-collusion codes (Tardos)** | Real redesign; roadmap |

The honest line: *"Because the owner holds the master, tone shifts and geometry can be
neutralized by normalizing and registering the suspect against the original before
extraction — a preprocessing front-end, not a change to the core."* Only **collusion**
truly can't be preprocessed away (needs coded marks), and **extreme information loss**
(tiny crops, brutal re-quantization) can sink recovery below the noise floor regardless —
at that point it's a detection-threshold decision.

---

### Slide 10 — Why not just paste the mark on? (baselines)
**The point:** The intellectual core. I built the obvious alternatives — a faint additive
overlay (non-blind) and classic LSB (blind) — and ran the same battery. On lossy attacks
(noise/JPEG/blur/pixelate) the SVD mark is the **only** one that survives.
**Know cold:** On *clean*, *geometric*, and *tone* attacks the additive overlay
matches or beats SVD (subtract-the-original recovers the mark almost perfectly). SVD's
specific, honest value is **robustness to lossy/diffusive processing** — and real leaks
are always lossy. LSB is weakest (blind → can't subtract the cover, no resync).
**Likely questions (this is where they'll push)**
- *So the trivial overlay ties or beats you on most attacks — why bother with SVD?* —
  Because real redistribution is **never** pristine. The overlay wins the benign cases
  that don't happen; SVD wins noise/JPEG/blur — exactly what a web re-upload or camcorder
  capture imposes. The methods are **complementary**; SVD earns its place on the attacks
  that actually occur.
- *Then why not ship the overlay?* — It owns clean/geometry/tone, but it collapses on the
  lossy channel that matters most for leaks. If you only get one method, you want the one
  that survives the real channel.
- *Why is LSB so weak?* — It's blind: no original to subtract, so any value change wipes
  it, and it has no geometric resync.
- *Why do additive/LSB lifts reach ~1.0 but SVD tops out near ~0.44?* — Max lift = 1 −
  the method's own control floor. Additive/LSB extract nothing watermark-shaped from an
  unmarked image (floor ≈ 0, ceiling ≈ 1.0); SVD's extraction rebuilds a watermark-shaped
  output by construction (floor ≈ 0.49, ceiling ≈ 0.51). So SVD's clean +0.441 is **~87%
  of its possible maximum** — and normalized by ceiling, its lossy-attack lead *grows*
  (noise ~63% of ceiling vs. additive's ~13%). The raw table, if anything, understates
  SVD's advantage.

---

### Slide 11 — The system
**The point:** Not just an algorithm — a working app. React (UI) → Laravel (accounts,
storage, orchestration) → stateless Python service (the math) → MariaDB. One Docker
Compose command.
**Know cold:** Python service is **stateless** (persists nothing) → trivially scalable.
Records use UUID primary keys; artifacts stored on the Laravel public disk as
`{resource}/{userId}/{id}.{ext}`.
**Likely questions**
- *Why a separate Python service?* — The math lives in NumPy/OpenCV; isolating it keeps
  it language-appropriate and independently scalable, with Laravel owning state/logic.
- *Why Laravel + React + FastAPI specifically?* — Each fits its layer: React for a
  reactive dashboard, Laravel for batteries-included API + auth + storage, FastAPI for a
  thin high-performance numerical service.

---

### Slide 12 — From algorithm to product
**The point:** Real product flow: register → upload → engrave/extract → review. Deployed
at invisign.com.
**Know cold:** Watermarks are stored as a power-of-2 square plus a thumbnail; engravings
and extractions are tracked records with results and match scores.

---

### Slide 13 — Market
**The point:** Watermarking is several segments; Invisign targets **forensic tracing**
(a different mark per recipient) — real and monetized, mature in video, thinner in stills.
**Know cold:** Tailwinds: rising image redistribution + AI raising provenance stakes
(both threat and driver, e.g. C2PA, AI-transparency regulation). Sizing in the report is
qualitative by choice (segments/drivers, not dollar figures).
**Likely questions**
- *Why target the smallest slice (still-image forensics)?* — It's underserved precisely
  because it's hard, and it's the slice the method genuinely fits. Video-forensic is
  bigger but incumbent-dominated; AI-provenance answers a different question.

---

### Slide 14 — Competitive landscape
**The point:** IMATAG (closest: invisible forensic + web monitoring), Digimarc (broad
incumbent), Verimatrix/NexGuard (the same model, in video — proof it's monetizable), and
C2PA/SynthID (adjacent: "is this AI-made?" not "who leaked it?").
**Know cold:** IMATAG's differentiator is **monitoring** (finding the leaked copy in the
wild) + **capacity** — exactly what Invisign doesn't yet have. NexGuard does the literal
studio→cinema scenario in video.
**Likely questions**
- *How are you different from IMATAG?* — IMATAG is the productized, scaled version:
  embed + web crawling + serial capacity. I implement the transparent embed/extract core;
  monitoring and capacity are my **roadmap**, not claims today.
- *If NexGuard already does this, why stills?* — Different medium and channel; stills
  dominate press/stock/social leaks with a distinct robustness profile (JPEG/resize/blur).

---

### Slide 15 — Roadmap
**The point:** Candid: it's a demonstrator. Three build-outs close the gap — web
monitoring, serial capacity + collusion resistance, harder channels (video/camcorder).
**Know cold:** **Collusion** = several recipients average their differently-marked copies
to wash out the mark; the defense is anti-collusion fingerprint codes (e.g. **Tardos
codes**). **Capacity** = carrying a coded serial number for thousands of recipients
rather than a single logo image.
**Likely questions**
- *What's a collusion attack?* — Recipients pool/average copies to erase the per-copy
  mark; defeated with fingerprinting codes designed for it. Known area, on the roadmap.
- *How far from commercial?* — The core is solid and honestly measured; the gap is
  engineering and scope (monitoring, capacity, video), not a fundamental flaw.

---

### Slide 16 — What this delivers (conclusion)
**The point:** Working invisible watermark; robust where it counts; honestly measured;
complete deployed product.
**Know cold:** This doubles as your **contributions** list — lead with it if asked "what
did you build / contribute?"

---

### Slide 17 — Thank you / Q&A
**The point:** Open the floor confidently. Repo + live site on screen, and a **QR code
that goes straight to invisign.com** — invite the committee to scan it and try the live
product during Q&A.

---

## Final section — big-picture questions the committee may ask

These are the *closing* questions that range across the whole project. For each: a
prepared answer and how to carry yourself.

### 1. "What is your main contribution?"
A working, **honestly-evaluated** still-image forensic watermark, plus the finding that
*matters*: via a controlled baseline comparison, the SVD representation's real value is
**specifically robustness to lossy/diffusive processing** — and a full product around it.
**Strategy:** Lead with the deliverables (slide 16), then the one insight (slide 10).
Don't oversell novelty — the embedding math is adapted from Abdallah et al. (ICPR'06);
*your* contributions are the Hadamard-removal simplification (with proof + ablation), the
honest lift-over-control methodology, the baseline study, and the end-to-end system.

### 2. "What's novel here, versus the paper you based it on?"
Three things: (a) I **removed the Walsh-Hadamard step** and proved it's a no-op
(orthogonal ⇒ singular values invariant), confirmed by ablation — same result, less
compute; (b) I extended it to **color** (per-channel embed, robust **median** pooling on
extraction); (c) I exposed the **reconstruction-floor problem** and introduced
**lift-over-control** as the honest metric. **Strategy:** Be upfront that the core
formula is from the literature; frame your value as rigor, simplification, and
engineering — committees respect honesty far more than inflated novelty claims.

### 3. "What was the hardest part / biggest challenge?"
Realizing that **raw NCC was lying** — extraction reconstructs from the watermark's own
vectors, so even an unmarked image "recovers" the mark (≈0.49). Diagnosing that and
re-basing every result on lift-over-control was the key turning point. **Strategy:**
Tell it as a discovery story — it shows scientific maturity.

### 4. "If you started over, what would you do differently?"
Carry a **coded serial number** instead of a single logo image from day one (capacity +
collusion resistance built in), and add a **registration step** for arbitrary-angle
geometry. I'd also automate the battery against a larger dataset (BOWS-2) earlier.
**Strategy:** Name concrete, informed choices — never "nothing."

### 5. "What are the limitations?" (they *will* ask)
Four, stated plainly: (a) **brightness/exposure** fail at invisible strength; (b) it
**can't prove ownership** (invertibility/ambiguity attack — an adversary can "extract"
their own watermark; Zhang & Li, 2005) — it's for **tracing**, not contested ownership;
(c) **no capacity/collusion resistance** yet (single logo); (d) **not tested on video or
arbitrary geometry**. **Strategy:** Volunteering the right scope ("tracing, not ownership
proof") *before* they corner you reads as mastery.

### 6. "Can an attacker defeat it?"
Yes, in specific ways, and I know them: heavy tone shifts at invisible strength;
**collusion** (averaging copies); arbitrary-angle geometry without resync; and the
**ambiguity attack** against ownership claims. None of these break the *tracing* use case
materially except collusion, which is the headline roadmap item. **Strategy:** Show you
think like an attacker — that *strengthens* credibility.

### 7. "How do you know the results are correct / reproducible?"
Deterministic battery scripts, fixed RNG seed, the standard public benchmark, and the
conservative lift-over-control metric. Anyone can re-run `extract(attack(cover), cover,
watermark)` and the control. **Strategy:** Offer to show the scripts/repo.

### 8. "Why these design choices?" (rapid-fire)
- **SVD?** Singular values capture block energy that survives lossy edits.
- **Largest singular value?** It's the low-frequency energy compression/blur preserve.
- **α = 0.01?** Empirical sweet spot (invisible yet recoverable).
- **16×16 blocks?** Capacity vs. local coherence.
- **Median aggregation?** Robust to channel/block damage from attacks.
- **Removed Hadamard?** Orthogonal ⇒ provably irrelevant; ablation-confirmed.

### 9. "Is it commercially viable? Who pays?"
The buyers exist (studios, stock/press agencies, platforms) and the model is proven in
video (NexGuard) and stills (IMATAG). As-is it's a **demonstrator**; viability needs the
roadmap (monitoring + capacity + video). **Strategy:** Be honest it's not market-ready;
position it as a transparent reference implementation or a narrow self-serve tool with a
clear path forward.

### 10. "Ethical / misuse considerations?"
It's a **defensive/attribution** tool for content owners; the main concern is false
attribution, which the honest scope (closed-set tracing, lift-based confidence, owner
holds the master) is designed to bound. It's not surveillance of users' own content; it
marks assets the owner already controls. **Strategy:** Show you've thought about it.

### 11. "What did you learn?"
The gap between a metric that *looks* good and one that's *honest*; that a clever method
must justify itself against a trivial baseline; and full-stack delivery (algorithm →
microservice → API → UI → deploy). **Strategy:** Mix technical + engineering + scientific
lessons.

### 12. "What's the single most important next step?"
**Capacity + collusion resistance** (coded serial marks with anti-collusion codes) —
without it, real multi-recipient tracing at scale isn't possible. Everything else is
incremental by comparison.

---

## How to handle a question you can't answer

1. **Don't bluff.** Committees detect it instantly and it costs you more than "I don't
   know."
2. **Reason aloud from what you *do* know.** "I didn't test that, but based on how the
   median pooling works, I'd expect…" — shows thinking, not just recall.
3. **Bound it honestly.** "That's outside what I validated; here's what I *can* claim…"
4. **Bridge to a strength.** Acknowledge, then pivot to a related result you're sure of.
5. **Offer follow-up.** "I'd want to run X to answer that properly" is a perfectly strong
   close.
6. **Keep `Report.md` handy** — for any number you blank on, it's all there.

**Mindset:** This project's superpower is its *honesty*. Every limitation is already
documented and reasoned. You're not defending a perfect tool — you're demonstrating that
you understand exactly what you built, what it's worth, and where its edges are. That is
what a defense is actually testing.
