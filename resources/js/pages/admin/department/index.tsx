import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: '/department',
    },
];

interface Department {
    id: number;
    name: string;
    description: string;
    status: string;
}

export default function DepartmentIndex({ departments = [] }: { departments: Department[] }) {
    return (
        <>
            <Head title="Department"></Head>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex w-full justify-between p-8">
                    <h1 className="text-2xl">Department List</h1>
                    <Button>
                        <Link href="department/create">Add Department</Link>
                    </Button>
                </div>

                <div className="w-full px-8">
                    <table className="border-primary w-full border text-left">
                        <thead>
                            <tr>
                                <th className="border-b p-2">No</th>
                                <th className="p-2">Nama</th>
                                <th className="p-2">Description</th>
                                <th className="p-2">Action Button</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department, index) => (
                                <tr key={department.id}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{department.name}</td>
                                    <td className="p-2">{department.description}</td>
                                    <td className="p-2">
                                        <Button>
                                            <Link href={`/department/edit/${department.id}`}>Edit</Link>
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
