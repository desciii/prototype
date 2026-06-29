<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Iar;
use App\Models\Delivery;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class IarController extends Controller
{
    public function index()
    {
        return Inertia::render('iar/index', [
            'iars' => Iar::with([
                            'purchaseOrder:id,po_number',
                            'delivery:id,invoice_number',
                        ])
                        ->latest()
                        ->get(),
            'purchaseOrders' => PurchaseOrder::select('id', 'po_number')->get(),
            'deliveries'     => Delivery::select('id', 'invoice_number', 'purchase_order_id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'iar_number'        => 'required|string|unique:iars,iar_number',
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'delivery_id'       => 'nullable|exists:deliveries,id',
            'iar_date'          => 'required|date',
            'inspected_by'      => 'required|string',
            'inspection_date'   => 'required|date',
            'status'            => 'required|in:pending,passed,failed',
            'remarks'           => 'nullable|string',
        ]);

        Iar::create($validated);

        return redirect()->route('iar.index')->with('success', 'IAR recorded.');
    }
}