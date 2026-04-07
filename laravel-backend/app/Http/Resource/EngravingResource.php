<?php

namespace App\Http\Resource;

use App\Http\Entity\Engraving;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EngravingResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Engraving $engraving */
        $engraving = $this->resource;

        $image     = $engraving->getImage();
        $watermark = $engraving->getWatermark();

        return [
            'id'           => $engraving->getId(),
            'image_id'     => $engraving->getImageId(),
            'watermark_id' => $engraving->getWatermarkId(),
            'engraved_url' => Storage::disk('public')->url($engraving->getEngravedPath()),
            'image'        => $image ? [
                'id'            => $image->getId(),
                'name'          => $image->getName(),
                'image_url'     => Storage::disk('public')->url($image->getImagePath()),
                'thumbnail_url' => Storage::disk('public')->url($image->getThumbnailPath()),
            ] : null,
            'watermark'    => $watermark ? [
                'id'            => $watermark->getId(),
                'name'          => $watermark->getName(),
                'image_url'     => Storage::disk('public')->url($watermark->getImagePath()),
                'thumbnail_url' => Storage::disk('public')->url($watermark->getThumbnailPath()),
            ] : null,
        ];
    }
}
