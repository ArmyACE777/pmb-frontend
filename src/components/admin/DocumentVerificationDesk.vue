<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Meja Verifikasi & Validasi Berkas Pendaftar
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Periksa keabsahan pindaian ijazah, identitas kependudukan, pas foto, dan surat keterangan sehat.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold font-sora">
          {{ pendingCount }} Berkas Membutuhkan Tindakan
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
    <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan nama, No. Registrasi, atau NIK..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-xl text-xs outline-none text-slate-800 transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="selectedFilter = filter.id"
          class="px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer"
          :class="selectedFilter === filter.id
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Applicants Document Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-3.5 px-4 font-bold">No. Registrasi / NIK</th>
              <th class="py-3.5 px-4 font-bold">Nama Lengkap & Asal Sekolah</th>
              <th class="py-3.5 px-4 font-bold">Program Studi Pilihan</th>
              <th class="py-3.5 px-4 font-bold text-center">Kelengkapan</th>
              <th class="py-3.5 px-4 font-bold">Status Berkas</th>
              <th class="py-3.5 px-4 font-bold text-right">Aksi Panitia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="applicant in filteredApplicants"
              :key="applicant.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Reg & NIK -->
              <td class="py-3.5 px-4">
                <div class="font-mono font-bold text-[#1E3A8A]">{{ applicant.id }}</div>
                <div class="font-mono text-[11px] text-slate-400">NIK: {{ applicant.nik }}</div>
              </td>

              <!-- Name & School -->
              <td class="py-3.5 px-4">
                <div class="font-sora font-bold text-slate-900">{{ applicant.fullName }}</div>
                <div class="text-[11px] text-slate-500">{{ applicant.schoolName }}</div>
              </td>

              <!-- Program Studi -->
              <td class="py-3.5 px-4">
                <div class="font-medium text-slate-800">{{ applicant.prodi1 }}</div>
                <div class="text-[10px] text-slate-400">Pilihan 2: {{ applicant.prodi2 }}</div>
              </td>

              <!-- Documents Count -->
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold"
                      :class="applicant.pendingDocsCount === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                  {{ applicant.verifiedDocsCount }}/{{ applicant.documents.length }} Sah
                </span>
              </td>

              <!-- Status Pill -->
              <td class="py-3.5 px-4">
                <span
                  v-if="applicant.documentStatus === 'verified'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Terverifikasi</span>
                </span>
                <span
                  v-else-if="applicant.documentStatus === 'revision'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>Perlu Perbaikan</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Menunggu Verifikasi</span>
                </span>
              </td>

              <!-- Action Button -->
              <td class="py-3.5 px-4 text-right">
                <button
                  @click="openVerifyModal(applicant)"
                  class="px-3.5 py-1.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] font-sora font-semibold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Periksa Berkas</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Review & Verifikasi Berkas Detail -->
    <div
      v-if="activeApplicant"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          @click="activeApplicant = null"
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none cursor-pointer"
        >
          &times;
        </button>

        <!-- Candidate Header Info -->
        <div class="pb-4 border-b border-slate-200">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Lembar Verifikasi Berkas Calon Mahasiswa
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 mt-1">
            <h3 class="font-sora font-extrabold text-xl text-slate-900">
              {{ activeApplicant.fullName }}
            </h3>
            <span class="font-mono text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              {{ activeApplicant.id }}
            </span>
          </div>
          <div class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Pilihan Prodi: <strong class="text-slate-800">{{ activeApplicant.prodi1 }}</strong></span>
            <span>•</span>
            <span>Asal Sekolah: {{ activeApplicant.schoolName }}</span>
            <span>•</span>
            <span>NIK: <span class="font-mono">{{ activeApplicant.nik }}</span></span>
          </div>
        </div>

        <!-- Document Checklist Review List -->
        <div class="py-5 space-y-4">
          <div
            v-for="doc in activeApplicant.documents"
            :key="doc.id"
            class="p-4 rounded-2xl border transition-all space-y-3"
            :class="{
              'bg-emerald-50/50 border-emerald-200': doc.status === 'verified',
              'bg-rose-50/50 border-rose-200': doc.status === 'revision',
              'bg-slate-50 border-slate-200/80': doc.status === 'pending'
            }"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div class="font-sora font-bold text-xs sm:text-sm text-slate-900">
                  {{ doc.title }}
                </div>
                <div class="text-[11px] text-slate-500 font-mono mt-0.5">
                  File: {{ doc.filename }}
                </div>
              </div>

              <!-- Status Tag -->
              <div>
                <span
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  :class="{
                    'bg-emerald-100 text-emerald-800': doc.status === 'verified',
                    'bg-rose-100 text-rose-800': doc.status === 'revision',
                    'bg-amber-100 text-amber-800': doc.status === 'pending'
                  }"
                >
                  {{ doc.status === 'verified' ? 'Disetujui' : doc.status === 'revision' ? 'Perlu Perbaikan' : 'Menunggu' }}
                </span>
              </div>
            </div>

            <!-- Notes from Committee -->
            <div class="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
              <span class="font-semibold text-slate-700">Catatan Panitia:</span> {{ doc.notes }}
            </div>

            <!-- Action Buttons for this document -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <button
                @click="setDocStatus(doc.id, 'verified', 'Dokumen terverifikasi sah dan sesuai standar BTH.')"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Setujui</span>
              </button>

              <button
                @click="promptRevision(doc.id)"
                class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Minta Perbaikan</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Master Actions -->
        <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            @click="approveAllDocs"
            class="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Setujui Seluruh Berkas Peserta Ini</span>
          </button>

          <button
            @click="activeApplicant = null"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup Lembar Kerja
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const searchQuery = ref('');
const selectedFilter = ref('all');
const activeApplicant = ref(null);
const toastMessage = ref('');

