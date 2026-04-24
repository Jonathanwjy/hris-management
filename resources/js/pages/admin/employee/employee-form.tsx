import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormProps } from '@/types/employee';
import { router, useForm } from '@inertiajs/react';
import { ImageIcon, UserIcon } from 'lucide-react';

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
            router.post(`/employee/${employee.id}`, { ...data, _method: 'put' }, { forceFormData: true });
        } else {
            router.post('/employee', data, { forceFormData: true });
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="border-border bg-card overflow-hidden rounded-xl border">
                <div className="border-border flex items-center gap-3 border-b px-6 py-5">
                    <div className="border-border bg-muted flex h-11 w-11 items-center justify-center rounded-full border">
                        <UserIcon className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-foreground text-base font-medium">{isEdit ? 'Update employee' : 'Add employee'}</h2>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="border-border border-b px-6 py-5">
                        <p className="text-muted-foreground mb-4 text-[11px] font-medium tracking-widest uppercase">Personal info</p>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                            <div className="col-span-2">
                                <Label htmlFor="full_name" className="text-muted-foreground text-xs font-medium">
                                    Full name
                                </Label>
                                <Input
                                    id="full_name"
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    className="bg-muted/50 mt-1.5"
                                />
                                <InputError message={errors.full_name} className="mt-1.5" />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-muted-foreground text-xs font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="bg-muted/50 mt-1.5"
                                />
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>

                            <div>
                                <Label htmlFor="phone_number" className="text-muted-foreground text-xs font-medium">
                                    Phone number
                                </Label>
                                <Input
                                    id="phone_number"
                                    type="text"
                                    placeholder="08xx-xxxx-xxxx"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    className="bg-muted/50 mt-1.5"
                                />
                                <InputError message={errors.phone_number} className="mt-1.5" />
                            </div>

                            <div className="col-span-2">
                                <Label className="text-muted-foreground text-xs font-medium">Profile photo</Label>
                                <label
                                    htmlFor="photo"
                                    className="border-border bg-muted/50 hover:border-foreground/30 mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 transition"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950">
                                        <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="text-foreground block text-sm font-medium">Click to upload photo</span>
                                        <span className="text-muted-foreground text-xs">JPG, PNG, WEBP — max 2MB</span>
                                    </div>
                                </label>
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData('photo', e.target.files[0]);
                                        }
                                    }}
                                />
                                <InputError message={errors.photo} className="mt-1.5" />
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="border-border border-b px-6 py-5">
                        <p className="text-muted-foreground mb-4 text-[11px] font-medium tracking-widest uppercase">Employment details</p>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                            <div>
                                <Label className="text-muted-foreground text-xs font-medium">Department</Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(value) => {
                                        setData('department_id', value);
                                        setData('role_id', '');
                                    }}
                                >
                                    <SelectTrigger className="bg-muted/50 mt-1.5">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Departments</SelectLabel>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={String(dept.id)}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.department_id} className="mt-1.5" />
                            </div>

                            <div>
                                <Label className="text-muted-foreground text-xs font-medium">Role</Label>
                                <Select value={data.role_id} onValueChange={(value) => setData('role_id', value)} disabled={!data.department_id}>
                                    <SelectTrigger className="bg-muted/50 mt-1.5">
                                        <SelectValue placeholder={data.department_id ? 'Select role' : 'Select department first'} />
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
                                <InputError message={errors.role_id} className="mt-1.5" />
                            </div>

                            <div>
                                <Label htmlFor="hire_date" className="text-muted-foreground text-xs font-medium">
                                    Hire date
                                </Label>
                                <Input
                                    id="hire_date"
                                    type="date"
                                    value={data.hire_date || ''}
                                    onChange={(e) => setData('hire_date', e.target.value)}
                                    className="bg-muted/50 mt-1.5"
                                />
                                <InputError message={errors.hire_date} className="mt-1.5" />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <span className="text-muted-foreground text-xs">Pastikan Data Sudah Benar</span>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : isEdit ? 'Update employee' : 'Add employee'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
