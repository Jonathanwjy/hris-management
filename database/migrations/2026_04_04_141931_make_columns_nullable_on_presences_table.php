<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('presences', function (Blueprint $table) {
            // Menambahkan ->nullable()->change() untuk mengubah kolom menjadi boleh kosong
            $table->timestamp('check_in_time')->nullable()->change();
            $table->timestamp('clock_out_time')->nullable()->change();

            $table->double('clock_in_latitude')->nullable()->change();
            $table->double('clock_in_longitude')->nullable()->change();

            $table->double('clock_out_latitude')->nullable()->change();
            $table->double('clock_out_longitude')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
