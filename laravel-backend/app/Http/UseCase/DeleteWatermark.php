<?php

namespace App\Http\UseCase;

use App\Exceptions\NotFound;
use App\Http\Repository\WatermarkRepository;
use Illuminate\Support\Facades\Storage;

class DeleteWatermark
{
    public function __construct(
        private readonly WatermarkRepository $watermarkRepository,
    ) {
    }

    /** @throws NotFound */
    public function execute(string $id, int $userId): void
    {
        $watermark = $this->watermarkRepository->findByIdForUser($id, $userId);

        Storage::disk('public')->delete($watermark->getImagePath());
        Storage::disk('public')->delete($watermark->getThumbnailPath());

        $this->watermarkRepository->delete($watermark);
    }
}
