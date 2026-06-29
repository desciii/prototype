<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class IarController extends Controller
{
    public function index()
    {
        return Inertia::render('iar/index', [
            'message' => 'Hello from Laravel!',
        ]);
    }
}