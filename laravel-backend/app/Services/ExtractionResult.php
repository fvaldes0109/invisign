<?php

namespace App\Services;

final class ExtractionResult
{
    public function __construct(
        public readonly string $bytes,
        public readonly float  $similarity,
    ) {
    }
}
