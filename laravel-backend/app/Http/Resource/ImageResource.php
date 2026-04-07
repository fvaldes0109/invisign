<?php

namespace App\Http\Resource;

use App\Http\Entity\Image;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ImageResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Image $image */
        $image = $this->resource;

        return [
            'id'            => $image->getId(),
            'name'          => $image->getName(),
            'image_url'     => Storage::disk('public')->url($image->getImagePath()),
            'thumbnail_url' => Storage::disk('public')->url($image->getThumbnailPath()),
        ];
    }
}
