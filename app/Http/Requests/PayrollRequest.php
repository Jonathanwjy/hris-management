<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Payroll;

class PayrollRequest extends FormRequest
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
            "employee_id" => "required|exists:employees,id",

            "bonuses" => "nullable|numeric|min:0",
            "deduction" => "nullable|numeric|min:0",
            "net_salary" => "required|numeric",
            "pay_date" => [
                "required",
                "date",
                function ($attribute, $value, $fail) {

                    $employeeId = $this->input('employee_id');

                    if (!$employeeId) return;

                    $date = Carbon::parse($value);

                    $exists = Payroll::where('employee_id', $employeeId)
                        ->whereYear('pay_date', $date->year)
                        ->whereMonth('pay_date', $date->month)
                        ->exists();

                    if ($exists) {

                        $fail('Gaji untuk karyawan ini pada bulan ' . $date->translatedFormat('F Y') . ' sudah dibuat.');
                    }
                },
            ],

        ];
    }
}
