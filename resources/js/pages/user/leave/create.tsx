import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import LeaveForm from './leave-form';

export default function CreateLeave() {
    return (
        <AppLayout>
            <div className="bg-muted/30 min-h-screen px-6 py-8">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-foreground text-xl font-semibold">Request Leave</h1>
                        </div>
                        <Link
                            href="/user/leave"
                            className="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium shadow-sm transition"
                        >
                            <ArrowLeftIcon className="h-3.5 w-3.5" />
                            Back
                        </Link>
                    </div>

                    <div className="border-border bg-card rounded-xl border shadow-sm">
                        <div className="border-border border-b px-6 py-4">
                            <h2 className="text-foreground text-sm font-medium">Leave request form</h2>
                            <p className="text-muted-foreground mt-0.5 text-xs">Silahkan isi formulir di bawah ini</p>
                        </div>
                        <div className="px-6 py-5">
                            <LeaveForm />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
