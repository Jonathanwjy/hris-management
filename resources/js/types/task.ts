import { PaginatedData } from './pagination';

export interface Employee {
    id: number;
    full_name: string;
}

export interface Department {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    title: string;
    deparment_id: number;
}

export interface EmployeeTask {
    id: number;
    task_id: number;
    employee_id: number;
    status: 'ongoing' | 'pending' | 'finished' | 'canceled';
    employee?: Employee;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    due_date: string;
    department_id: number;
    role_id: number;
    department?: Department;
    role?: Role;
    status: 'ongoing' | 'finished' | 'canceled';
    employee_tasks?: EmployeeTask[];
}

export interface TaskFormProps {
    task?: Task;
    departments: Department[];
    roles: Role[];
    employees: Employee[];
}

export type TaskIndexProps = {
    tasks: PaginatedData<Task>;
    isAdmin: boolean;
    statusOptions: Record<string, string>;
    filters: {
        status?: string;
    };
};

export interface ShowTaskProps {
    task: Task;
    isAdmin: boolean;
}
