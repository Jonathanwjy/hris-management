import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

export default function index() {
    return (
        <>
            <AppLayout>
                <div>
                    <h1>Ini Halaman Index Task</h1>
                </div>
                <Link href="/admin/task/create">Buat Task</Link>
            </AppLayout>
        </>
    );
}
