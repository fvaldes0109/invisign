<?php

namespace App\Http\UseCase;

use App\Exceptions\NotFound;
use App\Http\Repository\ImageRepository;
use Illuminate\Support\Facades\Storage;

class DeleteImage
{
    public function __construct(
        private readonly ImageRepository $imageRepository,
    ) {
    }

    /** @throws NotFound */
    public function execute(string $id, int $userId): void
    {
        $image = $this->imageRepository->findByIdForUser($id, $userId);

        Storage::disk('public')->delete($image->getImagePath());
        Storage::disk('public')->delete($image->getThumbnailPath());

        $this->imageRepository->delete($image);
    }
}
