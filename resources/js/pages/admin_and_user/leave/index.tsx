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
import { LeaveIndexProps } from '@/types/leave';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leave Request',
        href: '/leave',
    },
];

export default function LeaveIndex({ leaveRequests, isAdmin, remainingLeave, statusOptions, filters }: LeaveIndexProps) {
    const leaveRequestData = leaveRequests?.data || [];
    const leaveRequestLinks = leaveRequests?.links || [];

    const handleAccept = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'tolak' : 'merima';

        const isConfirmed = await showConfirm('Terima Pengajuan Cuti?', `Apakah Anda yakin ingin ${actionText} pengajuan cuti ini?`, 'Ya, Terima!');

        if (isConfirmed) {
            router.patch(`/admin/leave/${id}/accept-request`, {}, { preserveScroll: true });
        }
    };

    const handleDecline = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'menerima' : 'tolak';

        const isConfirmed = await showConfirm('Tolak Pengajuan Cuti?', `Apakah Anda yakin ingin ${actionText} pengajuan cuti ini?`, 'Ya, Tolak!');

        if (isConfirmed) {
            router.patch(`/admin/leave/${id}/decline-request`, {}, { preserveScroll: true });
        }
    };

    const handleFilterChange = (value: string) => {
        router.get(
            '/admin/leave',
            {
                status: value === 'all' ? null : value,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Leave Request" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Leave Request</h1>
                        {isAdmin && (
                            <Select value={filters.status || 'all'} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-[200px] cursor-pointer">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer">
                                        Semua Status
                                    </SelectItem>
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <SelectItem key={value} value={value} className="cursor-pointer">
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {!isAdmin && <p className="text-sm text-red-600">Sisa Hari Cuti yang bisa diambil: {remainingLeave} hari</p>}
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
                                {leaveRequestData.length > 0 ? (
                                    leaveRequestData.map((leave, index) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{leave.start_date}</TableCell>
                                            <TableCell>{leave.end_date}</TableCell>
                                            <TableCell>{leave.duration} hari</TableCell>
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
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDecline(leave.id, leave.status)}
                                                        className="cursor-pointer"
                                                    >
                                                        Decline
                                                    </Button>
                                                )}

                                                {isAdmin && leave.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => handleAccept(leave.id, leave.status)}
                                                        className="cursor-pointer"
                                                    >
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

                    {leaveRequestLinks.length > 3 && (
                        <Pagination className="justify-end">
                            <PaginationContent>
                                {leaveRequestLinks.map((link, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === leaveRequestLinks.length - 1;

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
                                                {link.label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
