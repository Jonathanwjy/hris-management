import AppLayout from '@/layouts/app-layout';
import DepartmentForm from './department-form';

export default function DepartmentCreate() {
    return (
        <>
            <AppLayout>
                <div className="p-8">
                    <h1>Add New Department</h1>
                    <DepartmentForm />
                </div>
            </AppLayout>
        </>
    );
}
