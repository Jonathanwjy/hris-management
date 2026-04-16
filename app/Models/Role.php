<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        "title",
        "description",
        "salary",
        "department_id",
        "status",
    ];

    public function employee()
    {
        return $this->hasMany(Employee::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function payroll()
    {
        return $this->hasOne(Payroll::class);
    }
}
