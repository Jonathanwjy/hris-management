<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use Illuminate\Http\Request;
use App\Services\TaskService;
use Inertia\Inertia;

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

    public function filterEmployees(Request $request)
    {
        $employees = $this->taskService->getEmployeesByDeptAndRole(
            $request->department_id,
            $request->role_id
        );

        return response()->json($employees);
    }
}
