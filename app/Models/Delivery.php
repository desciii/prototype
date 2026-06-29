<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = [
    'purchase_order_id', 'invoice_number',
    'invoice_date', 'dr_number', 'dr_date',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function iar()
    {
        return $this->hasOne(Iar::class);
    }
}
