<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryImage extends Model
{
    protected $fillable = ['delivery_id', 'image_path'];

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }
}