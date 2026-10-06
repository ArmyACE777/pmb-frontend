<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Penerbitan NIM & Registrasi Mahasiswa Baru
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Penetapan Nomor Induk Mahasiswa resmi, pembagian gugus PKKMB 2026, dan aktivasi akun SIAKAD.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="text-xs text-slate-500 font-sans">
          Format: [Tahun][Kode Prodi][No. Urut]
        </span>
      </div>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari mahasiswa, No. Registrasi, NIM..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none text-slate-800 transition-colors"
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
          class="px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
          :class="selectedFilter === filter.id
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Mobile Card View (< md) -->
    <div class="block md:hidden space-y-3">
      <div
        v-if="currentRole === 'superadmin' && filteredApplicants.some(a => a.payments.uktFee.status === 'paid' && !a.onboarding.nim)"
        class="pb-1"
      >
        <button
          @click="generateAllEligible"
          class="w-full py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
        >
          Generate Batch Semua yang Lunas
        </button>
      </div>

      <div
        v-for="applicant in filteredApplicants"
        :key="'mobile-' + applicant.id"
        class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="font-mono font-bold text-xs text-[#1E3A8A]">{{ applicant.id }}</div>
            <div class="font-sora font-bold text-slate-900 text-sm mt-0.5">{{ applicant.fullName }}</div>
            <div class="text-[11px] text-slate-500">{{ applicant.prodi1 }}</div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded border"
              :class="applicant.payments.uktFee.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'"
            >
              UKT: {{ applicant.payments.uktFee.status === 'paid' ? 'Lunas' : 'Belum' }}
            </span>
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded border"
              :class="applicant.selection.passedStatus === 'passed' ? 'bg-blue-50 text-[#1E3A8A] border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'"
            >
              {{ applicant.selection.passedStatus === 'passed' ? 'Lulus Seleksi' : 'Evaluasi' }}
            </span>
          </div>
        </div>

        <!-- Detail NIM & Gugus PKKMB (2 Kolom Ringkas) -->
        <div class="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-xs">
          <div class="border-r border-slate-200 pr-2">
            <div class="text-[10px] text-slate-400 font-medium">NIM Terbit</div>
            <div v-if="applicant.onboarding.nim" class="font-mono font-bold text-slate-900 mt-0.5">
              {{ applicant.onboarding.nim }}
            </div>
            <div v-else class="text-[11px] text-slate-400 italic mt-0.5">Belum Terbit</div>
          </div>
          <div class="pl-1">
            <div class="text-[10px] text-slate-400 font-medium">Gugus PKKMB</div>
            <div v-if="applicant.onboarding.pkkmbGroup" class="font-medium text-slate-800 mt-0.5">
              {{ applicant.onboarding.pkkmbGroup }}
            </div>
            <div v-else class="text-[11px] text-slate-400 italic mt-0.5">Belum Diplot</div>
          </div>
        </div>

        <button
          v-if="!applicant.onboarding.nim"
          @click="openEnrolModal(applicant)"
          class="w-full py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
        >
          Tetapkan NIM & Gugus
        </button>
        <button
          v-else
          @click="openEnrolModal(applicant)"
          class="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
        >
          Edit Data NIM / Gugus
        </button>
      </div>

      <div v-if="filteredApplicants.length === 0" class="py-10 text-center text-slate-400 bg-white rounded-xl border border-slate-200 p-6">
        <p class="text-xs">Belum ada mahasiswa yang sesuai kriteria.</p>
      </div>
    </div>

    <!-- Desktop Enrolment Table (>= md) -->
    <div class="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 class="font-sora font-bold text-slate-900 text-sm">
          Daftar Calon Mahasiswa Siap Penerbitan NIM (Lulus & Lunas UKT)
        </h3>
        <button
          v-if="currentRole === 'superadmin'"
          @click="generateAllEligible"
          class="self-start sm:self-auto px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
        >
          Generate Batch Semua yang Lunas
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[880px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider whitespace-nowrap">
            <tr>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[130px]">No. Registrasi</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[200px]">Nama Mahasiswa & Prodi</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[120px]">Status Seleksi</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[110px]">Status UKT</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[130px]">NIM Diterbitkan</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[140px]">Gugus PKKMB 2026</th>
              <th class="py-3.5 px-4 font-bold text-right whitespace-nowrap min-w-[120px]">Aksi Penetapan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="applicant in filteredApplicants"
              :key="applicant.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Reg -->
              <td class="py-3.5 px-4 font-mono font-bold text-[#1E3A8A] whitespace-nowrap">
                {{ applicant.id }}
              </td>

              <!-- Name & Prodi -->
              <td class="py-3.5 px-4 min-w-[200px]">
                <div class="font-sora font-bold text-slate-900 whitespace-nowrap">{{ applicant.fullName }}</div>
                <div class="text-[11px] text-slate-500 whitespace-nowrap">{{ applicant.prodi1 }}</div>
              </td>

              <!-- Selection -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  class="text-xs font-medium whitespace-nowrap"
                  :class="applicant.selection.passedStatus === 'passed' ? 'text-emerald-700' : 'text-slate-600'"
                >
                  {{ applicant.selection.passedStatus === 'passed' ? 'Lulus Seleksi' : 'Dalam Evaluasi' }}
                </span>
              </td>

              <!-- UKT Status -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  class="text-xs font-medium whitespace-nowrap"
                  :class="applicant.payments.uktFee.status === 'paid' ? 'text-emerald-700' : 'text-slate-500'"
                >
                  {{ applicant.payments.uktFee.status === 'paid' ? 'Lunas' : 'Belum Lunas' }}
                </span>
              </td>

              <!-- NIM -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span v-if="applicant.onboarding.nim" class="font-mono font-semibold text-xs text-slate-900 whitespace-nowrap">
                  {{ applicant.onboarding.nim }}
                </span>
                <span v-else class="text-xs text-slate-400 italic whitespace-nowrap">Belum Ada</span>
              </td>

              <!-- PKKMB Group -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span v-if="applicant.onboarding.pkkmbGroup" class="text-xs text-slate-800 font-medium whitespace-nowrap">
                  {{ applicant.onboarding.pkkmbGroup }}
                </span>
                <span v-else class="text-xs text-slate-400 italic whitespace-nowrap">Belum Diplot</span>
              </td>

              <!-- Action -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <button
                  v-if="!applicant.onboarding.nim"
                  @click="openEnrolModal(applicant)"
                  class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                >
                  Tetapkan NIM
                </button>
                <button
                  v-else
                  @click="openEnrolModal(applicant)"
                  class="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                >
                  Edit Data
                </button>
              </td>
            </tr>
            <tr v-if="filteredApplicants.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400">
                <div class="max-w-xs mx-auto space-y-2">
                  <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Mahasiswa Terdaftar</div>
                  <p class="text-xs text-slate-400">Belum ada calon mahasiswa yang melunasi UKT atau diterbitkan NIM.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Generate NIM & Gugus -->
    <Teleport to="body">
      <div
        v-if="activeApplicant"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
        @click.self="activeApplicant = null"
      >
        <div class="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 relative my-auto">
        <button
          @click="activeApplicant = null"
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-xl font-bold leading-none cursor-pointer"
        >
          &times;
        </button>

        <div class="pb-3 border-b border-slate-200 mb-4">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Penetapan Nomor Induk Mahasiswa (NIM)
          </div>
          <h3 class="font-sora font-bold text-lg text-slate-900 mt-0.5">
            {{ activeApplicant.fullName }}
          </h3>
          <div class="text-xs text-slate-500">
            {{ activeApplicant.prodi1 }} | TA 2026/2027
          </div>
        </div>

        <form @submit.prevent="saveNim" class="space-y-4 text-xs">
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nomor Induk Mahasiswa (NIM)</label>
            <input
              v-model="formNim"
              type="text"
              maxlength="10"
              required
              class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-lg outline-none text-slate-900 font-mono font-bold text-base"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              Standar BTH: 26 (Angkatan 2026) + Kode Fakultas/Prodi + No Urut.
            </p>
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">Kelompok Gugus Orientasi (PKKMB 2026)</label>
            <select
              v-model="formGroup"
              class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-lg outline-none text-slate-800"
            >
              <option value="Gugus 01 - Hygeia Farmasi">Gugus 01 - Hygeia Farmasi</option>
              <option value="Gugus 02 - Galen Kefarmasian">Gugus 02 - Galen Kefarmasian</option>
              <option value="Gugus 03 - Hygeia Farmasi">Gugus 03 - Hygeia Farmasi</option>
              <option value="Gugus 05 - Asklepios Kesehatan">Gugus 05 - Asklepios Kesehatan</option>
              <option value="Gugus 07 - Turing Informatika">Gugus 07 - Turing Informatika</option>
              <option value="Gugus 08 - Lovelace Komputer">Gugus 08 - Lovelace Komputer</option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="activeApplicant = null"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              Simpan & Terbitkan NIM
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useToast } from '@/composables/useToast';
import { PRODI_METADATA } from '@/stores/applicant';

