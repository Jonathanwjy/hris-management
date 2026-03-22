import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

type DepartmentStatus = 'active' | 'inactive';

interface Department {
    id: number;
    name: string;
    description: string;
    status: DepartmentStatus;
}

interface DepartmentFormProps {
    department?: Department;
}

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
            put(`/department/update/${department.id}`);
        } else {
            post('/department/store');
        }
    };

    return (
        <>
            <form onSubmit={submit} className="h-auto max-w-xl">
                <div className="mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Department Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        placeholder="Department Description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? 'Saving...' : isEdit ? 'Update Department' : 'Create Department'}
                </Button>
            </form>
        </>
    );
}
