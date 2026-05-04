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
            ->where('status', 'active')
            ->select('id', 'full_name')
            ->orderBy('full_name', 'asc')
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

        return DB::transaction(function () use ($data) {

            $task = Task::create([
                'title'         => $data['title'],
                'description'   => $data['description'],
                'due_date'      => $data['due_date'],
                'department_id' => $data['department_id'],
                'role_id'       => $data['role_id'],
            ]);


            $employeeTasks = [];
            foreach ($data['employee_ids'] as $employeeId) {
                $employeeTasks[] = [
                    'employee_id' => $employeeId,
                    'status'      => 'pending'
                ];
            }


            $task->employeeTasks()->createMany($employeeTasks);

            return $task;
        });
    }

    public function edit(Task $task): array
    {
        $task->load('employeeTasks');

        return [
            'task' => $task,
            'employees' => Employee::where('status', 'active')->get(),
            'departments' => Department::where('status', 'active')->get(),
            'roles' => Role::where('status', 'active')->get(),
        ];
    }

    public function update(Task $task, array $data)
    {
        return DB::transaction(function () use ($task, $data) {
            $task->update([
                'title'         => $data['title'],
                'description'   => $data['description'],
                'due_date'      => $data['due_date'],
                'department_id' => $data['department_id'],
                'role_id'       => $data['role_id'],
            ]);

            // 2. Kelola relasi Karyawan (Tanpa mereset status yang sudah ada)
            // Ambil array employee_id yang sudah ada di database saat ini
            $existingEmployeeIds = $task->employeeTasks()->pluck('employee_id')->toArray();

            // Array employee_id dari inputan form edit
            $newEmployeeIds = $data['employee_ids'];

            // A. Cari karyawan yang di-UNCHECK (Ada di lama, tapi tidak ada di inputan baru)
            $toDelete = array_diff($existingEmployeeIds, $newEmployeeIds);
            if (!empty($toDelete)) {
                $task->employeeTasks()->whereIn('employee_id', $toDelete)->delete();
            }

            // B. Cari karyawan yang di-CHECK BARU (Ada di inputan baru, tidak ada di lama)
            $toAdd = array_diff($newEmployeeIds, $existingEmployeeIds);
            if (!empty($toAdd)) {
                $employeeTasks = [];
                foreach ($toAdd as $employeeId) {
                    $employeeTasks[] = [
                        'employee_id' => $employeeId,
                        'status'      => 'pending' // Yang baru ditambahkan statusnya pending
                    ];
                }
                $task->employeeTasks()->createMany($employeeTasks);
            }

            return $task;
        });
    }
}
