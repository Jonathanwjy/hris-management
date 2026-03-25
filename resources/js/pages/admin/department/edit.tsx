import AppLayout from '@/layouts/app-layout';
import { Department } from '@/types/department';
import DepartmentForm from './department-form';

export default function DepartmentEdit({ department }: { department?: Department }) {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <h1>Edit Department</h1>
                    <DepartmentForm department={department} />
                </div>
            </AppLayout>
        </>
    );
}
