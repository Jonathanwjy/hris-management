import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaskFormProps } from '@/types/task';
import { useForm } from '@inertiajs/react';

export default function TaskForm({ task, employees }: TaskFormProps) {
    const isEdit = !!task;

    const { data, setData, post, put, processing, errors } = useForm({
        title: task?.title || '',
        description: task?.description || '',
        due_date: task?.due_date ? task.due_date.split('T')[0] : '',
        // Ubah menjadi array. Mapping semua employee_id dari task yang sudah ada (jika mode edit)
        employee_ids: task?.employee_tasks?.map((et) => et.employee_id) || [],
    });

    // Fungsi untuk menangani perubahan saat checkbox di-klik
    const handleEmployeeChange = (employeeId: number, isChecked: boolean) => {
        if (isChecked) {
            // Jika dicentang, tambahkan ID ke dalam array
            setData('employee_ids', [...data.employee_ids, employeeId]);
        } else {
            // Jika hapus centang, filter/buang ID dari array
            setData(
                'employee_ids',
                data.employee_ids.filter((id) => id !== employeeId),
            );
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(`/tasks/${task.id}`);
        } else {
            post('/tasks');
        }
    };

    return (
        <>
            <form onSubmit={submit} className="h-auto max-w-xl">
                {/* Title Input */}
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

                {/* Description Textarea */}
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

                {/* Due Date Input */}
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

                {/* Assign Multiple Employees (Checkboxes) */}
                <div className="mb-4">
                    <Label>Assign Employees</Label>
                    <div className="bg-background mt-2 grid grid-cols-2 gap-3 rounded-md border p-4">
                        {employees.map((employee) => (
                            <label key={employee.id} className="flex cursor-pointer items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={employee.id}
                                    // Cek apakah ID employee ada di dalam array employee_ids
                                    checked={data.employee_ids.includes(employee.id)}
                                    onChange={(e) => handleEmployeeChange(employee.id, e.target.checked)}
                                    className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-muted-foreground text-sm">{employee.full_name}</span>
                            </label>
                        ))}
                    </div>
                    {/* Error message menyesuaikan nama properti form */}
                    <InputError message={errors.employee_ids} className="mt-2" />
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
                </Button>
            </form>
        </>
    );
}
