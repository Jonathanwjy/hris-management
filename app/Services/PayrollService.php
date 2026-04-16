<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Payroll;

class PayrollService
{

    public function getPayrollsAdmin()
    {
        return Payroll::with('employee')->orderBy('created_at', 'desc')->get();
    }

    public function storePayroll(array $data): Payroll
    {
        // 1. Ambil data employee beserta relasi role-nya
        $employee = Employee::with('role')->findOrFail($data['employee_id']);

        // 2. Ambil gaji pokok dari role tersebut
        $baseSalary = $employee->role->salary;

        // 3. Pastikan bonus dan potongan tidak null
        $bonuses = $data['bonuses'] ?? 0;
        $deduction = $data['deduction'] ?? 0;

        // 4. Hitung Gaji Bersih
        $netSalary = $baseSalary + $bonuses - $deduction;

        // 5. Simpan ke database
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
