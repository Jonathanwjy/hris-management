import { Button } from '@/components/ui/button';
// Tambahkan import Input dari shadcn
import { Input } from '@/components/ui/input';
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
import { PresenceProps } from '@/types/presence';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Presence',
        href: '/presence',
    },
];

// Pastikan props filters diekstrak dari parameter komponen
export default function PresenceIndex({ presences, isAdmin, filters }: PresenceProps) {
    const presenceData = presences?.data || [];
    const presenceLinks = presences?.links || [];

    // Fungsi untuk menangani perubahan tanggal
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;

        // Mengirimkan request ke halaman saat ini dengan parameter date
        // preserveState & preserveScroll agar UI tidak berkedip saat memuat data
        router.get(window.location.pathname, { date: selectedDate }, { preserveState: true, preserveScroll: true, replace: true });
    };

    // Fungsi untuk mereset filter
    const resetFilter = () => {
        router.get(window.location.pathname, {}, { preserveState: true, preserveScroll: true, replace: true });
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
                        {/* --- BAGIAN FILTER TANGGAL --- */}
                        <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-gray-500">Filter Tanggal:</span>
                            <Input type="date" className="w-auto" value={filters?.date || ''} onChange={handleDateChange} />
                            {filters?.date && (
                                <Button variant="outline" size="sm" onClick={resetFilter}>
                                    Reset
                                </Button>
                            )}
                        </div>
                        {/* ----------------------------- */}

                        <div className="rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        {isAdmin && <TableHead>Nama Karyawan</TableHead>}
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
                                                {isAdmin && <TableCell>{presence.employee?.full_name ?? '-'}</TableCell>}
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
                                                                {isAdmin ? 'View' : 'Absen Keluar'}
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={isAdmin ? 6 : 5} className="text-center">
                                                Belum ada request presence
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Section Tetap Sama */}
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
