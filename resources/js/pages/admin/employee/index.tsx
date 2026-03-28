import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

                <div className="space-y-6 p-8">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Employee</h1>

                        <Button asChild>
                            <Link href="/employee/create">Add Employee</Link>
                        </Button>
                    </div>

                    {/* TABLE */}
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {employees.length > 0 ? (
                                    employees.map((employee, index) => (
                                        <TableRow key={employee.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{employee.full_name}</TableCell>
                                            <TableCell>{employee.phone_number}</TableCell>
                                            <TableCell>{employee.department?.name}</TableCell>
                                            <TableCell>{employee.role?.title}</TableCell>
                                            <TableCell className="flex gap-2">
                                                <Button size="sm" asChild>
                                                    <Link href={`/employee/${employee.id}/edit`}>Edit</Link>
                                                </Button>

                                                <Button size="sm" variant="secondary" asChild>
                                                    <Link href={`/employee/${employee.id}`}>Detail</Link>
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
