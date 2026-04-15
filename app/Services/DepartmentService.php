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
        return Department::orderBy('status', 'asc')->paginate(10);
    }

    public function toggleStatus(Department $department): Department
    {
        $newStatus = $department->status === 'active' ? 'inactive' : 'active';

        $department->update([
            'status' => $newStatus
        ]);

        $department->role()->update([
            'status' => $newStatus
        ]);

        return $department;
    }
}
