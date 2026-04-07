<?php

namespace App\Http\UseCase;

use App\Http\Entity\EngravingCollection;
use App\Http\Repository\EngravingRepository;

class ListEngravings
{
    public function __construct(private readonly EngravingRepository $engravingRepository)
    {
    }

    public function execute(int $userId, ?string $imageId, ?string $watermarkId): EngravingCollection
    {
        return $this->engravingRepository->listByUserId($userId, $imageId, $watermarkId);
    }
}
