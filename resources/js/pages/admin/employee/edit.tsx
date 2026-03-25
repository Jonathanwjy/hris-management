import AppLayout from '@/layouts/app-layout';
import { Department, Employee, Role } from '@/types/employee';
import EmployeeForm from './employee-form';

export default function EmployeeEdit({ employee, roles, departments }: { employee?: Employee; roles: Role[]; departments: Department[] }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <h1>Edit Employee</h1>
                    <EmployeeForm employee={employee} roles={roles} departments={departments} />
                </div>
            </AppLayout>
        </>
    );
}
