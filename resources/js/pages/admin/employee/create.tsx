import AppLayout from '@/layouts/app-layout';
import { Department, Role } from '@/types/employee';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import EmployeeForm from './employee-form';

export default function ({ roles, departments }: { roles: Role[]; departments: Department[] }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <div className="flex gap-96">
                        {' '}
                        <h1>Add Employee</h1>
                        <Link
                            href="/employee"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back
                        </Link>
                    </div>
                    <EmployeeForm roles={roles} departments={departments} />
                </div>
            </AppLayout>
        </>
    );
}
