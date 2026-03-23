<?php

namespace App\Services;

use App\Models\Department;
use Illuminate\Support\Facades\DB;
use App\Models\Role;

class RoleService
{
    public function getRole()
    {
        return Role::all();
    }

    public function store(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            return Role::create($data);
        });
    }

    public function update(Role $role, array $data): Role
    {
        $role->update($data);
        return $role;
    }
}
