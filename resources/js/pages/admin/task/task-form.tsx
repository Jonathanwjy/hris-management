import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee, TaskFormProps } from '@/types/task';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TaskForm({ task, departments, roles, employees }: TaskFormProps) {
    const isEdit = !!task;

    const [availableEmployees, setAvailableEmployees] = useState<Employee[]>(employees || []);

    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        title: task?.title || '',
        description: task?.description || '',
        due_date: task?.due_date ? task.due_date.split('T')[0] : '',
        department_id: task?.department_id ? String(task.department_id) : '',
        role_id: task?.role_id ? String(task.role_id) : '',
        employee_ids: task?.employee_tasks?.map((et) => et.employee_id) || [],
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            if (data.department_id && data.role_id) {
                setIsLoadingEmployees(true);
                try {
                    const response = await axios.get('/admin/task/filter-employees', {
                        params: {
                            department_id: data.department_id,
                            role_id: data.role_id,
                        },
                    });
                    setAvailableEmployees(response.data);
                } catch (error) {
                    console.error('Gagal mengambil data employee', error);
                } finally {
                    setIsLoadingEmployees(false);
                }
            } else {
                setAvailableEmployees([]);
            }
        };

        fetchEmployees();
    }, [data.department_id, data.role_id]);

    const handleDepartmentChange = (value: string) => {
        setData((prevData) => ({ ...prevData, department_id: value, employee_ids: [] }));
    };

    const handleRoleChange = (value: string) => {
        setData((prevData) => ({ ...prevData, role_id: value, employee_ids: [] }));
    };

    const handleEmployeeChange = (employeeId: number, isChecked: boolean) => {
        if (isChecked) {
            setData('employee_ids', [...data.employee_ids, employeeId]);
        } else {
            setData(
                'employee_ids',
                data.employee_ids.filter((id) => id !== employeeId),
            );
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting data:', data);
        if (isEdit) {
            put(`/admin/task/${task.id}`);
        } else {
            post('/admin/task');
        }
    };

    return (
        <form onSubmit={submit} className="h-auto max-w-xl">
            <div className="mb-4">
                <Label htmlFor="title">Title</Label>

                <Input
                    id="title"
                    type="text"
                    placeholder="Task Title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="text-muted-foreground mt-1"
                />

                <InputError message={errors.title} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="description">Description</Label>

                <textarea
                    id="description"
                    placeholder="Task description..."
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-muted-foreground mt-1 flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />

                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="due_date">Due Date</Label>

                <Input
                    id="due_date"
                    type="date"
                    value={data.due_date || ''}
                    onChange={(e) => setData('due_date', e.target.value)}
                    className="text-muted-foreground mt-1"
                />

                <InputError message={errors.due_date} className="mt-2" />
            </div>

            <div className="mb-5 space-y-1.5">
                <Label htmlFor="department" className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Departemen
                </Label>

                <Select value={data.department_id} onValueChange={handleDepartmentChange}>
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

            <div className="mb-5 space-y-1.5">
                <Label htmlFor="role" className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Role
                </Label>

                <Select value={data.role_id} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={String(role.id)}>
                                    {role.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <InputError message={errors.role_id} />
            </div>

            <div className="mb-4">
                <Label>Assign Employees</Label>

                {!data.department_id || !data.role_id ? (
                    <div className="text-muted-foreground bg-muted/50 mt-2 rounded-md border p-4 text-center text-sm">
                        Silakan pilih Departemen dan Role terlebih dahulu.
                    </div>
                ) : isLoadingEmployees ? (
                    <div className="text-muted-foreground mt-2 animate-pulse rounded-md border p-4 text-center text-sm">Mencari karyawan...</div>
                ) : availableEmployees.length === 0 ? (
                    <div className="text-muted-foreground bg-muted/50 mt-2 rounded-md border p-4 text-center text-sm">
                        Tidak ada karyawan dengan Departemen dan Role tersebut.
                    </div>
                ) : (
                    <div className="bg-background mt-2 grid grid-cols-2 gap-3 rounded-md border p-4">
                        {availableEmployees.map((employee) => (
                            <label key={employee.id} className="flex cursor-pointer items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={employee.id}
                                    checked={data.employee_ids.includes(employee.id)}
                                    onChange={(e) => handleEmployeeChange(employee.id, e.target.checked)}
                                    className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-muted-foreground text-sm">{employee.full_name}</span>
                            </label>
                        ))}
                    </div>
                )}
                <InputError message={errors.employee_ids} className="mt-2" />
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
            </Button>
        </form>
    );
}
