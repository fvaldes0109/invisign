<?php

namespace App\Services;

interface WatermarkingServiceInterface
{
    /**
     * Embed a watermark into an image.
     *
     * @param  string  $imageContents     Raw bytes of the source image.
     * @param  string  $watermarkContents Raw bytes of the watermark image.
     * @return string                     Raw bytes of the engraved result image.
     */
    public function engrave(string $imageContents, string $watermarkContents): string;

    /**
     * Extract a watermark from a suspected copy.
     *
     * @param  string  $markedImageContents   Raw bytes of the suspect (potentially watermarked) image.
     * @param  string  $originalImageContents Raw bytes of the original clean image.
     * @param  string  $watermarkContents     Raw bytes of the original watermark.
     * @return string                         Raw bytes of the extracted watermark image.
     */
    public function extract(string $markedImageContents, string $originalImageContents, string $watermarkContents): string;

    /**
     * Apply a named attack transformation to an image.
     *
     * @param  string  $imageContents Raw bytes of the image to transform.
     * @param  string  $attackType    One of: rotate, mirror, noise, brightness, compression.
     * @param  array   $params        Optional attack parameters (e.g. angle, std, factor, quality).
     * @return string                 Raw bytes of the transformed image.
     */
    public function applyAttack(string $imageContents, string $attackType, array $params = []): string;
}
