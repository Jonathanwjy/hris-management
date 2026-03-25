import AppLayout from '@/layouts/app-layout';
import { Department, Role } from '@/types/employee';
import EmployeeFrom from './employee-form';

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
