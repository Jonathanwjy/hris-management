import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LeaveFormProps } from '@/types/leave';
import { useForm } from '@inertiajs/react';

export default function LeaveForm({ leave }: LeaveFormProps) {
    const isEdit = !!leave;

    const { data, setData, post, put, processing, errors } = useForm({
        reason: leave?.reason ?? '',
        start_date: leave?.start_date ? leave.start_date.split('T')[0] : '',
        end_date: leave?.end_date ? leave.end_date.split('T')[0] : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(`/leave/${leave.id}`);
        } else {
            post('/user/leave');
        }
    };

    return (
        <>
            <form onSubmit={submit} className="h-auto max-w-xl">
                <div className="mb-4">
                    <Label htmlFor="reason">Reason</Label>
                    <Input
                        id="reason"
                        type="text"
                        placeholder="Reason"
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.reason} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                        id="start_date"
                        type="date"
                        value={data.start_date || ''}
                        onChange={(e) => setData('start_date', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.start_date} className="mt-2" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                        id="end_date"
                        type="date"
                        value={data.end_date || ''}
                        onChange={(e) => setData('end_date', e.target.value)}
                        className="text-muted-foreground mt-1"
                    />
                    <InputError message={errors.end_date} className="mt-2" />
                </div>

                <Button type="submit">{processing ? 'Saving...' : isEdit ? 'Update Leave' : 'Request Leave'}</Button>
            </form>
        </>
    );
}
