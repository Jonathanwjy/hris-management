import AppLayout from '@/layouts/app-layout';
import { PresenceFormProps } from '@/types/presence';

export default function CreateAbsence({ presence }: PresenceFormProps) {
    return (
        <AppLayout>
            <div className="mx-auto max-w-2xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Buat Pengajuan Absensi</h1>
                <p className="text-gray-600">Fitur ini sedang dalam pengembangan. Harap tunggu pembaruan selanjutnya.</p>
            </div>
        </AppLayout>
    );
}
