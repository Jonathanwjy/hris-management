<?php


namespace App\Services;

use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LeaveService
{

    const MAX_LEAVE_DAYS_PER_YEAR = 14;

    public function getRemainingLeaveDays($employee): int
    {

        $usedLeave = $employee->leaveRequest()
            ->where('status', 'accepted')
            ->whereYear('start_date', Carbon::now()->year)
            ->sum('duration');

        $remaining = self::MAX_LEAVE_DAYS_PER_YEAR - $usedLeave;

        return max(0, $remaining);
    }
    public function getLeaveRequest()
    {

        $employee = Auth::user()->employee;
        $remainingLeave = $this->getRemainingLeaveDays($employee);

        $leaveRequests = $employee
            ->leaveRequest()
            ->with('employee')
            ->latest()
            ->paginate(10);

        // Return dalam bentuk associative array
        return [
            'leaveRequests'  => $leaveRequests,
            'remainingLeave' => $remainingLeave,
        ];
    }

    public function getLeaveRequestAdmin($status = null)
    {

        return LeaveRequest::with('employee')
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByRaw("FIELD(status, 'pending', 'accepted', 'declined')")
            ->latest()
            ->paginate(10);
    }

    public function store(array $data): LeaveRequest
    {
        return DB::transaction(function () use ($data) {


            $user = Auth::user();
            $employee = $user->employee;


            $start = Carbon::parse($data['start_date']);
            $end = Carbon::parse($data['end_date']);

            $duration = $start->diffInDays($end) + 1;

            $leaveBalance = $this->getRemainingLeaveDays($employee);
            if ($duration > $leaveBalance) {
                throw ValidationException::withMessages([
                    'reason' => "Durasi cuti ({$duration} hari) melebihi sisa hari cuti yang tersedia ({$leaveBalance} hari)."
                ]);
            }

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
