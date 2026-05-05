import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { TaskIndexProps } from '@/types/task';
import { showConfirm } from '@/utils/alert';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/task',
    },
];

export default function index({ tasks, isAdmin, statusOptions, filters }: TaskIndexProps) {
    const TaskData = tasks?.data || [];
    const taskLinks = tasks?.links || [];

    const handleFilterChange = (value: string) => {
        router.get('/admin/task', { status: value === 'all' ? null : value }, { preserveState: true, replace: true });
    };

    const handleFinish = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'ongoing' ? 'selesai' : 'batal';
        const isConfirmed = await showConfirm('Selesaikan Task ini?', `Apakah Anda yakin ingin ${actionText} task ini?`, 'Ya, Selesaikan!');
        if (isConfirmed) {
            router.patch(`/admin/task/${id}/finish-task`, {}, { preserveScroll: true });
        }
    };

    const handleCancel = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === 'ongoing' ? 'Batalkan' : 'batal';
        const isConfirmed = await showConfirm('Batalkan task?', `Apakah Anda yakin ingin ${actionText} task ini?`, 'Ya, Batalkan!');
        if (isConfirmed) {
            router.patch(`/admin/task/${id}/cancel-task`, {}, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Tasks" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Tasks</h1>
                        <div className="flex gap-12">
                            {isAdmin && (
                                <Select value={filters.status || 'all'} onValueChange={handleFilterChange}>
                                    <SelectTrigger className="w-[200px] cursor-pointer">
                                        <SelectValue placeholder="Filter Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all" className="cursor-pointer">
                                            Semua Status
                                        </SelectItem>
                                        {Object.entries(statusOptions).map(([value, label]) => (
                                            <SelectItem key={value} value={value} className="cursor-pointer">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {isAdmin && (
                                <Button asChild>
                                    <Link href="/admin/task/create">Add Task</Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border">
                        <Table className="w-full table-fixed">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead className="w-60">Tugas</TableHead>
                                    <TableHead className="w-auto">Deskripsi</TableHead>
                                    <TableHead className="w-28">Tenggat</TableHead>
                                    <TableHead className="w-28">Status</TableHead>
                                    <TableHead className="w-52">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {TaskData.length > 0 ? (
                                    TaskData.map((task, index) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="w-12">{index + 1}</TableCell>

                                            <TableCell className="w-60">
                                                <span className="block truncate font-medium" title={task.title}>
                                                    {task.title}
                                                </span>
                                            </TableCell>

                                            <TableCell className="w-auto">
                                                <p
                                                    className="text-muted-foreground text-sm"
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}
                                                    title={task.description}
                                                >
                                                    {task.description}
                                                </p>
                                            </TableCell>

                                            <TableCell className="w-28 whitespace-nowrap">{task.due_date}</TableCell>

                                            <TableCell className="w-28">
                                                <span
                                                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                                                        task.status === 'finished'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : task.status === 'canceled'
                                                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                              : 'bg-blue-700 text-white dark:bg-blue-600'
                                                    }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </TableCell>

                                            <TableCell className="w-52">
                                                <div className="flex flex-wrap gap-1.5">
                                                    <Button size="sm" asChild>
                                                        <Link href={route(isAdmin ? 'task.show' : 'task.user.show', { task: task.id })}>Detail</Link>
                                                    </Button>

                                                    {!isAdmin && (
                                                        <Button size="sm" variant="secondary" asChild>
                                                            <Link href={`/admin/task/${task.id}/edit`}>Mark As Done</Link>
                                                        </Button>
                                                    )}

                                                    {isAdmin && (
                                                        <Button size="sm" asChild>
                                                            <Link href={`/admin/task/${task.id}/edit`}>Edit</Link>
                                                        </Button>
                                                    )}

                                                    {isAdmin && task.status === 'ongoing' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleCancel(task.id, task.status)}
                                                            className="cursor-pointer"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}

                                                    {isAdmin && task.status === 'ongoing' && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => handleFinish(task.id, task.status)}
                                                            className="cursor-pointer"
                                                        >
                                                            Finish
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            Belum ada Task
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {taskLinks.length > 3 && (
                        <Pagination className="justify-end">
                            <PaginationContent>
                                {taskLinks.map((link, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === taskLinks.length - 1;

                                    if (isFirst) {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationPrevious
                                                    href={link.url || '#'}
                                                    className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        );
                                    }

                                    if (isLast) {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationNext
                                                    href={link.url || '#'}
                                                    className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        );
                                    }

                                    if (link.label === '...') {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }

                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationLink href={link.url || '#'} isActive={link.active}>
                                                {link.label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
