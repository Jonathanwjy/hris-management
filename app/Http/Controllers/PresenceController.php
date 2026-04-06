<?php

namespace App\Http\Controllers;

use App\Http\Requests\PresenceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\PresenceService;

class PresenceController extends Controller
{
    protected $presenceService;

    public function __construct(PresenceService $presenceService)
    {
        $this->presenceService = $presenceService;
    }

    public function index()
    {
        return Inertia::render("admin_and_user/presence/index");
    }
    public function create()
    {
        return Inertia::render("user/presence/create");
    }

    public function store(PresenceRequest $request)
    {
        $this->presenceService->store($request->validated());
        return to_route('presence.index')->with('success', 'Successfully add presence');
    }
}
