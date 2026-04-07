<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EngravingController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\WatermarkController;
use Illuminate\Support\Facades\Route;

Route::get('health', function () {
    return response()->json(['message' => 'OK']);
});

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('watermarks',          [WatermarkController::class, 'index'])  ->name('watermarks.index');
    Route::get('watermarks/count',    [WatermarkController::class, 'count'])  ->name('watermarks.count');
    Route::get('watermarks/{id}',     [WatermarkController::class, 'show'])   ->name('watermarks.show');

    Route::post('watermarks',         [WatermarkController::class, 'store'])  ->name('watermarks.store');
    Route::delete('watermarks/{id}',  [WatermarkController::class, 'destroy'])->name('watermarks.destroy');

    Route::get('images',              [ImageController::class, 'index'])  ->name('images.index');
    Route::get('images/count',        [ImageController::class, 'count'])  ->name('images.count');
    Route::get('images/{id}',         [ImageController::class, 'show'])   ->name('images.show');

    Route::post('images',             [ImageController::class, 'store'])  ->name('images.store');
    Route::delete('images/{id}',      [ImageController::class, 'destroy'])->name('images.destroy');

    Route::get('engravings',           [EngravingController::class, 'index'])  ->name('engravings.index');
    Route::post('engravings',          [EngravingController::class, 'store'])  ->name('engravings.store');
    Route::delete('engravings/{id}',   [EngravingController::class, 'destroy'])->name('engravings.destroy');
});
