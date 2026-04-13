<?php

namespace App\Http\Controllers;

use App\Exceptions\NotFound;
use App\Http\Repository\ExtractionRepository;
use App\Http\Resource\ExtractionResource;
use App\Http\UseCase\CountExtractions;
use App\Http\UseCase\ExtractWatermark;
use App\Http\UseCase\ListExtractions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExtractionController extends Controller
{
    public function __construct(
        private readonly ExtractWatermark    $extractWatermark,
        private readonly ListExtractions     $listExtractions,
        private readonly CountExtractions    $countExtractions,
        private readonly ExtractionRepository $extractionRepository,
    ) {
    }

    public function index(Request $request): JsonResource
    {
        $extractions = $this->listExtractions->execute($request->user()->id);
        return ExtractionResource::collection($extractions);
    }

    public function count(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->countExtractions->execute($request->user()->id),
        ]);
    }

    public function show(Request $request, string $id): JsonResource|JsonResponse
    {
        try {
            $extraction = $this->extractionRepository->findByIdForUser($id, $request->user()->id);
            return new ExtractionResource($extraction);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function store(Request $request): JsonResource|JsonResponse
    {
        $request->validate([
            'engraving_id'  => 'required|uuid',
            'suspect_image' => 'required|file|image',
        ]);

        try {
            $suspectContents = file_get_contents($request->file('suspect_image')->getRealPath());

            $extraction = $this->extractWatermark->execute(
                engravingId:          $request->input('engraving_id'),
                suspectImageContents: $suspectContents,
                userId:               $request->user()->id,
            );

            return new ExtractionResource($extraction);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
