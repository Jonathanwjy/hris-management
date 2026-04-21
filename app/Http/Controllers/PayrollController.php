<?php

namespace App\Http\Controllers;

use App\Http\Requests\PayrollRequest;
use App\Models\Employee;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payroll;
use Carbon\Carbon;

class PayrollController extends Controller
{

    protected $payrollService;
    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }


    // ...

    public function index(Request $request)
    {

        $monthYear = $request->input('month_year');

        $payrolls = $this->payrollService->getPayrollsAdmin($monthYear);

        $availableMonths = Payroll::selectRaw('YEAR(pay_date) as year, MONTH(pay_date) as month')
            ->distinct()
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {

                $date = Carbon::createFromDate($item->year, $item->month, 1);
                return [
                    'value' => $date->format('Y-m'),
                    'label' => $date->translatedFormat('F Y'),
                ];
            });

        return Inertia::render('admin_and_user/payroll/index', [
            'payrolls' => $payrolls,
            'filters' => [
                'month_year' => $monthYear ?? 'all',
            ],
            'availableMonths' => $availableMonths,
            'isAdmin' => true,
        ]);
    }

    public function checkDeduction(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month'       => 'required|integer|min:1|max:12',
            'year'        => 'required|integer'
        ]);

        $deductionData = $this->payrollService->calculateDeduction(
            $request->employee_id,
            $request->month,
            $request->year
        );

        return response()->json($deductionData);
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
        return to_route('payroll.index')->with('success', 'Payroll created successfully.');
    }

    public function show(Payroll $payroll)
    {
        $payroll = $this->payrollService->getDetail($payroll);
        return Inertia::render('admin_and_user/payroll/show', [
            'payroll' => $payroll,
        ]);
    }

    public function edit(Payroll $payroll)
    {
        $payroll = $this->payrollService->getDetail($payroll);
        $employees = Employee::with('role:id,salary')->get(['id', 'full_name', 'role_id']);

        return Inertia::render('admin/payroll/edit', [
            'payroll' => $payroll,
            'employees' => $employees,
        ]);
    }

    public function update(PayrollRequest $request, Payroll $payroll)
    {
        $this->payrollService->update($payroll, $request->validated());
        return to_route('payroll.index')->with('success', 'Payroll updated successfully.');
    }

    public function UserIndex()
    {
        $payrolls = $this->payrollService->getPayroll();

        return Inertia::render('admin_and_user/payroll/index', [
            'payrolls' => $payrolls,
            'isAdmin' => false,
        ]);
    }
}
