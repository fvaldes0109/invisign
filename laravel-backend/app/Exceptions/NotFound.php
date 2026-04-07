<?php

namespace App\Exceptions;

class NotFound extends \Exception
{
    public static function watermarkNotFound(string $watermarkId): self
    {
        return new self("Watermark $watermarkId not found");
    }

    public static function imageNotFound(string $imageId): self
    {
        return new self("Image $imageId not found");
    }
}
