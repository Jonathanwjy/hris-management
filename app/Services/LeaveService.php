<?php


namespace App\Services;

use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

    public function accpetRequest(LeaveRequest $leaveRequest): LeaveRequest
    {
        if ($leaveRequest->status !== 'pending') {
            throw new \Exception('Status pengajuan ini sudah diproses dan tidak dapat diubah lagi.');
        }

        $leaveRequest->update(['status' => 'accepted']);

        return $leaveRequest;
    }

    public function declineRequest(LeaveRequest $leaveRequest): LeaveRequest
    {


        if ($leaveRequest->status !== 'pending') {
            throw new \Exception('Status pengajuan ini sudah diproses dan tidak dapat diubah lagi.');
        }

        $leaveRequest->update(['status' => 'declined']);

        return $leaveRequest;
    }

    public function cancelRequest(LeaveRequest $leaveRequest): LeaveRequest
    {
        if ($leaveRequest->status !== 'pending') {
            throw new \Exception('Status pengajuan ini sudah diproses dan tidak dapat dibatalkan.');
        }

        $leaveRequest->update(['status' => 'cancelled']);

        return $leaveRequest;
    }
}
