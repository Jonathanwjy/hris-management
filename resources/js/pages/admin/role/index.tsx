import { Button } from '@/components/ui/button';
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

export default function RoleIndex({ roles = [] }: { roles: RoleWithRelation[] }) {
    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'menonaktifkan' : 'mengaktifkan';

        const isConfirmed = await showConfirm('Ubah Status Role?', `Apakah Anda yakin ingin ${actionText} role ini?`, 'Ya, Ubah Status!');

        if (isConfirmed) {
            router.patch(
                `/role/toggle-status/${id}`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };
    return (
        <>
            <Head title="Role"></Head>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex justify-between p-8">
                    <h1>Role Index</h1>
                    <Button>
                        <Link href="/role/create">Add Role</Link>
                    </Button>
                </div>

                <div className="w-full px-8">
                    <table className="border-primary w-full border text-left">
                        <thead>
                            <tr>
                                <th className="border-b p-2">No</th>
                                <th className="w-2/8 p-2">Nama</th>
                                <th className="w-2/8 p-2">Department</th>
                                <th className="w-3/8 p-2">Description</th>
                                <th className="w-1/8 p-2">Salary</th>
                                <th className="w-1/8 p-2">Action Button</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={role.id}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{role.title}</td>
                                    <td className="p-2">{role.department.name}</td>
                                    <td className="p-2">{role.description}</td>
                                    <td className="p-2">{formatRupiah(role.salary)}</td>
                                    <td className="flex p-2">
                                        <Button className="mr-5 cursor-pointer">
                                            <Link href={`/role/${role.id}/edit`}>Edit</Link>
                                        </Button>
                                        <Button
                                            onClick={() => handleToggleStatus(role.id, role.status)}
                                            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                                                role.status === 'active'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {role.status === 'active' ? 'Active' : 'Inactive'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AppLayout>
        </>
    );
}
