<?php

namespace App\Services;

class FakeWatermarkingService implements WatermarkingServiceInterface
{
    public function engrave(string $imageContents, string $watermarkContents): string
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
