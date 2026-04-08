import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { PresenceFormProps } from '@/types/presence';
import { useForm } from '@inertiajs/react';

export default function PresenceOut({ presence }: PresenceFormProps) {
    const { data, setData, put, processing, errors } = useForm({
        status: presence?.status ?? 'pending',
        clock_out_time: presence?.clock_out_time ?? null,
        clock_out_latitude: presence?.clock_out_latitude ?? null,
        clock_out_longitude: presence?.clock_out_longitude ?? null,
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
                    clock_out_latitude: position.coords.latitude,
                    clock_out_longitude: position.coords.longitude,
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
                timeout: 1000,
                maximumAge: 0,
            },
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (presence?.id) {
            put(`/user/presence/${presence.id}`);
        } else {
            alert('Data absensi tidak ditemukan!');
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-2xl p-4">
                <h1 className="mb-6 text-2xl font-bold">Close Presence</h1>

                <form onSubmit={submit} className="h-auto rounded-lg border bg-white p-6 shadow-sm">
                    {/* Input Jam */}
                    <div className="mb-4">
                        <Label htmlFor="clock_out_time">Check Out Time</Label>
                        <Input
                            id="clock_out_time"
                            type="time"
                            placeholder="09:00"
                            value={data.clock_out_time ?? ''}
                            onChange={(e) => setData('clock_out_time', e.target.value)}
                            className="mt-1"
                        />
                        <InputError message={errors.clock_out_time} className="mt-2" />
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
                                <Label htmlFor="clock_out_latitude" className="text-xs">
                                    Clock out Latitude
                                </Label>
                                <Input
                                    id="clock_out_latitude"
                                    type="number"
                                    step="any"
                                    readOnly
                                    placeholder="Klik tombol lokasi..."
                                    value={data.clock_out_latitude ?? ''}
                                    className="mt-1 bg-slate-100"
                                />
                                {/* Error dari ValidationException Backend akan muncul di sini */}
                                <InputError message={errors.clock_out_latitude} className="mt-2" />
                            </div>

                            <div>
                                <Label htmlFor="clock_out_longitude" className="text-xs">
                                    Clock out Longitude
                                </Label>
                                <Input
                                    id="clock_out_longitude"
                                    type="number"
                                    step="any"
                                    readOnly
                                    placeholder="Klik tombol lokasi..."
                                    value={data.clock_out_longitude ?? ''}
                                    className="mt-1 bg-slate-100"
                                />
                                <InputError message={errors.clock_out_longitude} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full cursor-pointer" disabled={processing || !data.clock_out_longitude}>
                        {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
