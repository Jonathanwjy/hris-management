import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormProps } from '@/types/employee';
import { router, useForm } from '@inertiajs/react';

export default function EmployeeForm({ employee, roles, departments }: EmployeeFormProps) {
    const isEdit = !!employee;

    const { data, setData, processing, errors } = useForm({
        full_name: employee?.full_name ?? '',
        email: employee?.email ?? '',
        phone_number: employee?.phone_number ?? '',
        hire_date: employee?.hire_date ? employee.hire_date.split('T')[0] : '',
        department_id: employee?.department_id ? String(employee.department_id) : '',
        role_id: employee?.role_id ? String(employee.role_id) : '',
        status: employee?.status ?? 'active',
        photo: null as File | null,
    });

    const filteredRoles = roles.filter((role) => String(role.department_id) === data.department_id);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            router.post(
                `/employee/${employee.id}`,
                {
                    ...data,
                    _method: 'put',
                },
                {
                    forceFormData: true,
                },
            );
        } else {
            router.post('/employee', data, {
                forceFormData: true,
            });
        }
    };

    return (
        <>
            <form onSubmit={submit} className="h-auto max-w-xl">
                <div className="mb-4">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                        id="fullname"
                        type="text"
                        placeholder="Abdi Kusuma"
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.full_name} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="adi@gmail.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                        id="phone_number"
                        type="text"
                        placeholder="08...."
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.phone_number} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="photo">Photo</Label>
                    <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setData('photo', e.target.files[0]);
                            }
                        }}
                        className="mt-1"
                    />
                    <InputError message={errors.photo} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="hire_date">Hire Date</Label>
                    <Input
                        id="hire_date"
                        type="date"
                        value={data.hire_date || ''}
                        onChange={(e) => setData('hire_date', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.hire_date} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="department">Department</Label>
                    <Select
                        value={data.department_id}
                        onValueChange={(value) => {
                            setData('department_id', value);
                            setData('role_id', '');
                        }}
                    >
                        <SelectTrigger className="text-muted-foreground">
                            <SelectValue placeholder="Pilih Department"></SelectValue>
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
                    <InputError message={errors.department_id} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="role">Role</Label>
                    <Select value={data.role_id} onValueChange={(value) => setData('role_id', value)} disabled={!data.department_id}>
                        <SelectTrigger className="text-muted-foreground">
                            <SelectValue placeholder="Pilih Role"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                {filteredRoles.map((role) => (
                                    <SelectItem key={role.id} value={String(role.id)}>
                                        {role.title}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.role_id} className="mt-2" />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
                </Button>
            </form>
        </>
    );
}
