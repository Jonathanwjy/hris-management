import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PayrollProps } from '@/types/payroll';
import { Head, Link, router } from '@inertiajs/react';

// Definisi type untuk Dropdown Option
// Definisi type untuk Dropdown Option
interface MonthOption {
    value: string;
    label: string;
}

// Gunakan Omit untuk membuang 'filters' bawaan, lalu kita definisikan ulang
interface ExtendedPayrollProps extends Omit<PayrollProps, 'filters'> {
    filters: {
        month_year?: string; // Tambahkan tanda '?' agar opsional
    };
    availableMonths: MonthOption[];
}
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Payroll', href: '/payroll' }];

export default function PayrollIndex({ payrolls, isAdmin, filters, availableMonths = [] }: ExtendedPayrollProps) {
    const payrollData = payrolls?.data || [];
    const payrollLinks = payrolls?.links || [];

    // Fungsi helper untuk memformat angka menjadi format Rupiah (Rp)
    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    // Fungsi untuk menangani perubahan saat user memilih bulan di Dropdown
    const handleFilterChange = (value: string) => {
        router.get(
            window.location.pathname,
            { month_year: value === 'all' ? undefined : value }, // Jika 'all', hapus query parameter
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Payroll" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-8">
                    {/* Bagian Header & Tombol Create */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Payroll</h1>

                        {isAdmin && (
                            <Button asChild>
                                <Link href="/admin/payroll/create">Create Payroll</Link>
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* ================================== */}
                        {/* BAGIAN FILTER BULAN (DROPDOWN)     */}
                        {/* ================================== */}
                        <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-gray-500">Filter Bulan:</span>
                            <Select value={filters?.month_year || 'all'} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-[200px] bg-white">
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Bulan</SelectItem>
                                    {availableMonths.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Tombol Reset (Muncul hanya jika filter sedang aktif/bukan all) */}
                            {filters?.month_year && filters.month_year !== 'all' && (
                                <Button variant="outline" size="sm" onClick={() => handleFilterChange('all')}>
                                    Reset
                                </Button>
                            )}
                        </div>

                        {/* ================================== */}
                        {/* BAGIAN TABEL DATA PAYROLL          */}
                        {/* ================================== */}
                        <div className="rounded-xl border bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        {isAdmin && <TableHead>Nama Karyawan</TableHead>}
                                        <TableHead>Gaji Pokok</TableHead>
                                        <TableHead>Bonus</TableHead>
                                        <TableHead>Potongan</TableHead>
                                        <TableHead>Gaji Bersih</TableHead>
                                        <TableHead>Tanggal Gajian</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {payrollData.length > 0 ? (
                                        payrollData.map((payroll, index) => (
                                            <TableRow key={payroll.id}>
                                                <TableCell>{(payrolls?.from || 1) + index}</TableCell>
                                                {isAdmin && <TableCell>{payroll.employee?.full_name ?? '-'}</TableCell>}
                                                <TableCell>{formatRupiah(payroll.salary)}</TableCell>
                                                <TableCell>{formatRupiah(payroll.bonuses)}</TableCell>
                                                <TableCell>{formatRupiah(payroll.deduction)}</TableCell>
                                                <TableCell className="font-bold text-green-600">{formatRupiah(payroll.net_salary)}</TableCell>
                                                <TableCell>{payroll.pay_date}</TableCell>
                                                <TableCell className="flex gap-2">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/admin/payroll/${payroll.id}`}>View</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center text-gray-500">
                                                Belum ada data payroll untuk bulan ini.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* ================================== */}
                        {/* BAGIAN PAGINATION                  */}
                        {/* ================================== */}
                        {payrollLinks.length > 3 && (
                            <Pagination className="justify-end">
                                <PaginationContent>
                                    {payrollLinks.map((link, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === payrollLinks.length - 1;

                                        if (isFirst) {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationPrevious
                                                        href={link.url || '#'}
                                                        className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            );
                                        }

                                        if (isLast) {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationNext
                                                        href={link.url || '#'}
                                                        className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            );
                                        }

                                        if (link.label === '...') {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }

                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationLink href={link.url || '#'} isActive={link.active}>
                                                    {/* Mengakali tag <span> &laquo; yang dirender dari backend Laravel */}
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
