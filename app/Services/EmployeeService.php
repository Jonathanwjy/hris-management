<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleService
{

    public function getEmployee()
    {
        return Employee::all();
    }
}
