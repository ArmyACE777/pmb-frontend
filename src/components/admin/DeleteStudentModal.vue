<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans animate-fade-in"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-200 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <!-- Modal Header / Banner -->
        <div class="p-5 sm:p-6 bg-gradient-to-br from-rose-50 to-rose-100/50 border-b border-rose-100 flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Trash2 class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 id="modal-headline" class="font-sora font-bold text-slate-900 text-base sm:text-lg leading-snug">
              Hapus Akun Mahasiswa
            </h3>
            <p class="text-xs text-rose-800 font-medium mt-0.5 leading-relaxed">
              Konfirmasi penghapusan data dan akun mahasiswa secara permanen.
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-rose-200/50 transition-colors cursor-pointer"
            title="Tutup dialog"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-5 sm:p-6 space-y-4">
          <!-- Identitas Mahasiswa Terpilih -->
          <div v-if="student" class="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
            <div class="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-2">
              <div class="min-w-0">
                <div class="font-sora font-bold text-slate-900 text-sm truncate">
                  {{ student.fullName || student.name || 'Calon Mahasiswa' }}
                </div>
                <div class="font-mono text-[11px] text-[#1E3A8A] font-semibold mt-0.5">
                  {{ student.id || student.registrationNo || '-' }}
                </div>
              </div>
              <span
                v-if="student.onboarding?.nim"
                class="font-mono font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded shadow-2xs whitespace-nowrap"
              >
                NIM: {{ student.onboarding.nim }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
              <div>
                <span class="text-slate-400 block text-[10px]">Alamat Email</span>
                <span class="font-medium text-slate-700 truncate block">{{ student.email || '-' }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Nomor NIK</span>
                <span class="font-mono font-medium text-slate-700 block">{{ student.nik || '-' }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-slate-400 block text-[10px]">Program Studi Pilihan</span>
                <span class="font-medium text-slate-800 block truncate">{{ student.prodi1 || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Alert Peringatan Konsekuensi -->
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p class="leading-relaxed">
              Tindakan ini <strong>tidak dapat dibatalkan</strong>. Seluruh data biodata pendaftaran, berkas dokumen ijazah/KTP, riwayat pembayaran, seleksi CBT, dan nomor registrasi akan dihapus permanen dari sistem.
            </p>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            @click="closeModal"
            :disabled="isDeleting"
            class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-sora font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            @click="handleConfirmDelete"
            :disabled="isDeleting"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs hover:shadow flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isDeleting" class="w-3.5 h-3.5 animate-spin" />
            <Trash2 v-else class="w-3.5 h-3.5" />
            <span>{{ isDeleting ? 'Menghapus Akun...' : 'Ya, Hapus Akun Mahasiswa' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-vue-next';
import { useAdminStore } from '@/stores/admin';
import { useToast } from '@/composables/useToast';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  student: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'deleted']);

const adminStore = useAdminStore();
const toast = useToast();
const isDeleting = ref(false);

const closeModal = () => {
  if (isDeleting.value) return;
  emit('update:modelValue', false);
};

const handleConfirmDelete = async () => {
  if (!props.student) return;

  isDeleting.value = true;
  try {
    const studentName = props.student.fullName || props.student.name || 'Mahasiswa';
    const res = await adminStore.deleteApplicant(props.student);
    if (res.success) {
      toast.success(`Akun mahasiswa "${studentName}" berhasil dihapus dari sistem.`);
      emit('deleted', props.student);
      closeModal();
    } else {
      toast.error(res.message || 'Gagal menghapus akun mahasiswa.');
    }
  } catch (err) {
    toast.error(err?.message || 'Terjadi kesalahan saat menghapus akun mahasiswa.');
  } finally {
    isDeleting.value = false;
  }
};
</script>
