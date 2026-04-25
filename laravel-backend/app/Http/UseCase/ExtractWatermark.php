<?php

namespace App\Http\UseCase;

use App\Exceptions\NotFound;
use App\Http\Entity\Extraction;
use App\Http\Repository\EngravingRepository;
use App\Http\Repository\ExtractionRepository;
use App\Http\Repository\ImageRepository;
use App\Http\Repository\WatermarkRepository;
use App\Services\WatermarkingServiceInterface;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;

class ExtractWatermark
{
    public function __construct(
        private readonly EngravingRepository         $engravingRepository,
        private readonly ImageRepository             $imageRepository,
        private readonly WatermarkRepository         $watermarkRepository,
        private readonly ExtractionRepository        $extractionRepository,
        private readonly WatermarkingServiceInterface $watermarkingService,
    ) {
    }

    /** @throws NotFound */
    public function execute(string $engravingId, string $suspectImageContents, int $userId): Extraction
    {
        $engraving = $this->engravingRepository->findByIdForUser($engravingId, $userId);
        $image     = $this->imageRepository->findByIdForUser($engraving->getImageId(), $userId);
        $watermark = $this->watermarkRepository->findByIdForUser($engraving->getWatermarkId(), $userId);

        $originalImageContents = Storage::disk('public')->get($image->getImagePath());
        $watermarkContents     = Storage::disk('public')->get($watermark->getImagePath());

        $result = $this->watermarkingService->extract(
            $suspectImageContents,
            $originalImageContents,
            $watermarkContents,
        );

        $id          = Uuid::uuid4()->toString();
        $suspectPath = "extractions/{$userId}/{$id}_suspect.jpg";
        $resultPath  = "extractions/{$userId}/{$id}.jpg";

        Storage::disk('public')->put($suspectPath, $suspectImageContents);
        Storage::disk('public')->put($resultPath, $result->bytes);

        $extraction = Extraction::create(
            id:              $id,
            userId:          $userId,
            engravingId:     $engravingId,
            suspectPath:     $suspectPath,
            resultPath:      $resultPath,
            similarityScore: $result->similarity,
        );

        $this->extractionRepository->save($extraction);

        return $extraction;
    }
}
