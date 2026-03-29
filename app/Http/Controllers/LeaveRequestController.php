<?php

namespace App\Http\Controllers;


use App\Http\Requests\LeaveRequestRequest;
use App\Models\LeaveRequest;
use App\Services\LeaveService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    protected $leaveService;

    public function __construct(LeaveService $leaveService)
    {
        $this->leaveService = $leaveService;
    }
    public function index()
    {
        $leaveRequests = $this->leaveService->getLeaveRequest();

        return Inertia::render('user/leave/index', [
            'leave_requests' => $leaveRequests
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('user/leave/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LeaveRequestRequest $request)
    {

        $this->leaveService->store($request->validated());
        return to_route('leave.index')->with('success', 'Leave Request Berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveRequest $leaveRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LeaveRequest $leaveRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LeaveRequest $leaveRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveRequest $leaveRequest)
    {
        //
    }

    public function adminIndex()
    {
        $leaveRequest = LeaveRequest::all();
        return Inertia::render("admin/leave/index", [
            "leave_requests" => $leaveRequest
        ]);
    }
}
