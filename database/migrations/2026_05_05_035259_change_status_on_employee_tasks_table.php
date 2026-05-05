<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('employee_tasks')->where('status', 'pending')->update(['status' => 'ongoing']);

        // 2. Baru modify enum-nya
        Schema::table('employee_tasks', function (Blueprint $table) {
            $table->enum('status', ['ongoing', 'finished', 'canceled'])
                ->default('ongoing')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
