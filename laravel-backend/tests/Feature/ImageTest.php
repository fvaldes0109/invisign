<?php

namespace Tests\Feature;

use App\Models\Image;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ImageTest extends TestCase
{
    // ── Count ────────────────────────────────────────────────────────────────

    public function test_count_returns_number_of_authenticated_users_images(): void
    {
        $user  = User::factory()->create();
        $other = User::factory()->create();

        Image::factory()->forUser($user)->count(4)->create();
        Image::factory()->forUser($other)->count(2)->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/images/count')
            ->assertOk()
            ->assertExactJson(['count' => 4]);
    }

    public function test_count_returns_zero_when_user_has_no_images(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/images/count')
            ->assertOk()
            ->assertExactJson(['count' => 0]);
    }

    public function test_count_requires_authentication(): void
    {
        $this->getJson('/api/images/count')->assertUnauthorized();
    }

    // ── Index ────────────────────────────────────────────────────────────────

    public function test_index_returns_only_authenticated_users_images(): void
    {
        $user  = User::factory()->create();
        $other = User::factory()->create();

        Image::factory()->forUser($user)->count(3)->create();
        Image::factory()->forUser($other)->count(5)->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/images')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'name', 'image_url', 'thumbnail_url']],
            ]);
    }

    public function test_index_returns_empty_list_when_user_has_no_images(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/images')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/images')->assertUnauthorized();
    }

    // ── Show ─────────────────────────────────────────────────────────────────

    public function test_show_returns_image_for_owner(): void
    {
        $user  = User::factory()->create();
        $image = Image::factory()->forUser($user)->create();

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/images/{$image->id}")
            ->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'image_url', 'thumbnail_url']])
            ->assertJsonPath('data.id', $image->id);
    }

    public function test_show_returns_404_for_another_users_image(): void
    {
        $owner    = User::factory()->create();
        $intruder = User::factory()->create();
        $image    = Image::factory()->forUser($owner)->create();

        $this->actingAs($intruder, 'sanctum')
            ->getJson("/api/images/{$image->id}")
            ->assertNotFound();
    }

    public function test_show_returns_404_for_nonexistent_image(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/images/00000000-0000-0000-0000-000000000000')
            ->assertNotFound();
    }

    public function test_show_requires_authentication(): void
    {
        $image = Image::factory()->create();

        $this->getJson("/api/images/{$image->id}")->assertUnauthorized();
    }

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_store_creates_image_and_stores_files(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('photo.jpg', 800, 600);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/images', [
                'image' => $file,
                'name'  => 'My photo',
            ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['id', 'name', 'image_url', 'thumbnail_url']])
            ->assertJsonPath('data.name', 'My photo');

        $this->assertDatabaseHas('images', [
            'user_id' => $user->id,
            'name'    => 'My photo',
        ]);

        $id = $response->json('data.id');
        Storage::disk('public')->assertExists("images/{$user->id}/{$id}.jpg");
        Storage::disk('public')->assertExists("images/{$user->id}/thumbnails/{$id}_thumb.jpg");
    }

    public function test_store_returns_422_when_no_image_attached(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/images', ['name' => 'My photo'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    public function test_store_returns_422_when_name_is_missing(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('photo.jpg');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/images', ['image' => $file])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_returns_422_for_non_image_file(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/images', ['image' => $file, 'name' => 'My doc'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image']);
    }

    public function test_store_requires_authentication(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $this->postJson('/api/images', ['image' => $file, 'name' => 'My photo'])
            ->assertUnauthorized();
    }

    // ── Destroy ───────────────────────────────────────────────────────────────

    public function test_destroy_deletes_image_and_its_files(): void
    {
        Storage::fake('public');

        $user  = User::factory()->create();
        $image = Image::factory()->forUser($user)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image');
        Storage::disk('public')->put($image->thumbnail_path, 'fake-thumb');

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/images/{$image->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('images', ['id' => $image->id]);
        Storage::disk('public')->assertMissing($image->image_path);
        Storage::disk('public')->assertMissing($image->thumbnail_path);
    }

    public function test_destroy_returns_404_for_another_users_image(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $intruder = User::factory()->create();
        $image    = Image::factory()->forUser($owner)->create();

        $this->actingAs($intruder, 'sanctum')
            ->deleteJson("/api/images/{$image->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('images', ['id' => $image->id]);
    }

    public function test_destroy_returns_404_for_nonexistent_image(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/images/00000000-0000-0000-0000-000000000000')
            ->assertNotFound();
    }

    public function test_destroy_requires_authentication(): void
    {
        $image = Image::factory()->create();

        $this->deleteJson("/api/images/{$image->id}")->assertUnauthorized();
    }
}
