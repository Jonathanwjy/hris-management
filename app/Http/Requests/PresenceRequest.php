<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PresenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $employee = $this->user()->employee;
        return [
            "date" => [
                "required",
                "date",
                Rule::unique('presences')->where(function ($query) use ($employee) {
                    return $query->where('employee_id', $employee->id);
                })
            ],
            "clock_in_latitude" => "numeric",
            "clock_in_longitude" => "numeric",
            "status" => "in:sakit,alpa",
            "check_in_time" => "required",

        ];
    }
}
