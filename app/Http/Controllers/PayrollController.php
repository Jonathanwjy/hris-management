<?php

namespace App\Http\Controllers;

use App\Http\Requests\PayrollRequest;
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
        $employees = Employee::with('role:id,salary')->get(['id', 'full_name', 'role_id']);

        return Inertia::render('admin/payroll/create', [
            'employees' => $employees,
        ]);
    }

    public function store(PayrollRequest $request)
    {
        $this->payrollService->store($request->all());
        return to_route('admin.payroll.index')->with('success', 'Payroll created successfully.');
    }
}
