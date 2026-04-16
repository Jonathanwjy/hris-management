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
}

export interface Role {
    id: number;
    title: string;
}

export interface PayrollWithRelation extends Payroll {
    employee: Employee;
    role: Role;
}