const filters = [
  { id: 'all', label: 'Semua Status' },
  { id: 'pending', label: 'Menunggu Verifikasi' },
  { id: 'verified', label: 'Terverifikasi' },
  { id: 'revision', label: 'Perlu Perbaikan' },
];

const pendingCount = computed(() => {
  return adminStore.applicants.filter((a) => a.documentStatus === 'pending' || a.documentStatus === 'revision').length;
});

const filteredApplicants = computed(() => {
  return adminStore.applicants.filter((applicant) => {
    // Filter status
    if (selectedFilter.value !== 'all' && applicant.documentStatus !== selectedFilter.value) {
      return false;
    }
    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = applicant.fullName.toLowerCase().includes(q);
      const matchId = applicant.id.toLowerCase().includes(q);
      const matchNik = applicant.nik.includes(q);
      return matchName || matchId || matchNik;
    }
    return true;
  });
});

const openVerifyModal = (applicant) => {
  activeApplicant.value = applicant;
};

const setDocStatus = (docId, status, notes) => {
  if (!activeApplicant.value) return;
  adminStore.verifyDocument(activeApplicant.value.id, docId, status, notes);
  toastMessage.value = `Status dokumen berhasil diubah menjadi "${status === 'verified' ? 'Disetujui' : 'Perlu Perbaikan'}".`;
};

const promptRevision = (docId) => {
  const note = prompt('Masukkan catatan perbaikan untuk calon mahasiswa:', 'Pindaian dokumen kurang jelas / buram. Mohon unggah ulang dengan resolusi lebih baik.');
  if (note !== null) {
    setDocStatus(docId, 'revision', note || 'Mohon unggah ulang berkas.');
  }
};

const approveAllDocs = () => {
  if (!activeApplicant.value) return;
  activeApplicant.value.documents.forEach((doc) => {
    adminStore.verifyDocument(activeApplicant.value.id, doc.id, 'verified', 'Dokumen terverifikasi sah dan disetujui panitia.');
  });
  toastMessage.value = `Seluruh dokumen ${activeApplicant.value.fullName} berhasil diverifikasi sah.`;
};
</script>
