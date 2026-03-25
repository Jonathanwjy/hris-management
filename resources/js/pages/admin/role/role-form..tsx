import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Role } from '@/types/role';
import { useForm } from '@inertiajs/react';

interface RoleFormProps {
    role?: Role;
}

export default function RoleForm({ role }: RoleFormProps) {
    const isEdit = !!role;

    const { data, setData, post, put, processing, errors } = useForm({
        title: role?.title ?? '',
        description: role?.description ?? '',
        salary: role?.salary ?? 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(`/role/update/${role.id}`);
        } else {
            post('/role/store');
        }
    };

    return (
        <>
            <form onSubmit={submit} className="h-auto max-w-xl">
                <div className="mb-4">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        type="text"
                        placeholder="role title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        placeholder="role description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                        id="salary"
                        type="number"
                        placeholder="role salary"
                        value={data.salary}
                        onChange={(e) => setData('salary', Number(e.target.value))}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.salary} className="mt-2" />
                </div>

                <Button type="submit">{processing ? 'Saving...' : isEdit ? 'Update Role' : 'Create Role'}</Button>
            </form>
        </>
    );
}
