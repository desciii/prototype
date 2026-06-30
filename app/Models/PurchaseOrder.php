<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'po_number', 'po_date', 'po_amount', 'unit_office',
        'supplier_id', 'delivery_term', 'fund_cluster',
        'pr_number', 'pr_date', 'ors_bur_number', 'ors_bur_date',
        'status', 'remarks', 'document_path',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function deliveries()
    {
        return $this->hasMany(Delivery::class);
    }

    public function iar()
    {
        return $this->hasOne(Iar::class);
    }
}
