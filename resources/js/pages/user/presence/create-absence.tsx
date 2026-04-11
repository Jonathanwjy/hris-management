import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PresenceFormProps, PresenceStatus } from '@/types/presence';
import { useForm } from '@inertiajs/react';

export default function CreateAbsence({ presence }: PresenceFormProps) {
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const { data, setData, post, processing, errors } = useForm({
        employee_id: presence?.employee_id ? String(presence.employee_id) : '',
        date: getTodayDate(),
        status: presence?.status ?? 'pending',
        check_in_time: presence?.check_in_time ?? null,
        desc: presence?.desc ?? null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/user/presence');
    };

    return (
        <AppLayout>
            <div className="mx-auto w-full p-4 md:w-1/2">
                <h1 className="mb-6 text-2xl font-bold">Create Presence</h1>

                <form onSubmit={submit} className="h-auto rounded-lg border bg-white p-6 shadow-sm">
                    <div className="mb-4">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="mt-1" />
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
                            className="mt-1"
                        />
                        <InputError message={errors.check_in_time} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="Izin">Izin</Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value as PresenceStatus)}>
                            <SelectTrigger className="text-muted-foreground">
                                <SelectValue placeholder="Pilih Izin"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Izin</SelectLabel>
                                    <SelectItem value="sakit">Sakit</SelectItem>
                                    <SelectItem value="alpa">Izin</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="desc">Description</Label>
                        <Input
                            id="desc"
                            type="text"
                            placeholder="Deskripsi"
                            value={data.desc ?? ''}
                            onChange={(e) => setData('desc', e.target.value)}
                            className="mt-1"
                        />
                        <InputError message={errors.desc} className="mt-2" />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
