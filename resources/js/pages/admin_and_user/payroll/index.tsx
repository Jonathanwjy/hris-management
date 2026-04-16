import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function PayrollIndex() {
    return (
        <>
            <Head title="Payroll" />
            <AppLayout>
                <div className="space-y-6 p-8">
                    <h1 className="text-2xl font-semibold">Payroll</h1>
                </div>
            </AppLayout>
        </>
    );
}
