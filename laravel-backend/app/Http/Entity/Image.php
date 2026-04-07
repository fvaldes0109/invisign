<?php

namespace App\Http\Entity;

use App\Models\Image as EloquentImage;

class Image
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

    public static function fromEloquent(EloquentImage $eloquentImage): self
    {
        return new self(
            id:            $eloquentImage->id,
            userId:        $eloquentImage->user_id,
            name:          $eloquentImage->name,
            imagePath:     $eloquentImage->image_path,
            thumbnailPath: $eloquentImage->thumbnail_path,
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
