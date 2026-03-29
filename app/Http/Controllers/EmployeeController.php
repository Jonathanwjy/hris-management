<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Models\Employee;
use App\Models\Role;
use App\Models\Department;
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
    public function index(Request $request)
    {
        $departmentId = $request->input('department_id');
        $roleId = $request->input('role_id');

        $employees = $this->employeeService->getEmployee($departmentId, $roleId);

        $departments = Department::all();
        $roles = Role::all();

        return Inertia::render('admin/employee/index', [
            'departments' => $departments,
            'roles' => $roles,
            'employees' => $employees,
            'filters' => [
                'department_id' => $departmentId,
                'role_id' => $roleId,
            ]
        ]);
    }

    public function create()
    {
        $data = $this->employeeService->create();
        return Inertia::render('admin/employee/create', $data);
    }

    public function store(EmployeeRequest $request)
    {
        $this->employeeService->store($request->validated());
        return to_route('employee.index')->with('success', 'Successfully add employee');
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('admin/employee/edit', [
            'departments' => Department::all(),
            'roles' => Role::all(),
            'employee' => $employee
        ]);
    }

    public function update(EmployeeRequest $request, Employee $employee)
    {
        $employee = $this->employeeService->update($employee, $request->validated());

        return to_route('employee.index')->with('success', 'Employee berhasil diupdate');
    }

    public function show(Employee $employee)
    {
        $employee = $this->employeeService->getDetail($employee);

        return Inertia::render('admin/employee/show', [
            'employee' => $employee
        ]);
    }

    public function fireEmployee(Employee $employee)
    {
        $employee = $this->employeeService->fire($employee);
        return back()->with('success', 'Berhasil diubah');
    }
}
