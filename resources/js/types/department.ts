import { PaginatedData } from './pagination';

export type DepartmentStatus = 'active' | 'inactive';

export interface Department {
    id: number;
    name: string;
    description: string;
    status: DepartmentStatus;
}

export interface DepartmentFormProps {
    department?: Department;
}

export interface DepartmentProps {
    departments: PaginatedData<Department>;
}
