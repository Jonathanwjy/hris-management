import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { EmployeeWithRelation } from '@/types/employee';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

export default function EmployeeShow({ employee }: { employee: EmployeeWithRelation }) {
    const handleFired = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'active' ? 'Berhentikan' : 'Aktifkan';

        const isConfirmed = await showConfirm(
            `${actionText} pegawai ini?`,
            `Apakah Anda yakin ingin ${actionText} pegawai ini?`,
            `Ya, ${actionText}!`,
        );

        if (isConfirmed) {
            router.patch(`/employee/${id}/fire`, {}, { preserveScroll: true });
        }
    };

    const statusConfig = {
        active: {
            label: 'Active',
            dot: 'bg-emerald-400',
            badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        },
        inactive: {
            label: 'Inactive',
            dot: 'bg-red-400',
            badge: 'bg-red-50 text-red-700 ring-1 ring-red-200',
        },
        default: {
            label: employee.status,
            dot: 'bg-amber-400',
            badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        },
    };

    const status = statusConfig[employee.status as keyof typeof statusConfig] ?? statusConfig.default;

    const fields = [
        { icon: UserIcon, label: 'Full Name', value: employee.full_name },
        { icon: EnvelopeIcon, label: 'Email', value: employee.email },
        { icon: PhoneIcon, label: 'Phone', value: employee.phone_number },
        { icon: CalendarIcon, label: 'Hire Date', value: employee.hire_date },
        { icon: BuildingIcon, label: 'Department', value: employee.department?.name },
        { icon: BriefcaseIcon, label: 'Role', value: employee.role?.title },
    ];

    return (
        <>
            <Head title="Employee Detail" />
            <AppLayout>
                <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="mt-1 text-2xl font-bold text-slate-800">Employee Profile</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/employee"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                Back
                            </Link>
                            <Link
                                href={`/employee/${employee.id}/edit`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <PencilIcon className="h-4 w-4" />
                                Edit
                            </Link>
                            <Button
                                onClick={() => handleFired(employee.id, employee.status)}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600"
                            >
                                <FireIcon className="h-4 w-4" />
                                Fire
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="h-28 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

                        <div className="relative px-8 pb-8">
                            <div className="-mt-14 mb-4 flex items-end justify-between">
                                <div className="relative">
                                    <img
                                        src={
                                            employee.photo
                                                ? `/storage/${employee.photo}`
                                                : `https://ui-avatars.com/api/?name=${employee.full_name}&size=112&background=1d4ed8&color=fff&bold=true`
                                        }
                                        alt={employee.full_name}
                                        className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg"
                                    />
                                    <span className={`absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white ${status.dot} shadow`} />
                                </div>

                                <span
                                    className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                    {status.label}
                                </span>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-900">{employee.full_name}</h2>
                                <p className="mt-0.5 text-sm text-slate-500">{employee.email}</p>
                            </div>

                            <div className="mb-6 border-t border-slate-100" />

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {fields.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-400">{label}</p>
                                            <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                                                {value ?? <span className="text-slate-400 italic">—</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

function ArrowLeftIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    );
}

function PencilIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.415.586H9v-2.414a2 2 0 01.586-1.414z"
            />
        </svg>
    );
}

function FireIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

function EnvelopeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    );
}

function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
        </svg>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );
}

function BuildingIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
        </svg>
    );
}

function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    );
}
