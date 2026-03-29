import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import LeaveForm from './leave-form';

export default function CreateLeave() {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <div className="flex gap-96">
                        {' '}
                        <h1>Request Leave</h1>
                        <Link
                            href="/leave"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back
                        </Link>
                    </div>
                    <LeaveForm />
                </div>
            </AppLayout>
        </>
    );
}
