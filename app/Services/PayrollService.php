<?php

namespace App\Services;

use App\Mail\PayrollPublishedMail;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use App\Models\Presence;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class PayrollService
{


    public function getPayroll()
    {
        $payrolls = Auth::user()
            ->employee
            ->payroll()
            ->with('employee')
            ->orderBy('pay_date', 'desc')
            ->paginate(10);

        return $payrolls;
    }

    public function getPayrollsAdmin($monthYear = null)
    {
        $query = Payroll::with('employee')->orderBy('pay_date', 'desc');


        if ($monthYear) {
            $parts = explode('-', $monthYear);
            if (count($parts) === 2) {
                $query->whereYear('pay_date', $parts[0])
                    ->whereMonth('pay_date', $parts[1]);
            }
        }

        return $query->paginate(10)->withQueryString();
    }

    public function calculateDeduction($employeeId, $month, $year)
    {
        $deductionPerDay = 50000;

        $payrollStart = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $payrollEnd = Carbon::createFromDate($year, $month, 1)->endOfMonth();

        $leaves = LeaveRequest::where('employee_id', $employeeId)
            ->where('status', 'accepted')
            ->where(function ($query) use ($payrollStart, $payrollEnd) {
                $query->whereBetween('start_date', [$payrollStart, $payrollEnd])
                    ->orWhereBetween('end_date', [$payrollStart, $payrollEnd])
                    ->orWhere(function ($q) use ($payrollStart, $payrollEnd) {
                        $q->where('start_date', '<', $payrollStart)
                            ->where('end_date', '>', $payrollEnd);
                    });
            })
            ->get();

        $totalDaysInMonth = 0;

        foreach ($leaves as $leave) {
            $start = Carbon::parse($leave->start_date);
            $end = Carbon::parse($leave->end_date);

            $effectiveStart = $start->gt($payrollStart) ? $start : $payrollStart;

            $effectiveEnd = $end->lt($payrollEnd) ? $end : $payrollEnd;

            $days = $effectiveStart->diffInDays($effectiveEnd) + 1;
            $totalDaysInMonth += $days;
        }

        $absenceDays = Presence::where('employee_id', $employeeId)
            ->whereIn('status', ['alpa', 'izin', 'sakit'])
            ->whereBetween('date', [$payrollStart, $payrollEnd])
            ->count();

        $totalDays = $totalDaysInMonth + $absenceDays;

        return [
            'leave_days'      => $totalDaysInMonth,
            'absence_days'    => $absenceDays,
            'amount_per_day'  => $deductionPerDay,
            'total_deduction' => $totalDays * $deductionPerDay
        ];
    }

    public function store(array $data): Payroll
    {
        $employee = Employee::with('role')->findOrFail($data['employee_id']);

        $baseSalary = $employee->role->salary;
        $bonuses = $data['bonuses'] ?? 0;

        $payDate = Carbon::parse($data['pay_date']);
        $month = $payDate->month;
        $year = $payDate->year;

        $deductionData = $this->calculateDeduction(
            $employee->id,
            $month,
            $year
        );

        $autoDeduction = $deductionData['total_deduction'];

        $manualDeduction = $data['deduction'] ?? 0;
        $totalDeduction = $autoDeduction + $manualDeduction;

        $netSalary = $baseSalary + $bonuses - $totalDeduction;

        $payroll = Payroll::create([
            'employee_id' => $employee->id,
            'role_id'     => $employee->role_id,
            'salary'      => $baseSalary,
            'bonuses'     => $bonuses,
            'deduction'   => $totalDeduction,
            'net_salary'  => $netSalary,
            'pay_date'    => $data['pay_date'],
        ]);

        if ($employee->email) {

            Mail::to($employee->email)->send(new PayrollPublishedMail($payroll));
        }

        return $payroll;
    }



    public function getDetail(Payroll $payroll): Payroll
    {
        return $payroll->load('employee.role');
    }

    public function update(Payroll $payroll, array $data): Payroll
    {
        $employee = Employee::with('role')->findOrFail($data['employee_id']);

        // 2. Ambil gaji pokok dari role
        $baseSalary = $employee->role->salary;

        // 3. Pastikan bonus dan potongan tidak null
        $bonuses = $data['bonuses'] ?? 0;
        $deduction = $data['deduction'] ?? 0;

        // 4. Hitung ulang Gaji Bersih secara otoritatif di backend
        $netSalary = $baseSalary + $bonuses - $deduction;

        // 5. Lakukan update
        $payroll->update([
            'employee_id' => $employee->id,
            'role_id'     => $employee->role_id,
            'salary'      => $baseSalary,
            'bonuses'     => $bonuses,
            'deduction'   => $deduction,
            'net_salary'  => $netSalary,
            'pay_date'    => $data['pay_date'],
        ]);

        return $payroll;
    }
}
