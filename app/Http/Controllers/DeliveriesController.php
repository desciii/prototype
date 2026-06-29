<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DeliveriesController extends Controller
{
    public function index()
    {
        return Inertia::render('deliveries/index', [
            'message' => 'Hello from Laravel!',
        ]);
    }
}