<?php

namespace App\Http\Controllers;

use App\Exceptions\NotFound;
use App\Http\Resource\EngravingResource;
use App\Http\UseCase\DeleteEngraving;
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
        private readonly DeleteEngraving $deleteEngraving,
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
            'alpha'        => 'sometimes|numeric|min:0|max:1',
        ]);

        try {
            $engraving = $this->engraveImage->execute(
                imageId:     $request->input('image_id'),
                watermarkId: $request->input('watermark_id'),
                userId:      $request->user()->id,
                alpha:       (float) $request->input('alpha', 0.00005),
            );

            return new EngravingResource($engraving);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $this->deleteEngraving->execute($id, $request->user()->id);
            return response()->json(null, 204);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
