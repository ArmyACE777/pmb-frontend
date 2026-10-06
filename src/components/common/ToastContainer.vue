<template>
  <div
    class="fixed top-5 right-5 z-[99999] pointer-events-none flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-card group relative flex items-start gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200/95 shadow-md shadow-slate-900/4 text-slate-800 pointer-events-auto transition-all duration-200"
        :class="{
          'border-l-[3px] border-l-emerald-600': toast.type === 'success',
          'border-l-[3px] border-l-rose-600': toast.type === 'error',
          'border-l-[3px] border-l-amber-500': toast.type === 'warning',
          'border-l-[3px] border-l-slate-700': toast.type === 'info',
        }"
        role="alert"
      >
        <!-- Icon Minimalis: Tanpa background box, tanpa warna mencolok, tanpa animasi AI -->
        <div class="shrink-0 mt-0.5">
          <Check v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-600" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-4 h-4 text-rose-600" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="w-4 h-4 text-amber-600" />
          <Info v-else class="w-4 h-4 text-slate-600" />
        </div>

        <!-- Teks Pesan Bersih & Terstruktur -->
        <div class="flex-1 min-w-0 pr-1">
          <div
            v-if="toast.title && !isGenericTitle(toast.title)"
            class="text-xs font-semibold text-slate-900 font-sans leading-snug mb-0.5"
          >
            {{ toast.title }}
          </div>
          <div class="text-xs text-slate-700 leading-relaxed font-sans">
            {{ toast.message }}
          </div>
        </div>

        <!-- Tombol Tutup Sederhana (Subtle X) -->
        <button
          @click="dismiss(toast.id)"
          class="shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
          title="Tutup"
          aria-label="Tutup"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast';
import {
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-vue-next';

const { toasts, dismiss } = useToast();

const isGenericTitle = (title) => {
  if (!title) return true;
  const t = title.trim().toLowerCase();
  return [
    'berhasil',
    'sukses',
    'pemberitahuan',
    'informasi',
    'perhatian',
    'info',
    'success',
    'error',
    'warning',
  ].includes(t);
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}

.toast-move {
  transition: transform 0.2s ease;
}
</style>
