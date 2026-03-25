import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Role } from '@/types/role';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role',
        href: '/role',
    },
];

export default function RoleIndex({ roles = [] }: { roles: Role[] }) {
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
                                <th className="w-3/8 p-2">Description</th>
                                <th className="w-2/8 p-2">Salary</th>
                                <th className="w-2/8 p-2">Action Button</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={role.id}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{role.title}</td>
                                    <td className="p-2">{role.description}</td>
                                    <td className="p-2">{role.salary}</td>
                                    <td className="p-2">
                                        <Button className="mr-5 cursor-pointer">
                                            <Link href={`/role/edit/${role.id}`}>Edit</Link>
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
