<?php

namespace App\Services;

use GuzzleHttp\Client;

class MarkingModuleService implements WatermarkingServiceInterface
{
    private Client $http;

    public function __construct(private readonly string $baseUrl)
    {
        $this->http = new Client(['timeout' => 60]);
    }

    public function engrave(string $imageContents, string $watermarkContents, float $alpha = 0.00005): string
    {
        $response = $this->http->post("{$this->baseUrl}/engrave", [
            'multipart' => [
                [
                    'name'     => 'image',
                    'contents' => $imageContents,
                    'filename' => 'image.jpg',
                ],
                [
                    'name'     => 'watermark',
                    'contents' => $watermarkContents,
                    'filename' => 'watermark.jpg',
                ],
                [
                    'name'     => 'alpha',
                    'contents' => (string) $alpha,
                ],
            ],
        ]);

        return $response->getBody()->getContents();
    }

    public function extract(string $markedImageContents, string $originalImageContents, string $watermarkContents, float $alpha = 0.00005): ExtractionResult
    {
        $response = $this->http->post("{$this->baseUrl}/extract", [
            'multipart' => [
                [
                    'name'     => 'marked_image',
                    'contents' => $markedImageContents,
                    'filename' => 'marked.jpg',
                ],
                [
                    'name'     => 'original_image',
                    'contents' => $originalImageContents,
                    'filename' => 'original.jpg',
                ],
                [
                    'name'     => 'watermark',
                    'contents' => $watermarkContents,
                    'filename' => 'watermark.jpg',
                ],
                [
                    'name'     => 'alpha',
                    'contents' => (string) $alpha,
                ],
            ],
        ]);

        $similarity = (float) ($response->getHeaderLine('X-Similarity-Score') ?: '0');
        $similarity = max(0.0, min(1.0, $similarity));

        return new ExtractionResult(
            bytes:      $response->getBody()->getContents(),
            similarity: $similarity,
        );
    }

    public function applyAttack(string $imageContents, string $attackType, array $params = []): string
    {
        $response = $this->http->post("{$this->baseUrl}/apply-attack", [
            'multipart' => [
                [
                    'name'     => 'image',
                    'contents' => $imageContents,
                    'filename' => 'image.jpg',
                ],
                [
                    'name'     => 'attack',
                    'contents' => $attackType,
                ],
                [
                    'name'     => 'params',
                    'contents' => json_encode((object) $params),
                ],
            ],
        ]);

        return $response->getBody()->getContents();
    }
}
