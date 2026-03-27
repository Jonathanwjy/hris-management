<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
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
        return [
            "full_name" => "required|max:50",
            "email" => "required|email",
            "phone_number" => "required|min:8|max:12",
            "hire_date" => "required|date",
            "department_id" => "required|exists:departments,id",
            "role_id" => "required|exists:roles,id",
            "photo" => "nullable|image|mimes:jpg,jpeg,png|max:10000",
        ];
    }
}
