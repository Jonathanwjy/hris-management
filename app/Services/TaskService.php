<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Task;

class TaskService
{

    public function create(): array
    {
        return [
            'employees' => Employee::where('status', 'active')->get(),
        ];
    }

    public function store(array $data): Task
    {
        return Task::create($data);
    }
}
