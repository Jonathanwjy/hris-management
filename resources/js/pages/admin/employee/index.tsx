import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EmployeeWithRelation } from '@/types/employee';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee',
        href: '/employee',
    },
];

export default function EmployeeIndex({ employees = [] }: { employees: EmployeeWithRelation[] }) {
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
                                <th className="w-2/8 p-2">Full Name</th>
                                <th className="w-2/8 p-2">Phone Number</th>
                                <th className="w-2/8 p-2">Department</th>
                                <th className="w-1/8 p-2">Role</th>
                                <th className="w-1/8 p-2">Action Button</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr key={employee.id}>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{employee.full_name}</td>
                                    <td className="p-2">{employee.phone_number}</td>
                                    <td className="p-2">{employee.department.name}</td>
                                    <td className="p-2">{employee.role.title}</td>
                                    <td className="p-2">
                                        <Button className="mr-5 cursor-pointer">
                                            <Link href={`/employee/edit/${employee.id}`}>Edit</Link>
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
