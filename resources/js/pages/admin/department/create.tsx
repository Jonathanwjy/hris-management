import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import DepartmentForm from './department-form';

export default function DepartmentCreate() {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <div className="flex justify-center gap-60">
                        {' '}
                        <h1>Add Department</h1>
                        <Link
                            href="/department"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back
                        </Link>
                    </div>
                    <div className="flex min-h-screen justify-center">
                        <DepartmentForm />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
