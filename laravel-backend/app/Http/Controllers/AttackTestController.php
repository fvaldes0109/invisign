<?php

namespace App\Http\Controllers;

use App\Exceptions\NotFound;
use App\Http\Repository\AttackTestRepository;
use App\Http\Resource\AttackTestResource;
use App\Http\UseCase\TestAttackOnEngraving;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttackTestController extends Controller
{
    public function __construct(
        private readonly TestAttackOnEngraving $testAttackOnEngraving,
        private readonly AttackTestRepository  $attackTestRepository,
    ) {
    }

    public function index(Request $request): JsonResource
    {
        $engravingId = $request->query('engraving_id');
        $results = $this->attackTestRepository->listByUserId($request->user()->id, $engravingId);
        return AttackTestResource::collection(collect($results));
    }

    public function show(Request $request, string $id): JsonResource|JsonResponse
    {
        try {
            $attackTest = $this->attackTestRepository->findByIdForUser($id, $request->user()->id);
            return new AttackTestResource($attackTest);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function store(Request $request): JsonResource|JsonResponse
    {
        $request->validate([
            'engraving_id' => 'required|uuid',
            'attack_type'  => 'required|string|in:rotate,mirror,noise,brightness,compression,exposition,blur,pixelate',
            'params'       => 'sometimes|array',
        ]);

        try {
            $attackTest = $this->testAttackOnEngraving->execute(
                engravingId: $request->input('engraving_id'),
                attackType:  $request->input('attack_type'),
                params:      $request->input('params', []),
                userId:      $request->user()->id,
            );

            return new AttackTestResource($attackTest);
        } catch (NotFound $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
