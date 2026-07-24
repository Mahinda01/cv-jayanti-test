import Swal from 'sweetalert2';

const getTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');

    if (isDark) {
        return {
            background: '#1d293d',
            color: '#ffffff',
        };
    }

    return {
        background: '#ffffff',
        color: '#0f172a',
    };
};

const buttonColor = '#155dfc';
const dangerColor = '#dc2626';

const modalClass = {
    popup: 'rounded-2xl px-4 py-4 shadow-xl',
    title: 'text-base font-extrabold',
    htmlContainer: 'text-sm font-medium',
    confirmButton:
        'rounded-lg bg-[#155dfc] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700',
    cancelButton:
        'rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-[#314158] dark:text-white',
};

const dangerModalClass = {
    ...modalClass,
    confirmButton:
        'rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700',
};

export const showSuccess = (message = 'Data berhasil diproses.') => {
    return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        timer: 1700,
        showConfirmButton: false,
        timerProgressBar: true,
        width: '320px',
        ...getTheme(),
        customClass: {
            popup: 'rounded-xl px-3 py-2 shadow-lg',
            title: 'text-sm font-bold',
        },
    });
};

export const showError = (message = 'Terjadi kesalahan.') => {
    return Swal.fire({
        title: 'Gagal',
        text: message,
        width: '360px',
        padding: '16px',
        confirmButtonText: 'Tutup',
        buttonsStyling: false,
        confirmButtonColor: buttonColor,
        ...getTheme(),
        customClass: modalClass,
    });
};

export const confirmAction = async ({
    title = 'Apakah Anda yakin?',
    text = '',
    confirmButtonText = 'Ya',
    cancelButtonText = 'Batal',
    type = 'question',
} = {}) => {
    const isWarning = type === 'warning';

    const result = await Swal.fire({
        title,
        text,
        width: '360px',
        padding: '16px',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        focusConfirm: false,
        buttonsStyling: false,
        confirmButtonColor: isWarning ? dangerColor : buttonColor,
        ...getTheme(),
        customClass: isWarning ? dangerModalClass : modalClass,
    });

    return result.isConfirmed;
};

export const confirmStatus = async ({
    title = 'Ubah status data?',
    text = 'Status data akan diperbarui.',
    confirmButtonText = 'Ya, Ubah',
} = {}) => {
    return confirmAction({
        title,
        text,
        confirmButtonText,
        cancelButtonText: 'Batal',
        type: 'question',
    });
};

export const inputReason = async ({
    title = 'Masukkan alasan',
    inputPlaceholder = 'Tulis alasan di sini...',
    confirmButtonText = 'Lanjutkan',
} = {}) => {
    const result = await Swal.fire({
        title,
        input: 'text',
        inputPlaceholder,
        width: '320px',
        padding: '14px',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Batal',
        reverseButtons: true,
        focusConfirm: false,
        buttonsStyling: false,
        confirmButtonColor: dangerColor,
        inputAttributes: {
            maxlength: 255,
        },
        inputValidator: (value) => {
            if (!value || !value.trim()) {
                return 'Alasan wajib diisi.';
            }

            return null;
        },
        ...getTheme(),
        customClass: {
            popup: 'rounded-xl px-3 py-3 shadow-lg',
            title: 'text-sm font-extrabold',
            input: 'h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-[#155dfc] focus:ring-[#155dfc]/20 dark:border-[#475569] dark:bg-[#314158] dark:text-white',
            confirmButton:
                'rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700',
            cancelButton:
                'rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-[#314158] dark:text-white',
        },
    });

    if (!result.isConfirmed) {
        return null;
    }

    return result.value;
};

export const showInfo = ({
    title = 'Informasi',
    text = '',
    confirmButtonText = 'Tutup',
} = {}) => {
    return Swal.fire({
        title,
        text,
        width: '320px',
        padding: '14px',
        confirmButtonText,
        buttonsStyling: false,
        confirmButtonColor: buttonColor,
        ...getTheme(),
        customClass: {
            popup: 'rounded-xl px-3 py-3 shadow-lg',
            title: 'text-sm font-extrabold',
            htmlContainer: 'text-xs font-medium',
            confirmButton:
                'rounded-lg bg-[#155dfc] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700',
        },
    });
};