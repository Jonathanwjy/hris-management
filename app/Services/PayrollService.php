<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Payroll;

class PayrollService
{

    public function getPayrollsAdmin($monthYear = null)
    {
        $query = Payroll::with('employee')->orderBy('pay_date', 'desc');

        // Jika ada filter bulan dan tahun (misal: "2026-06")
        if ($monthYear) {
            $parts = explode('-', $monthYear);
            if (count($parts) === 2) {
                $query->whereYear('pay_date', $parts[0])
                    ->whereMonth('pay_date', $parts[1]);
            }
        }

        // Asumsi kamu menggunakan pagination (sesuaikan jika kamu menggunakan get())
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
}
