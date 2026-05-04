import AppLayout from '@/layouts/app-layout';
import { TaskFormProps } from '@/types/task';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import TaskForm from './task-form';

export default function EditTask({ task, employees, departments, roles }: TaskFormProps) {
    return (
        <AppLayout>
            <div className="p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Edit Task</h1>
                        <Link
                            href="/admin/task"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back
                        </Link>
                    </div>

                    <div className="w-full">
                        <TaskForm task={task} employees={employees} departments={departments} roles={roles} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
