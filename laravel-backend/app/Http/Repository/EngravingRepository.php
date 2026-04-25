<?php

namespace App\Http\Repository;

use App\Exceptions\NotFound;
use App\Http\Entity\Engraving;
use App\Http\Entity\EngravingCollection;
use App\Models\Engraving as EloquentEngraving;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EngravingRepository
{
    public function save(Engraving $engraving): void
    {
        EloquentEngraving::create([
            'id'            => $engraving->getId(),
            'user_id'       => $engraving->getUserId(),
            'image_id'      => $engraving->getImageId(),
            'watermark_id'  => $engraving->getWatermarkId(),
            'engraved_path' => $engraving->getEngravedPath(),
            'alpha'         => $engraving->getAlpha(),
        ]);
    }

    public function listByUserId(int $userId, ?string $imageId = null, ?string $watermarkId = null): EngravingCollection
    {
        $query = EloquentEngraving::query()
            ->with(['image', 'watermark'])
            ->where('user_id', $userId)
            ->latest();

        if ($imageId !== null) {
            $query->where('image_id', $imageId);
        }

        if ($watermarkId !== null) {
            $query->where('watermark_id', $watermarkId);
        }

        return EngravingCollection::fromEloquent($query->get());
    }

    /** @throws NotFound */
    public function findByIdForUser(string $id, int $userId): Engraving
    {
        try {
            /** @var EloquentEngraving $row */
            $row = EloquentEngraving::query()
                ->where('id', $id)
                ->where('user_id', $userId)
                ->firstOrFail();

            return Engraving::fromEloquent($row);
        } catch (ModelNotFoundException) {
            throw NotFound::engravingNotFound($id);
        }
    }

    public function delete(Engraving $engraving): void
    {
        EloquentEngraving::destroy($engraving->getId());
    }
}
