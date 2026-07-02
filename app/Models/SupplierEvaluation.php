<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;

class SupplierEvaluation extends Model
{
    use Auditable;

    protected $fillable = [
        'evaluation_date',
        'purchase_order_id',
        'supplier_id',
        'requesting_office',
        'total_amount',
        'quality_of_goods',
        'timeliness',
        'compliance',
        'document_path',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    // Average rating across the 3 criteria
    public function getAverageRatingAttribute()
    {
        return round(($this->quality_of_goods + $this->timeliness + $this->compliance) / 3, 1);
    }
}