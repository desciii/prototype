<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class Iar extends Model
{
    use Auditable;

    protected $fillable = [
        'iar_number', 'purchase_order_id', 'delivery_id',
        'iar_date', 'inspected_by', 'inspection_date',
        'status', 'remarks', 'document_path',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }
}
