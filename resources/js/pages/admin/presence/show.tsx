import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PresenceDetailProps } from '@/types/presence';

import { Head, Link } from '@inertiajs/react';

export default function PresenceShow({ presence }: PresenceDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Presence',
            href: '/admin/presence',
        },
    ];

    const getStatusBadge = (status: string) => {
        const statusStyles: Record<string, string> = {
            hadir: 'bg-green-100 text-green-700',
            telat: 'bg-red-100 text-blue-400',
            sakit: 'bg-yellow-100 text-yellow-700',
            alpa: 'bg-red-100 text-red-700',
            pending: 'bg-gray-100 text-gray-700',
        };
        const style = statusStyles[status] || 'bg-gray-100 text-gray-700';

        return <span className={`rounded px-3 py-1 text-sm font-medium capitalize ${style}`}>{status}</span>;
    };

    return (
        <>
            <Head title={`Detail Presensi - ${presence.employee?.full_name || 'Karyawan'}`} />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="mx-auto max-w-4xl space-y-6 p-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Detail Presensi</h1>
                        <Button variant="outline" asChild>
                            <Link href={route('presence.admin.index')}>Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Karyawan</CardTitle>
                            <CardDescription>Rincian absensi pada tanggal {presence.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                                    <p className="font-semibold">{presence.employee?.full_name ?? '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Status Absensi</p>
                                    <div>{getStatusBadge(presence.status)}</div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Waktu Check In</p>
                                    <p className="font-medium">{presence.check_in_time ?? 'Belum Check In'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Waktu Check Out</p>
                                    <p className="font-medium">{presence.clock_out_time ?? 'Belum Check Out'}</p>
                                </div>

                                <div className="col-span-1 space-y-1 md:col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Catatan / Keterangan</p>
                                    <p className="rounded-md bg-gray-50 p-3 text-sm">{presence.desc}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
