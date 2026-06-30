<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Iar;
use App\Models\Delivery;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class IarController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $iars = Iar::with([
                'purchaseOrder:id,po_number',
                'delivery:id,invoice_number',
            ])
            ->when($search, function ($query, $search) {
                $query->where('iar_number', 'like', "%{$search}%")
                    ->orWhere('inspected_by', 'like', "%{$search}%")
                    ->orWhereHas('purchaseOrder', function ($q) use ($search) {
                        $q->where('po_number', 'like', "%{$search}%");
                    });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('iar/index', [
            'iars' => $iars,
            'purchaseOrders' => PurchaseOrder::select('id', 'po_number')->get(),
            'deliveries'     => Delivery::select('id', 'invoice_number', 'purchase_order_id')->get(),
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'iar_number'        => 'required|string|unique:iars,iar_number',
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'delivery_id'       => 'required|exists:deliveries,id',
            'iar_date'          => 'required|date',
            'inspected_by'      => 'required|string',
            'inspection_date'   => 'required|date',
            'status'            => 'required|in:pending,passed,failed',
            'remarks'           => 'nullable|string',
            'document'          => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        if ($request->hasFile('document')) {
            $validated['document_path'] = $request->file('document')->store('iars', 'public');
        }

        unset($validated['document']);

        Iar::create($validated);

        return redirect()->route('iar.index')->with('success', 'IAR recorded.');
    }
}