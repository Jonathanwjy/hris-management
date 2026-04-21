import { PaginatedData } from './pagination';

type LeaveStatus = 'pending' | 'accepted' | 'declined';

export interface Leave {
    id: number;
    employee_id: number;
    reason: string;
    start_date: string;
    end_date: string;
    duration: number;
    status: LeaveStatus;
}

export interface Employee {
    id: number;
    full_name: string;
}

export interface LeaveWithEmployee extends Leave {
    employee: Employee;
}

export interface LeaveFormProps {
    leave?: Leave;
}

export type LeaveIndexProps = {
    leaveRequests: PaginatedData<LeaveWithEmployee>;

    isAdmin: boolean;
    remainingLeave: number;
    statusOptions: Record<string, string>;
    filters: {
        status?: string;
    };
};

export interface LeaveShowProps {
    leave: LeaveWithEmployee;
}
