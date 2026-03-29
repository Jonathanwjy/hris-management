import { usePage } from '@inertiajs/react';

export function useAuth() {
    const { props } = usePage();

    // Pastikan struktur props.auth sesuai dengan kiriman dari HandleInertiaRequests.php
    const user = props.auth.user;
    const isAdmin = props.auth.isAdmin;

    return {
        user,
        isAdmin,
        // Kamu bisa tambah helper lain di sini
        permissions: props.auth.permissions || [],
    };
}
