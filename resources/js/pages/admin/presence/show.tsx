import { PresenceWithRelation } from '@/types/presence';
import { Head } from '@inertiajs/react';

export default function Show({ presence }: { presence: PresenceWithRelation }) {
    return (
        <>
            <Head title="presence detail" />

            <div>
                <h1>Show Presence</h1>
            </div>
        </>
    );
}
