import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import { RoleFormProps } from '@/types/role';
import { useForm } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';

export default function RoleForm({ role, departments }: RoleFormProps) {
    const isEdit = !!role;

    const { data, setData, post, put, processing, errors } = useForm({
        title: role?.title ?? '',
        description: role?.description ?? '',
        salary: role?.salary ?? 0,
        department_id: role?.department_id ? String(role.department_id) : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/role/${role.id}`);
        } else {
            post('/role');
        }
    };

    return (
        <div className="max-w-xl">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <Briefcase className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-base font-semibold">{isEdit ? 'Edit Role' : 'Buat Role Baru'}</h2>
                    <p className="text-muted-foreground text-sm">{isEdit ? 'Perbarui informasi role' : 'Isi informasi role'}</p>
                </div>
            </div>

            <form onSubmit={submit}>
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                    {/* Title + Salary row */}
                    <div className="mb-5 grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                Role
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Nama Role"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="salary" className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                Gaji (IDR)
                            </Label>
                            <div className="relative">
                                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">Rp</span>
                                <Input
                                    id="salary"
                                    type="number"
                                    placeholder="0"
                                    value={data.salary}
                                    onChange={(e) => setData('salary', Number(e.target.value))}
                                    className="pl-9"
                                />
                            </div>
                            <InputError message={errors.salary} />
                        </div>
                    </div>

                    {/* Department */}
                    <div className="mb-5 space-y-1.5">
                        <Label htmlFor="department" className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Departemen
                        </Label>
                        <Select value={data.department_id} onValueChange={(value) => setData('department_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Departemen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Departments</SelectLabel>
                                    {departments.map((department) => (
                                        <SelectItem key={department.id} value={String(department.id)}>
                                            {department.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.department_id} />
                    </div>

                    {/* Description */}
                    <div className="mb-6 space-y-1.5">
                        <Label htmlFor="description" className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Deskripsi
                        </Label>
                        <Input
                            id="description"
                            placeholder="Jelaskan tanggung jawab role ini..."
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
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Role'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
