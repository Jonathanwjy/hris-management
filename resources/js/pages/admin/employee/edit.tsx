import AppLayout from '@/layouts/app-layout';
import { Department, Employee, Role } from '@/types/employee';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import EmployeeForm from './employee-form';

export default function EmployeeEdit({ employee, roles, departments }: { employee?: Employee; roles: Role[]; departments: Department[] }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <div className="mb-4 flex justify-center gap-70">
                        {' '}
                        <h1>Edit Employee</h1>
                        <Link
                            href="/employee"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <EmployeeForm employee={employee} roles={roles} departments={departments} />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
