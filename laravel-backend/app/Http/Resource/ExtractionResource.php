<?php

namespace App\Http\Resource;

use App\Http\Entity\Extraction;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ExtractionResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Extraction $extraction */
        $extraction = $this->resource;
        $engraving  = $extraction->getEngraving();

        return [
            'id'               => $extraction->getId(),
            'engraving_id'     => $extraction->getEngravingId(),
            'suspect_url'      => Storage::disk('public')->url($extraction->getSuspectPath()),
            'result_url'       => Storage::disk('public')->url($extraction->getResultPath()),
            'similarity_score' => $extraction->getSimilarityScore(),
            'engraving'    => $engraving ? [
                'id'           => $engraving->getId(),
                'engraved_url' => Storage::disk('public')->url($engraving->getEngravedPath()),
                'image'        => $engraving->getImage() ? [
                    'id'            => $engraving->getImage()->getId(),
                    'name'          => $engraving->getImage()->getName(),
                    'thumbnail_url' => Storage::disk('public')->url($engraving->getImage()->getThumbnailPath()),
                ] : null,
                'watermark'    => $engraving->getWatermark() ? [
                    'id'            => $engraving->getWatermark()->getId(),
                    'name'          => $engraving->getWatermark()->getName(),
                    'thumbnail_url' => Storage::disk('public')->url($engraving->getWatermark()->getThumbnailPath()),
                ] : null,
            ] : null,
        ];
    }
}
