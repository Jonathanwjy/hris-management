import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Department } from '@/types/department';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: '/department',
    },
];

export default function DepartmentIndex({ departments = [] }: { departments: Department[] }) {
    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'menonaktifkan' : 'mengaktifkan';

        const isConfirmed = await showConfirm('Ubah Status Department?', `Apakah Anda yakin ingin ${actionText} department ini?`, 'Ya, Ubah Status!');

        if (isConfirmed) {
            router.patch(
                `/department/toggle-status/${id}`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <>
            <Head title="Department"></Head>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex w-full justify-between p-8">
                    <h1 className="text-2xl">Department List</h1>
                    <Button className="cursor-pointer">
                        <Link href="department/create">Add Department</Link>
                    </Button>
                </div>

                <div className="w-full px-8">
                    <table className="border-primary w-full border text-left">
                        <thead>
                            <tr>
                                <th className="border-b p-2">No</th>
                                <th className="w-2/8 p-2">Nama</th>
                                <th className="w-3/8 p-2">Description</th>
                                <th className="w-2/8 p-2">Action Button</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department, index) => (
                                <tr key={department.id}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{department.name}</td>
                                    <td className="p-2">{department.description}</td>
                                    <td className="p-2">
                                        <Button className="mr-5 cursor-pointer">
                                            <Link href={`/department/${department.id}/edit`}>Edit</Link>
                                        </Button>
                                        <Button
                                            onClick={() => handleToggleStatus(department.id, department.status)}
                                            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                                                department.status === 'active'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {department.status === 'active' ? 'Active' : 'Inactive'}
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
