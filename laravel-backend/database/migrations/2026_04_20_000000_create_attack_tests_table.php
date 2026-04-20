<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attack_tests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('engraving_id')->constrained('engravings')->cascadeOnDelete();
            $table->string('attack_type');
            $table->string('attacked_image_path');
            $table->string('result_path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attack_tests');
    }
};
