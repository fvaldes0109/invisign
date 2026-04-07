<?php

namespace App\Http\Repository;

use App\Exceptions\NotFound;
use App\Http\Entity\Image;
use App\Http\Entity\ImageCollection;
use App\Models\Image as EloquentImage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ImageRepository
{
    public function listByUserId(int $userId): ImageCollection
    {
        $rows = EloquentImage::query()
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return ImageCollection::fromEloquent($rows);
    }

    /** @throws NotFound */
    public function findByIdForUser(string $id, int $userId): Image
    {
        try {
            /** @var EloquentImage $row */
            $row = EloquentImage::query()
                ->where('id', $id)
                ->where('user_id', $userId)
                ->firstOrFail();

            return Image::fromEloquent($row);
        } catch (ModelNotFoundException) {
            throw NotFound::imageNotFound($id);
        }
    }

    public function countByUserId(int $userId): int
    {
        return EloquentImage::query()
            ->where('user_id', $userId)
            ->count();
    }

    public function save(Image $image): void
    {
        EloquentImage::create([
            'id'             => $image->getId(),
            'user_id'        => $image->getUserId(),
            'name'           => $image->getName(),
            'image_path'     => $image->getImagePath(),
            'thumbnail_path' => $image->getThumbnailPath(),
        ]);
    }

    public function delete(Image $image): void
    {
        EloquentImage::destroy($image->getId());
    }
}
