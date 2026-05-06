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
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();

            $table->date('date');
            $table->text('desc')->nullable();
            $table->enum('status', ['pending', 'sakit', 'izin', 'hadir', 'telat', 'alpa'])->default('pending');
            $table->timestamp('check_in_time')->nullable();
            $table->timestamp('clock_out_time')->nullable();

            $table->double('clock_in_latitude')->nullable();
            $table->double('clock_in_longitude')->nullable();

            $table->double('clock_out_latitude')->nullable();
            $table->double('clock_out_longitude')->nullable();


            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
