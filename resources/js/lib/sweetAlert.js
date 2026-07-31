import Swal from 'sweetalert2';

const primaryColor = '#155dfc';
const dangerColor = '#dc2626';
const cancelColor = '#64748b';

const getTheme = () => {
    const isDarkMode =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark');

    return {
        background: isDarkMode ? '#1d293d' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#0f172a',
    };
};

export const showSuccess = (
    message = 'Data berhasil diproses.',
) => {
    return Swal.fire({
        ...getTheme(),
        icon: 'success',
        title: 'Berhasil',
        text: message,
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
    });
};

export const showError = (
    message = 'Terjadi kesalahan. Silakan coba kembali.',
) => {
    return Swal.fire({
        ...getTheme(),
        icon: 'error',
        title: 'Gagal',
        text: message,
        confirmButtonText: 'Tutup',
        confirmButtonColor: primaryColor,
    });
};

export const showInfo = (message = '') => {
    return Swal.fire({
        ...getTheme(),
        icon: 'info',
        title: 'Informasi',
        text: message,
        confirmButtonText: 'Tutup',
        confirmButtonColor: primaryColor,
    });
};

export const confirmAction = async ({
    title = 'Apakah Anda yakin?',
    text = '',
    confirmButtonText = 'Ya',
    cancelButtonText = 'Batal',
    icon,
    type,
    isDanger = false,
} = {}) => {
    const selectedIcon = icon || type || 'question';

    const result = await Swal.fire({
        ...getTheme(),
        icon: selectedIcon,
        title,
        text,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: isDanger
            ? dangerColor
            : primaryColor,
        cancelButtonColor: cancelColor,
        reverseButtons: true,
        focusCancel: true,
    });

    return result.isConfirmed;
};

export const confirmStatus = async ({
    title = 'Ubah status data?',
    text = 'Status data akan diperbarui.',
    confirmButtonText = 'Ya, Ubah',
    cancelButtonText = 'Batal',
} = {}) => {
    return confirmAction({
        title,
        text,
        confirmButtonText,
        cancelButtonText,
        icon: 'question',
        isDanger: false,
    });
};

export const inputReason = async ({
    title = 'Masukkan alasan',
    text = '',
    inputLabel = 'Alasan',
    inputPlaceholder = 'Tulis alasan di sini...',
    confirmButtonText = 'Lanjutkan',
    cancelButtonText = 'Batal',
    minimumLength = 3,
} = {}) => {
    const result = await Swal.fire({
        ...getTheme(),
        icon: 'warning',
        title,
        text,
        input: 'textarea',
        inputLabel,
        inputPlaceholder,
        inputAttributes: {
            maxlength: '1000',
        },
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: dangerColor,
        cancelButtonColor: cancelColor,
        reverseButtons: true,
        focusCancel: true,
        inputValidator: (value) => {
            const reason = value?.trim() || '';

            if (!reason) {
                return 'Alasan wajib diisi.';
            }

            if (reason.length < minimumLength) {
                return `Alasan minimal ${minimumLength} karakter.`;
            }

            return undefined;
        },
    });

    if (!result.isConfirmed) {
        return null;
    }

    return result.value?.trim() || null;
};

export {
    primaryColor,
    dangerColor,
    cancelColor,
};