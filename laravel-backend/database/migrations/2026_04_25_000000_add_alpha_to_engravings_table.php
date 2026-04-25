<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('engravings', function (Blueprint $table) {
            $table->decimal('alpha', 10, 6)->default(0.000050)->after('engraved_path');
        });
    }

    public function down(): void
    {
        Schema::table('engravings', function (Blueprint $table) {
            $table->dropColumn('alpha');
        });
    }
};
