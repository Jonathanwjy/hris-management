import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { RoleWithRelation } from '@/types/role';
import { showConfirm } from '@/utils/alert';
import { formatRupiah } from '@/utils/format';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role',
        href: '/role',
    },
];

type Props = {
    roles: RoleWithRelation[];
    departments: any[];
    filters: {
        department_id?: string;
    };
};

export default function RoleIndex({ roles = [], departments = [], filters }: Props) {
    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'menonaktifkan' : 'mengaktifkan';

        const isConfirmed = await showConfirm('Ubah Status Role?', `Apakah Anda yakin ingin ${actionText} role ini?`, 'Ya, Ubah Status!');

        if (isConfirmed) {
            router.patch(`/role/toggle-status/${id}`, {}, { preserveScroll: true });
        }
    };

    const handleFilterChange = (value: string) => {
        router.get(
            '/role',
            {
                department_id: value === 'all' ? null : value,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Role" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Role</h1>

                        <div className="flex items-center gap-4">
                            <Select value={filters.department_id || ''} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Department</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={String(dept.id)}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button asChild>
                                <Link href="/role/create">Add Role</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Salary</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {roles.length > 0 ? (
                                    roles.map((role, index) => (
                                        <TableRow key={role.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{role.title}</TableCell>
                                            <TableCell>{role.department?.name}</TableCell>
                                            <TableCell>{role.description}</TableCell>
                                            <TableCell>{formatRupiah(role.salary)}</TableCell>
                                            <TableCell className="flex gap-2">
                                                <Button className="cursor-pointer" size="sm" asChild>
                                                    <Link href={`/role/${role.id}/edit`}>Edit</Link>
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    variant={role.status === 'active' ? 'ghost' : 'destructive'}
                                                    onClick={() => handleToggleStatus(role.id, role.status)}
                                                >
                                                    {role.status === 'active' ? 'Active' : 'Inactive'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            Tidak ada data
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
