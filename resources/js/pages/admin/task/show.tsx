import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { ShowTaskProps } from '@/types/task';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminShow({ task, isAdmin }: ShowTaskProps) {
    const getTaskStatusColor = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'bg-blue-100 text-blue-800';
            case 'finished':
                return 'bg-green-100 text-green-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Fungsi bantuan untuk memberi warna badge status masing-masing karyawan
    const getEmployeeStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'ongoing':
                return 'bg-blue-100 text-blue-800';
            case 'finished':
                return 'bg-green-100 text-green-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFinish = async (id: number) => {
        const isConfirmed = await showConfirm('Selesaikan Task?', 'Pastikan sudah menyelesaikan task sesuai dengan ketentuan');

        if (isConfirmed) {
            const url = isAdmin ? `/admin/task/${id}/finish-task` : `/user/task/${id}/mark-as-done`;
            router.patch(url, {}, { preserveScroll: true });
        }
    };

    const handleCancel = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'ongoing' ? 'Batalkan' : 'batal';
        const isConfirmed = await showConfirm('Batalkan task?', `Apakah Anda yakin ingin ${actionText} task ini?`, 'Ya, Batalkan!');
        if (isConfirmed) {
            router.patch(`/admin/task/${id}/cancel-task`, {}, { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <Head title={`Detail Task - ${task.title}`} />

                <div className="mb-3 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Task Detail</h1>
                    <Button variant="outline" asChild>
                        <Link href={route(isAdmin ? 'task.index' : 'task.user.index')}>Back</Link>
                    </Button>
                </div>

                <div className="bg-background mb-8 overflow-hidden rounded-lg border shadow-sm">
                    <div className="border-b p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{task.title}</h1>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Tenggat Waktu: <span className="text-foreground font-medium">{task.due_date}</span>
                                </p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getTaskStatusColor(task.status)}`}>
                                {task.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                        <div>
                            <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">Deskripsi Tugas</h3>
                            <p className="text-foreground text-sm whitespace-pre-wrap">{task.description || 'Tidak ada deskripsi.'}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-muted-foreground mb-1 text-sm font-semibold tracking-wide uppercase">Departemen</h3>
                                <p className="text-sm font-medium">{task.department?.name || '-'}</p>
                            </div>
                            <div>
                                <h3 className="text-muted-foreground mb-1 text-sm font-semibold tracking-wide uppercase">Role</h3>
                                <p className="text-sm font-medium">{task.role?.title || '-'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 p-4">
                        {task.status === 'ongoing' && (
                            <Button size="sm" className="cursor-pointer" variant="default" onClick={() => handleFinish(task.id)}>
                                Mark As Done
                            </Button>
                        )}

                        {isAdmin && task.status === 'ongoing' && (
                            <Button size="sm" variant="destructive" onClick={() => handleCancel(task.id, task.status)} className="cursor-pointer">
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>

                {isAdmin && (
                    <div className="bg-background overflow-hidden rounded-lg border shadow-sm">
                        <div className="bg-muted/20 border-b p-6">
                            <h2 className="text-lg font-bold">Karyawan yang Ditugaskan</h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Daftar karyawan yang mengerjakan tugas ini beserta status pengerjaannya.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Nama Karyawan</th>
                                        <th className="px-6 py-3 font-semibold">Status Pengerjaan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {task.employee_tasks && task.employee_tasks.length > 0 ? (
                                        task.employee_tasks.map((et) => (
                                            <tr key={et.id} className="hover:bg-muted/30 border-b last:border-0">
                                                <td className="px-6 py-4 font-medium">{et.employee?.full_name || 'Karyawan tidak ditemukan'}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getEmployeeStatusColor(et.status)}`}
                                                    >
                                                        {et.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="text-muted-foreground px-6 py-8 text-center">
                                                Belum ada karyawan yang ditugaskan untuk task ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
