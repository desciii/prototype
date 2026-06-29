<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class POController extends Controller
{
    public function index()
    {
        return Inertia::render('po/index');
    }

    public function create()
    {
        return Inertia::render('po/poforms', [
            'suppliers' => Supplier::select('id', 'company_name')
                                    ->where('status', 'active')
                                    ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'po_number'      => 'required|string|unique:purchase_orders,po_number',
            'po_date'        => 'required|date',
            'po_amount'      => 'required|numeric',
            'unit_office'    => 'required|string',
            'supplier_id'    => 'required|exists:suppliers,id',
            'delivery_term'  => 'nullable|string',
            'fund_cluster'   => 'nullable|string',
            'pr_number'      => 'nullable|string',
            'pr_date'        => 'nullable|date',
            'ors_bur_number' => 'nullable|string',
            'ors_bur_date'   => 'nullable|date',
            'status'         => 'required|in:pending,partial,completed,cancelled',
            'remarks'        => 'nullable|string',
        ]);

        PurchaseOrder::create($validated);

        return redirect()->route('po.index')->with('success', 'Purchase Order created.');
    }
}