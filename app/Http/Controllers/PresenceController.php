<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PresenceController extends Controller
{
    public function create()
    {
        return Inertia::render("user/presence/create");
    }
}
