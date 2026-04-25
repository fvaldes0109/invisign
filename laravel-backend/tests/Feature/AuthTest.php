<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class AuthTest extends TestCase
{
    // ── Register (happy path) ─────────────────────────────────────────────────

    public function test_register_creates_user_and_returns_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Alice',
            'email'                 => 'alice-' . uniqid() . '@example.com',
            'password'              => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);
    }

    // ── Register (validation) ─────────────────────────────────────────────────

    public function test_register_returns_422_when_name_is_missing(): void
    {
        $this->postJson('/api/auth/register', [
            'email'                 => 'alice-' . uniqid() . '@example.com',
            'password'              => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertUnprocessable()->assertJsonValidationErrors(['name']);
    }

    public function test_register_returns_422_when_email_is_missing(): void
    {
        $this->postJson('/api/auth/register', [
            'name'                  => 'Alice',
            'password'              => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertUnprocessable()->assertJsonValidationErrors(['email']);
    }

    public function test_register_returns_422_when_email_is_invalid(): void
    {
        $this->postJson('/api/auth/register', [
            'name'                  => 'Alice',
            'email'                 => 'not-an-email',
            'password'              => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertUnprocessable()->assertJsonValidationErrors(['email']);
    }

    public function test_register_returns_422_when_email_is_already_taken(): void
    {
        $existing = User::factory()->create();

        $this->postJson('/api/auth/register', [
            'name'                  => 'Alice',
            'email'                 => $existing->email,
            'password'              => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertUnprocessable()->assertJsonValidationErrors(['email']);
    }

    public function test_register_returns_422_when_password_is_missing(): void
    {
        $this->postJson('/api/auth/register', [
            'name'  => 'Alice',
            'email' => 'alice-' . uniqid() . '@example.com',
        ])->assertUnprocessable()->assertJsonValidationErrors(['password']);
    }

    public function test_register_returns_422_when_password_is_too_short(): void
    {
        $this->postJson('/api/auth/register', [
            'name'                  => 'Alice',
            'email'                 => 'alice-' . uniqid() . '@example.com',
            'password'              => 'short',
            'password_confirmation' => 'short',
        ])->assertUnprocessable()->assertJsonValidationErrors(['password']);
    }

    public function test_register_returns_422_when_passwords_do_not_match(): void
    {
        $this->postJson('/api/auth/register', [
            'name'                  => 'Alice',
            'email'                 => 'alice-' . uniqid() . '@example.com',
            'password'              => 'secret123',
            'password_confirmation' => 'different123',
        ])->assertUnprocessable()->assertJsonValidationErrors(['password']);
    }

    // ── Login (happy path) ────────────────────────────────────────────────────

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $user = User::factory()->create(['password' => bcrypt('secret123')]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'secret123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token'])
            ->assertJsonPath('user.email', $user->email);
    }

    // ── Login (sad path) ──────────────────────────────────────────────────────

    public function test_login_returns_422_for_wrong_password(): void
    {
        $user = User::factory()->create(['password' => bcrypt('secret123')]);

        $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable()->assertJsonValidationErrors(['email']);
    }

    public function test_login_returns_422_for_unknown_email(): void
    {
        $this->postJson('/api/auth/login', [
            'email'    => 'nobody-' . uniqid() . '@example.com',
            'password' => 'secret123',
        ])->assertUnprocessable()->assertJsonValidationErrors(['email']);
    }

    public function test_login_returns_422_when_email_is_missing(): void
    {
        $this->postJson('/api/auth/login', ['password' => 'secret123'])
            ->assertUnprocessable()->assertJsonValidationErrors(['email']);
    }

    public function test_login_returns_422_when_password_is_missing(): void
    {
        $this->postJson('/api/auth/login', ['email' => 'alice@example.com'])
            ->assertUnprocessable()->assertJsonValidationErrors(['password']);
    }

    // ── Logout ────────────────────────────────────────────────────────────────

    public function test_logout_deletes_current_token(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logged out successfully');
    }

    public function test_logout_requires_authentication(): void
    {
        $this->postJson('/api/auth/logout')->assertUnauthorized();
    }

    // ── Me ────────────────────────────────────────────────────────────────────

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('email', $user->email);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }
}
