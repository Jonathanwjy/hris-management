<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepartmentController extends Controller
{

    protected $departmentService;

    public function __construct(DepartmentService $departmentService)
    {
        $this->departmentService = $departmentService;
    }

    public function index()
    {
        $departments = $this->departmentService->getDepartment();
        return Inertia::render('admin/department/index', ['departments' => $departments]);
    }

    public function create()
    {
        return Inertia::render('admin/department/create');
    }

    public function store(DepartmentRequest $request)
    {
        $department = $this->departmentService->store(
            $request->validated()
        );

        return to_route('department.index')->with('success', 'Department successfully added');
    }

    public function edit(Department $department)
    {
        return Inertia::render('admin/department/edit', [
            'department' => $department,
        ]);
    }

    public function update(DepartmentRequest $request, Department $department)
    {
        $department = $this->departmentService->update(
            $department,
            $request->validated()
        );

        return to_route('department.index')
            ->with('success', 'Department berhasil diupdate');
    }

    public function toggleStatus(Department $department)
    {
        $department = $this->departmentService->toggleStatus($department);

        return back()->with('success', 'Status berhasil diubah');
    }
}
