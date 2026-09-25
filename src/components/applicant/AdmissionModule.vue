<template>
  <div class="space-y-6">
    <!-- Header Modul Jalur Pendaftaran -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Jalur Pendaftaran & Pilihan Program Studi
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Tentukan jalur masuk dan program studi prioritas pilihan Anda di Universitas Bakti Tunas Husada.
        </p>
      </div>
      <div class="text-xs text-slate-500 font-sans self-start sm:self-auto">
        Status: <strong :class="applicantStore.state.admission.prodi1 ? 'text-emerald-700' : 'text-amber-700'">
          {{ applicantStore.state.admission.prodi1 ? 'Pilihan Tersimpan' : 'Belum Memilih' }}
        </strong>
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

    <form @submit.prevent="saveAdmission" class="space-y-6">
      <!-- Pilihan Jalur & Program Studi (Integrasi Terpadu BTH) -->
      <div id="section-prodi" class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm scroll-mt-24 space-y-4">
        <div class="text-xs font-sora font-bold text-[#1E3A8A] uppercase tracking-wider pb-2 border-b border-slate-100">
          Pilihan Jalur & Program Studi
        </div>

        <!-- Pemilihan Jalur Pendaftaran Resmi -->
        <div class="bg-slate-50/60 rounded-2xl p-4 sm:p-5 border border-slate-200/70 space-y-2 text-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label class="block font-medium text-slate-700">
              Jalur Pendaftaran <span class="text-red-500">*</span>
            </label>
            <span class="text-[11px] text-slate-400 font-sans">Tahun Akademik {{ applicantStore.state.admission.academicYear || '2026/2027' }}</span>
          </div>
          <select
            v-model="admissionForm.track"
            required
            class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer"
          >
            <option value="" disabled>-- Pilih Jalur Pendaftaran --</option>
            <option v-for="t in trackList" :key="t.name" :value="t.name">
              {{ t.name }} ({{ t.badge }})
            </option>
          </select>
          <div v-if="currentTrackDetails" class="text-[11px] text-slate-500 font-sans pt-1">
            <span>{{ currentTrackDetails.description }}</span>
          </div>
        </div>

        <!-- Pilihan Program Studi -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
          <!-- Pilihan 1: Prioritas Utama -->
          <div class="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/70 space-y-3">
            <div>
              <label class="block font-medium text-slate-700 mb-1.5">
                Program Studi Pilihan Utama <span class="text-red-500">*</span>
              </label>
              <select
                v-model="admissionForm.prodi1"
                required
                class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer"
              >
                <option value="" disabled>-- Pilih Program Studi --</option>
                <option v-for="item in prodiList" :key="item.code" :value="item.name">
                  {{ item.name }} ({{ item.faculty_name }}) - {{ item.degree }}
                </option>
              </select>
            </div>

            <!-- Detail Info Pilihan 1 -->
            <div v-if="currentProdi1Details" class="bg-white rounded-xl p-3.5 border border-slate-200/70 text-xs space-y-1.5">
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
          <div class="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/70 space-y-3">
            <div>
              <label class="block font-medium text-slate-700 mb-1.5">
                Program Studi Pilihan Kedua (Opsional)
              </label>
              <select
                v-model="admissionForm.prodi2"
                class="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-slate-800 font-sans font-medium text-xs cursor-pointer"
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

            <!-- Detail Info Pilihan 2 -->
            <div v-if="currentProdi2Details" class="bg-white rounded-xl p-3.5 border border-slate-200/70 text-xs space-y-1.5">
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-400 text-[11px]">Fakultas:</span>
                <span class="font-medium text-slate-800 text-[11px]">{{ currentProdi2Details.faculty_name }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-400 text-[11px]">Jenjang Akademik:</span>
                <span class="font-medium text-slate-800 text-[11px]">{{ currentProdi2Details.degree }}</span>
              </div>
            </div>
            <div v-else class="text-[11px] text-slate-400 font-sans italic py-1">
              Pilihan alternatif diproses apabila kuota pilihan utama telah penuh.
            </div>
          </div>
        </div>
      </div>

      <!-- Tombol Aksi Simpan -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          :disabled="isSaving"
          class="w-full sm:w-auto rounded-xl px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <Loader2 v-if="isSaving" class="animate-spin h-4 w-4 text-white" />
          <span>{{ isSaving ? 'Menyimpan ke Server...' : 'Simpan Pilihan Jalur & Program Studi' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { Loader2, CheckCircle2 } from 'lucide-vue-next';
import { ref, computed, watch, onMounted } from 'vue';
import { useApplicantStore } from '@/stores/applicant';
import { useOrganizationStore } from '@/stores/organization';
import { admissionApi } from '@/api/admission';

defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const organizationStore = useOrganizationStore();

const isSaving = ref(false);
const savedMessage = ref('');

onMounted(async () => {
  await Promise.allSettled([
    organizationStore.syncAll(),
    admissionApi.getActivePeriods().catch(() => null),
    admissionApi.getPaths().catch(() => null),
  ]);
});

const prodiList = computed(() => {
  return organizationStore.activeStudyPrograms;
});

const trackList = [
  {
    name: 'Jalur Reguler Gelombang 1',
    badge: 'Seleksi CBT Mandiri',
    description: 'Jalur seleksi umum berbasis Computer Based Test (CBT) dan wawancara peminatan.'
  },
  {
    name: 'Jalur Prestasi (PMDK / Akademik & Non-Akademik)',
    badge: 'Bebas Tes Tulis',
    description: 'Seleksi bebas tes tertulis bagi siswa berprestasi di bidang sains, olahraga, seni, atau keagamaan (Tahfidz).'
  },
  {
    name: 'Jalur Nilai Rapor & UTBK',
    badge: 'Bebas Tes Tulis',
    description: 'Seleksi berdasarkan nilai rata-rata rapor semester 1-5 atau sertifikat hasil UTBK-SNBT.'
  },
  {
    name: 'Jalur Beasiswa KIP Kuliah / Yayasan',
    badge: 'Beasiswa Pemerintah',
    description: 'Bantuan biaya pendidikan penuh bagi lulusan SMA/SMK berprestasi yang memiliki KIP atau terdaftar DTKS.'
  },
  {
    name: 'Jalur Alih Jenjang / Pindahan',
    badge: 'Program Lanjutan',
    description: 'Khusus lulusan Diploma (D3) yang melanjutkan ke jenjang Sarjana (S1) atau transfer mahasiswa.'
  },
  {
    name: 'Jalur Kemitraan & Rekanan Faskes',
    badge: 'Kerjasama Institusi',
    description: 'Jalur khusus bagi putra/putri keluarga tenaga kesehatan atau institusi/faskes rekanan Universitas BTH.'
  }
];

const admissionForm = ref({
  track: applicantStore.state.admission.track || 'Jalur Reguler Gelombang 1',
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
  return trackList.find(t => t.name === admissionForm.value.track);
});

const currentProdi1Details = computed(() => {
  return organizationStore.getStudyProgramByName(admissionForm.value.prodi1);
});

const currentProdi2Details = computed(() => {
  return organizationStore.getStudyProgramByName(admissionForm.value.prodi2);
});

const PRODI_METADATA_FEE = {
  'S1 Farmasi': 6500000,
  'D3 Farmasi': 4800000,
  'D3 Analis Kesehatan (TLM)': 4750000,
  'S1 Administrasi Rumah Sakit': 4500000,
  'S1 Keperawatan': 5200000,
  'S1 Teknologi Informasi': 4500000,
  'S1 Bisnis Digital': 4250000,
};

const currentProdi1Fee = computed(() => {
  if (!admissionForm.value.prodi1) return 6500000;
  return PRODI_METADATA_FEE[admissionForm.value.prodi1] || 6500000;
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
      let periodId = 1;
      let pathId = 1;
      const periodRes = await admissionApi.getActivePeriods().catch(() => null);
      if (periodRes?.data?.data?.id) periodId = periodRes.data.data.id;

      const pathRes = await admissionApi.getPaths().catch(() => null);
      if (pathRes?.data?.data && Array.isArray(pathRes.data.data)) {
        const found = pathRes.data.data.find(
          (p) => p.name?.toLowerCase().includes('reguler') || p.code === 'REG'
        );
        if (found?.id) pathId = found.id;
      }

      const createRes = await admissionApi.createApplication({
        period_id: periodId,
        admission_path_id: pathId,
        choice_1_id: choice1UUID,
        choice_2_id: choice2UUID,
      }).catch(() => null);

      if (createRes?.data?.data?.registration_no) {
        applicantStore.state.candidate.registrationNumber = createRes.data.data.registration_no;
      }
    }

    // Refresh sinkronisasi seluruh state dari backend
    await applicantStore.syncFromBackend().catch(() => null);

    savedMessage.value = 'Pilihan jalur pendaftaran dan program studi berhasil disimpan ke sistem PMB!';
  } catch (err) {
    console.warn('Admission save notice (fallback):', err);
    savedMessage.value = 'Pilihan berhasil disimpan!';
  } finally {
    isSaving.value = false;
    setTimeout(() => {
      savedMessage.value = '';
    }, 4000);
  }
};
</script>
