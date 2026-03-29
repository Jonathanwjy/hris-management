import AppLayout from '@/layouts/app-layout';
import { Department, Role } from '@/types/role';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import RoleForm from './role-form.';

export default function RoleEdit({ role, departments }: { role?: Role; departments: Department[] }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <div className="flex gap-105">
                        {' '}
                        <h1>Edit Role</h1>
                        <Link
                            href="/role"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back
                        </Link>
                    </div>

                    <RoleForm role={role} departments={departments} />
                </div>
            </AppLayout>
        </>
    );
}
