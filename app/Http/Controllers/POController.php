<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class POController extends Controller
{
    public function index()
    {
        return Inertia::render('po/index', [
        ]);
    }
}