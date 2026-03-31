import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { LeaveIndexProps } from '@/types/leave';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leave Request',
        href: '/leave',
    },
];

export default function LeaveIndex({ leaveRequests = [], isAdmin }: LeaveIndexProps) {
    const handleAccept = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'menonaktifkan' : 'mengaktifkan';

        const isConfirmed = await showConfirm('Ubah Status Department?', `Apakah Anda yakin ingin ${actionText} department ini?`, 'Ya, Ubah Status!');

        if (isConfirmed) {
            router.patch(`/admin/leave/${id}/accept-request`, {}, { preserveScroll: true });
        }
    };

    const handleDecline = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'menonaktifkan' : 'mengaktifkan';

        const isConfirmed = await showConfirm('Ubah Status Department?', `Apakah Anda yakin ingin ${actionText} department ini?`, 'Ya, Ubah Status!');

        if (isConfirmed) {
            router.patch(`/admin/leave/${id}/decline-request`, {}, { preserveScroll: true });
        }
    };
    return (
        <>
            <Head title="Leave Request" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Leave Request</h1>
                        {!isAdmin && (
                            <Button asChild>
                                <Link href="leave/create">Request Leave</Link>
                            </Button>
                        )}
                    </div>

                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Tanggal Mulai</TableHead>
                                    <TableHead>Tanggal Selesai</TableHead>
                                    <TableHead>Durasi (Hari)</TableHead>
                                    {isAdmin && <TableHead>Requested By</TableHead>}
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {leaveRequests.length > 0 ? (
                                    leaveRequests.map((leave, index) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{leave.start_date}</TableCell>
                                            <TableCell>{leave.end_date}</TableCell>
                                            <TableCell>{leave.duration}</TableCell>
                                            {isAdmin && <TableCell>{leave.employee.full_name}</TableCell>}
                                            <TableCell>{leave.reason}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded px-2 py-1 text-xs ${
                                                        leave.status === 'accepted'
                                                            ? 'bg-green-100 text-green-700'
                                                            : leave.status === 'declined'
                                                              ? 'bg-red-100 text-red-700'
                                                              : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {leave.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex gap-2">
                                                <Button size="sm" asChild>
                                                    <Link href={route(isAdmin ? 'leave.admin.show' : 'leave.show', { leave: leave.id })}>Detail</Link>
                                                </Button>

                                                {isAdmin && leave.status === 'pending' && (
                                                    <Button size="sm" variant="destructive" onClick={() => handleDecline(leave.id, leave.status)}>
                                                        Decline
                                                    </Button>
                                                )}

                                                {isAdmin && leave.status === 'pending' && (
                                                    <Button size="sm" variant="secondary" onClick={() => handleAccept(leave.id, leave.status)}>
                                                        Accept
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            Belum ada request leave
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
