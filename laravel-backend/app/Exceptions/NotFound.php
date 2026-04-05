<?php

namespace App\Exceptions;

class NotFound extends \Exception
{
    public static function watermarkNotFound(string $watermarkId): self
    {
        return new self("Watermark $watermarkId not found");
    }
}
