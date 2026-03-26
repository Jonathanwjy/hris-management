import AppLayout from '@/layouts/app-layout';
import { Department, Role } from '@/types/role';
import RoleForm from './role-form.';

export default function RoleEdit({ role, departments }: { role?: Role; departments: Department[] }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <h1>Edit Role</h1>
                    <RoleForm role={role} departments={departments} />
                </div>
            </AppLayout>
        </>
    );
}
