<?php

namespace Database\Factories;

use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Ramsey\Uuid\Uuid;

class ImageFactory extends Factory
{
    protected $model = Image::class;

    public function definition(): array
    {
        $id = Uuid::uuid4()->toString();

        return [
            'id'             => $id,
            'user_id'        => User::factory(),
            'name'           => $this->faker->word() . '.jpg',
            'image_path'     => "images/1/{$id}.jpg",
            'thumbnail_path' => "images/1/thumbnails/{$id}_thumb.jpg",
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(function () use ($user) {
            $id = Uuid::uuid4()->toString();

            return [
                'id'             => $id,
                'user_id'        => $user->id,
                'image_path'     => "images/{$user->id}/{$id}.jpg",
                'thumbnail_path' => "images/{$user->id}/thumbnails/{$id}_thumb.jpg",
            ];
        });
    }
}
