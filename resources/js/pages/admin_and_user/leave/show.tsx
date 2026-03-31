import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth'; // Import hook buatanmu
import AppLayout from '@/layouts/app-layout';
import { LeaveShowProps } from '@/types/leave';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarIcon, FileTextIcon, UserIcon } from 'lucide-react';

export default function LeaveShow({ leave }: LeaveShowProps) {
    const { isAdmin } = useAuth();
    const { patch, processing } = useForm();

    const updateStatus = (status: 'accepted' | 'declined') => {
        if (confirm(`Apakah Anda yakin ingin ${status === 'accepted' ? 'menyetujui' : 'menolak'} pengajuan ini?`)) {
            // Gunakan status sebagai data agar diterima Controller melalui $request->status
            patch(route('admin.leave.updateStatus', { leave: leave.id }), {
                data: { status },
            });
        }
    };

    const breadcrumbs = [
        { title: 'Leave Request', href: isAdmin ? '/admin/leave' : '/user/leave' },
        { title: 'Detail', href: '#' },
    ];

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        accepted: 'bg-green-100 text-green-700 border-green-200',
        declined: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Leave Request" />

            <div className="mx-auto max-w-4xl p-8">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href={isAdmin ? route('leave.admin.index') : route('leave.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Link>
                </Button>

                <Card>
                    <CardHeader className="border-b">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">Detail Pengajuan Cuti</CardTitle>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-sm font-medium ${statusColors[leave.status]}`}>
                                {leave.status.toUpperCase()}
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-6 pt-6">
                        <div className="bg-muted/50 flex items-center gap-4 rounded-lg p-4">
                            <div className="rounded-full bg-white p-2 shadow-sm">
                                <UserIcon className="text-primary h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Nama Karyawan</p>
                                <p className="text-lg font-semibold">{leave.employee?.full_name || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-1">
                                <div className="text-muted-foreground flex items-center text-sm">
                                    <CalendarIcon className="mr-2 h-4 w-4" /> Mulai
                                </div>
                                <p className="text-base font-medium">{leave.start_date}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-muted-foreground flex items-center text-sm">
                                    <CalendarIcon className="mr-2 h-4 w-4" /> Selesai
                                </div>
                                <p className="text-base font-medium">{leave.end_date}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">Durasi</p>
                                <p className="text-primary text-xl font-bold">{leave.duration} Hari</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-muted-foreground flex items-center text-sm">
                                <FileTextIcon className="mr-2 h-4 w-4" /> Alasan Cuti
                            </div>
                            <div className="bg-muted/30 text-foreground/80 rounded-md border p-4 italic">"{leave.reason}"</div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-muted/10 flex justify-end gap-3 border-t pt-6">
                        {isAdmin && leave.status === 'pending' && (
                            <>
                                <Button variant="destructive" onClick={() => updateStatus('declined')} disabled={processing}>
                                    Tolak Pengajuan
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus('accepted')} disabled={processing}>
                                    Setujui Cuti
                                </Button>
                            </>
                        )}

                        {!isAdmin && leave.status === 'pending' && (
                            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                Batalkan Pengajuan
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
