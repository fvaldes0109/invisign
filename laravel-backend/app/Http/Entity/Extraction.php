<?php

namespace App\Http\Entity;

use App\Models\Extraction as EloquentExtraction;

class Extraction
{
    private function __construct(
        private readonly string    $id,
        private readonly int       $userId,
        private readonly string    $engravingId,
        private readonly string    $suspectPath,
        private readonly string    $resultPath,
        private readonly ?float    $similarityScore = null,
        private readonly ?Engraving $engraving = null,
    ) {
    }

    public static function create(
        string $id,
        int    $userId,
        string $engravingId,
        string $suspectPath,
        string $resultPath,
        ?float $similarityScore = null,
    ): self {
        return new self(
            id:              $id,
            userId:          $userId,
            engravingId:     $engravingId,
            suspectPath:     $suspectPath,
            resultPath:      $resultPath,
            similarityScore: $similarityScore,
        );
    }

    public static function fromEloquent(EloquentExtraction $e): self
    {
        return new self(
            id:              $e->id,
            userId:          $e->user_id,
            engravingId:     $e->engraving_id,
            suspectPath:     $e->suspect_path,
            resultPath:      $e->result_path,
            similarityScore: isset($e->similarity_score) ? (float) $e->similarity_score : null,
            engraving:       $e->relationLoaded('engraving') && $e->engraving
                                 ? Engraving::fromEloquent($e->engraving)
                                 : null,
        );
    }

    public function getId(): string             { return $this->id; }
    public function getUserId(): int            { return $this->userId; }
    public function getEngravingId(): string    { return $this->engravingId; }
    public function getSuspectPath(): string    { return $this->suspectPath; }
    public function getResultPath(): string     { return $this->resultPath; }
    public function getSimilarityScore(): ?float { return $this->similarityScore; }
    public function getEngraving(): ?Engraving  { return $this->engraving; }
}
