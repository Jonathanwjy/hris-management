<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    protected $fillable = [
        "employee_id",
        "check_in",
        "check_out",
        "date",
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
