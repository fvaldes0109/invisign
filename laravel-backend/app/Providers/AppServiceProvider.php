<?php

namespace App\Providers;

use App\Services\MarkingModuleService;
use App\Services\WatermarkingServiceInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(WatermarkingServiceInterface::class, function () {
            return new MarkingModuleService(config('services.watermarking.url'));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
