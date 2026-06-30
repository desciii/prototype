<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Delivery;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use App\Models\Supplier;

class DeliveriesController extends Controller
{

   public function index(Request $request)
    {
        $search = $request->input('search');
        $supplierId = $request->input('supplier_id');

        $deliveries = Delivery::with([
                'purchaseOrder:id,po_number',
                'supplier:id,company_name',
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('dr_number', 'like', "%{$search}%")
                    ->orWhereHas('purchaseOrder', function ($po) use ($search) {
                        $po->where('po_number', 'like', "%{$search}%");
                    });
                });
            })
            ->when($supplierId, function ($query, $supplierId) {
                $query->where('supplier_id', $supplierId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

            return Inertia::render('deliveries/index', [
                'deliveries' => $deliveries,

                'purchaseOrders' => PurchaseOrder::select(
                    'id',
                    'po_number'
                )->orderBy('po_number')->get(),

                'suppliers' => Supplier::select(
                    'id',
                    'company_name'
                )->orderBy('company_name')->get(),

                'filters' => [
                    'search' => $search,
                    'supplier_id' => $supplierId,
                ],
            ]);
    }

    public function store(Request $request)
    {
    $validated = $request->validate(
        [
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'invoice_number'    => 'nullable|string|unique:deliveries,invoice_number',
            'invoice_date'      => 'nullable|date',
            'dr_number'         => 'nullable|string|unique:deliveries,dr_number',
            'dr_date'           => 'nullable|date',
            'document'          => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ],
        [
            'invoice_number.unique' => 'This Invoice Number is already registered.',
            'dr_number.unique'      => 'This Delivery Receipt Number is already registered.',
        ]
    );

    $purchaseOrder = PurchaseOrder::findOrFail($validated['purchase_order_id']);

    $validated['supplier_id'] = $purchaseOrder->supplier_id;

    if ($request->hasFile('document')) {
        $validated['document_path'] = $request->file('document')->store('deliveries', 'public');
    }

    unset($validated['document']);

    Delivery::create($validated);

        return redirect()->route('deliveries.index')->with('success', 'Delivery recorded.');
    }
}