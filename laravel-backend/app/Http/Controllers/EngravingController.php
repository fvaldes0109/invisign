<?php

namespace App\Http\Controllers;

use App\Exceptions\NotFound;
use App\Http\Resource\EngravingResource;
use App\Http\UseCase\EngraveImage;
use App\Http\UseCase\ListEngravings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EngravingController extends Controller
{
    public function __construct(
        private readonly EngraveImage   $engraveImage,
        private readonly ListEngravings $listEngravings,
    ) {
    }

    public function index(Request $request): JsonResource
    {
        $engravings = $this->listEngravings->execute(
            userId:      $request->user()->id,
            imageId:     $request->query('image_id'),
            watermarkId: $request->query('watermark_id'),
        );

        return EngravingResource::collection($engravings);
    }

    public function store(Request $request): JsonResource|JsonResponse
    {
        $request->validate([
            'image_id'     => 'required|uuid',
            'watermark_id' => 'required|uuid',
        ]);

        try {
            $engraving = $this->engraveImage->execute(
                imageId:     $request->input('image_id'),
                watermarkId: $request->input('watermark_id'),
                userId:      $request->user()->id,
            );

            return new EngravingResource($engraving);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
