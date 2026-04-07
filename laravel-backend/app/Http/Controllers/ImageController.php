<?php

namespace App\Http\Controllers;

use App\Exceptions\NotFound;
use App\Http\Resource\ImageResource;
use App\Http\UseCase\CountImages;
use App\Http\UseCase\CreateImage;
use App\Http\UseCase\DeleteImage;
use App\Http\UseCase\ListImages;
use App\Http\UseCase\ShowImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    public function __construct(
        private readonly ListImages  $listImages,
        private readonly ShowImage   $showImage,
        private readonly CreateImage $createImage,
        private readonly DeleteImage $deleteImage,
        private readonly CountImages $countImages,
    ) {
    }

    public function index(Request $request): JsonResource
    {
        $images = $this->listImages->execute($request->user()->id);

        return ImageResource::collection($images);
    }

    public function show(Request $request, string $id): JsonResource|JsonResponse
    {
        try {
            $image = $this->showImage->execute($id, $request->user()->id);
            return new ImageResource($image);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    public function store(Request $request): JsonResource
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:51200',
            'name'  => 'required|string|max:255',
        ]);

        $image = $this->createImage->execute(
            userId: $request->user()->id,
            file:   $request->file('image'),
            name:   $request->input('name'),
        );

        return new ImageResource($image);
    }

    public function count(Request $request): JsonResponse
    {
        $count = $this->countImages->execute($request->user()->id);

        return response()->json(['count' => $count]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $this->deleteImage->execute($id, $request->user()->id);
            return response()->json(null, 204);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
