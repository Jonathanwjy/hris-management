import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

Chart.register(...registerables);

interface Department {
    name: string;
    count: number;
}

interface Analytics {
    tasks: {
        total: number;
        ongoing: number;
        finished: number;
        canceled: number;
    };
    presences: {
        present_today: number;
    };
    leave_requests: {
        pending: number;
    };
    employees: {
        // ← sebelumnya "employee", diubah jadi "employees"
        total: number;
        by_department: Department[];
    };
}

interface Props {
    analytics?: Analytics;
}

const defaultAnalytics: Analytics = {
    tasks: { total: 0, ongoing: 0, finished: 0, canceled: 0 },
    presences: { present_today: 0 },
    leave_requests: { pending: 0 },
    employees: { total: 0, by_department: [] }, // ← sama di sini
};

export default function Dashboard({ analytics }: Props) {
    const data: Analytics = analytics ?? defaultAnalytics;

    const taskChartRef = useRef<HTMLCanvasElement>(null);
    const deptChartRef = useRef<HTMLCanvasElement>(null);
    const taskChartInstance = useRef<Chart | null>(null);
    const deptChartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (taskChartInstance.current) taskChartInstance.current.destroy();
        if (deptChartInstance.current) deptChartInstance.current.destroy();

        if (taskChartRef.current) {
            taskChartInstance.current = new Chart(taskChartRef.current, {
                type: 'doughnut',
                data: {
                    labels: ['Ongoing', 'Finished', 'Canceled'],
                    datasets: [
                        {
                            data: [data.tasks.ongoing, data.tasks.finished, data.tasks.canceled],
                            backgroundColor: ['#378ADD', '#639922', '#E24B4A'],
                            borderWidth: 0,
                            hoverOffset: 4,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    cutout: '65%',
                },
            });
        }

        if (deptChartRef.current) {
            deptChartInstance.current = new Chart(deptChartRef.current, {
                type: 'bar',
                data: {
                    labels: data.employees.by_department.map((d) => d.name), // ← employees
                    datasets: [
                        {
                            label: 'Karyawan',
                            data: data.employees.by_department.map((d) => d.count), // ← employees
                            backgroundColor: '#AFA9EC',
                            borderRadius: 6,
                            borderSkipped: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                        y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { stepSize: 1 } },
                    },
                },
            });
        }

        return () => {
            taskChartInstance.current?.destroy();
            deptChartInstance.current?.destroy();
        };
    }, [data]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 p-6">
                <Head title="Dashboard Analytics" />

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                </div>

                {/* Grid Metrik Utama */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
                >
                    <motion.div
                        variants={itemVariants}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <h3 className="mb-1 text-sm font-semibold text-gray-500">Total Tasks</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-bold text-gray-800">{data.tasks.total}</span>
                            <span className="rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-500">{data.tasks.ongoing} Ongoing</span>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <h3 className="mb-1 text-sm font-semibold text-gray-500">Hadir Hari Ini</h3>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-green-600">{data.presences.present_today}</span>
                            <span className="mb-1 text-sm text-gray-400">/ {data.employees.total} Staff</span> {/* ← employees */}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <h3 className="mb-1 text-sm font-semibold text-gray-500">Pending Leave Requests</h3>
                        <div className="text-4xl font-bold text-orange-500">{data.leave_requests.pending}</div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <h3 className="mb-1 text-sm font-semibold text-gray-500">Total Employees</h3>
                        <div className="text-4xl font-bold text-indigo-600">{data.employees.total}</div> {/* ← employees */}
                    </motion.div>
                </motion.div>

                {/* Grid Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
                >
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-2 text-lg font-bold text-gray-800">Task Status</h3>
                        <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />
                                Ongoing ({data.tasks.ongoing})
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-600" />
                                Finished ({data.tasks.finished})
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500" />
                                Canceled ({data.tasks.canceled})
                            </span>
                        </div>
                        <div className="relative h-52">
                            <canvas ref={taskChartRef} role="img" aria-label="Donut chart status task" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Employee per Department</h3>
                        <div className="relative h-52">
                            {data.employees.by_department.length > 0 ? ( // ← employees
                                <canvas ref={deptChartRef} role="img" aria-label="Bar chart karyawan per departemen" />
                            ) : (
                                <p className="text-center text-sm text-gray-400 italic">Belum ada data departemen</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Grid Detail Teks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-2"
                >
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Task Status Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50">
                                <span className="font-medium text-gray-600">Ongoing</span>
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">{data.tasks.ongoing}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50">
                                <span className="font-medium text-gray-600">Finished</span>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">{data.tasks.finished}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50">
                                <span className="font-medium text-gray-600">Canceled</span>
                                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">{data.tasks.canceled}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Employee per Department</h3>
                        <div className="space-y-4">
                            {data.employees.by_department.length > 0 ? ( // ← employees
                                data.employees.by_department.map((dept, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50">
                                        <span className="font-medium text-gray-600">{dept.name}</span>
                                        <span className="font-bold text-gray-800">{dept.count}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-400 italic">Belum ada data departemen</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
