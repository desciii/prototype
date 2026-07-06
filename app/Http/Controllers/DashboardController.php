<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Delivery;
use App\Models\Iar;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalPos' => PurchaseOrder::count(),
            'totalSuppliers' => Supplier::where('status', 'active')->count(),
            'pendingIars' => Iar::where('status', 'pending')->count(),
            'totalDeliveries' => Delivery::count(),
        ];

        $poStatusBreakdown = PurchaseOrder::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $recentPurchaseOrders = PurchaseOrder::with('supplier')
            ->latest('po_date')
            ->take(5)
            ->get()
            ->map(fn ($po) => [
                'id' => $po->id,
                'poNumber' => $po->po_number,
                'supplier' => $po->supplier->company_name,
                'amount' => (float) $po->po_amount,
                'status' => $po->status,
                'date' => \Carbon\Carbon::parse($po->po_date)->format('M d, Y'),
            ]);

        $recentActivity = AuditLog::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($log) => [
                'description' => ($log->user->name ?? 'System') . ' ' . $log->action . ' ' . $log->model . ($log->model_id ? " #{$log->model_id}" : ''),
                'timestamp' => $log->created_at->diffForHumans(),
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'poStatusBreakdown' => $poStatusBreakdown,
            'recentPurchaseOrders' => $recentPurchaseOrders,
            'recentActivity' => $recentActivity,
        ]);
    }
}