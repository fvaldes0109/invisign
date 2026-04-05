<?php

namespace App\Http\Entity;

use App\Models\Watermark as EloquentWatermark;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class WatermarkCollection extends Collection
{
    public static function fromEloquent(EloquentCollection $eloquentCollection): self
    {
        $watermarks = [];
        foreach ($eloquentCollection as $eloquentWatermark) {
            if (EloquentWatermark::class === get_class($eloquentWatermark)) {
                $watermarks[] = Watermark::fromEloquent($eloquentWatermark);
            }
        }

        return new self($watermarks);
    }
}
