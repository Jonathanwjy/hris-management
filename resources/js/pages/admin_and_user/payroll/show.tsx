import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PayrollDetailProps } from '@/types/payroll';
import { Head, Link } from '@inertiajs/react';

export default function PayrollShow({ payroll }: PayrollDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Payroll', href: '/payroll' },
        { title: 'Detail', href: '#' },
    ];

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Slip Gaji - ${payroll.employee?.full_name}`} />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-8">
                    <div className="flex items-center justify-between print:hidden">
                        <h1 className="text-2xl font-semibold">Detail Payroll</h1>
                        <div className="flex gap-4">
                            <Button variant="outline" asChild>
                                <Link href="/admin/payroll">Kembali</Link>
                            </Button>
                            <Button onClick={handlePrint}>Cetak Slip Gaji</Button>
                        </div>
                    </div>

                    <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 shadow-sm">
                        <div className="mb-8 border-b pb-6 text-center">
                            <h2 className="text-2xl font-bold tracking-wider text-gray-800 uppercase">Slip Gaji Karyawan</h2>
                            <p className="text-gray-500">Periode: {formatDate(payroll.pay_date)}</p>
                        </div>

                        <div className="mb-8 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Nama Karyawan</p>
                                <p className="font-semibold text-gray-900">{payroll.employee?.full_name ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Posisi / Role</p>
                                <p className="font-semibold text-gray-900">{payroll.employee?.role?.title ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Tanggal Pembayaran</p>
                                <p className="font-semibold text-gray-900">{formatDate(payroll.pay_date)}</p>
                            </div>
                        </div>

                        {/* Detail Perhitungan Gaji */}
                        <div className="mb-8 overflow-hidden rounded-lg border">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-gray-500">Keterangan</th>
                                        <th className="px-6 py-3 text-right font-medium text-gray-500">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {/* Pendapatan */}
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-gray-900">Gaji Pokok</td>
                                        <td className="px-6 py-4 text-right text-gray-700">{formatRupiah(payroll.salary)}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-gray-900">Bonus & Tunjangan</td>
                                        <td className="px-6 py-4 text-right text-green-600">
                                            {payroll.bonuses > 0 ? '+' : ''} {formatRupiah(payroll.bonuses)}
                                        </td>
                                    </tr>

                                    {/* Potongan */}
                                    <tr>
                                        <td className="px-6 py-4 font-medium text-gray-900">Potongan (Deduction)</td>
                                        <td className="px-6 py-4 text-right text-red-600">
                                            {payroll.deduction > 0 ? '-' : ''} {formatRupiah(payroll.deduction)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Total Gaji Bersih */}
                        <div className="flex items-center justify-between rounded-lg border bg-gray-50 px-6 py-4">
                            <span className="text-lg font-bold text-gray-900">Total Gaji Bersih </span>
                            <span className="text-2xl font-bold text-green-600">{formatRupiah(payroll.net_salary)}</span>
                        </div>

                        {/* Tanda Tangan Section (Opsional untuk di-print) */}
                        <div className="mt-16 flex justify-between px-8 text-center text-sm text-gray-600">
                            <div>
                                <p className="mb-16">Penerima</p>
                                <p className="border-b border-gray-400 px-4 pb-1 font-semibold text-gray-900">{payroll.employee?.full_name}</p>
                            </div>
                            <div>
                                <p className="mb-16">Mengetahui (HRD/Keuangan)</p>
                                <p className="border-b border-gray-400 px-4 pb-1 font-semibold text-gray-900">_______________________</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>

            {/* Global style tambahan untuk merapikan hasil cetak (print) */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    body { background-color: white !important; }
                    /* Sembunyikan sidebar/navbar bawaan AppLayout jika perlu */
                    header, nav, aside { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                }
            `,
                }}
            />
        </>
    );
}
