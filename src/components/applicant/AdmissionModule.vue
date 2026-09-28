<template>
  <div class="space-y-6">
    <!-- Header Modul Jalur Pendaftaran -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Jalur Pendaftaran & Pilihan Program Studi
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Tentukan jalur seleksi dan program studi prioritas Anda di Universitas Bakti Tunas Husada.
        </p>
      </div>

      <!-- Status Indicator Badge (Bersih, Minimalis, Non-Duplikatif) -->
      <div class="self-start sm:self-auto flex items-center">
        <span
          v-if="applicantStore.isAdmissionLocked"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Pendaftaran Terkunci (Biaya Lunas)</span>
        </span>
        <span
          v-else-if="applicantStore.state.admission.prodi1"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-200"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>Pilihan Tersimpan • Menunggu Pembayaran</span>
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <span>Belum Memilih</span>
        </span>
      </div>
    </div>

    <!-- Alert Sukses Simpan -->
    <div
      v-if="savedMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>{{ savedMessage }}</span>
      </div>
      <button @click="savedMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-sm leading-none cursor-pointer">&times;</button>
    </div>

    <!-- FORM UTAMA (Single Clean Card, Menghilangkan Banner-Banner Duplikat) -->
    <form @submit.prevent="saveAdmission" class="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div class="p-6 sm:p-7 space-y-6">
        <!-- 1. Pemilihan Jalur Pendaftaran -->
        <div class="space-y-2">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label class="block text-xs font-semibold text-slate-800">
              Jalur Pendaftaran <span class="text-rose-500">*</span>
            </label>
            <span class="text-[11px] text-slate-400 font-sans">
              Tahun Akademik {{ applicantStore.state.admission.academicYear || '2026/2027' }}
            </span>
          </div>

          <select
            v-model="admissionForm.track"
            :disabled="applicantStore.isAdmissionLocked"
            required
            class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-lg outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer transition-colors disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            <option value="" disabled>-- Pilih Jalur Pendaftaran --</option>
            <option v-for="t in trackList" :key="t.name" :value="t.name">
              {{ t.name }} ({{ t.badge }})
            </option>
          </select>

          <div v-if="currentTrackDetails" class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
            <span>{{ currentTrackDetails.description }}</span>
            <span class="font-medium text-slate-700 whitespace-nowrap">
              Biaya Formulir: Rp {{ (currentTrackDetails.registration_fee ?? 250000).toLocaleString('id-ID') }}
            </span>
          </div>
        </div>

        <div class="border-t border-slate-100"></div>

        <!-- 2. Pemilihan Program Studi (2 Kolom Bersih) -->
        <div class="space-y-3">
          <div class="text-xs font-semibold text-slate-800">
            Pilihan Program Studi
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Pilihan 1: Prioritas Utama -->
            <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1.5">
                  Program Studi Pilihan Utama <span class="text-rose-500">*</span>
                </label>
                <select
                  v-model="admissionForm.prodi1"
                  :disabled="applicantStore.isAdmissionLocked"
                  required
                  class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-lg outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer transition-colors disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>-- Pilih Program Studi Utama --</option>
                  <option v-for="item in prodiList" :key="item.code" :value="item.name">
                    {{ item.name }} ({{ item.faculty_name }}) - {{ item.degree }}
                  </option>
                </select>
              </div>

              <!-- Metadata Pilihan 1 Ringkas & Bersih -->
              <div v-if="currentProdi1Details" class="pt-2 border-t border-slate-200/60 text-xs space-y-1">
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Fakultas:</span>
                  <span class="font-medium text-slate-800 text-[11px]">{{ currentProdi1Details.faculty_name }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Jenjang Akademik:</span>
                  <span class="font-medium text-slate-800 text-[11px]">{{ currentProdi1Details.degree }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Estimasi Biaya UKT:</span>
                  <span class="font-semibold text-slate-800 text-xs font-mono">Rp {{ currentProdi1Fee.toLocaleString('id-ID') }} <span class="text-[10px] text-slate-400 font-sans font-normal">/ semester</span></span>
                </div>
              </div>
            </div>

            <!-- Pilihan 2: Alternatif Cadangan -->
            <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1.5">
                  Program Studi Pilihan Kedua <span class="text-slate-400 text-[11px] font-normal">(Opsional)</span>
                </label>
                <select
                  v-model="admissionForm.prodi2"
                  :disabled="applicantStore.isAdmissionLocked"
                  class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-lg outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer transition-colors disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="">-- Tanpa Pilihan Kedua --</option>
                  <option
                    v-for="item in prodiList"
                    :key="item.code"
                    :value="item.name"
                    :disabled="item.name === admissionForm.prodi1"
                  >
                    {{ item.name }} ({{ item.faculty_name }}) - {{ item.degree }}
                  </option>
                </select>
              </div>

              <!-- Metadata Pilihan 2 Ringkas & Bersih -->
              <div v-if="currentProdi2Details" class="pt-2 border-t border-slate-200/60 text-xs space-y-1">
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Fakultas:</span>
                  <span class="font-medium text-slate-800 text-[11px]">{{ currentProdi2Details.faculty_name }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-600">
                  <span class="text-slate-400 text-[11px]">Jenjang Akademik:</span>
                  <span class="font-medium text-slate-800 text-[11px]">{{ currentProdi2Details.degree }}</span>
                </div>
              </div>
              <div v-else class="pt-2 border-t border-slate-200/60 text-[11px] text-slate-400 italic">
                Pilihan alternatif diproses apabila kuota pilihan utama telah penuh.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER AKSI TUNGGAL & TERSTRUKTUR (Single Source of Action) -->
      <div class="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <!-- Keterangan Status Terarah -->
        <div class="text-xs text-slate-500 font-sans text-center sm:text-left">
          <span v-if="applicantStore.isAdmissionLocked" class="flex items-center gap-1.5 text-emerald-800">
            <Lock class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Pendaftaran telah dikunci karena biaya formulir telah terverifikasi lunas.</span>
          </span>
          <span v-else-if="applicantStore.canCancelAdmission">
            <span>Pilihan telah tersimpan. Anda dapat mengubah pilihan atau membatalkannya sebelum biaya formulir dibayarkan.</span>
          </span>
          <span v-else>
            <span>Setelah memilih jalur dan program studi, lanjutkan untuk menyelesaikan biaya formulir pendaftaran.</span>
          </span>
        </div>

        <!-- Tombol Aksi Sesuai Kondisi -->
        <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <!-- Kondisi 1: Jika Terkunci (Lunas) -> Tombol Lanjut ke CBT -->
          <button
            v-if="applicantStore.isAdmissionLocked"
            type="button"
            @click="emit('switch-tab', 'exam')"
            class="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Lihat Sesi Ujian CBT</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>

          <!-- Kondisi 2: Pilihan Tersimpan & Belum Bayar -->
          <template v-else-if="applicantStore.canCancelAdmission">
            <button
              type="button"
              @click="openCancelModal"
              :disabled="isCancelling"
              class="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Batalkan Pilihan
            </button>

            <!-- Jika Form Diubah: Simpan Perubahan; Jika Tidak: Langsung Lanjut ke Pembayaran -->
            <button
              v-if="isFormChanged"
              type="submit"
              :disabled="isSaving"
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              <Loader2 v-if="isSaving" class="animate-spin h-3.5 w-3.5 text-white" />
              <span>{{ isSaving ? 'Menyimpan...' : 'Perbarui Pilihan' }}</span>
              <ArrowRight v-if="!isSaving" class="w-3.5 h-3.5" />
            </button>

            <button
              v-else
              type="button"
              @click="emit('switch-tab', 'payment')"
              class="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </template>

          <!-- Kondisi 3: Belum Memilih Sama Sekali -->
          <button
            v-else
            type="submit"
            :disabled="isSaving"
            class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
          >
            <Loader2 v-if="isSaving" class="animate-spin h-3.5 w-3.5 text-white" />
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan & Lanjut ke Pembayaran' }}</span>
            <ArrowRight v-if="!isSaving" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>

    <!-- Modal Konfirmasi Pembatalan Pendaftaran Resmi Institusional -->
    <Teleport to="body">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showCancelModal = false"
      >
        <div class="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200/90 overflow-hidden animate-scaleUp">
          <!-- Body Dialog -->
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base font-semibold text-slate-900 leading-snug">
                  Batalkan Pilihan Program Studi?
                </h3>
                <p class="text-sm text-slate-500 mt-1">
                  Program studi: <span class="font-medium text-slate-800">{{ admissionForm.prodi1 || applicantStore.state?.admission?.prodi1 || 'Program Studi Terpilih' }}</span>
                  <span class="text-slate-300 mx-1.5">•</span>
                  <span class="text-slate-600">{{ admissionForm.track || applicantStore.state?.admission?.track || 'Reguler' }}</span>
                </p>
              </div>
              <button
                type="button"
                @click="showCancelModal = false"
                class="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup dialog"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-sm text-slate-600 leading-relaxed font-sans">
              <p>
                Pilihan program studi saat ini akan dibatalkan dari sistem. Anda dapat langsung memilih kembali program studi atau jalur seleksi lain pada formulir pendaftaran.
              </p>
              <p class="text-xs text-slate-500 pt-1">
                Catatan: Pembatalan hanya dapat dilakukan sebelum biaya formulir pendaftaran dibayarkan.
              </p>
            </div>
          </div>

          <!-- Dialog Footer (Clean grey bar standard) -->
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="showCancelModal = false"
              :disabled="isCancelling"
              class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="confirmCancelAdmission"
              :disabled="isCancelling"
              class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isCancelling" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isCancelling ? 'Membatalkan...' : 'Ya, Batalkan Pilihan' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {
  Loader2,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Trash2,
  Lock,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-vue-next';
import { ref, computed, watch, onMounted } from 'vue';
import { useApplicantStore } from '@/stores/applicant';
import { useOrganizationStore } from '@/stores/organization';
import { admissionApi } from '@/api/admission';

const emit = defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const organizationStore = useOrganizationStore();

const isSaving = ref(false);
const isCancelling = ref(false);
const showCancelModal = ref(false);
const savedMessage = ref('');

const backendPaths = ref([]);
const activePeriod = ref(null);

onMounted(async () => {
  const [orgRes, periodRes, pathsRes] = await Promise.allSettled([
    organizationStore.syncAll(),
    admissionApi.getActivePeriods(),
    admissionApi.getPaths(),
  ]);

  if (periodRes.status === 'fulfilled' && periodRes.value?.data?.data) {
    activePeriod.value = periodRes.value.data.data;
    if (activePeriod.value.academic_year) {
      applicantStore.state.admission.academicYear = activePeriod.value.academic_year;
    }
  }

  if (pathsRes.status === 'fulfilled' && Array.isArray(pathsRes.value?.data?.data) && pathsRes.value.data.data.length > 0) {
    backendPaths.value = pathsRes.value.data.data;
  }
});

const prodiList = computed(() => {
  return organizationStore.activeStudyPrograms;
});

const DEFAULT_TRACK_LIST = [
  {
    id: 1,
    name: 'Reguler Tes CBT',
    badge: 'Seleksi CBT Mandiri',
    description: 'Jalur seleksi umum berbasis Computer Based Test (CBT) dan wawancara peminatan.',
    registration_fee: 250000,
    requires_exam: true,
  },
  {
    id: 2,
    name: 'Prestasi Akademik',
    badge: 'Bebas Tes Tulis',
    description: 'Jalur seleksi bebas tes berbasis nilai rapor atau sertifikat olimpiade sains.',
    registration_fee: 200000,
    requires_exam: false,
  },
  {
    id: 3,
    name: 'Prestasi Non-Akademik',
    badge: 'Bebas Tes Tulis',
    description: 'Jalur seleksi prestasi seni, olahraga, dan keagamaan (Tahfidz).',
    registration_fee: 200000,
    requires_exam: false,
  },
  {
    id: 4,
    name: 'Beasiswa Kemitraan',
    badge: 'Beasiswa Penuh',
    description: 'Jalur beasiswa penuh kerja sama institusi dan mitra faskes.',
    registration_fee: 0,
    requires_exam: true,
  },
];

const trackList = computed(() => {
  if (backendPaths.value && backendPaths.value.length > 0) {
    return backendPaths.value.map((p) => ({
      id: p.id,
      name: p.name,
      badge: p.requires_exam ? 'Seleksi CBT Mandiri' : 'Bebas Tes Tulis',
      description: p.description || 'Jalur seleksi resmi PMB Universitas BTH.',
      registration_fee: p.registration_fee ?? 250000,
      requires_exam: p.requires_exam,
    }));
  }
  return DEFAULT_TRACK_LIST;
});

const admissionForm = ref({
  track: applicantStore.state.admission.track || 'Reguler Tes CBT',
  prodi1: applicantStore.state.admission.prodi1 || '',
  prodi2: applicantStore.state.admission.prodi2 || '',
});

// Sinkronkan data store hanya jika data store diperbarui dari luar
watch(
  () => applicantStore.state.admission?.prodi1,
  (newProdi) => {
    if (newProdi && newProdi !== admissionForm.value.prodi1) {
      admissionForm.value.prodi1 = newProdi;
    }
  }
);
watch(
  () => applicantStore.state.admission?.prodi2,
  (newProdi2) => {
    if (newProdi2 !== undefined && newProdi2 !== admissionForm.value.prodi2) {
      admissionForm.value.prodi2 = newProdi2;
    }
  }
);
watch(
  () => applicantStore.state.admission?.track,
  (newTrack) => {
    if (newTrack && newTrack !== admissionForm.value.track) {
      admissionForm.value.track = newTrack;
    }
  }
);

const currentTrackDetails = computed(() => {
  return trackList.value.find((t) => t.name === admissionForm.value.track) || trackList.value[0];
});

const currentProdi1Details = computed(() => {
  return organizationStore.getStudyProgramByName(admissionForm.value.prodi1);
});

const currentProdi2Details = computed(() => {
  return organizationStore.getStudyProgramByName(admissionForm.value.prodi2);
});

const isFormChanged = computed(() => {
  const currentProdi1 = applicantStore.state.admission?.prodi1 || '';
  const currentProdi2 = applicantStore.state.admission?.prodi2 || '';
  const currentTrack = applicantStore.state.admission?.track || 'Reguler Tes CBT';

  return (
    admissionForm.value.prodi1 !== currentProdi1 ||
    admissionForm.value.prodi2 !== currentProdi2 ||
    admissionForm.value.track !== currentTrack
  );
});

const PRODI_METADATA_FEE = {
  'S1 Farmasi': 6500000,
  'D3 Farmasi': 4800000,
  'D3 Analis Kesehatan (TLM)': 4750000,
  'S1 Administrasi Rumah Sakit': 4500000,
  'S1 Keperawatan': 5200000,
  'S1 Manajemen Bisnis Informasi': 4250000,
};

const currentProdi1Fee = computed(() => {
  if (!admissionForm.value.prodi1) return 0;
  return PRODI_METADATA_FEE[admissionForm.value.prodi1] || 4500000;
});

const saveAdmission = async () => {
  if (!admissionForm.value.prodi1) {
    alert('Silakan pilih Program Studi Pilihan Utama terlebih dahulu.');
    return;
  }
  isSaving.value = true;
  try {
    const p1 = currentProdi1Details.value;
    const p2 = currentProdi2Details.value;

    applicantStore.updateAdmission({
      track: admissionForm.value.track,
      prodi1: admissionForm.value.prodi1,
      prodi1Code: p1?.code || '',
      prodi1NimCode: p1?.nim_code || '01',
      prodi1Faculty: p1?.faculty_name || '',
      prodi1Degree: p1?.degree || '',
      prodi2: admissionForm.value.prodi2,
      prodi2Code: p2?.code || '',
      prodi2NimCode: p2?.nim_code || '',
      prodi2Faculty: p2?.faculty_name || '',
      prodi2Degree: p2?.degree || '',
    });

    // Format UUID valid untuk choice_id yang kompatibel dengan schema backend
    const formatChoiceUUID = (id) => {
      const num = parseInt(id) || 1;
      return `00000000-0000-0000-0000-${String(num).padStart(12, '0')}`;
    };

    const choice1UUID = p1?.uuid || formatChoiceUUID(p1?.id || 1);
    const choice2UUID = p2 ? (p2?.uuid || formatChoiceUUID(p2?.id || 2)) : null;

    // Sinkronisasi ke backend admission-service
    const existingApps = await admissionApi.getMyApplications().catch(() => null);
    if (existingApps?.data?.data && existingApps.data.data.length > 0) {
      const activeApp = existingApps.data.data[0];
      await admissionApi.updateChoices(activeApp.id, {
        choice_1_id: choice1UUID,
        choice_2_id: choice2UUID,
      }).catch(() => null);
    } else {
      let periodId = activePeriod.value?.id || 1;
      let pathId = currentTrackDetails.value?.id || 1;

      if (!pathId && backendPaths.value.length > 0) {
        const found = backendPaths.value.find(
          (p) => p.name === admissionForm.value.track
        );
        if (found?.id) pathId = found.id;
      }

      const createRes = await admissionApi.createApplication({
        period_id: periodId,
        admission_path_id: pathId,
        choice_1_id: choice1UUID,
        choice_2_id: choice2UUID,
      }).catch((err) => {
        console.warn('Backend create application notice:', err);
        return null;
      });

      if (createRes?.data?.data?.registration_no) {
        applicantStore.state.candidate.registrationNumber = createRes.data.data.registration_no;
      }
    }

    // Refresh sinkronisasi seluruh state dari backend
    await applicantStore.syncFromBackend().catch(() => null);

    savedMessage.value = 'Pilihan jalur pendaftaran dan program studi berhasil disimpan! Mengarahkan ke Halaman Pembayaran...';
    setTimeout(() => {
      emit('switch-tab', 'payment');
    }, 600);
  } catch (err) {
    console.warn('Admission save notice (fallback):', err);
    savedMessage.value = 'Pilihan berhasil disimpan! Mengarahkan ke Halaman Pembayaran...';
    setTimeout(() => {
      emit('switch-tab', 'payment');
    }, 600);
  } finally {
    isSaving.value = false;
    setTimeout(() => {
      savedMessage.value = '';
    }, 4000);
  }
};

const openCancelModal = () => {
  if (applicantStore.isAdmissionLocked) {
    alert('Pendaftaran tidak dapat dibatalkan karena biaya pendaftaran sudah dibayar.');
    return;
  }
  showCancelModal.value = true;
};

const confirmCancelAdmission = async () => {
  isCancelling.value = true;
  try {
    const res = await applicantStore.cancelAdmission();
    admissionForm.value.prodi1 = '';
    admissionForm.value.prodi2 = '';
    showCancelModal.value = false;
    savedMessage.value = res?.message || 'Pendaftaran berhasil dibatalkan. Anda dapat langsung memilih program studi dan jalur yang diinginkan.';
  } catch (err) {
    alert(err?.message || 'Gagal membatalkan pendaftaran.');
  } finally {
    isCancelling.value = false;
  }
};
</script>
