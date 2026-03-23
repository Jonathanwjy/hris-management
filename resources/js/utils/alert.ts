// resources/js/utils/alert.ts
import Swal from 'sweetalert2';

// 1. Alert Sukses
export const showSuccess = (title: string, text?: string) => {
    return Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 2000,
    });
};

// 2. Alert Error/Gagal
export const showError = (title: string, text?: string) => {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonColor: '#ea580c',
    });
};

export const showConfirm = async (title: string, text: string, confirmText: string = 'Ya, konfirmasi') => {
    const result = await Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonColor: '#ea580c',
        cancelButtonColor: '#334155',
        confirmButtonText: confirmText,
        cancelButtonText: 'Batal',
        reverseButtons: true,
    });

    return result.isConfirmed;
};
