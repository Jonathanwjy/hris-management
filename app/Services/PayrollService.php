<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Support\Facades\Auth;

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

    public function store(array $data): Payroll
    {

        $employee = Employee::with('role')->findOrFail($data['employee_id']);

        $baseSalary = $employee->role->salary;

        $bonuses = $data['bonuses'] ?? 0;
        $deduction = $data['deduction'] ?? 0;

        $netSalary = $baseSalary + $bonuses - $deduction;

        return Payroll::create([
            'employee_id' => $employee->id,
            'role_id'     => $employee->role_id,
            'salary'      => $baseSalary,
            'bonuses'     => $bonuses,
            'deduction'   => $deduction,
            'net_salary'  => $netSalary,
            'pay_date'    => $data['pay_date'],
        ]);
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
