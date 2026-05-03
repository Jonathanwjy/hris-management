<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Role;
use App\Models\Task;

class TaskService
{

    public function getEmployeesByDeptAndRole($departmentId, $roleId)
    {

        return Employee::where('department_id', $departmentId)
            ->where('role_id', $roleId)
            ->select('id', 'full_name')
            ->get();
    }

    public function create(): array
    {
        return [
            'employees' => Employee::where('status', 'active')->get(),
            'departments' => Department::where('status', 'active')->get(),
            'roles' => Role::where('status', 'active')->get(),
        ];
    }

    public function store(array $data): Task
    {
        return Task::create($data);
    }
}
