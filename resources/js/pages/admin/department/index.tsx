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
import { DepartmentProps } from '@/types/department';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: '/department',
    },
];

export default function DepartmentIndex({ departments }: DepartmentProps) {
    const departmentsData = departments?.data || [];
    const departmentsLinks = departments?.links || [];

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'menonaktifkan' : 'mengaktifkan';

        const isConfirmed = await showConfirm('Ubah Status Department?', `Apakah Anda yakin ingin ${actionText} department ini?`, 'Ya, Ubah Status!');

        if (isConfirmed) {
            router.patch(`/department/toggle-status/${id}`, {}, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Department" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-8">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Department</h1>

                        <Button asChild>
                            <Link href="/department/create">Add Department</Link>
                        </Button>
                    </div>

                    {/* TABLE */}
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {departmentsData.length > 0 ? (
                                    departmentsData.map((department, index) => (
                                        <TableRow key={department.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{department.name}</TableCell>
                                            <TableCell>{department.description}</TableCell>
                                            <TableCell className="flex gap-2">
                                                <Button size="sm" asChild>
                                                    <Link href={`/department/${department.id}/edit`}>Edit</Link>
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant={department.status === 'active' ? 'ghost' : 'destructive'}
                                                    onClick={() => handleToggleStatus(department.id, department.status)}
                                                >
                                                    {department.status === 'active' ? 'Active' : 'Inactive'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            Tidak ada data
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {departmentsLinks.length > 3 && (
                        <Pagination className="justify-end">
                            <PaginationContent>
                                {departmentsLinks.map((link, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === departmentsLinks.length - 1;

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
