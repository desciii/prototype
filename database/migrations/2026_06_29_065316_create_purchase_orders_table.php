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
    Schema::create('purchase_orders', function (Blueprint $table) {
        $table->id();
        $table->string('po_number')->unique();
        $table->date('po_date');
        $table->decimal('po_amount', 12, 2);
        $table->string('unit_office');
        $table->foreignId('supplier_id')->constrained('suppliers')->cascadeOnDelete();
        $table->string('delivery_term')->nullable();
        $table->string('fund_cluster')->nullable();
        $table->string('pr_number')->nullable();
        $table->date('pr_date')->nullable();
        $table->string('ors_bur_number')->nullable();
        $table->date('ors_bur_date')->nullable();
        $table->enum('status', ['pending', 'partial', 'completed', 'cancelled'])->default('pending');
        $table->text('remarks')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
