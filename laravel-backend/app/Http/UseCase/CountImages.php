<?php

namespace App\Http\UseCase;

use App\Http\Repository\ImageRepository;

class CountImages
{
    public function __construct(
        private readonly ImageRepository $imageRepository,
    ) {
    }

    public function execute(int $userId): int
    {
        return $this->imageRepository->countByUserId($userId);
    }
}
