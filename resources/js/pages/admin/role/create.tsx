import AppLayout from '@/layouts/app-layout';
import { Department } from '@/types/role';
import RoleForm from './role-form.';

export default function RoleCreate({ departments }: { departments: Department[] }) {
    return (
        <AppLayout>
            <div className="p-8">
                <RoleForm departments={departments} />
            </div>
        </AppLayout>
    );
}
