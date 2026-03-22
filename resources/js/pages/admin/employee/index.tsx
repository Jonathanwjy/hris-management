import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee',
        href: '/employee',
    },
];

export default function EmployeeIndex() {
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Employee" />
                <div>Ini index employee</div>
            </AppLayout>
        </>
    );
}
