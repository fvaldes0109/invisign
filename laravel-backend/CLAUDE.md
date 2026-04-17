# laravel-backend

Laravel 10, PHP 8.1, Sanctum token auth.

## Architecture

Strict layered: **Entity → Repository → UseCase → Controller**

- **Entity** (`app/Http/Entity/`) — Immutable POPOs created via static `create()`/`fromEloquent()`. Never use Eloquent models outside repositories.
- **Repository** (`app/Http/Repository/`) — Only place that touches Eloquent models. Bridges DB ↔ Entity.
- **UseCase** (`app/Http/UseCase/`) — One class per action; contains all business logic.
- **Controller** (`app/Http/Controllers/`) — Validates input, calls a UseCase, wraps result in a Resource. No logic here.
- **Resource** (`app/Http/Resource/`) — Transforms Entities (not Models) into JSON responses.

## Database conventions

- UUID primary keys on all domain tables (`$keyType = 'string'`, `$incrementing = false`).
- Use `foreignUuid()` for UUID FK columns; `foreignId()` for integer `user_id`.
- Storage: `public` disk, organized as `{resource}/{userId}/{id}.{ext}`.

## Watermarks

- Must be **square** (validated in controller; returns 422 if not).
- **Auto-resized** to the nearest power-of-2 side length in `CreateWatermark`.

## Testing rules

- **NEVER use `RefreshDatabase`** — it drops and recreates tables on the live MySQL DB.
- Tests use SQLite `:memory:` (configured in `phpunit.xml`), which is always fresh per run.
- Use `Storage::fake('public')` for file operations.
- Authenticate with `$this->actingAs($user, 'sanctum')`.
- For engrave/extract tests, swap `WatermarkingServiceInterface` with `FakeWatermarkingService` in `setUp()`.

```bash
php artisan test
php artisan test --filter=WatermarkTest
```

## External service

`WatermarkingServiceInterface` is bound to `MarkingModuleService` (Guzzle HTTP to the marking module). Override with `FakeWatermarkingService` in tests.