const props = defineProps({
  currentRole: {
    type: String,
    default: 'superadmin',
  },
});

const adminStore = useAdminStore();
const toast = useToast();
const activeApplicant = ref(null);
const formNim = ref('');
const formGroup = ref('Gugus 01 - Hygeia Farmasi');
const searchQuery = ref('');
const selectedFilter = ref('all');

const filters = [
  { id: 'all', label: 'Semua Mahasiswa' },
  { id: 'enrolled', label: 'Sudah Ada NIM' },
  { id: 'eligible', label: 'Siap Terbit NIM' },
  { id: 'unpaid', label: 'Menunggu UKT' },
];

const filteredApplicants = computed(() => {
  return adminStore.applicants.filter((applicant) => {
    // Status filter
    if (selectedFilter.value === 'enrolled') {
      if (!applicant.onboarding?.nim) return false;
    } else if (selectedFilter.value === 'eligible') {
      if (applicant.selection?.passedStatus !== 'passed' || applicant.payments?.uktFee?.status !== 'paid' || applicant.onboarding?.nim) {
        return false;
      }
    } else if (selectedFilter.value === 'unpaid') {
      if (applicant.payments?.uktFee?.status === 'paid') return false;
    }

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = (applicant.fullName || '').toLowerCase().includes(q);
      const matchId = (applicant.id || '').toLowerCase().includes(q);
      const matchNim = (applicant.onboarding?.nim || '').toLowerCase().includes(q);
      const matchProdi = (applicant.prodi1 || '').toLowerCase().includes(q);
      return matchName || matchId || matchNim || matchProdi;
    }
    return true;
  });
});

