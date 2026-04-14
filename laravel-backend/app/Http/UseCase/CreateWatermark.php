<?php

namespace App\Http\UseCase;

use App\Http\Entity\Watermark;
use App\Http\Repository\WatermarkRepository;
use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

        // Load the uploaded image; resize to the nearest power-of-two square when
        // the side length is not already a power of two.
        $source = $this->loadGd($file->getRealPath(), $ext);
        $side   = imagesx($source); // width == height guaranteed by controller validation

        if (!$this->isPowerOfTwo($side)) {
            $target  = $this->nearestPowerOfTwo($side);
            $resized = $this->createCanvas($target, $ext);
            imagecopyresampled($resized, $source, 0, 0, 0, 0, $target, $target, $side, $side);
            imagedestroy($source);
            $source = $resized;
            $side   = $target;
        }

        Storage::disk('public')->put($imagePath,     $this->encode($source, $ext));
        Storage::disk('public')->put($thumbnailPath, $this->thumbnail($source, $side, $ext));
        imagedestroy($source);

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

    // ─── GD helpers ──────────────────────────────────────────────────────────

    private function loadGd(string $path, string $ext): GdImage
    {
        return match ($ext) {
            'png'  => imagecreatefrompng($path),
            'webp' => imagecreatefromwebp($path),
            default => imagecreatefromjpeg($path),
        };
    }

    private function createCanvas(int $size, string $ext): GdImage
    {
        $img = imagecreatetruecolor($size, $size);
        if ($ext === 'png') {
            imagealphablending($img, false);
            imagesavealpha($img, true);
        }
        return $img;
    }

    private function encode(GdImage $img, string $ext): string
    {
        ob_start();
        match ($ext) {
            'png'  => imagepng($img),
            'webp' => imagewebp($img, null, 85),
            default => imagejpeg($img, null, 85),
        };
        return ob_get_clean();
    }

    private function thumbnail(GdImage $source, int $side, string $ext): string
    {
        $size  = min($side, 300);
        $thumb = $this->createCanvas($size, $ext);
        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $size, $size, $side, $side);
        $data  = $this->encode($thumb, $ext);
        imagedestroy($thumb);
        return $data;
    }

    // ─── Power-of-two helpers ─────────────────────────────────────────────────

    private function isPowerOfTwo(int $n): bool
    {
        return $n > 0 && ($n & ($n - 1)) === 0;
    }

    private function nearestPowerOfTwo(int $n): int
    {
        $lower = (int) (2 ** (int) floor(log($n, 2)));
        $upper = $lower * 2;
        return ($n - $lower) <= ($upper - $n) ? $lower : $upper;
    }
}
