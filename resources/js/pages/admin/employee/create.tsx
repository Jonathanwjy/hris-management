import AppLayout from '@/layouts/app-layout';
import { Department, Role } from '@/types/employee';
import EmployeeForm from './employee-form';

export default function ({ roles, departments }: { roles: Role[]; departments: Department[] }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <h1>Add Employee</h1>
                    <EmployeeForm roles={roles} departments={departments} />
                </div>
            </AppLayout>
        </>
    );
}
