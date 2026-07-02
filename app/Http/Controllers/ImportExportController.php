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
use App\Models\SupplierEvaluation;

class ImportExportController extends Controller
{
    public function index()
    {
        return Inertia::render('importexport/index');
    }

    public function import(Request $request)
    {
        $request->validate([
            'module' => 'required|in:suppliers,purchase_orders,deliveries,iars,supplier_evaluations',
            'file'   => 'required|file|mimes:csv,txt',
        ]);

        $csv = Reader::createFromPath($request->file('file')->getPathname());
        $csv->setHeaderOffset(0);
        $records = $csv->getRecords();

        foreach ($records as $record) {
            match ($request->module) {
                'suppliers'             => Supplier::create($record),
                'purchase_orders'       => PurchaseOrder::create($record),
                'deliveries'            => Delivery::create($record),
                'iars'                  => Iar::create($record),
                'supplier_evaluations'  => SupplierEvaluation::create($record),
            };
        }

        return back()->with('success', 'Import successful.');
    }

   public function preview(Request $request)
    {
        $module = $request->query('module', 'suppliers');

        $rows = match($module) {
            'suppliers' => \App\Models\Supplier::all()->map(fn($r) => [
                'id'               => $r->id,
                'company_name'     => $r->company_name,
                'office_address'   => $r->office_address,
                'tin'              => $r->tin,
                'email'            => $r->email,
                'contact_number'   => $r->contact_number,
                'status'           => $r->status,
                'internal_remarks' => $r->internal_remarks,
            ]),

            'purchase-orders' => \App\Models\PurchaseOrder::with('supplier')->get()->map(fn($r) => [
                'id'             => $r->id,
                'po_number'      => $r->po_number,
                'po_date'        => $r->po_date,
                'po_amount'      => $r->po_amount,
                'unit_office'    => $r->unit_office,
                'supplier'       => $r->supplier?->company_name,
                'delivery_term'  => $r->delivery_term,
                'fund_cluster'   => $r->fund_cluster,
                'pr_number'      => $r->pr_number,
                'pr_date'        => $r->pr_date,
                'ors_bur_number' => $r->ors_bur_number,
                'ors_bur_date'   => $r->ors_bur_date,
                'status'         => $r->status,
                'remarks'        => $r->remarks,
            ]),

            'deliveries' => \App\Models\Delivery::with('purchaseOrder','supplier')->get()->map(fn($r) => [
                'id'             => $r->id,
                'po_number'      => $r->purchaseOrder?->po_number,
                'supplier'       => $r->supplier?->company_name,
                'invoice_number' => $r->invoice_number,
                'invoice_date'   => $r->invoice_date,
                'dr_number'      => $r->dr_number,
                'dr_date'        => $r->dr_date,
                'document_path'  => $r->document_path,
            ]),

            'iars' => \App\Models\Iar::with('purchaseOrder','delivery')->get()->map(fn($r) => [
                'id'              => $r->id,
                'iar_number'      => $r->iar_number,
                'po_number'       => $r->purchaseOrder?->po_number,
                'invoice_number'  => $r->delivery?->invoice_number,
                'iar_date'        => $r->iar_date,
                'inspected_by'    => $r->inspected_by,
                'inspection_date' => $r->inspection_date,
                'status'          => $r->status,
                'remarks'         => $r->remarks,
                'document_path'   => $r->document_path,
            ]),

            'supplier-evaluations' => \App\Models\SupplierEvaluation::with('supplier','purchaseOrder')->get()->map(fn($r) => [
                'id'                => $r->id,
                'evaluation_date'   => $r->evaluation_date,
                'supplier'          => $r->supplier?->company_name,
                'po_number'         => $r->purchaseOrder?->po_number,
                'requesting_office' => $r->requesting_office,
                'total_amount'      => $r->total_amount,
                'quality_of_goods'  => $r->quality_of_goods,
                'timeliness'        => $r->timeliness,
                'compliance'        => $r->compliance,
            ]),

            default => collect(),
        };

        if ($rows->isEmpty()) {
            return response()->json(['headers' => [], 'rows' => []]);
        }

        $headers = array_keys($rows->first());
        $rowValues = $rows->map(fn($row) => array_values($row))->toArray();

        return response()->json(['headers' => $headers, 'rows' => $rowValues]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'module' => 'required|in:suppliers,purchase_orders,deliveries,iars,supplier_evaluations',
        ]);
        $data = match ($request->module) {
            'suppliers'             => Supplier::all()->toArray(),
            'purchase_orders'       => PurchaseOrder::all()->toArray(),
            'deliveries'            => Delivery::all()->toArray(),
            'iars'                  => Iar::all()->toArray(),
            'supplier_evaluations'  => SupplierEvaluation::all()->toArray(),
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