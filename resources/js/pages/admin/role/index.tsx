import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Role {
    id: number;
    title: string;
    descrition: string;
    salary: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role',
        href: '/role',
    },
];

export default function RoleIndex({ roles = [] }: { roles: Role[] }) {
    return (
        <>
            <Head title="Role"></Head>
            <AppLayout breadcrumbs={breadcrumbs}>
                <h1>Ini halaman index role</h1>
            </AppLayout>
        </>
    );
}
