<?php

namespace Database\Factories;

use App\Models\Engraving;
use App\Models\Image;
use App\Models\User;
use App\Models\Watermark;
use Illuminate\Database\Eloquent\Factories\Factory;
use Ramsey\Uuid\Uuid;

class EngravingFactory extends Factory
{
    protected $model = Engraving::class;

    public function definition(): array
    {
        $id = Uuid::uuid4()->toString();

        return [
            'id'            => $id,
            'user_id'       => User::factory(),
            'image_id'      => Image::factory(),
            'watermark_id'  => Watermark::factory(),
            'engraved_path' => "engravings/1/{$id}.jpg",
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(function () use ($user) {
            $id = Uuid::uuid4()->toString();

            return [
                'id'            => $id,
                'user_id'       => $user->id,
                'image_id'      => Image::factory()->forUser($user),
                'watermark_id'  => Watermark::factory()->forUser($user),
                'engraved_path' => "engravings/{$user->id}/{$id}.jpg",
            ];
        });
    }
}
