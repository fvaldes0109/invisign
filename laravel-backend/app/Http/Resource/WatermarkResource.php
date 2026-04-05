<?php

namespace App\Http\Resource;

use App\Http\Entity\Watermark;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class WatermarkResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Watermark $watermark */
        $watermark = $this->resource;

        return [
            'id'            => $watermark->getId(),
            'name'          => $watermark->getName(),
            'image_url'     => Storage::disk('public')->url($watermark->getImagePath()),
            'thumbnail_url' => Storage::disk('public')->url($watermark->getThumbnailPath()),
        ];
    }
}
