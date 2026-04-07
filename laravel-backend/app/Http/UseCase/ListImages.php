<?php

namespace App\Http\UseCase;

use App\Http\Entity\ImageCollection;
use App\Http\Repository\ImageRepository;

class ListImages
{
    public function __construct(
        private readonly ImageRepository $imageRepository,
    ) {
    }

    public function execute(int $userId): ImageCollection
    {
        return $this->imageRepository->listByUserId($userId);
    }
}
