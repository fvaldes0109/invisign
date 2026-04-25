<?php

namespace App\Http\Resource;

use App\Http\Entity\AttackTest;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AttackTestResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var AttackTest $attackTest */
        $attackTest = $this->resource;
        $engraving  = $attackTest->getEngraving();

        return [
            'id'                 => $attackTest->getId(),
            'engraving_id'       => $attackTest->getEngravingId(),
            'attack_type'        => $attackTest->getAttackType(),
            'attacked_image_url' => Storage::disk('public')->url($attackTest->getAttackedImagePath()),
            'result_url'         => Storage::disk('public')->url($attackTest->getResultPath()),
            'similarity_score'   => $attackTest->getSimilarityScore(),
            'engraving'         => $engraving ? [
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
