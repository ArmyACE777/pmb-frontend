import { ref } from 'vue';

const toasts = ref([]);
let nextId = 1;

/**
 * Universal Toast Notification System
 * Menyediakan notifikasi mengambang (floating toast popup) yang bersih, elegan, dan profesional.
 */
export function useToast() {
  const show = ({
    type = 'success', // 'success' | 'error' | 'warning' | 'info'
    title = '',
    message = '',
    duration = 4500,
  }) => {
    const id = nextId++;

    // Bersihkan karakter simbol seperti ✓, tanda seru ganda, atau prefix 'Sukses:'
    let cleanMessage = String(message || '').trim();
    cleanMessage = cleanMessage.replace(/^[✓✔]\s*/, '');
    cleanMessage = cleanMessage.replace(/^Sukses:\s*/i, '');

    // Judul otomatis berbasis tipe jika tidak ditentukan
    let cleanTitle = title;
    if (!cleanTitle) {
      switch (type) {
        case 'success':
          cleanTitle = 'Berhasil';
          break;
        case 'error':
          cleanTitle = 'Pemberitahuan';
          break;
        case 'warning':
          cleanTitle = 'Perhatian';
          break;
        case 'info':
        default:
          cleanTitle = 'Informasi';
          break;
      }
    }

    const toastItem = {
      id,
      type,
      title: cleanTitle,
      message: cleanMessage,
      duration,
      createdAt: Date.now(),
    };

    toasts.value.push(toastItem);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  };

  const success = (message, title = 'Berhasil', duration = 4500) => {
    return show({ type: 'success', title, message, duration });
  };

  const error = (message, title = 'Pemberitahuan', duration = 5000) => {
    return show({ type: 'error', title, message, duration });
  };

  const warning = (message, title = 'Perhatian', duration = 4500) => {
    return show({ type: 'warning', title, message, duration });
  };

  const info = (message, title = 'Informasi', duration = 4000) => {
    return show({ type: 'info', title, message, duration });
  };

  const dismiss = (id) => {
    const idx = toasts.value.findIndex((t) => t.id === id);
    if (idx !== -1) {
      toasts.value.splice(idx, 1);
    }
  };

  const clearAll = () => {
    toasts.value = [];
  };

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    clearAll,
  };
}
