<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuppliesController;
use App\Http\Controllers\DeliveriesController;
use App\Http\Controllers\IarController;


Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/supplies', [SuppliesController::class, 'index'])->name('supplies.index');

Route::get('/deliveries', [DeliveriesController::class, 'index'])->name('deliveries.index');

Route::get('/iar', [IarController::class, 'index'])->name('iar.index');
require __DIR__.'/settings.php';
