<?php

namespace Tests\Feature;

use App\Models\Image;
use App\Models\User;
use App\Models\Watermark;
use App\Services\FakeWatermarkingService;
use App\Services\WatermarkingServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ExtractionTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->app->bind(WatermarkingServiceInterface::class, FakeWatermarkingService::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Creates a stored engraving for the given user and returns its ID. */
    private function createEngraving(User $user, Image $image, Watermark $watermark): string
    {
        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ]);

        return $response->json('data.id');
    }

    /** Creates a full extraction (engraving + extraction) and returns the extraction ID. */
    private function createExtraction(User $user): string
    {
        $image     = Image::factory()->forUser($user)->create();
        $watermark = Watermark::factory()->forUser($user)->create();
        $engravingId = $this->createEngraving($user, $image, $watermark);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/extractions', [
                'engraving_id'  => $engravingId,
                'suspect_image' => UploadedFile::fake()->image('suspect.jpg'),
            ]);

        return $response->json('data.id');
    }

    // ── Store (happy path) ────────────────────────────────────────────────────

    public function test_store_runs_extraction_stores_result_and_returns_resource(): void
    {
        Storage::fake('public');

        $user      = User::factory()->create();
        $image     = Image::factory()->forUser($user)->create();
        $watermark = Watermark::factory()->forUser($user)->create();

        $engravingId = $this->createEngraving($user, $image, $watermark);

        $suspectFile = UploadedFile::fake()->image('suspect.jpg');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/extractions', [
                'engraving_id'  => $engravingId,
                'suspect_image' => $suspectFile,
            ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'engraving_id', 'suspect_url', 'result_url', 'similarity_score']])
            ->assertJsonPath('data.engraving_id', $engravingId)
            ->assertJsonPath('data.similarity_score', 1);

        $this->assertDatabaseHas('extractions', [
            'user_id'          => $user->id,
            'engraving_id'     => $engravingId,
            'similarity_score' => 1.0,
        ]);

        $extractionId = $response->json('data.id');
        Storage::disk('public')->assertExists("extractions/{$user->id}/{$extractionId}.jpg");
        Storage::disk('public')->assertExists("extractions/{$user->id}/{$extractionId}_suspect.jpg");
    }

    // ── Store (not found) ─────────────────────────────────────────────────────

    public function test_store_returns_404_when_engraving_does_not_exist(): void
    {
        Storage::fake('public');

        $user        = User::factory()->create();
        $suspectFile = UploadedFile::fake()->image('suspect.jpg');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/extractions', [
                'engraving_id'  => '00000000-0000-0000-0000-000000000000',
                'suspect_image' => $suspectFile,
            ])
            ->assertNotFound();
    }

    public function test_store_returns_404_when_engraving_belongs_to_another_user(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $intruder = User::factory()->create();
        $image     = Image::factory()->forUser($owner)->create();
        $watermark = Watermark::factory()->forUser($owner)->create();

        $engravingId = $this->createEngraving($owner, $image, $watermark);

        $suspectFile = UploadedFile::fake()->image('suspect.jpg');

        $this->actingAs($intruder, 'sanctum')
            ->postJson('/api/extractions', [
                'engraving_id'  => $engravingId,
                'suspect_image' => $suspectFile,
            ])
            ->assertNotFound();
    }

    // ── Store (validation) ────────────────────────────────────────────────────

    public function test_store_returns_422_when_engraving_id_is_missing(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/extractions', ['suspect_image' => UploadedFile::fake()->image('s.jpg')])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['engraving_id']);
    }

    public function test_store_returns_422_when_suspect_image_is_missing(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/extractions', ['engraving_id' => '00000000-0000-0000-0000-000000000000'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['suspect_image']);
    }

    public function test_store_returns_422_when_engraving_id_is_not_a_uuid(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/extractions', [
                'engraving_id'  => 'not-a-uuid',
                'suspect_image' => UploadedFile::fake()->image('s.jpg'),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['engraving_id']);
    }

    // ── Store (authentication) ────────────────────────────────────────────────

    public function test_store_requires_authentication(): void
    {
        $this->postJson('/api/extractions', [
            'engraving_id'  => '00000000-0000-0000-0000-000000000000',
            'suspect_image' => UploadedFile::fake()->image('s.jpg'),
        ])->assertUnauthorized();
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_index_returns_user_extractions_with_nested_engraving(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->createExtraction($user);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/extractions');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [[
                    'id', 'engraving_id', 'suspect_url', 'result_url', 'similarity_score',
                    'engraving' => ['id', 'engraved_url', 'image', 'watermark'],
                ]],
            ]);
    }

    public function test_index_returns_empty_list_when_no_extractions(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/extractions')
            ->assertOk()
            ->assertJson(['data' => []]);
    }

    public function test_index_does_not_return_other_users_extractions(): void
    {
        Storage::fake('public');

        $owner = User::factory()->create();
        $other = User::factory()->create();

        $this->createExtraction($owner);

        $this->actingAs($other, 'sanctum')
            ->getJson('/api/extractions')
            ->assertOk()
            ->assertJson(['data' => []]);
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/extractions')->assertUnauthorized();
    }

    // ── Count ─────────────────────────────────────────────────────────────────

    public function test_count_returns_correct_number(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->createExtraction($user);
        $this->createExtraction($user);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/extractions/count')
            ->assertOk()
            ->assertJson(['data' => 2]);
    }

    public function test_count_returns_zero_when_no_extractions(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/extractions/count')
            ->assertOk()
            ->assertJson(['data' => 0]);
    }

    public function test_count_does_not_include_other_users_extractions(): void
    {
        Storage::fake('public');

        $owner = User::factory()->create();
        $other = User::factory()->create();

        $this->createExtraction($owner);

        $this->actingAs($other, 'sanctum')
            ->getJson('/api/extractions/count')
            ->assertOk()
            ->assertJson(['data' => 0]);
    }

    public function test_count_requires_authentication(): void
    {
        $this->getJson('/api/extractions/count')->assertUnauthorized();
    }

    // ── Show ──────────────────────────────────────────────────────────────────

    public function test_show_returns_extraction_with_nested_engraving(): void
    {
        Storage::fake('public');

        $user         = User::factory()->create();
        $extractionId = $this->createExtraction($user);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/extractions/{$extractionId}");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'id', 'engraving_id', 'suspect_url', 'result_url', 'similarity_score',
                    'engraving' => ['id', 'engraved_url', 'image', 'watermark'],
                ],
            ])
            ->assertJsonPath('data.id', $extractionId);
    }

    public function test_show_returns_404_when_extraction_does_not_exist(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/extractions/00000000-0000-0000-0000-000000000000')
            ->assertNotFound();
    }

    public function test_show_returns_404_when_extraction_belongs_to_another_user(): void
    {
        Storage::fake('public');

        $owner        = User::factory()->create();
        $intruder     = User::factory()->create();
        $extractionId = $this->createExtraction($owner);

        $this->actingAs($intruder, 'sanctum')
            ->getJson("/api/extractions/{$extractionId}")
            ->assertNotFound();
    }

    public function test_show_requires_authentication(): void
    {
        $this->getJson('/api/extractions/00000000-0000-0000-0000-000000000000')
            ->assertUnauthorized();
    }
}
