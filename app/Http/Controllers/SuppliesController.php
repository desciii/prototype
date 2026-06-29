<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SuppliesController extends Controller
{
    public function index()
    {
        return Inertia::render('supplies/index');
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