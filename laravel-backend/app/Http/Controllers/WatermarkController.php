<?php

namespace App\Http\Controllers;

use App\Exceptions\NotFound;
use App\Http\Resource\WatermarkResource;
use App\Http\UseCase\CountWatermarks;
use App\Http\UseCase\CreateWatermark;
use App\Http\UseCase\DeleteWatermark;
use App\Http\UseCase\ListWatermarks;
use App\Http\UseCase\ShowWatermark;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class WatermarkController extends Controller
{
    public function __construct(
        private readonly ListWatermarks  $listWatermarks,
        private readonly ShowWatermark   $showWatermark,
        private readonly CreateWatermark $createWatermark,
        private readonly DeleteWatermark $deleteWatermark,
        private readonly CountWatermarks $countWatermarks,
    ) {
    }

    public function index(Request $request): JsonResource
    {
        $watermarks = $this->listWatermarks->execute($request->user()->id);

        return WatermarkResource::collection($watermarks);
    }

    public function show(Request $request, string $id): JsonResource|JsonResponse
    {
        try {
            $watermark = $this->showWatermark->execute($id, $request->user()->id);
            return new WatermarkResource($watermark);
        } catch (NotFound $e) {
            return response()->json(['message' => $e], Response::HTTP_NOT_FOUND);
        }
    }

    public function store(Request $request): JsonResource
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:51200',
            'name'  => 'required|string|max:255',
        ]);

        $file = $request->file('image');
        $size = getimagesize($file->getRealPath());

        if ($size === false || $size[0] !== $size[1]) {
            throw ValidationException::withMessages([
                'image' => ['The watermark image must be square (width must equal height).'],
            ]);
        }

        $watermark = $this->createWatermark->execute(
            userId: $request->user()->id,
            file:   $file,
            name:   $request->input('name'),
        );

        return new WatermarkResource($watermark);
    }

    public function count(Request $request): JsonResponse
    {
        $count = $this->countWatermarks->execute($request->user()->id);

        return response()->json(['count' => $count]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $this->deleteWatermark->execute($id, $request->user()->id);
            return response()->json(null, 204);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
