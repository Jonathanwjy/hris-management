import AppLayout from '@/layouts/app-layout';
import RoleForm from './role-form.';

export default function RoleCreate() {
    return (
        <AppLayout>
            <div className="mb-8">
                <RoleForm />
            </div>
        </AppLayout>
    );
}
