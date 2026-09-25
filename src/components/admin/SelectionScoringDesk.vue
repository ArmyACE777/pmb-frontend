<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Seleksi Akademik, Nilai CBT & Wawancara
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Rekapitulasi skor ujian komputer, penilaian wawancara dosen penguji, dan penetapan SK Kelulusan.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="px-3 py-1 bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-full text-xs font-semibold font-sora">
          Nilai Ambang Batas Minimal: 70.0
        </span>
      </div>
    </div>

    <!-- Alert Toast Feedback -->
    <div
      v-if="toastMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-sm leading-none">&times;</button>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari peserta, No. Peserta, prodi..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-xl text-xs outline-none text-slate-800 transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs -mx-1 px-1">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="selectedFilter = filter.id"
          class="px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
          :class="selectedFilter === filter.id
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Selection Scoring Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-sora font-bold text-slate-900 text-sm">
          Daftar Penilaian Calon Mahasiswa TA 2026/2027
        </h3>
        <span class="text-xs text-slate-400">Total {{ filteredApplicants.length }} Peserta Ditampilkan</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[700px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-3.5 px-4 font-bold">No. Peserta</th>
              <th class="py-3.5 px-4 font-bold">Nama Lengkap & Prodi</th>
              <th class="py-3.5 px-4 font-bold text-center">Skor CBT</th>
              <th class="py-3.5 px-4 font-bold text-center">Rata-rata Rapor</th>
              <th class="py-3.5 px-4 font-bold text-center">Nilai Wawancara</th>
              <th class="py-3.5 px-4 font-bold">Status Keputusan</th>
              <th class="py-3.5 px-4 font-bold text-right">Aksi Penilaian</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="applicant in filteredApplicants"
              :key="applicant.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Reg -->
              <td class="py-3.5 px-4 font-mono font-bold text-[#1E3A8A]">
                {{ applicant.id }}
              </td>

              <!-- Name & Prodi -->
              <td class="py-3.5 px-4">
                <div class="font-sora font-bold text-slate-900">{{ applicant.fullName }}</div>
                <div class="text-[11px] text-slate-500">{{ applicant.prodi1 }}</div>
              </td>

              <!-- CBT Score -->
              <td class="py-3.5 px-4 text-center">
                <span class="font-sora font-bold text-base" :class="applicant.selection.cbtScore >= 70 ? 'text-[#1E3A8A]' : 'text-rose-600'">
                  {{ applicant.selection.cbtScore }}
                </span>
              </td>

              <!-- Rapor -->
              <td class="py-3.5 px-4 text-center font-mono font-medium text-slate-800">
                {{ applicant.averageScore }}
              </td>

              <!-- Interview Score -->
              <td class="py-3.5 px-4 text-center">
                <span v-if="applicant.selection.interviewScore" class="font-sora font-bold text-base text-slate-900">
                  {{ applicant.selection.interviewScore }}
                </span>
                <span v-else class="text-[11px] text-slate-400 italic">Belum Diuji</span>
              </td>

              <!-- Decision Status -->
              <td class="py-3.5 px-4">
                <span
                  v-if="applicant.selection.passedStatus === 'passed'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold font-sora"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lulus Seleksi</span>
                </span>
                <span
                  v-else-if="applicant.selection.passedStatus === 'failed'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-semibold font-sora"
                >
                  <span>Tidak Lulus</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-semibold font-sora"
                >
                  <span>Evaluasi Pleno</span>
                </span>
              </td>

              <!-- Action Button -->
              <td class="py-3.5 px-4 text-right">
                <button
                  @click="openInterviewModal(applicant)"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] font-sora font-semibold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Nilai Wawancara</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredApplicants.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400">
                <div class="max-w-xs mx-auto space-y-2">
                  <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Peserta Seleksi</div>
                  <p class="text-xs text-slate-400">Belum ada peserta yang mengikuti seleksi atau pengerjaan CBT.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Input / Edit Nilai Wawancara -->
    <div
      v-if="activeApplicant"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        <button
          @click="activeApplicant = null"
          class="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none cursor-pointer p-1"
        >
          &times;
        </button>

        <div class="pb-3 border-b border-slate-200 mb-4">
          <div class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Formulir Penilaian Wawancara Dosen PMB
          </div>
          <h3 class="font-sora font-bold text-base sm:text-lg text-slate-900 mt-0.5">
            {{ activeApplicant.fullName }}
          </h3>
          <div class="text-[11px] sm:text-xs text-slate-500 font-mono">
            No. Reg: {{ activeApplicant.id }} • {{ activeApplicant.prodi1 }}
          </div>
        </div>

        <form @submit.prevent="saveInterview" class="space-y-4 text-xs">
          <div>
            <label class="block font-medium text-slate-700 mb-1">Dosen Penguji / Pewawancara</label>
            <input
              v-model="formInterviewer"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">Skor Nilai Wawancara (0 - 100)</label>
            <input
              v-model="formScore"
              type="number"
              min="0"
              max="100"
              required
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-mono font-bold text-sm"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">Catatan Evaluasi / Komitmen Studi</label>
            <textarea
              v-model="formNotes"
              rows="3"
              class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800"
            ></textarea>
          </div>

          <!-- Formula Preview -->
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <div class="flex justify-between">
              <span>Skor Ujian CBT:</span>
              <strong class="text-slate-800 font-mono">{{ activeApplicant.selection.cbtScore }}</strong>
            </div>
            <div class="flex justify-between">
              <span>Simulasi Rata-rata Gabungan:</span>
              <strong class="text-[#1E3A8A] font-mono">
                {{ Math.round((Number(activeApplicant.selection.cbtScore) + Number(formScore || 0)) / 2) }}
              </strong>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="activeApplicant = null"
              class="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              class="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer text-center"
            >
              Simpan & Tetapkan Hasil
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const activeApplicant = ref(null);
const formScore = ref(85);
const formNotes = ref('');
const formInterviewer = ref('');
const toastMessage = ref('');
const searchQuery = ref('');
const selectedFilter = ref('all');

const filters = [
  { id: 'all', label: 'Semua Peserta' },
  { id: 'passed', label: 'Lulus Seleksi' },
  { id: 'evaluating', label: 'Evaluasi Pleno' },
  { id: 'failed', label: 'Tidak Lulus' },
];

const filteredApplicants = computed(() => {
  return adminStore.applicants.filter((applicant) => {
    // Status filter
    if (selectedFilter.value !== 'all') {
      if (applicant.selection?.passedStatus !== selectedFilter.value) return false;
    }
    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = (applicant.fullName || '').toLowerCase().includes(q);
      const matchId = (applicant.id || '').toLowerCase().includes(q);
      const matchProdi = (applicant.prodi1 || '').toLowerCase().includes(q);
      return matchName || matchId || matchProdi;
    }
    return true;
  });
});

const openInterviewModal = (applicant) => {
  activeApplicant.value = applicant;
  formScore.value = applicant.selection.interviewScore || 85;
  formNotes.value = applicant.selection.interviewNotes || '';
  formInterviewer.value = applicant.selection.interviewer || 'apt. Dedi Mulyadi, M.Farm.';
};

const saveInterview = () => {
  if (!activeApplicant.value) return;
  adminStore.updateInterview(
    activeApplicant.value.id,
    formScore.value,
    formNotes.value,
    formInterviewer.value
  );
  toastMessage.value = `Penilaian wawancara ${activeApplicant.value.fullName} berhasil disimpan dan status kelulusan diperbarui.`;
  activeApplicant.value = null;
};
</script>
