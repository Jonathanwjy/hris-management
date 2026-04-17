import { PaginatedData } from './pagination';

export interface Payroll {
    id: number;
    employee_id: number;
    role_id: number;
    salary: number;
    bonuses: number;
    deduction: number;
    net_salary: number;
    pay_date: string;
}

export interface Employee {
    id: number;
    full_name: string;
    role?: Role;
}

export interface Role {
    id: number;
    title: string;
    salary: number;
}

export interface PayrollWithRelation extends Payroll {
    employee: Employee;
    role: Role;
}

export interface PayrollFormProps {
    payroll?: PayrollWithRelation;
    employees: Employee[];
}

export interface PayrollProps {
    payrolls: PaginatedData<PayrollWithRelation>;
    employees: Employee[];
    filters: {
        employee_id?: string;
        date?: string;
    };
    isAdmin: boolean;
}

export interface PayrollDetailProps {
    payroll: PayrollWithRelation;
}
