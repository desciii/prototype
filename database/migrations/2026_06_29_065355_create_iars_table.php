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
    Schema::create('iars', function (Blueprint $table) {
        $table->id();
        $table->string('iar_number')->unique();
        $table->foreignId('purchase_order_id')->constrained('purchase_orders')->cascadeOnDelete();
        $table->foreignId('delivery_id')->nullable()->constrained('deliveries')->nullOnDelete();
        $table->date('iar_date');
        $table->string('inspected_by');
        $table->date('inspection_date');
        $table->enum('status', ['pending', 'passed', 'failed'])->default('pending');
        $table->text('remarks')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iars');
    }
};
