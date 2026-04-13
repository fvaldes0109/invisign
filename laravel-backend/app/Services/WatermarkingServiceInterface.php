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
}
