<?php

namespace Tests\Feature;

use App\Models\Image;
use App\Models\User;
use App\Models\Watermark;
use App\Services\FakeWatermarkingService;
use App\Services\WatermarkingServiceInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EngraveTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->app->bind(WatermarkingServiceInterface::class, FakeWatermarkingService::class);
    }

    // ── Store (happy path) ────────────────────────────────────────────────────

    public function test_store_engraves_image_stores_result_and_returns_resource(): void
    {
        Storage::fake('public');

        $user      = User::factory()->create();
        $image     = Image::factory()->forUser($user)->create();
        $watermark = Watermark::factory()->forUser($user)->create();

        // Put fake source files so the use case can read them
        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'image_id', 'watermark_id', 'engraved_url']])
            ->assertJsonPath('data.image_id', $image->id)
            ->assertJsonPath('data.watermark_id', $watermark->id);

        $this->assertDatabaseHas('engravings', [
            'user_id'      => $user->id,
            'image_id'     => $image->id,
            'watermark_id' => $watermark->id,
        ]);

        $engravingId = $response->json('data.id');
        Storage::disk('public')->assertExists("engravings/{$user->id}/{$engravingId}.jpg");
    }

    // ── Store (not found) ─────────────────────────────────────────────────────

    public function test_store_returns_404_when_image_does_not_exist(): void
    {
        Storage::fake('public');

        $user      = User::factory()->create();
        $watermark = Watermark::factory()->forUser($user)->create();
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => '00000000-0000-0000-0000-000000000000',
                'watermark_id' => $watermark->id,
            ])
            ->assertNotFound();
    }

    public function test_store_returns_404_when_watermark_does_not_exist(): void
    {
        Storage::fake('public');

        $user  = User::factory()->create();
        $image = Image::factory()->forUser($user)->create();
        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => '00000000-0000-0000-0000-000000000000',
            ])
            ->assertNotFound();
    }

    public function test_store_returns_404_when_image_belongs_to_another_user(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $intruder = User::factory()->create();
        $image    = Image::factory()->forUser($owner)->create();
        $watermark = Watermark::factory()->forUser($intruder)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $this->actingAs($intruder, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ])
            ->assertNotFound();
    }

    public function test_store_returns_404_when_watermark_belongs_to_another_user(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $intruder = User::factory()->create();
        $image     = Image::factory()->forUser($intruder)->create();
        $watermark = Watermark::factory()->forUser($owner)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $this->actingAs($intruder, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ])
            ->assertNotFound();
    }

    // ── Store (validation) ────────────────────────────────────────────────────

    public function test_store_returns_422_when_image_id_is_missing(): void
    {
        $user      = User::factory()->create();
        $watermark = Watermark::factory()->forUser($user)->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', ['watermark_id' => $watermark->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image_id']);
    }

    public function test_store_returns_422_when_watermark_id_is_missing(): void
    {
        $user  = User::factory()->create();
        $image = Image::factory()->forUser($user)->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', ['image_id' => $image->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['watermark_id']);
    }

    public function test_store_returns_422_when_ids_are_not_valid_uuids(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => 'not-a-uuid',
                'watermark_id' => 'not-a-uuid',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image_id', 'watermark_id']);
    }

    // ── Authentication ────────────────────────────────────────────────────────

    public function test_store_requires_authentication(): void
    {
        $this->postJson('/api/engravings', [
            'image_id'     => '00000000-0000-0000-0000-000000000000',
            'watermark_id' => '00000000-0000-0000-0000-000000000000',
        ])->assertUnauthorized();
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_index_returns_user_engravings_with_nested_relations(): void
    {
        Storage::fake('public');

        $user      = User::factory()->create();
        $image     = Image::factory()->forUser($user)->create();
        $watermark = Watermark::factory()->forUser($user)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/engravings');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'image_id', 'watermark_id', 'engraved_url', 'image', 'watermark']],
            ])
            ->assertJsonPath('data.0.image.id', $image->id)
            ->assertJsonPath('data.0.watermark.id', $watermark->id);
    }

    public function test_index_returns_empty_list_when_no_engravings(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/engravings')
            ->assertOk()
            ->assertJson(['data' => []]);
    }

    public function test_index_filters_by_image_id(): void
    {
        Storage::fake('public');

        $user       = User::factory()->create();
        $imageA     = Image::factory()->forUser($user)->create();
        $imageB     = Image::factory()->forUser($user)->create();
        $watermark  = Watermark::factory()->forUser($user)->create();

        foreach ([$imageA, $imageB] as $img) {
            Storage::disk('public')->put($img->image_path, 'fake-image-bytes');
        }
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $acting = $this->actingAs($user, 'sanctum');
        $acting->postJson('/api/engravings', ['image_id' => $imageA->id, 'watermark_id' => $watermark->id]);
        $acting->postJson('/api/engravings', ['image_id' => $imageB->id, 'watermark_id' => $watermark->id]);

        $response = $acting->getJson("/api/engravings?image_id={$imageA->id}");

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($imageA->id, $response->json('data.0.image_id'));
    }

    public function test_index_filters_by_watermark_id(): void
    {
        Storage::fake('public');

        $user        = User::factory()->create();
        $image       = Image::factory()->forUser($user)->create();
        $watermarkA  = Watermark::factory()->forUser($user)->create();
        $watermarkB  = Watermark::factory()->forUser($user)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        foreach ([$watermarkA, $watermarkB] as $wm) {
            Storage::disk('public')->put($wm->image_path, 'fake-watermark-bytes');
        }

        $acting = $this->actingAs($user, 'sanctum');
        $acting->postJson('/api/engravings', ['image_id' => $image->id, 'watermark_id' => $watermarkA->id]);
        $acting->postJson('/api/engravings', ['image_id' => $image->id, 'watermark_id' => $watermarkB->id]);

        $response = $acting->getJson("/api/engravings?watermark_id={$watermarkA->id}");

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($watermarkA->id, $response->json('data.0.watermark_id'));
    }

    public function test_index_does_not_return_other_users_engravings(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $other    = User::factory()->create();
        $image    = Image::factory()->forUser($owner)->create();
        $watermark = Watermark::factory()->forUser($owner)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $this->actingAs($owner, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ]);

        $response = $this->actingAs($other, 'sanctum')
            ->getJson('/api/engravings');

        $response->assertOk()
            ->assertJson(['data' => []]);
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/engravings')->assertUnauthorized();
    }

    // ── Destroy ───────────────────────────────────────────────────────────────

    public function test_destroy_deletes_engraving_and_file(): void
    {
        Storage::fake('public');

        $user      = User::factory()->create();
        $image     = Image::factory()->forUser($user)->create();
        $watermark = Watermark::factory()->forUser($user)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $storeResponse = $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ]);

        $engravingId = $storeResponse->json('data.id');

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/engravings/{$engravingId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('engravings', ['id' => $engravingId]);
        Storage::disk('public')->assertMissing("engravings/{$user->id}/{$engravingId}.jpg");
    }

    public function test_destroy_returns_404_when_engraving_does_not_exist(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/engravings/00000000-0000-0000-0000-000000000000')
            ->assertNotFound();
    }

    public function test_destroy_returns_404_when_engraving_belongs_to_another_user(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $intruder = User::factory()->create();
        $image     = Image::factory()->forUser($owner)->create();
        $watermark = Watermark::factory()->forUser($owner)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $storeResponse = $this->actingAs($owner, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ]);

        $engravingId = $storeResponse->json('data.id');

        $this->actingAs($intruder, 'sanctum')
            ->deleteJson("/api/engravings/{$engravingId}")
            ->assertNotFound();

        $this->assertDatabaseHas('engravings', ['id' => $engravingId]);
    }

    public function test_destroy_requires_authentication(): void
    {
        $this->deleteJson('/api/engravings/00000000-0000-0000-0000-000000000000')
            ->assertUnauthorized();
    }
}
