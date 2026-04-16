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
        // 1. Tangkap filter dari request
        $monthYear = $request->input('month_year');

        // 2. Ambil data payroll yang sudah difilter melalui service
        $payrolls = $this->payrollService->getPayrollsAdmin($monthYear);

        // 3. Ambil daftar bulan & tahun unik dari database untuk Dropdown
        $availableMonths = Payroll::selectRaw('YEAR(pay_date) as year, MONTH(pay_date) as month')
            ->distinct()
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {
                // Buat tanggal dummy (tanggal 1) untuk diubah jadi nama bulan
                $date = Carbon::createFromDate($item->year, $item->month, 1);
                return [
                    'value' => $date->format('Y-m'), // Contoh: "2026-06"
                    'label' => $date->translatedFormat('F Y'), // Contoh: "Juni 2026"
                ];
            });

        return Inertia::render('admin_and_user/payroll/index', [
            'payrolls' => $payrolls,
            'filters' => [
                'month_year' => $monthYear ?? 'all',
            ],
            'availableMonths' => $availableMonths,
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
        return to_route('payroll.index')->with('success', 'Payroll created successfully.');
    }
}
