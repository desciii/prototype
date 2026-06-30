<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\SupplierEvaluation;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierEvaluationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $evaluations = SupplierEvaluation::with([
                'purchaseOrder:id,po_number',
                'supplier:id,company_name',
            ])
            ->when($search, function ($query, $search) {
                $query->where('requesting_office', 'like', "%{$search}%")
                      ->orWhereHas('supplier', function ($q) use ($search) {
                          $q->where('company_name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('purchaseOrder', function ($q) use ($search) {
                          $q->where('po_number', 'like', "%{$search}%");
                      });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('supplies/evaluations', [
            'evaluations' => $evaluations,
            'purchaseOrders' => PurchaseOrder::select('id', 'po_number', 'supplier_id', 'po_amount')
            ->whereDoesntHave('evaluation')
            ->get(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'evaluation_date'    => 'required|date',
            'purchase_order_id'  => 'required|exists:purchase_orders,id|unique:supplier_evaluations,purchase_order_id',
            'requesting_office'  => 'required|string',
            'total_amount'       => 'required|numeric',
            'quality_of_goods'   => 'required|integer|min:1|max:5',
            'timeliness'         => 'required|integer|min:1|max:5',
            'compliance'         => 'required|integer|min:1|max:5',
            'document'           => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        $po = PurchaseOrder::findOrFail($validated['purchase_order_id']);
        $validated['supplier_id'] = $po->supplier_id;

        if ($request->hasFile('document')) {
            $validated['document_path'] = $request->file('document')->store('evaluations', 'public');
        }

        unset($validated['document']);

        SupplierEvaluation::create($validated);

        return redirect()->route('supplier-evaluations.index')->with('success', 'Evaluation recorded.');
    }
}