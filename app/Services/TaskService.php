<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Role;
use App\Models\Task;
use Illuminate\Support\Facades\DB;

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

    public function store(array $data)
    {
        // Gunakan DB Transaction agar jika insert karyawan gagal, insert task dibatalkan
        return DB::transaction(function () use ($data) {

            // 1. Simpan task baru
            $task = Task::create([
                'title'         => $data['title'],
                'description'   => $data['description'],
                'due_date'      => $data['due_date'],
                'department_id' => $data['department_id'],
                'role_id'       => $data['role_id'],
            ]);

            // 2. Siapkan data untuk tabel pivot EmployeeTask
            $employeeTasks = [];
            foreach ($data['employee_ids'] as $employeeId) {
                $employeeTasks[] = [
                    'employee_id' => $employeeId,
                    'status'      => 'pending' // Status awal selalu pending
                ];
            }

            // 3. Simpan relasinya
            // Karena sebelumnya kamu pakai hasMany('App\Models\EmployeeTask'),
            // kita bisa pakai createMany()
            $task->employeeTasks()->createMany($employeeTasks);

            return $task;
        });
    }
}
