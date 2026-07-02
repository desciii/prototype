<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function ($model) {
            AuditLog::create([
                'user_id'    => Auth::id(),
                'action'     => 'created',
                'model'      => get_class($model),
                'model_id'   => $model->id,
                'old_values' => null,
                'new_values' => $model->getAttributes(),
                'ip_address' => Request::ip(),
            ]);
        });

        static::updated(function ($model) {
            $ignored = ['updated_at', 'created_at'];
            $changes = array_diff_key($model->getChanges(), array_flip($ignored));

            if (empty($changes)) return;

            AuditLog::create([
                'user_id'    => Auth::id(),
                'action'     => 'updated',
                'model'      => get_class($model),
                'model_id'   => $model->id,
                'old_values' => array_intersect_key($model->getOriginal(), $changes),
                'new_values' => $changes,
                'ip_address' => Request::ip(),
            ]);
        });

        static::deleted(function ($model) {
            AuditLog::create([
                'user_id'    => Auth::id(),
                'action'     => 'deleted',
                'model'      => get_class($model),
                'model_id'   => $model->id,
                'old_values' => $model->getAttributes(),
                'new_values' => null,
                'ip_address' => Request::ip(),
            ]);
        });
    }
}