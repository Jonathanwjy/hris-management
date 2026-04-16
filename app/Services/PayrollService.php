<?php

namespace App\Services;

use App\Models\Payroll;

class PayrollService
{

    public function getPayrollsAdmin()
    {
        return Payroll::with('employee')->orderBy('created_at', 'desc')->get();
    }
}
