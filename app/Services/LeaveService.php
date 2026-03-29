<?php


namespace App\Services;

use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


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

    public function store(array $data): LeaveRequest
    {
        return DB::transaction(function () use ($data) {

            dd([
                'auth_id' => Auth::id(),
                'employee' => Auth::user()->employee,
            ]);

            $user = Auth::user();
            $employee = $user->employee;

            if (!$employee) {
                throw new \Exception('Employee tidak ditemukan');
            }

            return LeaveRequest::create([
                'employee_id' => $employee->id,
                'start_date'  => $data['start_date'],
                'end_date'    => $data['end_date'],
                'reason'      => $data['reason'],
                'status'      => 'pending',
            ]);
        });
    }
}
