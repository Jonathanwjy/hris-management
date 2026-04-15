import { PaginatedData } from './pagination';

type RoleStatus = 'active' | 'inactive';

export interface Role {
    id: number;
    title: string;
    description: string;
    department_id: number;
    salary: number;
    status: RoleStatus;
}

export interface Department {
    id: number;
    name: string;
}

export interface RoleFormProps {
    role?: Role;
    departments: Department[];
}

export interface RoleWithRelation extends Role {
    department: Department;
}

export interface RoleProps {
    roles: PaginatedData<RoleWithRelation>;
    departments: Department[];
    filters: {
        department_id?: string;
    };
}
