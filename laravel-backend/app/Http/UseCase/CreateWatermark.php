<?php

namespace App\Http\UseCase;

use App\Http\Entity\Watermark;
use App\Http\Repository\WatermarkRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

class CreateWatermark
{
    public function __construct(
        private readonly WatermarkRepository $watermarkRepository,
    ) {
    }

    public function execute(int $userId, UploadedFile $file, string $name): Watermark
    {
        $id  = Uuid::uuid4()->toString();
        $ext = strtolower($file->getClientOriginalExtension());

        $imagePath     = "watermarks/{$userId}/{$id}.{$ext}";
        $thumbnailPath = "watermarks/{$userId}/thumbnails/{$id}_thumb.{$ext}";

        Storage::disk('public')->put($imagePath, file_get_contents($file->getRealPath()));
        Storage::disk('public')->put($thumbnailPath, $this->makeThumbnail($file->getRealPath(), $ext));

        $watermark = Watermark::create(
            id:            $id,
            userId:        $userId,
            name:          $name,
            imagePath:     $imagePath,
            thumbnailPath: $thumbnailPath,
        );

        $this->watermarkRepository->save($watermark);

        return $watermark;
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

        $max  = 300;
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
