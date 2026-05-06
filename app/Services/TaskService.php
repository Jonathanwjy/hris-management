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
        $employeeId = Auth::user()->employee->id;

        // 1. Ambil task sekaligus muat (eager load) relasi employeeTasks KHUSUS untuk user ini
        $tasks = Task::whereHas('employeeTasks', function ($query) use ($employeeId) {
            $query->where('employee_id', $employeeId);
        })
            ->with(['employeeTasks' => function ($query) use ($employeeId) {
                $query->where('employee_id', $employeeId); // Hanya load data karyawan ini
            }])
            ->orderByRaw("FIELD(status, 'ongoing','finished','canceled')")
            ->latest()
            ->paginate(10);

        // 2. Manipulasi data sebelum dikirim ke frontend
        // Kita ubah (transform) isi collection pagination-nya
        $tasks->getCollection()->transform(function ($task) {
            if ($task->employeeTasks->isNotEmpty()) {
                // Timpa 'status' utama task dengan 'status' dari tabel pivot employeeTasks
                $task->status = $task->employeeTasks->first()->status;
            }

            return $task;
        });

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


            $existingEmployeeIds = $task->employeeTasks()->pluck('employee_id')->toArray();

            $newEmployeeIds = $data['employee_ids'];

            $toDelete = array_diff($existingEmployeeIds, $newEmployeeIds);
            if (!empty($toDelete)) {
                $task->employeeTasks()->whereIn('employee_id', $toDelete)->delete();
            }


            $toAdd = array_diff($newEmployeeIds, $existingEmployeeIds);
            if (!empty($toAdd)) {
                $employeeTasks = [];
                foreach ($toAdd as $employeeId) {
                    $employeeTasks[] = [
                        'employee_id' => $employeeId,
                        'status'      => 'pending'
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

    public function showUser(Task $task)
    {
        $employeeId = Auth::user()->employee->id;

        // Load relasi, tapi FILTER tabel karyawan hanya untuk user yang sedang login
        $task->load([
            'department',
            'role',
            'employeeTasks' => function ($query) use ($employeeId) {
                $query->where('employee_id', $employeeId)->with('employee');
            }
        ]);

        // Timpa status utama task dengan status dari tabel pivot (agar badge di atas kanan berubah)
        if ($task->employeeTasks->isNotEmpty()) {
            $task->status = $task->employeeTasks->first()->status;
        }

        return $task;
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

    public function markAsDone(Task $task): Task
    {
        $employeeId = Auth::user()->employee->id;

        return DB::transaction(function () use ($task, $employeeId) {

            // 1. Update status tugas milik karyawan yang sedang login menjadi 'finished'
            $task->employeeTasks()
                ->where('employee_id', $employeeId)
                ->update(['status' => 'finished']);

            // 2. Cek apakah SEMUA karyawan sudah menyelesaikan tugas ini.
            // Kita hitung apakah masih ada karyawan yang statusnya 'pending' atau 'ongoing'
            $uncompletedCount = $task->employeeTasks()
                ->whereIn('status',  ['ongoing'])
                ->count();

            // 3. Jika tidak ada lagi yang pending/ongoing (artinya semua sudah finished/canceled),
            // maka otomatis selesaikan task utamanya.
            if ($uncompletedCount === 0) {
                $task->update([
                    'status' => 'finished'
                ]);
            }

            return $task;
        });
    }
}
