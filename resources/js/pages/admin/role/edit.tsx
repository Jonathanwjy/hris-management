import AppLayout from '@/layouts/app-layout';
import RoleForm from './role-form.';

export default function RoleEdit({ role }: { role: any }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <h1>Edit Role</h1>
                    <RoleForm role={role} />
                </div>
            </AppLayout>
        </>
    );
}
