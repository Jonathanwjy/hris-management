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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
// Anda mungkin perlu memperbarui PresenceProps di file types Anda
// untuk mendefinisikan { data: any[], links: any[] }
import { PresenceProps } from '@/types/presence';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Presence',
        href: '/presence',
    },
];

export default function PresenceIndex({ presences, isAdmin }: PresenceProps) {
    const presenceData = presences?.data || [];
    const presenceLinks = presences?.links || [];

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
            <Head title="Presence" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Presence</h1>
                        {!isAdmin && (
                            <Button asChild>
                                <Link href="presence/create">Add Presence</Link>
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Tanggal dan Jam</TableHead>
                                        <TableHead>Jam Check Out</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {presenceData.length > 0 ? (
                                        presenceData.map((presence, index) => (
                                            <TableRow key={presence.id}>
                                                <TableCell>{(presences?.from || 1) + index}</TableCell>
                                                <TableCell>{presence.check_in_time}</TableCell>
                                                <TableCell>{presence.clock_out_time ?? '-'}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs ${
                                                            presence.status === 'hadir'
                                                                ? 'bg-green-100 text-green-700'
                                                                : presence.status === 'telat'
                                                                  ? 'bg-red-100 text-blue-400'
                                                                  : presence.status === 'sakit'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : presence.status === 'alpa'
                                                                      ? 'bg-red-100 text-red-700'
                                                                      : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                    >
                                                        {presence.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="flex gap-2">
                                                    {presence.status === 'pending' && (
                                                        <Button size="sm" asChild>
                                                            <Link
                                                                href={route(isAdmin ? 'presence.admin.show' : 'presence.out', {
                                                                    presence: presence.id,
                                                                })}
                                                            >
                                                                Absen Keluar
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {isAdmin && presence.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDecline(presence.id, presence.status)}
                                                        >
                                                            Decline
                                                        </Button>
                                                    )}

                                                    {isAdmin && presence.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => handleAccept(presence.id, presence.status)}
                                                        >
                                                            Accept
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">
                                                Belum ada request presence
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {presenceLinks.length > 3 && (
                            <Pagination className="justify-end">
                                <PaginationContent>
                                    {presenceLinks.map((link, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === presenceLinks.length - 1;

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
                </div>
            </AppLayout>
        </>
    );
}
