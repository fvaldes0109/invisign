<?php

namespace App\Http\Entity;

use App\Models\AttackTest as EloquentAttackTest;

class AttackTest
{
    private function __construct(
        private readonly string   $id,
        private readonly int      $userId,
        private readonly string   $engravingId,
        private readonly string   $attackType,
        private readonly string   $attackedImagePath,
        private readonly string   $resultPath,
        private readonly ?float   $similarityScore = null,
        private readonly ?Engraving $engraving = null,
    ) {
    }

    public static function create(
        string $id,
        int    $userId,
        string $engravingId,
        string $attackType,
        string $attackedImagePath,
        string $resultPath,
        ?float $similarityScore = null,
    ): self {
        return new self(
            id:                $id,
            userId:            $userId,
            engravingId:       $engravingId,
            attackType:        $attackType,
            attackedImagePath: $attackedImagePath,
            resultPath:        $resultPath,
            similarityScore:   $similarityScore,
        );
    }

    public static function fromEloquent(EloquentAttackTest $e): self
    {
        return new self(
            id:                $e->id,
            userId:            $e->user_id,
            engravingId:       $e->engraving_id,
            attackType:        $e->attack_type,
            attackedImagePath: $e->attacked_image_path,
            resultPath:        $e->result_path,
            similarityScore:   isset($e->similarity_score) ? (float) $e->similarity_score : null,
            engraving:         $e->relationLoaded('engraving') && $e->engraving
                                    ? Engraving::fromEloquent($e->engraving)
                                    : null,
        );
    }

    public function getId(): string               { return $this->id; }
    public function getUserId(): int              { return $this->userId; }
    public function getEngravingId(): string      { return $this->engravingId; }
    public function getAttackType(): string       { return $this->attackType; }
    public function getAttackedImagePath(): string { return $this->attackedImagePath; }
    public function getResultPath(): string       { return $this->resultPath; }
    public function getSimilarityScore(): ?float  { return $this->similarityScore; }
    public function getEngraving(): ?Engraving    { return $this->engraving; }
}
