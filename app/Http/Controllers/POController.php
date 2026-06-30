<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class POController extends Controller
{
    
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $purchaseOrders = PurchaseOrder::with('supplier:id,company_name')
            ->when($search, function ($query, $search) {
                $query->where('po_number', 'like', "%{$search}%")
                    ->orWhere('unit_office', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function ($q) use ($search) {
                        $q->where('company_name', 'like', "%{$search}%");
                    });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('po/index', [
            'suppliers' => Supplier::select('id', 'company_name')
                                    ->where('status', 'active')
                                    ->get(),
            'purchaseOrders' => $purchaseOrders,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
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
            'po_number'      => 'required|string|max:255|unique:purchase_orders,po_number',
            'po_date'        => 'required|date',
            'po_amount'      => 'required|numeric',
            'unit_office'    => 'required|string|max:255',
            'supplier_id'    => 'required|exists:suppliers,id',
            'delivery_term'  => 'nullable|string|max:255',
            'fund_cluster'   => 'nullable|string|max:255',
            'pr_number'      => 'nullable|string|max:255|unique:purchase_orders,pr_number',
            'pr_date'        => 'nullable|date',
            'ors_bur_number' => 'nullable|string|max:255|unique:purchase_orders,ors_bur_number',
            'ors_bur_date'   => 'nullable|date',
            'status'         => 'required|in:pending,partial,completed,cancelled',
            'remarks'        => 'nullable|string',
            'document'       => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        if ($request->hasFile('document')) {
            $validated['document_path'] = $request->file('document')
                ->store('purchase_orders', 'public');
        }

        unset($validated['document']);

        PurchaseOrder::create($validated);

        return redirect()->route('po.index')->with('success', 'Purchase Order created.');
    }
}