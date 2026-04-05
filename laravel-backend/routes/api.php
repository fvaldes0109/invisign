<?php

use App\Http\Controllers\AuthController;
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
});
