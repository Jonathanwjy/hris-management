import AppLayout from '@/layouts/app-layout';

export default function RoleEdit({ role }: { role: any }) {
    return (
        <>
            <AppLayout>
                <div className="mb-8">
                    <h1>Edit Role</h1>
                    <RoleEdit role={role} />
                </div>
            </AppLayout>
        </>
    );
}
