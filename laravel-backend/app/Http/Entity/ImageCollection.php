<?php

namespace App\Http\Entity;

use App\Models\Image as EloquentImage;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class ImageCollection extends Collection
{
    public static function fromEloquent(EloquentCollection $eloquentCollection): self
    {
        $images = [];
        foreach ($eloquentCollection as $eloquentImage) {
            if (EloquentImage::class === get_class($eloquentImage)) {
                $images[] = Image::fromEloquent($eloquentImage);
            }
        }

        return new self($images);
    }
}
