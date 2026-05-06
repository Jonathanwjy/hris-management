<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Presence;
use App\Models\LeaveRequest;
use App\Models\Employee;
use App\Models\Department;
use Illuminate\Support\Carbon;

class DashboardService
{
    public function getAnalyticsData(): array
    {
        return [
            'tasks'          => $this->getTaskStats(),
            'presences'      => $this->getPresenceStats(),
            'leave_requests' => $this->getLeaveRequestStats(),
            'employees'      => $this->getEmployeeStats(),
        ];
    }

    private function getTaskStats(): array
    {
        return [
            'total'    => Task::count(),
            'ongoing'  => Task::where('status', 'ongoing')->count(),
            'finished' => Task::where('status', 'finished')->count(),
            'canceled' => Task::where('status', 'canceled')->count(),
        ];
    }

    private function getPresenceStats(): array
    {
        return [
            'present_today' => Presence::whereDate('created_at', Carbon::today())->count(),
        ];
    }

    private function getLeaveRequestStats(): array
    {
        return [
            'pending' => LeaveRequest::where('status', 'pending')->count(),
        ];
    }

    private function getEmployeeStats(): array
    {
        return [
            'total'         => Employee::where('status', 'active')->count(),
            'by_department' => Department::withCount(['employee' => function ($query) {
                $query->where('status', 'active');
            }])
                ->get()
                ->map(function ($dept) {
                    return [
                        'name'  => $dept->name,
                        'count' => $dept->employee_count,
                    ];
                })
                ->values()
                ->toArray(),
        ];
    }
}
