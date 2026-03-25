export type DepartmentStatus = 'active' | 'inactive';

export interface Department {
    id: number;
    name: string;
    description: string;
    status: DepartmentStatus;
}
