<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class SuppliesController extends Controller
{
    
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $suppliers = Supplier::when($search, function ($query, $search) {
                $query->where('company_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('tin', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%");
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('supplies/index', [
            'suppliers' => $suppliers,
            'purchaseOrders' => PurchaseOrder::select('id', 'po_number', 'supplier_id', 'po_amount')->get(),
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name'    => 'required|string',
            'office_address'  => 'nullable|string',
            'tin'             => 'nullable|string',
            'email'           => 'nullable|email',
            'contact_number'  => 'nullable|string',
            'status'          => 'required|in:active,inactive',
            'internal_remarks'=> 'nullable|string',
        ]);

        Supplier::create($validated);

        return redirect()->route('supplies.index')->with('success', 'Supplier added.');
    }
}