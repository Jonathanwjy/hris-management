import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { PresenceFormProps } from '@/types/presence';
import { useForm } from '@inertiajs/react';
import React from 'react';

export default function CreatePresence({ presence }: PresenceFormProps) {
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
        clock_in_latitude: presence?.clock_in_latitude ?? null,
        clock_in_longitude: presence?.clock_in_longitude ?? null,
    });

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert('Browser Anda tidak mendukung fitur lokasi.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Langsung simpan ke state form
                setData((prevData) => ({
                    ...prevData,
                    clock_in_latitude: position.coords.latitude,
                    clock_in_longitude: position.coords.longitude,
                }));
                // Opsional: Beri tahu user bahwa lokasi berhasil didapat
                alert('Lokasi berhasil didapatkan. Silakan klik Simpan Absensi.');
            },
            (error) => {
                console.error('Error mengambil lokasi: ', error);
                alert('Gagal mendapatkan lokasi. Pastikan GPS menyala dan izin lokasi di browser telah diaktifkan.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/user/presence');
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-2xl p-4">
                <h1 className="mb-6 text-2xl font-bold">Create Presence</h1>

                <form onSubmit={submit} className="h-auto rounded-lg border bg-white p-6 shadow-sm">
                    {/* Input Tanggal */}
                    <div className="mb-4">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="mt-1" />
                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    {/* Input Jam */}
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

                    {/* Section Lokasi */}
                    <div className="mb-6 rounded-lg border bg-slate-50 p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium">Lokasi Absensi</h3>
                                <p className="text-muted-foreground text-xs">Izinkan akses lokasi untuk mengisi koordinat otomatis.</p>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={getLocation}>
                                📍 Ambil Lokasi Saat Ini
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="clock_in_latitude" className="text-xs">
                                    Clock In Latitude
                                </Label>
                                <Input
                                    id="clock_in_latitude"
                                    type="number"
                                    step="any"
                                    readOnly
                                    placeholder="Klik tombol lokasi..."
                                    value={data.clock_in_latitude ?? ''}
                                    className="mt-1 bg-slate-100"
                                />
                                {/* Error dari ValidationException Backend akan muncul di sini */}
                                <InputError message={errors.clock_in_latitude} className="mt-2" />
                            </div>

                            <div>
                                <Label htmlFor="clock_in_longitude" className="text-xs">
                                    Clock In Longitude
                                </Label>
                                <Input
                                    id="clock_in_longitude"
                                    type="number"
                                    step="any"
                                    readOnly
                                    placeholder="Klik tombol lokasi..."
                                    value={data.clock_in_longitude ?? ''}
                                    className="mt-1 bg-slate-100"
                                />
                                <InputError message={errors.clock_in_longitude} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full cursor-pointer" disabled={processing || !data.clock_in_latitude}>
                        {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
