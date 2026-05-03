<?php

namespace App\Http\Controllers;

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

    public function create()
    {

        $data = $this->taskService->create();
        return Inertia::render('admin/task/create', $data);
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
