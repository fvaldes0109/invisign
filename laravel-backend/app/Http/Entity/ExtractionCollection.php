<?php

namespace App\Http\Entity;

use App\Models\Extraction as EloquentExtraction;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class ExtractionCollection extends Collection
{
    public static function fromEloquent(EloquentCollection $eloquentCollection): self
    {
        $extractions = [];
        foreach ($eloquentCollection as $e) {
            if (EloquentExtraction::class === get_class($e)) {
                $extractions[] = Extraction::fromEloquent($e);
            }
        }
        return new self($extractions);
    }
}
