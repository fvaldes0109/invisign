<?php

namespace App\Http\UseCase;

use App\Http\Entity\Image;
use App\Http\Repository\ImageRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;

class CreateImage
{
    public function __construct(
        private readonly ImageRepository $imageRepository,
    ) {
    }

    public function execute(int $userId, UploadedFile $file, string $name): Image
    {
        $id  = Uuid::uuid4()->toString();
        $ext = strtolower($file->getClientOriginalExtension());

        $imagePath     = "images/{$userId}/{$id}.{$ext}";
        $thumbnailPath = "images/{$userId}/thumbnails/{$id}_thumb.{$ext}";

        Storage::disk('public')->put($imagePath, file_get_contents($file->getRealPath()));
        Storage::disk('public')->put($thumbnailPath, $this->makeThumbnail($file->getRealPath(), $ext));

        $image = Image::create(
            id:            $id,
            userId:        $userId,
            name:          $name,
            imagePath:     $imagePath,
            thumbnailPath: $thumbnailPath,
        );

        $this->imageRepository->save($image);

        return $image;
    }

    private function makeThumbnail(string $sourcePath, string $ext): string
    {
        $source = match ($ext) {
            'png'  => imagecreatefrompng($sourcePath),
            'webp' => imagecreatefromwebp($sourcePath),
            default => imagecreatefromjpeg($sourcePath),
        };

        $origW = imagesx($source);
        $origH = imagesy($source);

        $max = 300;
        if ($origW >= $origH) {
            $newW = $max;
            $newH = (int) round($origH * $max / $origW);
        } else {
            $newH = $max;
            $newW = (int) round($origW * $max / $origH);
        }

        $thumb = imagecreatetruecolor($newW, $newH);

        if ($ext === 'png') {
            imagealphablending($thumb, false);
            imagesavealpha($thumb, true);
        }

        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

        ob_start();
        match ($ext) {
            'png'  => imagepng($thumb),
            'webp' => imagewebp($thumb, null, 85),
            default => imagejpeg($thumb, null, 85),
        };
        $data = ob_get_clean();

        imagedestroy($source);
        imagedestroy($thumb);

        return $data;
    }
}
