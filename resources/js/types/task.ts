export interface Employee {
    id: number;
    full_name: string;
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
    employee_tasks?: EmployeeTask[];
}

export interface TaskFormProps {
    task?: Task;
    employees: Employee[];
}
