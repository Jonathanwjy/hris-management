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
    leaveRequests: LeaveWithEmployee[];
    isAdmin: boolean;
};

export interface LeaveShowProps {
    leave: LeaveWithEmployee;
}
