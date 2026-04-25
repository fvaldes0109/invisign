<?php

namespace Tests\Feature;

use App\Models\Image;
use App\Models\User;
use App\Models\Watermark;
use App\Services\FakeWatermarkingService;
use App\Services\WatermarkingServiceInterface;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AttackTestTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->app->bind(WatermarkingServiceInterface::class, FakeWatermarkingService::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function createEngraving(User $user): string
    {
        $image     = Image::factory()->forUser($user)->create();
        $watermark = Watermark::factory()->forUser($user)->create();

        Storage::disk('public')->put($image->image_path, 'fake-image-bytes');
        Storage::disk('public')->put($watermark->image_path, 'fake-watermark-bytes');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/engravings', [
                'image_id'     => $image->id,
                'watermark_id' => $watermark->id,
            ]);

        return $response->json('data.id');
    }

    private function createAttackTest(User $user, string $engravingId, string $attackType = 'mirror'): string
    {
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => $engravingId,
                'attack_type'  => $attackType,
            ]);

        return $response->json('data.id');
    }

    // ── Store (happy path) ────────────────────────────────────────────────────

    public function test_store_runs_attack_stores_files_and_returns_resource(): void
    {
        Storage::fake('public');

        $user        = User::factory()->create();
        $engravingId = $this->createEngraving($user);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => $engravingId,
                'attack_type'  => 'noise',
                'params'       => ['std' => 30],
            ]);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'engraving_id', 'attack_type', 'attacked_image_url', 'result_url', 'similarity_score'],
            ])
            ->assertJsonPath('data.engraving_id', $engravingId)
            ->assertJsonPath('data.attack_type', 'noise')
            ->assertJsonPath('data.similarity_score', 1);

        $id = $response->json('data.id');

        $this->assertDatabaseHas('attack_tests', [
            'user_id'      => $user->id,
            'engraving_id' => $engravingId,
            'attack_type'  => 'noise',
        ]);

        Storage::disk('public')->assertExists("attack-tests/{$user->id}/{$id}_attacked.jpg");
        Storage::disk('public')->assertExists("attack-tests/{$user->id}/{$id}.jpg");
    }

    public function test_store_works_without_optional_params(): void
    {
        Storage::fake('public');

        $user        = User::factory()->create();
        $engravingId = $this->createEngraving($user);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => $engravingId,
                'attack_type'  => 'mirror',
            ])
            ->assertOk()
            ->assertJsonPath('data.attack_type', 'mirror');
    }

    // ── Store (not found) ─────────────────────────────────────────────────────

    public function test_store_returns_404_when_engraving_does_not_exist(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => '00000000-0000-0000-0000-000000000000',
                'attack_type'  => 'mirror',
            ])
            ->assertNotFound();
    }

    public function test_store_returns_404_when_engraving_belongs_to_another_user(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $intruder = User::factory()->create();

        $engravingId = $this->createEngraving($owner);

        $this->actingAs($intruder, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => $engravingId,
                'attack_type'  => 'mirror',
            ])
            ->assertNotFound();
    }

    // ── Store (validation) ────────────────────────────────────────────────────

    public function test_store_returns_422_when_engraving_id_is_missing(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', ['attack_type' => 'mirror'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['engraving_id']);
    }

    public function test_store_returns_422_when_attack_type_is_missing(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', ['engraving_id' => '00000000-0000-0000-0000-000000000000'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['attack_type']);
    }

    public function test_store_returns_422_for_unknown_attack_type(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => '00000000-0000-0000-0000-000000000000',
                'attack_type'  => 'teleportation',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['attack_type']);
    }

    public function test_store_returns_422_when_engraving_id_is_not_a_uuid(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => 'not-a-uuid',
                'attack_type'  => 'mirror',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['engraving_id']);
    }

    public function test_store_returns_422_when_params_is_not_an_array(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => '00000000-0000-0000-0000-000000000000',
                'attack_type'  => 'noise',
                'params'       => 'not-an-array',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['params']);
    }

    // ── Store (all supported attack types) ───────────────────────────────────

    /**
     * @dataProvider attackTypeProvider
     */
    public function test_store_accepts_all_supported_attack_types(string $attackType): void
    {
        Storage::fake('public');

        $user        = User::factory()->create();
        $engravingId = $this->createEngraving($user);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/attack-tests', [
                'engraving_id' => $engravingId,
                'attack_type'  => $attackType,
            ])
            ->assertOk();
    }

    public static function attackTypeProvider(): array
    {
        return [
            'rotate'     => ['rotate'],
            'mirror'     => ['mirror'],
            'noise'      => ['noise'],
            'brightness' => ['brightness'],
            'compression'=> ['compression'],
            'exposition' => ['exposition'],
            'blur'       => ['blur'],
            'pixelate'   => ['pixelate'],
        ];
    }

    // ── Store (authentication) ────────────────────────────────────────────────

    public function test_store_requires_authentication(): void
    {
        $this->postJson('/api/attack-tests', [
            'engraving_id' => '00000000-0000-0000-0000-000000000000',
            'attack_type'  => 'mirror',
        ])->assertUnauthorized();
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_index_returns_users_attack_tests(): void
    {
        Storage::fake('public');

        $user        = User::factory()->create();
        $engravingId = $this->createEngraving($user);

        $this->createAttackTest($user, $engravingId, 'mirror');
        $this->createAttackTest($user, $engravingId, 'noise');

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/attack-tests');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure([
                'data' => [[
                    'id', 'engraving_id', 'attack_type',
                    'attacked_image_url', 'result_url', 'similarity_score', 'engraving',
                ]],
            ]);
    }

    public function test_index_returns_empty_list_when_no_attack_tests(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/attack-tests')
            ->assertOk()
            ->assertJson(['data' => []]);
    }

    public function test_index_does_not_return_other_users_attack_tests(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $intruder = User::factory()->create();

        $engravingId = $this->createEngraving($owner);
        $this->createAttackTest($owner, $engravingId);

        $this->actingAs($intruder, 'sanctum')
            ->getJson('/api/attack-tests')
            ->assertOk()
            ->assertJson(['data' => []]);
    }

    public function test_index_filters_by_engraving_id(): void
    {
        Storage::fake('public');

        $user         = User::factory()->create();
        $engravingIdA = $this->createEngraving($user);
        $engravingIdB = $this->createEngraving($user);

        $this->createAttackTest($user, $engravingIdA);
        $this->createAttackTest($user, $engravingIdB);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/attack-tests?engraving_id={$engravingIdA}");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.engraving_id', $engravingIdA);
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/attack-tests')->assertUnauthorized();
    }

    // ── Show ──────────────────────────────────────────────────────────────────

    public function test_show_returns_attack_test_for_owner(): void
    {
        Storage::fake('public');

        $user         = User::factory()->create();
        $engravingId  = $this->createEngraving($user);
        $attackTestId = $this->createAttackTest($user, $engravingId);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/attack-tests/{$attackTestId}");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'id', 'engraving_id', 'attack_type',
                    'attacked_image_url', 'result_url', 'similarity_score',
                    'engraving' => ['id', 'engraved_url', 'image', 'watermark'],
                ],
            ])
            ->assertJsonPath('data.id', $attackTestId);
    }

    public function test_show_returns_404_when_attack_test_does_not_exist(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/attack-tests/00000000-0000-0000-0000-000000000000')
            ->assertNotFound();
    }

    public function test_show_returns_404_when_attack_test_belongs_to_another_user(): void
    {
        Storage::fake('public');

        $owner    = User::factory()->create();
        $intruder = User::factory()->create();

        $engravingId  = $this->createEngraving($owner);
        $attackTestId = $this->createAttackTest($owner, $engravingId);

        $this->actingAs($intruder, 'sanctum')
            ->getJson("/api/attack-tests/{$attackTestId}")
            ->assertNotFound();
    }

    public function test_show_requires_authentication(): void
    {
        $this->getJson('/api/attack-tests/00000000-0000-0000-0000-000000000000')
            ->assertUnauthorized();
    }
}
