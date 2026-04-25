<?php

namespace App\Http\UseCase;

use App\Exceptions\NotFound;
use App\Http\Entity\Engraving;
use App\Http\Repository\EngravingRepository;
use App\Http\Repository\ImageRepository;
use App\Http\Repository\WatermarkRepository;
use App\Services\WatermarkingServiceInterface;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;

class EngraveImage
{
    public function __construct(
        private readonly ImageRepository           $imageRepository,
        private readonly WatermarkRepository       $watermarkRepository,
        private readonly EngravingRepository       $engravingRepository,
        private readonly WatermarkingServiceInterface $watermarkingService,
    ) {
    }

    /** @throws NotFound */
    public function execute(string $imageId, string $watermarkId, int $userId, float $alpha = 0.00005): Engraving
    {
        $image     = $this->imageRepository->findByIdForUser($imageId, $userId);
        $watermark = $this->watermarkRepository->findByIdForUser($watermarkId, $userId);

        $imageContents     = Storage::disk('public')->get($image->getImagePath());
        $watermarkContents = Storage::disk('public')->get($watermark->getImagePath());

        $engravedBytes = $this->watermarkingService->engrave($imageContents, $watermarkContents, $alpha);

        $id            = Uuid::uuid4()->toString();
        $engravedPath  = "engravings/{$userId}/{$id}.jpg";

        Storage::disk('public')->put($engravedPath, $engravedBytes);

        $engraving = Engraving::create(
            id:           $id,
            userId:       $userId,
            imageId:      $imageId,
            watermarkId:  $watermarkId,
            engravedPath: $engravedPath,
            alpha:        $alpha,
        );

        $this->engravingRepository->save($engraving);

        return $engraving;
    }
}
