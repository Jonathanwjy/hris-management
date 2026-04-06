import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { PresenceFormProps } from '@/types/presence';
import { router, useForm } from '@inertiajs/react';

export default function CreatePresence({ presence }: PresenceFormProps) {
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Ditambah 1 karena bulan dimulai dari 0
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const { data, setData, processing, errors } = useForm({
        employee_id: presence?.employee_id ? String(presence.employee_id) : '',
        date: getTodayDate(),
       
        status: presence?.status ?? 'pending',
        check_in_time: presence?.check_in_time ?? null,
        clock_in_latitude: presence?.clock_in_latitude ?? null,
        clock_in_longitude: presence?.clock_in_longitude ?? null,
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
            <div className="p-4">
                <form onSubmit={submit} className="h-auto max-w-xl">
                    <div className="mb-4">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="text-muted-foreground mt-1"
                        />
                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="check_in_time">Check In Time</Label>
                        <Input
                            id="check_in_time"
                            type="time"
                            placeholder="09:00"
                            value={data.check_in_time ?? ''}
                            onChange={(e) => setData('check_in_time', e.target.value)}
                            className="text-muted-foreground mt-1"
                        />
                        <InputError message={errors.check_in_time} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="clock_in_latitude">Clock In Latitude</Label>
                        <Input
                            id="clock_in_latitude"
                            type="number"
                            step="any"
                            placeholder="-2.9..."
                            value={data.clock_in_latitude ?? ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setData('clock_in_latitude', val === '' ? null : parseFloat(val));
                            }}
                            className="text-muted-foreground mt-1"
                        />
                        <InputError message={errors.clock_in_latitude} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="clock_in_longitude">Clock In Longitude</Label>
                        <Input
                            id="clock_in_longitude"
                            type="number"
                            step="any"
                            placeholder="106.8..."
                            value={data.clock_in_longitude ?? ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setData('clock_in_longitude', val === '' ? null : parseFloat(val));
                            }}
                            className="text-muted-foreground mt-1"
                        />
                        <InputError message={errors.clock_in_longitude} className="mt-2" />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? 'Saving...' : 'Add Employee'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
