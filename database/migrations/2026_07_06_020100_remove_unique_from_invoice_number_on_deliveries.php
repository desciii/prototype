<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('deliveries', function (Blueprint $table) {
            // Drop the global unique constraints
            $table->dropUnique(['invoice_number']);
            $table->dropUnique(['dr_number']);

            // Replace with composite unique per PO
            $table->unique(['purchase_order_id', 'invoice_number'], 'deliveries_po_invoice_unique');
            $table->unique(['purchase_order_id', 'dr_number'], 'deliveries_po_dr_unique');
        });
    }

    public function down(): void
    {
        Schema::table('deliveries', function (Blueprint $table) {
            $table->dropUnique('deliveries_po_invoice_unique');
            $table->dropUnique('deliveries_po_dr_unique');
            $table->unique('invoice_number');
            $table->unique('dr_number');
        });
    }
};