const openEnrolModal = (applicant) => {
  activeApplicant.value = applicant;
  const meta = PRODI_METADATA[applicant.prodi1] || { code: '01', gugus: 'Gugus 01 - Hygeia Farmasi' };
  const regSuffix = (applicant.id || '').split('-').pop() || String(Math.floor(Math.random() * 80 + 10));
  formNim.value = applicant.onboarding?.nim || `26${meta.code}${regSuffix.slice(-4)}`;
  formGroup.value = applicant.onboarding?.pkkmbGroup || meta.gugus;
};

const saveNim = () => {
  if (!activeApplicant.value) return;
  adminStore.generateNim(activeApplicant.value.id, formNim.value, formGroup.value);
  toast.success(`Nomor Induk Mahasiswa (${formNim.value}) berhasil diterbitkan untuk ${activeApplicant.value.fullName}.`);
  activeApplicant.value = null;
};

const generateAllEligible = () => {
  let count = 0;
  adminStore.applicants.forEach((a, idx) => {
    if (a.selection?.passedStatus === 'passed' && !a.onboarding?.nim) {
      const meta = PRODI_METADATA[a.prodi1] || { code: '01', gugus: 'Gugus 01 - Hygeia Farmasi' };
      const num = `26${meta.code}00${String(idx + 1).padStart(2, '0')}`;
      adminStore.generateNim(a.id, num, meta.gugus);
      count++;
    }
  });
  toast.success(`Penerbitan NIM untuk ${count} calon mahasiswa berhasil diproses.`);
};
</script>
