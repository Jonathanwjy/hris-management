import AppLayout from '@/layouts/app-layout';
import { PresenceFormProps } from '@/types/presence';
import { router } from '@inertiajs/react';
import useForm from 'node_modules/@inertiajs/react/types/useForm';

export default function CreatePresence({ presence, employees }: PresenceFormProps) {
    const { data, setData, processing, errors } = useForm({
        employee_id: presence?.employee_id ? String(presence.employee_id) : '',
        date: presence?.date ? presence.date.split('T')[0] : '',
        status: presence?.status ?? 'pending',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/presence', data);
    };

    return (
        <AppLayout>
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Create Presence</h1>
            </div>
        </AppLayout>
    );
}
