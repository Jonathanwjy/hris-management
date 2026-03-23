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
        return Employee::all();
    }

    public function create(): array
    {
        return [
            'roles' => Role::all(),
            'departments' => Department::all(),
        ];
    }
}
