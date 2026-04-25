<?php

namespace App\Http\Repository;

use App\Exceptions\NotFound;
use App\Http\Entity\Extraction;
use App\Http\Entity\ExtractionCollection;
use App\Models\Extraction as EloquentExtraction;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ExtractionRepository
{
    public function save(Extraction $extraction): void
    {
        EloquentExtraction::create([
            'id'               => $extraction->getId(),
            'user_id'          => $extraction->getUserId(),
            'engraving_id'     => $extraction->getEngravingId(),
            'suspect_path'     => $extraction->getSuspectPath(),
            'result_path'      => $extraction->getResultPath(),
            'similarity_score' => $extraction->getSimilarityScore(),
        ]);
    }

    public function listByUserId(int $userId): ExtractionCollection
    {
        $rows = EloquentExtraction::query()
            ->with(['engraving.image', 'engraving.watermark'])
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return ExtractionCollection::fromEloquent($rows);
    }

    /** @throws NotFound */
    public function findByIdForUser(string $id, int $userId): Extraction
    {
        try {
            /** @var EloquentExtraction $row */
            $row = EloquentExtraction::query()
                ->with(['engraving.image', 'engraving.watermark'])
                ->where('id', $id)
                ->where('user_id', $userId)
                ->firstOrFail();

            return Extraction::fromEloquent($row);
        } catch (ModelNotFoundException) {
            throw new NotFound("Extraction $id not found");
        }
    }

    public function countByUserId(int $userId): int
    {
        return EloquentExtraction::query()
            ->where('user_id', $userId)
            ->count();
    }
}
