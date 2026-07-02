<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $action = $request->input('action');

        $logs = AuditLog::with('user:id,name')
            ->when($search, function ($q, $search) {
                $q->where('model', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($action, fn($q, $action) => $q->where('action', $action))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('auditlogs/index', [
            'logs'    => $logs,
            'filters' => ['search' => $search, 'action' => $action],
        ]);
    }
}