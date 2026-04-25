<?php

namespace App\Http\Repository;

use App\Exceptions\NotFound;
use App\Http\Entity\AttackTest;
use App\Models\AttackTest as EloquentAttackTest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AttackTestRepository
{
    public function save(AttackTest $attackTest): void
    {
        EloquentAttackTest::create([
            'id'                  => $attackTest->getId(),
            'user_id'             => $attackTest->getUserId(),
            'engraving_id'        => $attackTest->getEngravingId(),
            'attack_type'         => $attackTest->getAttackType(),
            'attacked_image_path' => $attackTest->getAttackedImagePath(),
            'result_path'         => $attackTest->getResultPath(),
            'similarity_score'    => $attackTest->getSimilarityScore(),
        ]);
    }

    /** @return AttackTest[] */
    public function listByUserId(int $userId, ?string $engravingId = null): array
    {
        $query = EloquentAttackTest::query()
            ->with(['engraving.image', 'engraving.watermark'])
            ->where('user_id', $userId)
            ->latest();

        if ($engravingId !== null) {
            $query->where('engraving_id', $engravingId);
        }

        return $query->get()->map(fn ($row) => AttackTest::fromEloquent($row))->all();
    }

    /** @throws NotFound */
    public function findByIdForUser(string $id, int $userId): AttackTest
    {
        try {
            $row = EloquentAttackTest::query()
                ->with(['engraving.image', 'engraving.watermark'])
                ->where('id', $id)
                ->where('user_id', $userId)
                ->firstOrFail();

            return AttackTest::fromEloquent($row);
        } catch (ModelNotFoundException) {
            throw new NotFound("AttackTest $id not found");
        }
    }
}
