<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Delivery;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class DeliveriesController extends Controller
{
    public function index()
    {
        return Inertia::render('deliveries/index', [
            'deliveries' => Delivery::with('purchaseOrder:id,po_number,supplier_id')
                                     ->latest()
                                     ->get(),
            'purchaseOrders' => PurchaseOrder::select('id', 'po_number')
                                              ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'invoice_number'    => 'nullable|string',
            'invoice_date'      => 'nullable|date',
            'dr_number'         => 'nullable|string',
            'dr_date'           => 'nullable|date',
        ]);

        Delivery::create($validated);

        return redirect()->route('deliveries.index')->with('success', 'Delivery recorded.');
    }
}