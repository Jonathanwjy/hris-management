import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PayrollFormProps } from '@/types/payroll';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function PayrollForm({ payroll, employees }: PayrollFormProps) {
    const isEdit = !!payroll;

    const [searchQuery, setSearchQuery] = useState(payroll?.employee?.full_name || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [baseSalary, setBaseSalary] = useState(payroll?.salary ?? 0);

    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: payroll?.employee_id ? String(payroll.employee_id) : '',
        role_id: payroll?.role_id ? String(payroll.role_id) : '',
        salary: payroll?.salary ?? 0,
        bonuses: payroll?.bonuses ?? 0,
        deduction: payroll?.deduction ?? 0,
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

    useEffect(() => {
        if (data.employee_id) {
            const selectedEmp = employees.find((emp) => String(emp.id) === data.employee_id);
            // Paksa menjadi Number di sini untuk mencegah data dari backend berupa String
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const salary = Number((selectedEmp as any)?.role?.salary) || 0;
            setBaseSalary(salary);
        } else {
            setBaseSalary(0);
        }
    }, [data.employee_id, employees]);

    useEffect(() => {
        const base = Number(baseSalary) || 0;
        const bonusAmount = Number(data.bonuses) || 0;
        const deductionAmount = Number(data.deduction) || 0;

        const calculatedNetSalary = base + bonusAmount - deductionAmount;

        setData('net_salary', calculatedNetSalary);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseSalary, data.bonuses, data.deduction]);

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
            {/* Input Autocomplete Employee */}
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

                {/* Dropdown List */}
                {isDropdownOpen && searchQuery && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <li
                                    key={emp.id}
                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
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

            <div className="mb-4">
                <Label htmlFor="bonuses">Bonuses</Label>
                <Input
                    id="bonuses"
                    type="number"
                    placeholder="Enter bonuses"
                    value={data.bonuses}
                    onChange={(e) => setData('bonuses', Number(e.target.value))}
                    className="text-muted-foreground mt-1"
                />
                <InputError message={errors.bonuses} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="deduction">Deduction</Label>
                <Input
                    id="deduction"
                    type="number"
                    placeholder="Enter deduction"
                    value={data.deduction}
                    onChange={(e) => setData('deduction', Number(e.target.value))}
                    className="text-muted-foreground mt-1"
                />
                <InputError message={errors.deduction} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="net_salary">Estimasi Gaji Bersih (Dihitung Otomatis)</Label>
                <Input
                    id="net_salary"
                    type="number"
                    readOnly
                    placeholder="Akan dihitung otomatis"
                    value={data.net_salary}
                    className="text-muted-foreground mt-1 cursor-not-allowed bg-gray-100"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="pay_date">Pay Date</Label>
                <Input
                    id="pay_date"
                    type="date"
                    value={data.pay_date}
                    onChange={(e) => setData('pay_date', e.target.value)}
                    className="text-muted-foreground mt-1"
                />
                <InputError message={errors.pay_date} className="mt-2" />
            </div>

            <Button type="submit" disabled={processing} className="cursor-pointer">
                {processing ? 'Saving...' : isEdit ? 'Update Payroll' : 'Create Payroll'}
            </Button>
        </form>
    );
}
