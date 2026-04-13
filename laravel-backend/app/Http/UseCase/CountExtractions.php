<?php

namespace App\Http\UseCase;

use App\Http\Repository\ExtractionRepository;

class CountExtractions
{
    public function __construct(private readonly ExtractionRepository $extractionRepository)
    {
    }

    public function execute(int $userId): int
    {
        return $this->extractionRepository->countByUserId($userId);
    }
}
