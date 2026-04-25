<?php

namespace App\Services;

class FakeWatermarkingService implements WatermarkingServiceInterface
{
    public function engrave(string $imageContents, string $watermarkContents): string
    {
        return $this->makeJpeg();
    }

    public function extract(string $markedImageContents, string $originalImageContents, string $watermarkContents): ExtractionResult
    {
        return new ExtractionResult(bytes: $this->makeJpeg(), similarity: 1.0);
    }

    public function applyAttack(string $imageContents, string $attackType, array $params = []): string
    {
        return $this->makeJpeg();
    }

    private function makeJpeg(): string
    {
        // Returns a minimal 1×1 white JPEG so storage assertions work
        // without making any real HTTP calls to the marking-module service.
        $img = imagecreatetruecolor(1, 1);
        imagefilledrectangle($img, 0, 0, 1, 1, imagecolorallocate($img, 255, 255, 255));

        ob_start();
        imagejpeg($img);
        $bytes = ob_get_clean();

        imagedestroy($img);

        return $bytes;
    }
}
