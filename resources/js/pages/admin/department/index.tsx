import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: '/department',
    },
];

export default function DepartmentIndex() {
    return (
        <>
            <Head title="Department"></Head>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex w-full justify-between p-8">
                    <h1 className="text-2xl">Department List</h1>
                    <Button>
                        <Link href="department/create">Add Department</Link>
                    </Button>
                </div>
            </AppLayout>
        </>
    );
}
