import AppLayout from '@/layouts/app-layout';
import DepartmentForm from './department-form';

export default function DepartmentCreate({ department }: { department: any }) {
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
