export type EmployeeStatus = 'active' | 'inactive' | 'leave';

export interface Employee {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    hire_date: string;
    department_id: number;
    role_id: number;
    status: EmployeeStatus;
}

export interface Department {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    title: string;
}

export interface EmployeeFormProps {
    employee?: Employee;
    roles: Role[];
    departments: Department[];
}

export interface EmployeeWithRelation extends Employee {
    department: Department;
    role: Role;
}
