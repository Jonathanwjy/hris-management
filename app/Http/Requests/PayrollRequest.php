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
                    // Cek: kalau ini update, skip validasi duplikat
                    if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
                        return;
                    }
                    $date = Carbon::parse($value);
                    $routeParam = $this->route('payroll');
                    $idToIgnore = null;
                    if (is_object($routeParam)) {
                        $idToIgnore = $routeParam->id;
                    } elseif (is_array($routeParam) && isset($routeParam['id'])) {
                        $idToIgnore = $routeParam['id'];
                    } else {
                        $idToIgnore = $routeParam;
                    }
                    $query = Payroll::where('employee_id', $employeeId)
                        ->whereYear('pay_date', $date->year)
                        ->whereMonth('pay_date', $date->month);
                    if ($idToIgnore) {
                        $query->where('id', '!=', $idToIgnore);
                    }
                    if ($query->exists()) {
                        $fail('Gaji untuk karyawan ini pada bulan ' . $date->translatedFormat('F Y') . ' sudah dibuat.');
                    }
                },
            ],
        ];
    }
}
