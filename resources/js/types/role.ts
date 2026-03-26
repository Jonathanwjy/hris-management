export interface Role {
    id: number;
    title: string;
    description: string;
    department_id: number;
    salary: number;
}

export interface Department {
    id: number;
    name: string;
}

export interface RoleFormProps {
    role?: Role;
    departments: Department[];
}
