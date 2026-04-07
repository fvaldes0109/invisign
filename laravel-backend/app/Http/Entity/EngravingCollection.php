<?php

namespace App\Http\Entity;

use App\Models\Engraving as EloquentEngraving;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class EngravingCollection extends Collection
{
    public static function fromEloquent(EloquentCollection $eloquentCollection): self
    {
        $engravings = [];
        foreach ($eloquentCollection as $e) {
            if (EloquentEngraving::class === get_class($e)) {
                $engravings[] = Engraving::fromEloquent($e);
            }
        }

        return new self($engravings);
    }
}
