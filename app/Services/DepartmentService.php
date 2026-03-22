<?php

namespace App\Services;

use App\Models\Department;
use Illuminate\Support\Facades\DB;

class DepartmentService
{
    public function store(array $data): Department
    {
        return DB::transaction(function () use ($data) {
            return Department::create($data);
        });
    }

    public function update(Department $department, array $data): Department
    {
        $department->update($data);
        return $department;
    }

    public function getDepartment()
    {
        return Department::all();
    }
}
