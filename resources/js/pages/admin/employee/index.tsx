import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EmployeeProps } from '@/types/employee';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee',
        href: '/employee',
    },
];

const handleFilterChange = (value: string) => {
    router.get(
        '/employee',
        {
            department_id: value === 'all' ? null : value,
            role_id: value === 'all' ? null : value,
        },
        {
            preserveState: true,
            replace: true,
        },
    );
};

export default function EmployeeIndex({ employees = [], departments = [], roles = [], filters }: EmployeeProps) {
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Employee" />

                <div className="space-y-6 p-8">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Employee</h1>
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

                            <Select value={filters.role_id || ''} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Role</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={String(role.id)}>
                                            {role.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button asChild>
                                <Link href="/employee/create">Add Employee</Link>
                            </Button>
                        </div>
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
