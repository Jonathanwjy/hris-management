@component('mail::message')
# Halo, {{ $payroll->employee->full_name }}

Gaji Anda untuk periode **{{ \Carbon\Carbon::parse($payroll->pay_date)->translatedFormat('F Y') }}** telah berhasil ditransfer.

Berikut adalah ringkasan slip gaji Anda:

@component('mail::table')
| Keterangan | Nominal |
| :------------- | :------------- |
| **Gaji Pokok** | Rp {{ number_format($payroll->salary, 0, ',', '.') }} |
| **Bonus** | Rp {{ number_format($payroll->bonuses, 0, ',', '.') }} |
| **Potongan** | Rp {{ number_format($payroll->deduction, 0, ',', '.') }} |
| **Total Diterima** | **Rp {{ number_format($payroll->net_salary, 0, ',', '.') }}** |
@endcomponent

Anda dapat melihat rincian lebih lengkap dengan login ke dalam sistem HRIS.

@component('mail::button', ['url' => config('app.url') . '/login'])
Cek Detail Payroll
@endcomponent

Terima kasih atas kerja keras Anda bulan ini!

Salam hangat,<br>
**Tim HRD {{ config('app.name') }}**
@endcomponent