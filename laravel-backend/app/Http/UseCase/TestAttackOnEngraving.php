<?php

namespace App\Http\UseCase;

use App\Exceptions\NotFound;
use App\Http\Entity\AttackTest;
use App\Http\Repository\AttackTestRepository;
use App\Http\Repository\EngravingRepository;
use App\Http\Repository\ImageRepository;
use App\Http\Repository\WatermarkRepository;
use App\Services\WatermarkingServiceInterface;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;

class TestAttackOnEngraving
{
    public function __construct(
        private readonly EngravingRepository          $engravingRepository,
        private readonly ImageRepository              $imageRepository,
        private readonly WatermarkRepository          $watermarkRepository,
        private readonly AttackTestRepository         $attackTestRepository,
        private readonly WatermarkingServiceInterface $watermarkingService,
    ) {
    }

    /** @throws NotFound */
    public function execute(string $engravingId, string $attackType, array $params, int $userId): AttackTest
    {
        $engraving = $this->engravingRepository->findByIdForUser($engravingId, $userId);
        $image     = $this->imageRepository->findByIdForUser($engraving->getImageId(), $userId);
        $watermark = $this->watermarkRepository->findByIdForUser($engraving->getWatermarkId(), $userId);

        $engravingBytes        = Storage::disk('public')->get($engraving->getEngravedPath());
        $originalImageContents = Storage::disk('public')->get($image->getImagePath());
        $watermarkContents     = Storage::disk('public')->get($watermark->getImagePath());

        $attackedBytes = $this->watermarkingService->applyAttack($engravingBytes, $attackType, $params);

        $resultBytes = $this->watermarkingService->extract(
            $attackedBytes,
            $originalImageContents,
            $watermarkContents,
        );

        $id               = Uuid::uuid4()->toString();
        $attackedPath     = "attack-tests/{$userId}/{$id}_attacked.jpg";
        $resultPath       = "attack-tests/{$userId}/{$id}.jpg";

        Storage::disk('public')->put($attackedPath, $attackedBytes);
        Storage::disk('public')->put($resultPath, $resultBytes);

        $attackTest = AttackTest::create(
            id:                $id,
            userId:            $userId,
            engravingId:       $engravingId,
            attackType:        $attackType,
            attackedImagePath: $attackedPath,
            resultPath:        $resultPath,
        );

        $this->attackTestRepository->save($attackTest);

        return $attackTest;
    }
}
