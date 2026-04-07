<?php

namespace App\Http\UseCase;

use App\Exceptions\NotFound;
use App\Http\Repository\EngravingRepository;
use Illuminate\Support\Facades\Storage;

class DeleteEngraving
{
    public function __construct(private readonly EngravingRepository $engravingRepository)
    {
    }

    /** @throws NotFound */
    public function execute(string $id, int $userId): void
    {
        $engraving = $this->engravingRepository->findByIdForUser($id, $userId);

        Storage::disk('public')->delete($engraving->getEngravedPath());

        $this->engravingRepository->delete($engraving);
    }
}
