<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use Illuminate\Http\Request;
use App\Services\TaskService;
use Inertia\Inertia;
use App\Models\Task;

use function PHPUnit\Framework\isReadable;

class TaskController extends Controller
{

    protected $taskService;
    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(Request $request)
    {
        $status = $request->input('status');
        $tasks = $this->taskService->getTaskAdmin($status);

        $statusOptions = [
            'ongoing' => 'Ongoing',
            'finished' => 'Finished',
            'canceled' => 'Canceled',
        ];
        return Inertia::render('admin_and_user/task/index', [
            'tasks' => $tasks,
            'isAdmin' => true,
            'statusOptions' => $statusOptions,
            'filters' => [
                'status' => $status,
            ]
        ]);
    }

    public function userIndex()
    {
        $data = $this->taskService->getTaskUser();

        return Inertia::render('admin_and_user/task/index', [
            "tasks" => $data['tasks'],
            'isAdmin' => false,
        ]);
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

    public function show(Task $task)
    {
        $taskData = $this->taskService->showAdmin($task);

        return Inertia::render('admin/task/show', [
            'task' => $taskData,
            'isAdmin' => true,
        ]);
    }

    public function userShow(Task $task)
    {
        $taskData = $this->taskService->showUser($task);

        return Inertia::render('admin/task/show', [
            'task' => $taskData,
            'isAdmin' => false,
        ]);
    }

    public function filterEmployees(Request $request)
    {
        $employees = $this->taskService->getEmployeesByDeptAndRole(
            $request->department_id,
            $request->role_id
        );

        return response()->json($employees);
    }

    public function finishTask(Task $task)
    {
        $task = $this->taskService->finishTask($task);
        return back()->with('success', 'Task Berhasil Diselesaikan');
    }


    public function cancelTask(Task $task)
    {
        $task = $this->taskService->cancelTask($task);
        return back()->with('success', 'Task Berhasil Dibatalkan');
    }
}
