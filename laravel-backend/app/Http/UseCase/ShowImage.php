<?php

namespace App\Http\UseCase;

use App\Exceptions\NotFound;
use App\Http\Entity\Image;
use App\Http\Repository\ImageRepository;

class ShowImage
{
    public function __construct(
        private readonly ImageRepository $imageRepository,
    ) {
    }

    /** @throws NotFound */
    public function execute(string $id, int $userId): Image
    {
        return $this->imageRepository->findByIdForUser($id, $userId);
    }
}
