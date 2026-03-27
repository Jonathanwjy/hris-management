<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Role;
use App\Models\Department;
use Illuminate\Support\Facades\DB;

class EmployeeService
{

    public function getEmployee()
    {
        return Employee::with(['department', 'role'])->get();
    }

    public function create(): array
    {
        return [
            'roles' => Role::all(),
            'departments' => Department::all(),
        ];
    }

    public function store(array $data): Employee
    {
        return DB::transaction(function () use ($data) {
            return Employee::create($data);
        });
    }

    public function update(Employee $employee, array $data): Employee
    {

        $employee->update($data);
        return $employee;
    }

    public function getDetail(Employee $employee): Employee
    {
        return $employee->load(['department', 'role']);
    }

    public function fire(Employee $employee): Employee
    {
        $fired = $employee->status == 'active' ? 'inactive' : 'active';
        $employee->update(['status' => $fired]);
        return $employee;
    }
}
