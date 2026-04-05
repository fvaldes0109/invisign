<?php

namespace App\Http\Repository;

use App\Exceptions\NotFound;
use App\Http\Entity\Watermark;
use App\Http\Entity\WatermarkCollection;
use App\Models\Watermark as EloquentWatermark;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class WatermarkRepository
{
    public function listByUserId(int $userId): WatermarkCollection
    {
        $rows = EloquentWatermark::query()
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return WatermarkCollection::fromEloquent($rows);
    }

    /** @throws NotFound */
    public function findByIdForUser(string $id, int $userId): Watermark
    {
        try {
            /** @var EloquentWatermark $row */
            $row = EloquentWatermark::query()
                ->where('id', $id)
                ->where('user_id', $userId)
                ->firstOrFail();

            return Watermark::fromEloquent($row);
        } catch (ModelNotFoundException) {
            throw NotFound::watermarkNotFound($id);
        }
    }

    public function countByUserId(int $userId): int
    {
        return EloquentWatermark::query()
            ->where('user_id', $userId)
            ->count();
    }

    public function save(Watermark $watermark): void
    {
        EloquentWatermark::create([
            'id'             => $watermark->getId(),
            'user_id'        => $watermark->getUserId(),
            'name'           => $watermark->getName(),
            'image_path'     => $watermark->getImagePath(),
            'thumbnail_path' => $watermark->getThumbnailPath(),
        ]);
    }

    public function delete(Watermark $watermark): void
    {
        EloquentWatermark::destroy($watermark->getId());
    }
}
