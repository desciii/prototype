<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\Delivery;
use App\Models\Iar;
use League\Csv\Reader;
use League\Csv\Writer;

class ImportExportController extends Controller
{
    public function index()
    {
        return Inertia::render('importexport/index');
    }

    public function import(Request $request)
    {
        $request->validate([
            'module' => 'required|in:suppliers,purchase_orders,deliveries,iars',
            'file'   => 'required|file|mimes:csv,txt',
        ]);

        $csv = Reader::createFromPath($request->file('file')->getPathname());
        $csv->setHeaderOffset(0);
        $records = $csv->getRecords();

        foreach ($records as $record) {
            match ($request->module) {
                'suppliers'       => Supplier::create($record),
                'purchase_orders' => PurchaseOrder::create($record),
                'deliveries'      => Delivery::create($record),
                'iars'            => Iar::create($record),
            };
        }

        return back()->with('success', 'Import successful.');
    }

    public function export(Request $request)
    {
        $request->validate([
            'module' => 'required|in:suppliers,purchase_orders,deliveries,iars',
        ]);

        $data = match ($request->module) {
            'suppliers'       => Supplier::all()->toArray(),
            'purchase_orders' => PurchaseOrder::all()->toArray(),
            'deliveries'      => Delivery::all()->toArray(),
            'iars'            => Iar::all()->toArray(),
        };

        if (empty($data)) {
            return back()->withErrors(['module' => 'No data found for this module.']);
        }

        $filename = $request->module . '_' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, array_keys($data[0]));

            // Data rows
            foreach ($data as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}