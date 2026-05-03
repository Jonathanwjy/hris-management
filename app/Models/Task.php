<?php

namespace App\Models;

use App\Models\EmployeeTask;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'due_date',
        'deparment_id',
        'role_id'
    ];

    public function employeeTask()
    {
        return $this->hasMany(EmployeeTask::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
