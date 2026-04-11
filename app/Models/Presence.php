<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    protected $fillable = [
        "employee_id",
        "date",
        "check_in_time",
        "clock_out_time",
        "status",
        "desc",
        "clock_in_latitude",
        "clock_in_longitude",
        "clock_out_latitude",
        "clock_out_longitude",
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
