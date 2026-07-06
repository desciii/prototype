<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('deliveries', function (Blueprint $table) {
            $table->string('received_by_1')->nullable();
            $table->string('received_by_2')->nullable();
            $table->string('place_of_delivery')->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('total_amount', 14, 2)->nullable();
        });

        Schema::create('delivery_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->constrained('deliveries')->cascadeOnDelete();
            $table->string('image_path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_images');
        Schema::table('deliveries', function (Blueprint $table) {
            $table->dropColumn(['received_by_1', 'received_by_2', 'place_of_delivery', 'remarks', 'total_amount']);
        });
    }
};