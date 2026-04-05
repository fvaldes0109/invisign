<?php

namespace App\Http\UseCase;

use App\Http\Repository\WatermarkRepository;

class CountWatermarks
{
    public function __construct(
        private readonly WatermarkRepository $watermarkRepository,
    ) {
    }

    public function execute(int $userId): int
    {
        return $this->watermarkRepository->countByUserId($userId);
    }
}
