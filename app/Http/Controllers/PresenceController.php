<?php

namespace App\Http\Controllers;

use App\Http\Requests\PresenceOutRequest;
use App\Http\Requests\PresenceRequest;
use App\Models\Presence;
use Inertia\Inertia;
use App\Services\PresenceService;
use Illuminate\Support\Facades\Request;
use Illuminate\Http\Request as HttpRequest;

class PresenceController extends Controller
{
    protected $presenceService;

    public function __construct(PresenceService $presenceService)
    {
        $this->presenceService = $presenceService;
    }

    public function index(HttpRequest $request)
    {
        $data = $this->presenceService->getPresences();
        return Inertia::render("admin_and_user/presence/index", [
            "presences" => $data['presences'],
            "filters" => $request->only('date'),
            "hadir" => $data['hadir'],
            "telat" => $data['telat'],
            "izin" => $data['izin'],
            "sakit" => $data['sakit'],
            "isAdmin" => false,
        ]);
    }

    public function adminIndex(HttpRequest $request)
    {
        $presences = $this->presenceService->getPresencesAdmin($request);
        return Inertia::render("admin_and_user/presence/index", [
            "presences" => $presences,
            "filters" => $request->only('date'),
            "isAdmin" => true,
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

    public function show(Presence $presence)
    {
        $presence = $this->presenceService->getDetail($presence);
        return Inertia::render("admin/presence/show", [
            "presence" => $presence
        ]);
    }
}
