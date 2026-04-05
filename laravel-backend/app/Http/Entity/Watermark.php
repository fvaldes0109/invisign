<?php

namespace App\Http\Entity;

use App\Models\Watermark as EloquentWatermark;

class Watermark
{
    private function __construct(
        private readonly string $id,
        private readonly int $userId,
        private readonly string $name,
        private readonly string $imagePath,
        private readonly string $thumbnailPath,
    ) {
    }

    public static function create(
        string $id,
        int    $userId,
        string $name,
        string $imagePath,
        string $thumbnailPath,
    ): self {
        return new self(
            id:            $id,
            userId:        $userId,
            name:          $name,
            imagePath:     $imagePath,
            thumbnailPath: $thumbnailPath,
        );
    }

    public static function fromEloquent(EloquentWatermark $eloquentWatermark): self
    {
        return new self(
            id: $eloquentWatermark->id,
            userId: $eloquentWatermark->user_id,
            name: $eloquentWatermark->name,
            imagePath: $eloquentWatermark->image_path,
            thumbnailPath: $eloquentWatermark->thumbnail_path,
        );
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getImagePath(): string
    {
        return $this->imagePath;
    }

    public function getThumbnailPath(): string
    {
        return $this->thumbnailPath;
    }
}
