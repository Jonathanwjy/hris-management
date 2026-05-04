import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PayrollFormProps } from '@/types/payroll';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

// Buat interface untuk menampung tipe kembalian API
interface DeductionDetails {
    leave_days: number;
    absence_days: number;
    total_days: number;
    amount_per_day: number;
    total_deduction: number;
}

export default function PayrollForm({ payroll, employees }: PayrollFormProps) {
    const isEdit = !!payroll;

    const [searchQuery, setSearchQuery] = useState(payroll?.employee?.full_name || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [baseSalary, setBaseSalary] = useState(payroll?.salary ?? 0);

    // State baru untuk menampung perhitungan dari Backend
    const [systemDeduction, setSystemDeduction] = useState<DeductionDetails | null>(null);
    const [isLoadingDeduction, setIsLoadingDeduction] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: payroll?.employee_id ? String(payroll.employee_id) : '',
        role_id: payroll?.role_id ? String(payroll.role_id) : '',
        salary: payroll?.salary ?? 0,
        bonuses: payroll?.bonuses ?? 0,
        deduction: payroll?.deduction ?? 0, // Ini tetap menjadi potongan tambahan/manual
        net_salary: payroll?.net_salary ?? 0,
        pay_date: payroll?.pay_date ?? '',
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mengambil gaji pokok dari opsi pegawai
    useEffect(() => {
        if (data.employee_id) {
            const selectedEmp = employees.find((emp) => String(emp.id) === data.employee_id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const salary = Number((selectedEmp as any)?.role?.salary) || 0;
            setBaseSalary(salary);
        } else {
            setBaseSalary(0);
        }
    }, [data.employee_id, employees]);

    // 🌟 LOGIKA BARU: Fetching Data Potongan dari API
    useEffect(() => {
        if (data.employee_id && data.pay_date) {
            const dateObj = new Date(data.pay_date);
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();

            setIsLoadingDeduction(true);
            axios
                .get('/admin/payroll/check-deduction', {
                    params: {
                        employee_id: data.employee_id,
                        month: month,
                        year: year,
                    },
                })
                .then((res) => {
                    setSystemDeduction(res.data);
                })
                .catch((err) => {
                    console.error('Gagal mengambil data potongan otomatis', err);
                    setSystemDeduction(null);
                })
                .finally(() => {
                    setIsLoadingDeduction(false);
                });
        } else {
            setSystemDeduction(null);
        }
    }, [data.employee_id, data.pay_date]);

    // UPDATE LOGIKA: Hitung ulang Net Salary dengan memasukkan potongan sistem
    useEffect(() => {
        const base = Number(baseSalary) || 0;
        const bonusAmount = Number(data.bonuses) || 0;
        const manualDeductionAmount = Number(data.deduction) || 0;
        const autoDeductionAmount = systemDeduction?.total_deduction || 0; // Tambahan

        // Gaji Bersih = Gaji Pokok + Bonus - (Potongan Manual + Potongan Sistem)
        const calculatedNetSalary = base + bonusAmount - (manualDeductionAmount + autoDeductionAmount);

        setData('net_salary', calculatedNetSalary);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseSalary, data.bonuses, data.deduction, systemDeduction]);

    const filteredEmployees = employees.filter((emp) => emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/payroll/${payroll.id}`);
        } else {
            post('/admin/payroll');
        }
    };

    return (
        <form onSubmit={submit} className="h-auto max-w-xl">
            {/* Input Pencarian Pegawai */}
            <div className="relative mb-4" ref={dropdownRef}>
                <Label htmlFor="employee_search">Employee Name</Label>
                <Input
                    id="employee_search"
                    type="text"
                    autoComplete="off"
                    placeholder="Ketik untuk mencari employee..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                        if (data.employee_id) setData('employee_id', '');
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="text-muted-foreground mt-1"
                />

                {isDropdownOpen && searchQuery && (
                    <ul className="bg-primary absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-lg">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <li
                                    key={emp.id}
                                    className="text-primary-foreground cursor-pointer px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                        setData('employee_id', String(emp.id));
                                        setSearchQuery(emp.full_name);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {emp.full_name}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">Employee tidak ditemukan</li>
                        )}
                    </ul>
                )}
                <InputError message={errors.employee_id} className="mt-2" />
            </div>

            {/* Input Tanggal Gajian - Dipindah ke atas agar logika API segera terpicu */}
            <div className="mb-4">
                <Label htmlFor="pay_date">Pay Date</Label>
                <Input
                    id="pay_date"
                    type="date"
                    value={data.pay_date}
                    onChange={(e) => setData('pay_date', e.target.value)}
                    className="text-muted-foreground mt-1 w-auto cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
                <InputError message={errors.pay_date} className="mt-2" />
            </div>

            {/* 🌟 BLOK UI: Tampilan Rincian Potongan */}
            <div className="mb-4 min-h-[80px]">
                {isLoadingDeduction && (
                    <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-4">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></span>
                        <p className="text-sm text-gray-500 italic">Mengkalkulasi absensi & cuti...</p>
                    </div>
                )}

                {!isLoadingDeduction && systemDeduction && (
                    <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                        <h3 className="text-sm font-semibold text-blue-900">Rincian Kehadiran Sistem</h3>
                        <div className="text-primary flex justify-between text-sm">
                            <span>Hari Cuti:</span>
                            <span className="font-medium">{systemDeduction.leave_days} hari</span>
                        </div>
                        <div className="text-primary flex justify-between text-sm">
                            <span>Hari Alpa/Izin/Sakit:</span>
                            <span className="font-medium">{systemDeduction.absence_days} hari</span>
                        </div>
                        <div className="mt-2 flex justify-between border-t border-blue-200/50 pt-2 font-bold text-red-600">
                            <span className="text-sm">Total Potongan Otomatis:</span>
                            <span>Rp {systemDeduction.total_deduction.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
                {/* Input Bonus */}
                <div>
                    <Label htmlFor="bonuses">Bonuses</Label>
                    <Input
                        id="bonuses"
                        type="number"
                        placeholder="0"
                        value={data.bonuses}
                        onChange={(e) => setData('bonuses', Number(e.target.value))}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.bonuses} className="mt-2" />
                </div>

                {/* Input Potongan Manual */}
                <div>
                    <Label htmlFor="deduction">Potongan Manual</Label>
                    <Input
                        id="deduction"
                        type="number"
                        placeholder="0"
                        value={data.deduction}
                        onChange={(e) => setData('deduction', Number(e.target.value))}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.deduction} className="mt-2" />
                </div>
            </div>

            {/* Input Gaji Bersih Terkalkulasi */}
            <div className="mb-6">
                <Label htmlFor="net_salary">Estimasi Gaji Bersih (Dihitung Otomatis)</Label>
                <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 font-medium text-gray-500">Rp</span>
                    <Input
                        id="net_salary"
                        type="text"
                        readOnly
                        value={data.net_salary.toLocaleString('id-ID')}
                        className="text-muted-foreground mt-1 cursor-not-allowed bg-gray-100 pl-10 font-bold"
                    />
                </div>
            </div>

            <Button type="submit" disabled={processing} className="w-full cursor-pointer">
                {processing ? 'Saving...' : isEdit ? 'Update Payroll' : 'Create Payroll'}
            </Button>
        </form>
    );
}
