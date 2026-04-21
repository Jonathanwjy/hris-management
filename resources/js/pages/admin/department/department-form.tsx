import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DepartmentFormProps } from '@/types/department';
import { useForm } from '@inertiajs/react';
import { Building2 } from 'lucide-react';

export default function DepartmentForm({ department }: DepartmentFormProps) {
    const isEdit = !!department;

    const { data, setData, post, put, processing, errors } = useForm({
        name: department?.name ?? '',
        description: department?.description ?? '',
        status: department?.status ?? 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/department/${department.id}`);
        } else {
            post('/department');
        }
    };

    return (
        <div className="w-3/8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <Building2 className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-base font-semibold">{isEdit ? 'Edit Department' : 'Buat Department Baru'}</h2>
                    <p className="text-muted-foreground text-sm">{isEdit ? 'Perbarui informasi departemen' : 'Isi informasi departemen'}</p>
                </div>
            </div>

            <form onSubmit={submit}>
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    {/* Name */}
                    <div className="mb-5 space-y-1.5">
                        <Label htmlFor="name" className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Nama Departemen
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nama Department"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Description */}
                    <div className="mb-6 space-y-1.5">
                        <Label htmlFor="description" className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Deskripsi
                        </Label>
                        <Input
                            id="description"
                            placeholder="Jelaskan tanggung jawab departemen ini..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="resize-none"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button type="button" variant="ghost" onClick={() => window.history.back()} className="cursor-pointer">
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="cursor-pointer">
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Department'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
