<?php


namespace App\Services;

use App\Models\LeaveRequest;


class LeaveService
{
    public function getLeaveRequest($employeeId = null, $status = null)
    {
        return LeaveRequest::with('employee')
            ->when($employeeId, function ($query) use ($employeeId) {
                $query->where('employee_id', $employeeId);
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
