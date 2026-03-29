<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class EmployeeService
{

    public function getEmployee($departmentId = null, $roleId = null)
    {
        return Employee::with(['department', 'role'])
            ->when($departmentId, function ($query) use ($departmentId) {
                $query->where('department_id', $departmentId);
            })
            ->when($roleId, function ($query) use ($roleId) {
                $query->where('role_id', $roleId);
            })
            ->orderBy('status', 'asc')
            ->get();
    }

    public function create(): array
    {
        return [
            'roles' => Role::where('status', 'active')->get(),
            'departments' => Department::where('status', 'active')->get(),
        ];
    }

    public function store(array $data): Employee
    {
        return DB::transaction(function () use ($data) {
            if (isset($data['photo'])) {
                $data['photo'] = $data['photo']->store('employees', 'public');
            }

            // buat user dulu
            $user = User::create([
                'name' => $data['full_name'],
                'email' => $data['email'],
                'password' => Hash::make('password123'),
            ]);

            // baru employee
            $data['user_id'] = $user->id;

            $employee = Employee::create($data);

            return $employee;
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
