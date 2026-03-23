<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use Inertia\Inertia;
use App\Models\Role;
use App\Services\RoleService;

class RoleController extends Controller
{

    protected $roleService;
    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }
    public function index()
    {
        $roles = $this->roleService->getRole();
        return Inertia::render("admin/role/index", [
            "roles" => $roles,
        ]);
    }

    public function create()
    {
        return Inertia::render("admin/role/create");
    }

    public function store(RoleRequest $request)
    {
        $role = $this->roleService->store($request->validated());
        return to_route("role.index")->with("success", "Role Berhasil ditambahkan");
    }

    public function edit(Role $role)
    {
        return Inertia::render("admin/role/edit", [
            "role" => $role,
        ]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        $this->roleService->update($role, $request->validated());
        return to_route("role.index")->with("success", "Role berhasil diupate");
    }
}
