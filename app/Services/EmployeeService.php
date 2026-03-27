<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Role;
use App\Models\Department;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
            if (isset($data['photo'])) {
                $data['photo'] = $data['photo']->store('employees', 'public');
            }
            return Employee::create($data);
        });
    }

    public function update(Employee $employee, array $data): Employee
    {
        if (isset($data['photo'])) {

            // hapus foto lama
            if ($employee->photo) {
                Storage::disk('public')->delete($employee->photo);
            }

            // simpan foto baru
            $data['photo'] = $data['photo']->store('employees', 'public');
        }
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
