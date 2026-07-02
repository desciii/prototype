<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuppliesController;
use App\Http\Controllers\DeliveriesController;
use App\Http\Controllers\IarController;
use App\Http\Controllers\POController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImportExportController;
use App\Http\Controllers\SupplierEvaluationController;
use App\Http\Controllers\AuditLogController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::get('/supplies', [SuppliesController::class, 'index'])->name('supplies.index');
Route::post('/suppliers', [SuppliesController::class, 'store'])->name('suppliers.store');

Route::get('/deliveries', [DeliveriesController::class, 'index'])->name('deliveries.index');
Route::post('/deliveries', [DeliveriesController::class, 'store'])->name('deliveries.store');

Route::get('/iar', [IarController::class, 'index'])->name('iar.index');
Route::post('/iar', [IarController::class, 'store'])->name('iar.store');

Route::get('/po', [POController::class, 'index'])->name('po.index');
Route::get('/po/create', [POController::class, 'create'])->name('purchase-orders.create');
Route::post('/po', [POController::class, 'store'])->name('purchase-orders.store');

Route::get('/importexport', [ImportExportController::class, 'index'])->name('importexport.index');
Route::post('/importexport/import', [ImportExportController::class, 'import'])->name('importexport.import');
Route::get('/importexport/export', [ImportExportController::class, 'export'])->name('importexport.export');
Route::get('/importexport/preview', [ImportExportController::class, 'preview'])->name('importexport.preview');

Route::get('/supplier-evaluations', [SupplierEvaluationController::class, 'index'])->name('supplier-evaluations.index');
Route::post('/supplier-evaluations', [SupplierEvaluationController::class, 'store'])->name('supplier-evaluations.store');

Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');


require __DIR__.'/settings.php';