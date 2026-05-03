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
    ];

    public function employeeTask()
    {
        return $this->hasOne(EmployeeTask::class);
    }
}
