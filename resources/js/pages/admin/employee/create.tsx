import AppLayout from '@/layouts/app-layout';
import EmployeeFrom from './employee-form';

interface Role {
    id: number;
    name: string;
}

interface Department {
    id: number;
    name: string;
}

export default function ({ roles, departments }: { roles: Role[]; departments: Department[] }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <h1>Add Employee</h1>
                    <EmployeeFrom roles={roles} departments={departments} />
                </div>
            </AppLayout>
        </>
    );
}
