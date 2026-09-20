<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Jalur Pendaftaran & Pilihan Program Studi
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Tentukan program studi prioritas utama dan alternatif pada Tahun Akademik 2026/2027.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1E3A8A] border border-blue-200/80 rounded-full text-xs font-semibold font-sora">
          <span class="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
          {{ applicantStore.state.admission.track }}
        </span>
      </div>
    </div>

    <!-- Alert Sukses Simpan -->
    <div
      v-if="savedMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ savedMessage }}</span>
      </div>
      <button @click="savedMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-sm leading-none">&times;</button>
    </div>

    <!-- Status Gelombang & Kuota Banner -->
    <div class="bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] text-white rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="text-[11px] font-semibold text-amber-300 uppercase tracking-wider font-sora">
            Informasi Gelombang Aktif
          </div>
          <h3 class="text-lg sm:text-xl font-sora font-extrabold mt-1 text-white">
            Gelombang 1 - TA 2026/2027
          </h3>
          <p class="text-xs text-blue-100/90 mt-1 max-w-xl leading-relaxed">
            Periode pendaftaran reguler dibuka hingga 15 Oktober 2026. Peserta berhak mengikuti seleksi CBT Online dan wawancara peminatan.
          </p>
        </div>

        <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 rounded-xl flex-shrink-0">
          <div>
            <div class="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Sisa Kuota Gel. 1</div>
            <div class="font-sora font-extrabold text-xl text-amber-300">
              {{ applicantStore.state.admission.quotaWave1 }} <span class="text-xs font-normal text-white">Kursi</span>
            </div>
          </div>
          <div class="w-px h-8 bg-white/20"></div>
          <div>
            <div class="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Status Seleksi</div>
            <div class="font-sora font-semibold text-xs text-emerald-300">
              {{ applicantStore.state.admission.status }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Pilihan Program Studi -->
    <form @submit.prevent="saveAdmission" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Pilihan 1 (Prioritas Utama) -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-sora font-bold text-xs">
                  1
                </span>
                <span class="font-sora font-bold text-sm text-slate-800">Pilihan Prioritas Utama</span>
              </div>
              <span class="text-[11px] font-semibold text-[#1E3A8A] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                Pilihan Ke-1
              </span>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block font-medium text-slate-700 mb-1.5">Pilih Program Studi</label>
                <select
                  v-model="form.prodi1"
                  @change="handleProdi1Change"
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans font-medium"
                >
                  <option v-for="item in prodiList" :key="item.name" :value="item.name">
                    {{ item.name }} ({{ item.faculty }})
                  </option>
                </select>
              </div>

              <!-- Info Card Detail Prodi 1 -->
              <div class="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-500">Fakultas:</span>
                  <span class="font-semibold text-slate-800">{{ currentProdi1Details?.faculty }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-500">Gelar Kelulusan:</span>
                  <span class="font-mono font-bold text-[#1E3A8A]">{{ currentProdi1Details?.degree }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-500">Akreditasi BAN-PT / LAM-PTKes:</span>
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    {{ currentProdi1Details?.accreditation }}
                  </span>
                </div>
                <div class="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200">
                  <span class="text-slate-500">Estimasi UKT Per Semester:</span>
                  <span class="font-sora font-bold text-slate-900">{{ currentProdi1Details?.uktEstimate }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Prioritas pertama akan diproses saat penilaian kelulusan CBT.</span>
          </div>
        </div>

        <!-- Pilihan 2 (Alternatif Cadangan) -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-sora font-bold text-xs">
                  2
                </span>
                <span class="font-sora font-bold text-sm text-slate-800">Pilihan Alternatif / Cadangan</span>
              </div>
              <span class="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                Pilihan Ke-2
              </span>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block font-medium text-slate-700 mb-1.5">Pilih Program Studi Cadangan</label>
                <select
                  v-model="form.prodi2"
                  @change="handleProdi2Change"
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans font-medium"
                >
                  <option v-for="item in prodiList" :key="item.name" :value="item.name" :disabled="item.name === form.prodi1">
                    {{ item.name }} ({{ item.faculty }})
                  </option>
                </select>
              </div>

              <!-- Info Card Detail Prodi 2 -->
              <div class="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-500">Fakultas:</span>
                  <span class="font-semibold text-slate-800">{{ currentProdi2Details?.faculty }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-500">Gelar Kelulusan:</span>
                  <span class="font-mono font-bold text-[#1E3A8A]">{{ currentProdi2Details?.degree }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-500">Akreditasi BAN-PT / LAM-PTKes:</span>
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    {{ currentProdi2Details?.accreditation }}
                  </span>
                </div>
                <div class="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200">
                  <span class="text-slate-500">Estimasi UKT Per Semester:</span>
                  <span class="font-sora font-bold text-slate-900">{{ currentProdi2Details?.uktEstimate }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Dipertimbangkan otomatis jika kuota pilihan utama telah terpenuhi.</span>
          </div>
        </div>
      </div>

      <!-- Syarat Khusus Program Studi Kesehatan & Sains -->
      <div class="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-xs">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="space-y-1.5">
            <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm">
              Ketentuan Khusus Program Studi Kesehatan
            </h4>
            <p class="text-slate-700 leading-relaxed">
              Program studi <strong>S1 Farmasi, D3 Farmasi, dan D3 Analis Kesehatan</strong> mewajibkan calon mahasiswa tidak buta warna (parsial maupun total). Surat hasil pemeriksaan kesehatan wajib dilampirkan pada menu Berkas Persyaratan.
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div class="text-xs text-slate-500 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Pilihan dapat diperbarui selama masa pendaftaran Gelombang 1 masih berlangsung.</span>
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="w-full sm:w-auto px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Pilihan Program Studi' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApplicantStore } from '@/stores/applicant';

const applicantStore = useApplicantStore();

const prodiList = [
  {
    name: 'S1 Farmasi',
    faculty: 'Fakultas Farmasi',
    degree: 'S.Farm.',
    accreditation: 'Unggul',
    uktEstimate: 'Rp 6.500.000 / semester',
  },
  {
    name: 'S1 Teknologi Informasi',
    faculty: 'Fakultas Teknologi & Bisnis',
    degree: 'S.Kom.',
    accreditation: 'Baik Sekali',
    uktEstimate: 'Rp 4.500.000 / semester',
  },
  {
    name: 'S1 Manajemen Bisnis Informasi',
    faculty: 'Fakultas Teknologi & Bisnis',
    degree: 'S.M.',
    accreditation: 'Baik',
    uktEstimate: 'Rp 4.250.000 / semester',
  },
  {
    name: 'D3 Farmasi',
    faculty: 'Fakultas Farmasi',
    degree: 'A.Md.Farm.',
    accreditation: 'Unggul',
    uktEstimate: 'Rp 4.800.000 / semester',
  },
  {
    name: 'D3 Analis Kesehatan (TLM)',
    faculty: 'Fakultas Ilmu Kesehatan',
    degree: 'A.Md.Kes.',
    accreditation: 'Baik Sekali',
    uktEstimate: 'Rp 4.750.000 / semester',
  },
  {
    name: 'S1 Administrasi Rumah Sakit',
    faculty: 'Fakultas Ilmu Kesehatan',
    degree: 'S.Kes.',
    accreditation: 'Baik Sekali',
    uktEstimate: 'Rp 4.500.000 / semester',
  },
];

const form = ref({
  prodi1: applicantStore.state.admission.prodi1,
  prodi2: applicantStore.state.admission.prodi2,
});

const currentProdi1Details = computed(() => {
  return prodiList.find((p) => p.name === form.value.prodi1) || prodiList[0];
});

const currentProdi2Details = computed(() => {
  return prodiList.find((p) => p.name === form.value.prodi2) || prodiList[1];
});

const handleProdi1Change = () => {
  const p = currentProdi1Details.value;
  applicantStore.state.admission.prodi1Faculty = p.faculty;
  applicantStore.state.admission.prodi1Degree = p.degree;
};

const handleProdi2Change = () => {
  const p = currentProdi2Details.value;
  applicantStore.state.admission.prodi2Faculty = p.faculty;
  applicantStore.state.admission.prodi2Degree = p.degree;
};

const isSaving = ref(false);
const savedMessage = ref('');

const saveAdmission = () => {
  isSaving.value = true;
  setTimeout(() => {
    applicantStore.updateAdmission({
      prodi1: form.value.prodi1,
      prodi1Faculty: currentProdi1Details.value.faculty,
      prodi1Degree: currentProdi1Details.value.degree,
      prodi2: form.value.prodi2,
      prodi2Faculty: currentProdi2Details.value.faculty,
      prodi2Degree: currentProdi2Details.value.degree,
    });
    isSaving.value = false;
    savedMessage.value = 'Pilihan program studi berhasil diperbarui dan tersimpan di database sistem.';
  }, 350);
};
</script>
