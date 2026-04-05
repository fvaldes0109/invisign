<?php

namespace App\Http\UseCase;

use App\Http\Entity\WatermarkCollection;
use App\Http\Repository\WatermarkRepository;

class ListWatermarks
{
    public function __construct(
        private readonly WatermarkRepository $watermarkRepository,
    ) {
    }

    public function execute(int $userId): WatermarkCollection
    {
        return $this->watermarkRepository->listByUserId($userId);
    }
}
