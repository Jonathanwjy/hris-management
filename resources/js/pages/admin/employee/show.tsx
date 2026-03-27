import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { EmployeeWithRelation } from '@/types/employee';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

export default function EmployeeShow({ employee }: { employee: EmployeeWithRelation }) {
    const handleFired = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'menonaktifkan' : 'mengaktifkan';

        const isConfirmed = await showConfirm('Berhentikan pegawai ini?', `Apakah Anda yakin ingin ${actionText} pegawai ini?`, 'Ya, Berhentikan!');

        if (isConfirmed) {
            router.patch(
                `/employee/${id}/fire`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };
    return (
        <>
            <Head title="Employee Detail" />

            <AppLayout>
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Employee Detail</h1>

                        <div className="space-x-2">
                            <Link href="/employee" className="rounded bg-gray-200 px-4 py-2">
                                Back
                            </Link>

                            <Link href={`/employee/${employee.id}/edit`} className="rounded bg-blue-500 px-4 py-2 text-white">
                                Edit
                            </Link>
                            <Button
                                onClick={() => handleFired(employee.id, employee.status)}
                                className="cursor-pointer rounded-sm bg-red-500 px-3 py-1 text-xs font-semibold transition-colors"
                            >
                                Fire
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border p-6 shadow">
                        <div className="mb-6 flex items-center gap-6">
                            <div>
                                <img
                                    src={employee.photo ? `/storage/${employee.photo}` : `https://ui-avatars.com/api/?name=${employee.full_name}`}
                                    alt={employee.full_name}
                                    className="h-34 w-34 rounded-sm border object-cover"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">{employee.full_name}</h2>
                                <p className="text-sm text-gray-500">{employee.email}</p>

                                <span
                                    className={`mt-2 inline-block rounded px-3 py-1 text-xs font-medium ${
                                        employee.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : employee.status === 'inactive'
                                              ? 'bg-red-100 text-red-700'
                                              : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                >
                                    {employee.status}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-semibold">{employee.full_name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold">{employee.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-semibold">{employee.phone_number}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Hire Date</p>
                            <p className="font-semibold">{employee.hire_date}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-semibold">{employee.department?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="font-semibold">{employee.role?.title}</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
