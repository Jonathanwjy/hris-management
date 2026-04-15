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
        $data = $this->leaveService->getLeaveRequest();

        return Inertia::render('admin_and_user/leave/index', [
            'leaveRequests' => $data['leaveRequests'],
            'remainingLeave' => $data['remainingLeave'],
            'isAdmin' => false,
        ]);
    }

    public function adminIndex()
    {
        $leaveRequests = $this->leaveService->getLeaveRequestAdmin();

        return Inertia::render('admin_and_user/leave/index', [
            'leaveRequests' => $leaveRequests,
            'isAdmin' => true,
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
    public function show(LeaveRequest $leave)
    {
        $this->leaveService->show($leave);
        return Inertia::render('admin_and_user/leave/show', [
            'leave' => $leave,
            'isAdmin' => Auth::user()->isAdmin,
        ]);
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

    public function acceptRequest(LeaveRequest $leaveRequest)
    {
        $this->leaveService->accpetRequest($leaveRequest);
        return back()->with('success', 'Leave Request berhasil diterima');
    }

    public function declineRequest(LeaveRequest $leaveRequest)
    {
        $this->leaveService->declineRequest($leaveRequest);
        return back()->with('success', 'Leave Request berhasil ditolak');
    }
}
