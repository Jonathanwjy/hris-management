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
}
