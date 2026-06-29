<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class SuppliesController extends Controller
{
    public function index()
    {
        return Inertia::render('supplies/index', [
            'message' => 'Hello from Laravel!',
        ]);
    }
}