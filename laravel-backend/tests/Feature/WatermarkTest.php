<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Watermark;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WatermarkTest extends TestCase
{
    // ── Count ────────────────────────────────────────────────────────────────

    public function test_count_returns_number_of_authenticated_users_watermarks(): void
    {
        $user  = User::factory()->create();
        $other = User::factory()->create();

        Watermark::factory()->forUser($user)->count(5)->create();
        Watermark::factory()->forUser($other)->count(3)->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/watermarks/count')
            ->assertOk()
            ->assertExactJson(['count' => 5]);
    }

    public function test_count_returns_zero_when_user_has_no_watermarks(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/watermarks/count')
            ->assertOk()
            ->assertExactJson(['count' => 0]);
    }

    public function test_count_requires_authentication(): void
    {
        $this->getJson('/api/watermarks/count')->assertUnauthorized();
    }

    // ── Index ────────────────────────────────────────────────────────────────

    public function test_index_returns_only_authenticated_users_watermarks(): void
    {
        $user  = User::factory()->create();
        $other = User::factory()->create();

        Watermark::factory()->forUser($user)->count(3)->create();
        Watermark::factory()->forUser($other)->count(2)->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/watermarks');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'name', 'image_url', 'thumbnail_url']],
            ]);
    }

    public function test_index_returns_empty_list_when_user_has_no_watermarks(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/watermarks')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/watermarks')->assertUnauthorized();
    }

    // ── Show ─────────────────────────────────────────────────────────────────

    public function test_show_returns_watermark_for_owner(): void
    {
        $user      = User::factory()->create();
        $watermark = Watermark::factory()->forUser($user)->create();

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/watermarks/{$watermark->id}")
            ->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'image_url', 'thumbnail_url']])
            ->assertJsonPath('data.id', $watermark->id);
    }

    public function test_show_returns_404_for_another_users_watermark(): void
    {
        $owner     = User::factory()->create();
        $intruder  = User::factory()->create();
        $watermark = Watermark::factory()->forUser($owner)->create();

        $this->actingAs($intruder, 'sanctum')
            ->getJson("/api/watermarks/{$watermark->id}")
            ->assertNotFound();
    }

    public function test_show_returns_404_for_nonexistent_watermark(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/watermarks/00000000-0000-0000-0000-000000000000')
            ->assertNotFound();
    }

    public function test_show_requires_authentication(): void
    {
        $watermark = Watermark::factory()->create();

        $this->getJson("/api/watermarks/{$watermark->id}")->assertUnauthorized();
    }

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_store_creates_watermark_and_stores_files(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('photo.jpg', 800, 600);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/watermarks', [
                'image' => $file,
                'name' => 'My Mark'
            ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'image_url', 'thumbnail_url']])
            ->assertJsonPath('data.name', 'My Mark');

        $this->assertDatabaseHas('watermarks', [
            'user_id' => $user->id,
            'name'    => 'My Mark',
        ]);

        $id = $response->json('data.id');
        Storage::disk('public')->assertExists("watermarks/{$user->id}/{$id}.jpg");
        Storage::disk('public')->assertExists("watermarks/{$user->id}/thumbnails/{$id}_thumb.jpg");
    }

    public function test_store_returns_422_when_no_image_attached(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/watermarks', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    public function test_store_returns_422_for_non_image_file(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/watermarks', ['image' => $file])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    public function test_store_requires_authentication(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $this->postJson('/api/watermarks', ['image' => $file])->assertUnauthorized();
    }

    // ── Destroy ───────────────────────────────────────────────────────────────

    public function test_destroy_deletes_watermark_and_its_files(): void
    {
        Storage::fake('public');

        $user      = User::factory()->create();
        $watermark = Watermark::factory()->forUser($user)->create();

        // Put fake files so deletion can be asserted
        Storage::disk('public')->put($watermark->image_path, 'fake-image');
        Storage::disk('public')->put($watermark->thumbnail_path, 'fake-thumb');

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/watermarks/{$watermark->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('watermarks', ['id' => $watermark->id]);
        Storage::disk('public')->assertMissing($watermark->image_path);
        Storage::disk('public')->assertMissing($watermark->thumbnail_path);
    }

    public function test_destroy_returns_404_for_another_users_watermark(): void
    {
        Storage::fake('public');

        $owner     = User::factory()->create();
        $intruder  = User::factory()->create();
        $watermark = Watermark::factory()->forUser($owner)->create();

        $this->actingAs($intruder, 'sanctum')
            ->deleteJson("/api/watermarks/{$watermark->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('watermarks', ['id' => $watermark->id]);
    }

    public function test_destroy_returns_404_for_nonexistent_watermark(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/watermarks/00000000-0000-0000-0000-000000000000')
            ->assertNotFound();
    }

    public function test_destroy_requires_authentication(): void
    {
        $watermark = Watermark::factory()->create();

        $this->deleteJson("/api/watermarks/{$watermark->id}")->assertUnauthorized();
    }
}
