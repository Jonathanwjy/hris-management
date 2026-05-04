<?php

namespace App\Services;

use App\Mail\TaskAssignedMail;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Role;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

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

    public function getTaskAdmin($status = null)
    {
        return Task::when($status, function ($query) use ($status) {
            $query->where('status', $status);
        })
            ->orderByRaw("FIELD(status, 'ongoing','finished','canceled')")
            ->latest()
            ->paginate(10);
    }

    public function getTaskUser()
    {
        // Ambil ID karyawan yang sedang login
        $employeeId = Auth::user()->employee->id;

        // Query langsung ke model Task (sama seperti Admin)
        // Tapi difilter HANYA task yang ditugaskan ke karyawan ini
        $tasks = Task::whereHas('employeeTasks', function ($query) use ($employeeId) {
            $query->where('employee_id', $employeeId);
        })
            ->latest()
            ->paginate(10);

        return [
            "tasks" => $tasks
        ];
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

            $employees = Employee::whereIn('id', $data['employee_ids'])->get();

            foreach ($employees as $employee) {
                // Kirim email ke masing-masing karyawan
                // Tips: Ganti send() menjadi queue() jika kamu sudah mengatur antrean (Queue) di Laravel agar loading form lebih cepat.
                Mail::to($employee->email)->queue(new TaskAssignedMail($task, $employee));
            }

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

    public function showAdmin(Task $task)
    {
        return $task->load(['department', 'role', 'employeeTasks.employee']);
    }

    public function finishTask(Task $task): Task
    {
        if ($task->status !== 'ongoing') {
            throw new \Exception('Task ini sudah diproses dan tidak dapat diubah lagi.');
        }

        $task->update([
            'status' => 'finished'
        ]);

        $task->employeeTasks()->update([
            'status' => 'finished'
        ]);

        return $task;
    }

    public function cancelTask(Task $task): Task
    {
        if ($task->status !== 'ongoing') {
            throw new \Exception('Task ini sudah diproses dan tidak dapat diubah lagi.');
        }

        $task->update([
            'status' => 'canceled'
        ]);

        $task->employeeTasks()->update([
            'status' => 'canceled'
        ]);

        return $task;
    }
}
