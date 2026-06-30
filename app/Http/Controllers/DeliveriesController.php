<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Delivery;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class DeliveriesController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search');
        $poId = $request->input('po_id');

        $deliveries = Delivery::with([
                'purchaseOrder:id,po_number',
                'supplier:id,company_name',
            ])
            ->when($search, function ($query, $search) {
                $query->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('dr_number', 'like', "%{$search}%")
                    ->orWhereHas('purchaseOrder', function ($q) use ($search) {
                        $q->where('po_number', 'like', "%{$search}%");
                    });
            })
            ->when($poId, function ($query, $poId) {
                $query->where('purchase_order_id', $poId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('deliveries/index', [
            'deliveries' => $deliveries,
            'purchaseOrders' => PurchaseOrder::select('id', 'po_number')->get(),
            'filters' => [
                'search' => $search,
                'po_id'  => $poId,
            ],
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
            'document'          => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        if ($request->hasFile('document')) {
            $validated['document_path'] = $request->file('document')->store('deliveries', 'public');
        }

        unset($validated['document']);

        Delivery::create($validated);

        return redirect()->route('deliveries.index')->with('success', 'Delivery recorded.');
    }
}