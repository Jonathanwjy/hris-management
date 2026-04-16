<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{

    protected $payrollService;
    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index()
    {
        $payrolls = $this->payrollService->getPayrollsAdmin();
        return Inertia::render('admin_and_user/payroll/index', [
            'payrolls' => $payrolls,
        ]);
    }

    public function create()
    {
        $employees = Employee::select('id', 'full_name')->get();

        return Inertia::render('admin/payroll/create', [
            'employees' => $employees,
        ]);
    }
}
