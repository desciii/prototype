<?php

namespace App\Models;   

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use Auditable;

    protected $fillable = [
        'company_name', 'office_address', 'tin',
        'email', 'contact_number', 'status', 'internal_remarks',
    ];

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}