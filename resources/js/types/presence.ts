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

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export type PresenceProps = {
    presences: PaginatedData<PresenceWithRelation>;
    employees: Employee[];
    filters: {
        employee_id?: string;
        date?: string;
    };
    isAdmin: boolean;
};

export type PresenceDetailProps = {
    presence: PresenceWithRelation;
};
