<?php

namespace App\Http\UseCase;

use App\Exceptions\NotFound;
use App\Http\Entity\Watermark;
use App\Http\Repository\WatermarkRepository;

class ShowWatermark
{
    public function __construct(
        private readonly WatermarkRepository $watermarkRepository,
    ) {
    }

    /** @throws NotFound */
    public function execute(string $id, int $userId): Watermark
    {
        return $this->watermarkRepository->findByIdForUser($id, $userId);
    }
}
