import AppLayout from '@/layouts/app-layout';
import { PayrollFormProps } from '@/types/payroll';
import PayrollForm from './payroll-form';

export default function CreatePayroll({ payroll, employees }: PayrollFormProps) {
    return (
        <AppLayout>
            <div className="space-y-6 p-8">
                <h1 className="text-2xl font-semibold">Create Payroll</h1>
                <PayrollForm payroll={payroll} employees={employees} />
            </div>
        </AppLayout>
    );
}
