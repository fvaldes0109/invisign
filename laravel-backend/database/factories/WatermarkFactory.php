<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Watermark;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

class WatermarkFactory extends Factory
{
    protected $model = Watermark::class;

    public function definition(): array
    {
        $userId = User::factory();
        $id     = Uuid::uuid4()->toString();

        return [
            'id'             => $id,
            'user_id'        => $userId,
            'name'           => $this->faker->word() . '.jpg',
            'image_path'     => "watermarks/1/{$id}.jpg",
            'thumbnail_path' => "watermarks/1/thumbnails/{$id}_thumb.jpg",
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(function () use ($user) {
            $id = Uuid::uuid4()->toString();

            return [
                'id'             => $id,
                'user_id'        => $user->id,
                'image_path'     => "watermarks/{$user->id}/{$id}.jpg",
                'thumbnail_path' => "watermarks/{$user->id}/thumbnails/{$id}_thumb.jpg",
            ];
        });
    }
}
