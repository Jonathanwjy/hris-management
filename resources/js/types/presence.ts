import { PaginatedData } from './pagination';

export type PresenceStatus = 'pending' | 'sakit' | 'hadir' | 'telat' | 'alpa';

export interface Presence {
    id: number;
    employee_id: number;
    date: string;
    status: PresenceStatus;
    desc: string | null;
    clock_in_latitude: number | null;
    clock_in_longitude: number | null;
    clock_out_latitude: number | null;
    clock_out_longitude: number | null;
    check_in_time: string | null;
    clock_out_time: string | null;
}

export interface Employee {
    id: number;
    full_name: string;
}

export interface PresenceWithRelation extends Presence {
    employee: Employee;
}

export interface PresenceFormProps {
    presence?: Presence;
    employees: Employee[];
}

export type PresenceProps = {
    presences: PaginatedData<PresenceWithRelation>;
    employees: Employee[];
    filters: {
        employee_id?: string;
        date?: string;
    };
    hadir: number;
    telat: number;
    izin: number;
    sakit: number;
    isAdmin: boolean;
};

export type PresenceDetailProps = {
    presence: PresenceWithRelation;
};
