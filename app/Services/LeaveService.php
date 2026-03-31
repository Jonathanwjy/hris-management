<?php


namespace App\Services;

use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PDO;

class LeaveService
{
    public function getLeaveRequest()
    {
        $leaveRequests = Auth::user()
            ->employee
            ->leaveRequest()
            ->with("employee")
            ->latest()
            ->get();

        return $leaveRequests;
    }

    public function getLeaveRequestAdmin()
    {
        return LeaveRequest::with('employee')->latest()->get();
    }

    public function store(array $data): LeaveRequest
    {
        return DB::transaction(function () use ($data) {


            $user = Auth::user();
            $employee = $user->employee;

            if (!$employee) {
                throw new \Exception('Employee tidak ditemukan');
            }

            $start = Carbon::parse($data['start_date']);
            $end = Carbon::parse($data['end_date']);

            $duration = $start->diffInDays($end) + 1;

            return LeaveRequest::create([
                'employee_id' => $employee->id,
                'start_date'  => $data['start_date'],
                'end_date'    => $data['end_date'],
                'duration'    => $duration,
                'reason'      => $data['reason'],
                'status'      => 'pending',
            ]);
        });
    }

    public function show(LeaveRequest $leaveRequest): LeaveRequest
    {
        return $leaveRequest->load('employee');
    }
}
