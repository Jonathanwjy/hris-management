<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Department;
use App\Models\Role;
use App\Services\RoleService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoleController extends Controller
{

    protected $roleService;
    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }
    public function index(Request $request)
    {
        $departmentId = $request->input('department_id');

        $roles = $this->roleService->getRoles($departmentId);

        $departments = Department::all();

        return Inertia::render('admin/role/index', [
            'roles' => $roles,
            'departments' => $departments,
            'filters' => [
                'department_id' => $departmentId
            ]
        ]);
    }

    public function create()
    {
        $data = $this->roleService->create();
        return Inertia::render("admin/role/create", $data);
    }

    public function store(RoleRequest $request)
    {
        $role = $this->roleService->store($request->validated());
        return to_route("role.index")->with("success", "Role Berhasil ditambahkan");
    }


    public function edit(Role $role)
    {
        $data = $this->roleService->edit($role);
        return Inertia::render("admin/role/edit", [
            "role" => $data['role'],
            "departments" => $data['departments']
        ]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        $this->roleService->update($role, $request->validated());
        return to_route("role.index")->with("success", "Role berhasil diupate");
    }

    public function toggleStatus(Role $role)
    {
        $role = $this->roleService->toggleStatus($role);
        return back()->with("success", "Berhasil ubah status");
    }
}
