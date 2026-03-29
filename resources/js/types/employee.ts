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
    photo: string | null;
}

export interface Department {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    title: string;
    department_id: number;
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

export type EmployeeProps = {
    employees: EmployeeWithRelation[];
    departments: Department[];
    roles: Role[];
    filters: {
        department_id?: string;
        role_id?: string;
    };
};
