<?php


namespace App\Services;

use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Auth;


class LeaveService
{
    public function getLeaveRequest()
    {
        $leaveRequests = Auth::user()
            ->employee
            ->leaveRequest()
            ->latest()
            ->get();

        return $leaveRequests;
    }
}
