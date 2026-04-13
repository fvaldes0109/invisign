<?php

namespace App\Http\UseCase;

use App\Http\Entity\ExtractionCollection;
use App\Http\Repository\ExtractionRepository;

class ListExtractions
{
    public function __construct(private readonly ExtractionRepository $extractionRepository)
    {
    }

    public function execute(int $userId): ExtractionCollection
    {
        return $this->extractionRepository->listByUserId($userId);
    }
}
