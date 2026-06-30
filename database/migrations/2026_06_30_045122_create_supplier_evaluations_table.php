<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_evaluations', function (Blueprint $table) {
            $table->id();
            $table->date('evaluation_date');
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->cascadeOnDelete();
            $table->foreignId('supplier_id')->constrained('suppliers')->cascadeOnDelete();
            $table->string('requesting_office');
            $table->decimal('total_amount', 12, 2);
            $table->unsignedTinyInteger('quality_of_goods'); // 1-5
            $table->unsignedTinyInteger('timeliness');       // 1-5
            $table->unsignedTinyInteger('compliance');       // 1-5
            $table->string('document_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_evaluations');
    }
};