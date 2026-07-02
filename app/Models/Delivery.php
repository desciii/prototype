<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;

class Delivery extends Model
{
    use Auditable;

    protected $fillable = [
        'purchase_order_id',
        'supplier_id',
        'invoice_number',
        'invoice_date',
        'dr_number',
        'dr_date',
        'document_path',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function iar()
    {
        return $this->hasOne(Iar::class);
    }
}
