<?php

namespace App\Http\Controllers;

use App\Http\Requests\PresenceOutRequest;
use App\Http\Requests\PresenceRequest;
use App\Models\Presence;
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
        $presences = $this->presenceService->getPresences();
        return Inertia::render("admin_and_user/presence/index", [
            "presences" => $presences,
            "isAdmin" => false,
        ]);
    }
    public function create()
    {
        return Inertia::render("user/presence/create");
    }

    public function createAbsence()
    {
        return Inertia::render("user/presence/create-absence");
    }

    public function store(PresenceRequest $request)
    {
        $this->presenceService->store($request->validated());
        return to_route('presence.index')->with('success', 'Successfully add presence');
    }

    public function PresenceOut(Presence $presence)
    {
        return Inertia::render("user/presence/create-out", [
            "presence" => $presence
        ]);
    }

    public function StorePresenceOut(PresenceOutRequest $request, Presence $presence)
    {
        $this->presenceService->presenceOut($presence, $request->validated());
        return to_route('presence.index')->with('success', 'Successfully update presence');
    }
}
