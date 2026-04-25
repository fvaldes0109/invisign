<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attack_tests', function (Blueprint $table) {
            $table->decimal('similarity_score', 7, 6)->nullable()->after('result_path');
        });
    }

    public function down(): void
    {
        Schema::table('attack_tests', function (Blueprint $table) {
            $table->dropColumn('similarity_score');
        });
    }
};
