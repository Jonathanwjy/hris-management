<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use Illuminate\Http\Request;
use App\Services\TaskService;
use Inertia\Inertia;
use App\Models\Task;

class TaskController extends Controller
{

    protected $taskService;
    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index()
    {
        return Inertia::render('admin_and_user/task/index');
    }

    public function create()
    {

        $data = $this->taskService->create();
        return Inertia::render('admin/task/create', $data);
    }

    public function store(TaskRequest $request)
    {
        $this->taskService->store($request->validated());
        return to_route('task.index')->with('success', 'Task Berhasil dibuat');
    }

    public function edit(Task $task)
    {
        $data = $this->taskService->edit($task);
        return Inertia::render('admin/task/edit', $data);
    }

    public function update(TaskRequest $request, Task $task)
    {
        $this->taskService->update($task, $request->validated());

        // 3. Redirect kembali dengan pesan sukses
        return redirect()->route('task.index')->with('success', 'Task berhasil diupdate!');
    }

    public function filterEmployees(Request $request)
    {
        $employees = $this->taskService->getEmployeesByDeptAndRole(
            $request->department_id,
            $request->role_id
        );

        return response()->json($employees);
    }
}
