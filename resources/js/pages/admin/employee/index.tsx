import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee',
        href: '/employee',
    },
];

type EmployeeStatus = 'active' | 'inactive' | 'leave';

interface Employee {
    id: number;
    full_name: string;
    phone_number: string;
    email: string;
    hire_date: string;
    department_id: number;
    role_id: number;
    status: EmployeeStatus;
}

export default function EmployeeIndex({ employees = [] }) {
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Employee" />
                <div className="flex justify-between p-8">
                    <h1>Employee Index</h1>
                    <Button className="cursor-pointer">
                        <Link href="/employee/create">Add Employee</Link>
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
                            {employees.map((department, index) => (
                                <tr key={department.id}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{department.name}</td>
                                    <td className="p-2">{department.description}</td>
                                    <td className="p-2">
                                        <Button className="mr-5 cursor-pointer">
                                            <Link href={`/department/edit/${department.id}`}>Edit</Link>
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
