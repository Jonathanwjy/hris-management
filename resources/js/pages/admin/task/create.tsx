import AppLayout from '@/layouts/app-layout';
import { TaskFormProps } from '@/types/task';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import TaskForm from './task-form';

export default function CreateTask({ employees }: TaskFormProps) {
    return (
        <AppLayout>
            <div className="p-8">
                <div className="flex justify-center gap-66">
                    {' '}
                    <h1>Create Task</h1>
                    <Link
                        href="/admin/payroll"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back
                    </Link>
                </div>
                <div className="flex justify-center">
                    <TaskForm employees={employees} />
                </div>
            </div>
        </AppLayout>
    );
}
