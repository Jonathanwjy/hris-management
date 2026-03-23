<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Services\EmployeeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{

    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }
    public function index()
    {
        return Inertia::render('admin/employee/index');
    }

    public function create()
    {
        $data = $this->employeeService->create();
        return Inertia::render('admin/employee/create', $data);
    }

    public function store(EmployeeRequest $request)
    {
        $this->employeeService->store($request->validated());
        return back()->with('success', 'Successfully add employee');
    }
}
