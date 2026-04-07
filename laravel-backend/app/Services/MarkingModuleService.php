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

    public function engrave(string $imageContents, string $watermarkContents): string
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
            ],
        ]);

        return $response->getBody()->getContents();
    }
}
