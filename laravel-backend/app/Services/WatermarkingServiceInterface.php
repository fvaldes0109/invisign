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
}
