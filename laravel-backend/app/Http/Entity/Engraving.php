<?php

namespace App\Http\Entity;

use App\Models\Engraving as EloquentEngraving;

class Engraving
{
    private function __construct(
        private readonly string    $id,
        private readonly int       $userId,
        private readonly string    $imageId,
        private readonly string    $watermarkId,
        private readonly string    $engravedPath,
        private readonly float     $alpha = 0.00005,
        private readonly ?Image     $image = null,
        private readonly ?Watermark $watermark = null,
    ) {
    }

    public static function create(
        string $id,
        int    $userId,
        string $imageId,
        string $watermarkId,
        string $engravedPath,
        float  $alpha = 0.00005,
    ): self {
        return new self(
            id:           $id,
            userId:       $userId,
            imageId:      $imageId,
            watermarkId:  $watermarkId,
            engravedPath: $engravedPath,
            alpha:        $alpha,
        );
    }

    public static function fromEloquent(EloquentEngraving $e): self
    {
        return new self(
            id:           $e->id,
            userId:       $e->user_id,
            imageId:      $e->image_id,
            watermarkId:  $e->watermark_id,
            engravedPath: $e->engraved_path,
            alpha:        (float) ($e->alpha ?? 0.00005),
            image:        $e->relationLoaded('image') && $e->image
                              ? Image::fromEloquent($e->image)
                              : null,
            watermark:    $e->relationLoaded('watermark') && $e->watermark
                              ? Watermark::fromEloquent($e->watermark)
                              : null,
        );
    }

    public function getId(): string            { return $this->id; }
    public function getUserId(): int           { return $this->userId; }
    public function getImageId(): string       { return $this->imageId; }
    public function getWatermarkId(): string   { return $this->watermarkId; }
    public function getEngravedPath(): string  { return $this->engravedPath; }
    public function getAlpha(): float          { return $this->alpha; }
    public function getImage(): ?Image         { return $this->image; }
    public function getWatermark(): ?Watermark { return $this->watermark; }
}
