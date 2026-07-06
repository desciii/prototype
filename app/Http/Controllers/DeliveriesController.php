<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Delivery;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Models\DeliveryImage;

class DeliveriesController extends Controller
{

   public function index(Request $request)
    {
        $search = $request->input('search');
        $supplierId = $request->input('supplier_id');

            $deliveries = Delivery::with([
                'purchaseOrder:id,po_number',
                'supplier:id,company_name',
                'images',
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

                'purchaseOrders' => PurchaseOrder::select('id', 'po_number', 'po_amount')->get(),

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
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'invoice_number'    => 'nullable|string',
            'invoice_date'      => 'nullable|date',
            'dr_number'         => 'nullable|string',
            'dr_date'           => 'nullable|date',
            'received_by_1'     => 'nullable|string',
            'received_by_2'     => 'nullable|string',
            'place_of_delivery' => 'nullable|string',
            'remarks'           => 'nullable|string',
            'total_amount'      => 'nullable|numeric',
            'document'          => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'images'            => 'nullable|array',
            'images.*'          => 'file|mimes:jpg,jpeg,png|max:10240',
        ]);

        if (empty($validated['total_amount'])) {
            $po = PurchaseOrder::find($validated['purchase_order_id']);
            $validated['total_amount'] = $po?->po_amount;
        }

        if ($request->hasFile('document')) {
            $validated['document_path'] = $request->file('document')->store('deliveries', 'public');
        }

        unset($validated['document'], $validated['images']);

        $delivery = Delivery::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                DeliveryImage::create([
                    'delivery_id' => $delivery->id,
                    'image_path'  => $image->store('deliveries/images', 'public'),
                ]);
            }
        }

        return redirect()->route('deliveries.index')->with('success', 'Delivery recorded.');
    }
}