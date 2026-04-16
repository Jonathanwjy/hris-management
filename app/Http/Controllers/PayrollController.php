<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PayrollService;
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
}
