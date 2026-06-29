<?php

namespace App\Http\Controllers;

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
            'totalPoAmount' => PurchaseOrder::sum('po_amount'),
            'activeSuppliers' => Supplier::where('status', 'active')->count(),
            'pendingIars' => Iar::where('status', 'pending')->count(),
            'completedPos' => PurchaseOrder::where('status', 'completed')->count(),
        ];

        $poStatusBreakdown = PurchaseOrder::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $monthlyPoAmount = PurchaseOrder::selectRaw("strftime('%m', po_date) as month, SUM(po_amount) as total")
            ->whereRaw("strftime('%Y', po_date) = ?", [now()->year])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => date('M', mktime(0, 0, 0, (int) $row->month, 1)),
                'amount' => (float) $row->total,
            ]);

        $recentPurchaseOrders = PurchaseOrder::with('supplier')
            ->latest('po_date')
            ->take(8)
            ->get()
            ->map(fn ($po) => [
                'id' => $po->id,
                'poNumber' => $po->po_number,
                'supplier' => $po->supplier->company_name,
                'amount' => (float) $po->po_amount,
                'status' => $po->status,
                'date' => \Carbon\Carbon::parse($po->po_date)->format('M d, Y'),
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'poStatusBreakdown' => $poStatusBreakdown,
            'chartData' => $monthlyPoAmount,
            'recentPurchaseOrders' => $recentPurchaseOrders,
        ]);
    }
}