<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuppliesController;
use App\Http\Controllers\DeliveriesController;
use App\Http\Controllers\IarController;
use App\Http\Controllers\POController;


Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/supplies', [SuppliesController::class, 'index'])->name('supplies.index');
Route::post('/suppliers', [SuppliesController::class, 'store'])->name('suppliers.store');

Route::get('/deliveries', [DeliveriesController::class, 'index'])->name('deliveries.index');

Route::get('/iar', [IarController::class, 'index'])->name('iar.index');

Route::get('/po', [POController::class, 'index'])->name('po.index');
Route::get('/po/create', [POController::class, 'create'])->name('purchase-orders.create');
Route::post('/po', [POController::class, 'store'])->name('purchase-orders.store');
require __DIR__.'/settings.php';
