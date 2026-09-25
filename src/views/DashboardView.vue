<template>
  <DashboardLayout>
    <!-- Floating Interactive Toast Feedback -->
    <transition name="toast-slide">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border bg-slate-900 text-white border-slate-700"
      >
        <CheckCircle2 class="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div class="text-xs sm:text-sm font-sans flex-1">{{ toastMessage }}</div>
        <button @click="toastMessage = ''" class="text-white/70 hover:text-white text-lg font-bold px-1 cursor-pointer">&times;</button>
      </div>
    </transition>

    <!-- KONDISI 1: BERANDA UTAMA (OVERVIEW) -->
    <div v-if="activeTab === 'overview'" class="space-y-6 animate-fadeIn pb-12">
      <!-- 1. Hero Card: Bersih, Rapi, Fokus Identitas & Status -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Left: Identitas Calon Mahasiswa -->
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-blue-700 text-white font-sora font-bold text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-sm ring-4 ring-blue-50/80 overflow-hidden">
              <img
                v-if="candidatePhoto"
                :src="candidatePhoto"
                alt="Foto Profil Calon Mahasiswa"
                class="w-full h-full object-cover rounded-full"
              />
              <span v-else>{{ candidateInitials }}</span>
            </div>

            <div class="space-y-1 min-w-0">
              <h1 class="text-lg sm:text-xl font-sora font-bold text-slate-900 tracking-tight capitalize">
                Selamat Datang, {{ candidateName }}
              </h1>

              <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 font-sans">
                <span>No. Reg: <strong class="font-mono text-slate-700">{{ candidateRegNo }}</strong></span>
                <button
                  @click="copyRegNumber"
                  class="text-slate-400 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                  title="Salin Nomor Registrasi"
                >
                  <Copy class="w-3.5 h-3.5" />
                </button>
                <span class="text-slate-300">•</span>
                <span>{{ applicantStore.state.admission.track || 'Jalur Reguler' }}</span>
                <template v-if="applicantStore.state.admission.prodi1">
                  <span class="text-slate-300">•</span>
                  <span class="font-semibold text-slate-800">{{ applicantStore.state.admission.prodi1 }}</span>
                  <span class="text-slate-400 text-[11px]">({{ applicantStore.state.admission.prodi1Degree || 'S1' }})</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Right: Status Seleksi Resmi (Badge Tenang & Elegan) -->
          <div class="flex flex-col sm:items-end gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
            <span class="text-[11px] font-sans text-slate-400 font-medium">Status Pendaftaran</span>
            <div
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border shadow-2xs"
              :class="statusBadgeClass"
            >
              <span>{{ applicantStore.overallStatus.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Alur Tahapan Pendaftaran: Connected Milestone Stepper (Sleek, To The Point, Non-AI) -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <!-- Header: Title & Progress Bar Metric -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Tahapan Pendaftaran & Seleksi
            </h2>
            <p class="text-xs text-slate-500 mt-0.5 font-sans">
              Alur resmi pendaftaran dan seleksi mahasiswa baru Universitas BTH.
            </p>
          </div>

          <!-- Progress Indicator (To The Point) -->
          <div class="flex items-center gap-3 self-start sm:self-auto">
            <div class="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-[#1E3A8A] rounded-full transition-all duration-500"
                :style="{ width: `${(applicantStore.completedStepsCount / 6) * 100}%` }"
              ></div>
            </div>
            <span class="font-sora font-semibold text-xs text-slate-700 whitespace-nowrap">
              {{ applicantStore.completedStepsCount }} dari 6 Tahap Selesai
            </span>
          </div>
        </div>

        <!-- Connected Milestone Stepper Bar (6 Tahapan Terpadu PMB BTH) -->
        <div class="py-2">
          <div class="relative">
            <!-- Connecting Line between step nodes (Visible on sm+) -->
            <div class="hidden sm:block absolute top-4 left-10 right-10 h-0.5 bg-slate-100 -z-0">
              <div
                class="h-full bg-emerald-500 transition-all duration-500"
                :style="{ width: `${Math.min(100, Math.max(0, ((applicantStore.completedStepsCount - 1) / 5) * 100))}%` }"
              ></div>
            </div>

            <!-- The 6 Step Nodes -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-2 relative z-10">
              <button
                v-for="(step, idx) in steps"
                :key="step.id"
                @click="switchTab(step.id)"
                class="group flex flex-col items-center text-center p-2 rounded-2xl transition-all cursor-pointer hover:bg-slate-50/80 focus:outline-none"
              >
                <!-- Node Circle Icon -->
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center font-sora text-xs font-bold transition-all duration-200 mb-2 relative"
                  :class="step.isCompleted
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : step.isCurrent
                      ? 'bg-[#1E3A8A] text-white ring-4 ring-blue-50 shadow-xs'
                      : 'bg-white text-slate-400 border border-slate-200 group-hover:border-slate-300'"
                >
                  <Check v-if="step.isCompleted" class="w-4 h-4 stroke-[2.5]" />
                  <span v-else>{{ idx + 1 }}</span>
                </div>

                <!-- Step Title -->
                <div
                  class="text-xs transition-colors font-sora"
                  :class="step.isCurrent
                    ? 'font-bold text-[#1E3A8A]'
                    : step.isCompleted
                      ? 'font-semibold text-slate-800'
                      : 'font-normal text-slate-500 group-hover:text-slate-700'"
                >
                  {{ step.title }}
                </div>

                <!-- Subtitle / Meta Text (Clean & Compact) -->
                <div
                  class="text-[11px] font-sans mt-0.5 truncate max-w-full"
                  :class="step.isCompleted
                    ? 'text-emerald-700 font-medium'
                    : step.isCurrent
                      ? 'text-blue-700 font-semibold'
                      : 'text-slate-400'"
                >
                  {{ step.statusText }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Integrated Next Action Banner (Direct, To The Point, Replaces the Clunky Helpdesk Card) -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:px-8 sm:py-4 rounded-b-3xl">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center flex-shrink-0">
              <component :is="nextActionInfo.icon || ArrowRight" class="w-4 h-4" />
            </div>
            <div>
              <div class="font-sora font-semibold text-xs text-slate-800">
                Tahap Saat Ini: <span class="text-[#1E3A8A]">{{ nextActionInfo.title }}</span>
              </div>
              <p class="text-[11px] text-slate-500 font-sans mt-0.5">
                {{ nextActionInfo.desc }}
              </p>
            </div>
          </div>

          <button
            @click="handleNextAction(nextActionInfo.tab, nextActionInfo.section)"
            class="rounded-xl px-4 py-2 font-medium text-xs text-white bg-[#1E3A8A] hover:bg-[#172554] transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center flex-shrink-0 shadow-xs"
          >
            <span>{{ nextActionInfo.cta }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- KONDISI 2: SUB-MODUL AKTIF (Profil, Jalur, Berkas, Pembayaran, CBT/Wawancara, Hasil) -->
    <div v-else class="space-y-4 animate-fadeIn pb-12">
      <!-- 1. Profil (Biodata, Alamat, Orang Tua, Asal Sekolah, Foto Profil) -->
      <ProfileModule v-if="activeTab === 'profile'" />

      <!-- 2. Jalur Pendaftaran (Pemilihan Fakultas, Prodi, Jalur, Detail & Persyaratan, Biaya, Kartu Peserta) -->
      <AdmissionModule v-else-if="activeTab === 'admission'" @switch-tab="switchTab" />

      <!-- 3. Berkas Persyaratan (admission-service) -->
      <DocumentModule v-else-if="activeTab === 'documents'" />

      <!-- 4. Biaya Pendaftaran & Kuliah (finance-service: List Biaya, Bayar Langsung, Cicilan) -->
      <PaymentModule v-else-if="activeTab === 'payment'" />

      <!-- 5. Proses Seleksi (exam-service: CBT Online & Tes Lisan Google Meet / Zoom) -->
      <ExamModule v-else-if="activeTab === 'exam'" @switch-tab="switchTab" />

      <!-- 6. Hasil Kelulusan & Registrasi Ulang (selection-service: LoA & NIM) -->
      <ResultModule v-else-if="activeTab === 'result'" @switch-tab="switchTab" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import {
  CheckCircle2,
  User,
  Compass,
  FileText,
  CreditCard,
  ClipboardCheck,
  GraduationCap,
  ArrowRight,
  Copy,
  Check,
  LifeBuoy
} from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useApplicantStore } from '@/stores/applicant';
import { useAuthStore } from '@/stores/auth';

// Import 6 Modul Utama PMB
import ProfileModule from '@/components/applicant/ProfileModule.vue';
import AdmissionModule from '@/components/applicant/AdmissionModule.vue';
import DocumentModule from '@/components/applicant/DocumentModule.vue';
import PaymentModule from '@/components/applicant/PaymentModule.vue';
import ExamModule from '@/components/applicant/ExamModule.vue';
import ResultModule from '@/components/applicant/ResultModule.vue';

const route = useRoute();
const applicantStore = useApplicantStore();
const authStore = useAuthStore();
const toastMessage = ref('');

onMounted(() => {
  if (route.query.tab) {
    applicantStore.setActiveTab(route.query.tab);
  }
  if (route.query.unauthorized === 'admin') {
    toastMessage.value = 'Akses ditolak: Portal Panitia PMB hanya diperuntukkan bagi Panitia Seleksi & Superadmin.';
  }
  // Sinkronisasi data terkini dari microservices backend
  applicantStore.syncFromBackend();
});

// Bind activeTab seamlessly to Pinia store
const activeTab = computed({
  get: () => applicantStore.activeTab,
  set: (val) => applicantStore.setActiveTab(val),
});

const candidateName = computed(() => {
  return applicantStore.state.candidate.fullName || authStore.currentUser?.full_name || 'Calon Mahasiswa';
});

const candidateInitials = computed(() => {
  const name = candidateName.value.trim();
  if (!name) return 'CM';
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

const candidatePhoto = computed(() => {
  return applicantStore.candidatePhoto || authStore.currentUser?.avatar || null;
});

const candidateRegNo = computed(() => {
  return applicantStore.state.candidate.registrationNumber || 'BTH-2026-REG-00000';
});

const statusBadgeClass = computed(() => {
  const theme = applicantStore.overallStatus.theme;
  if (theme === 'emerald') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (theme === 'blue') return 'bg-blue-50 text-[#1E3A8A] border-blue-200';
  if (theme === 'indigo') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (theme === 'amber') return 'bg-amber-50 text-amber-800 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
});

const statusDotColor = computed(() => {
  const theme = applicantStore.overallStatus.theme;
  if (theme === 'emerald') return 'bg-emerald-500';
  if (theme === 'blue') return 'bg-blue-600';
  if (theme === 'indigo') return 'bg-indigo-600';
  if (theme === 'amber') return 'bg-amber-500';
  return 'bg-slate-400';
});

const currentStageLabel = computed(() => {
  if (applicantStore.isResultPassed) return 'Dinyatakan Lulus Seleksi';
  if (applicantStore.isExamCompleted) return 'Selesai Ujian CBT';
  if (applicantStore.isRegPaymentComplete) return 'Sesi Ujian CBT Aktif';
  if (applicantStore.isDocumentsComplete) return 'Berkas Persyaratan Lengkap';
  if (applicantStore.isProfileComplete && applicantStore.isAdmissionComplete) return 'Formulir & Pilihan Prodi Lengkap';
  if (applicantStore.isProfileComplete) return 'Biodata Profil Lengkap';
  return 'Pengisian Formulir Biodata';
});

// Rekomendasi langkah selanjutnya dinamis
const nextActionInfo = computed(() => {
  if (!applicantStore.isProfileComplete) {
    return {
      title: 'Lengkapi Formulir Biodata Pribadi',
      desc: 'Lengkapi biodata diri, data domisili, orang tua/wali, dan asal sekolah Anda di Universitas BTH.',
      cta: 'Lengkapi Biodata Sekarang',
      tab: 'profile',
      section: 'section-pribadi',
      badge: 'Langkah 1: Biodata Mahasiswa',
      theme: 'blue',
      icon: BookOpen,
    };
  }
  if (!applicantStore.isAdmissionComplete) {
    return {
      title: 'Tentukan Jalur Pendaftaran & Program Studi',
      desc: 'Pilih jalur masuk resmi dan program studi prioritas pilihan Anda di Universitas BTH.',
      cta: 'Pilih Jalur & Prodi Sekarang',
      tab: 'admission',
      section: 'section-prodi',
      badge: 'Langkah 2: Jalur Pendaftaran',
      theme: 'blue',
      icon: Compass,
    };
  }
  if (!applicantStore.isDocumentsComplete) {
    return {
      title: 'Unggah Berkas Persyaratan Pendaftaran',
      desc: `Baru ${applicantStore.uploadedDocsCount} dari 5 berkas diunggah. Silakan lengkapi pindaian KTP, Ijazah/SKL, dan pasfoto resmi Anda.`,
      cta: 'Unggah Berkas Dokumen',
      tab: 'documents',
      section: null,
      badge: 'Langkah 3: Berkas Dokumen',
      theme: 'blue',
      icon: FileText,
    };
  }
  if (!applicantStore.isRegPaymentComplete) {
    return {
      title: 'Selesaikan Pembayaran Biaya Pendaftaran',
      desc: 'Selesaikan pembayaran biaya registrasi formulir PMB sebesar Rp 250.000 agar sesi Ujian CBT Online aktif.',
      cta: 'Bayar Biaya Pendaftaran',
      tab: 'payment',
      section: null,
      badge: 'Langkah 4: Biaya Pendaftaran',
      theme: 'amber',
      icon: CreditCard,
    };
  }
  if (!applicantStore.isExamCompleted) {
    return {
      title: 'Sesi Ujian CBT Online Telah Aktif',
      desc: 'Anda telah memenuhi syarat untuk mengikuti Ujian Mandiri Berbasis Komputer (CBT) PMB BTH secara daring.',
      cta: 'Mulai Ujian CBT Sekarang',
      tab: 'exam',
      section: null,
      badge: 'Langkah 5: Ujian Mandiri CBT',
      theme: 'blue',
      icon: ClipboardCheck,
    };
  }
  if (!applicantStore.isResultPassed) {
    return {
      title: 'Ujian Selesai - Verifikasi Nilai CBT',
      desc: `Skor CBT Anda (${applicantStore.state.exam.score}/100) sedang ditinjau panitia PMB. Pengumuman resmi maksimal 1x24 jam.`,
      cta: 'Lihat Status Kelulusan',
      tab: 'result',
      section: null,
      badge: 'Menunggu Pengumuman',
      theme: 'blue',
      icon: GraduationCap,
    };
  }
  if (!applicantStore.isUktPaid) {
    return {
      title: 'Selamat! Anda Dinyatakan Lulus Seleksi PMB',
      desc: `Diterima di ${applicantStore.state.admission.prodi1}. Unduh Surat Penerimaan (LoA) & selesaikan registrasi ulang UKT.`,
      cta: 'Daftar Ulang & Pembayaran UKT',
      tab: 'result',
      section: null,
      badge: 'Lulus Seleksi',
      theme: 'emerald',
    };
  }
  return {
    title: 'Daftar Ulang Selesai - Resmi Menjadi Mahasiswa BTH!',
    desc: `NIM resmi Anda: ${applicantStore.state.onboarding.nim}. Silakan persiapkan diri menyambut kegiatan PKKMB 2026.`,
    cta: 'Lihat Berkas & Akun Kampus',
    tab: 'result',
    section: null,
    badge: 'Mahasiswa Baru',
    theme: 'emerald',
  };
});

const handleNextAction = (tab, section = null) => {
  applicantStore.setActiveTab(tab, section);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const steps = computed(() => [
  {
    id: 'profile',
    number: 1,
    title: 'Profil',
    statusText: applicantStore.isProfileComplete ? 'Selesai' : 'Belum Lengkap',
    isCompleted: applicantStore.isProfileComplete,
    isCurrent: !applicantStore.isProfileComplete,
    icon: User,
  },
  {
    id: 'admission',
    number: 2,
    title: 'Jalur Pendaftaran',
    statusText: applicantStore.state.admission.prodi1 || 'Pilih Prodi & Jalur',
    isCompleted: applicantStore.isAdmissionComplete,
    isCurrent: applicantStore.isProfileComplete && !applicantStore.isAdmissionComplete,
    icon: Compass,
  },
  {
    id: 'documents',
    number: 3,
    title: 'Berkas Dokumen',
    statusText: applicantStore.isDocumentsComplete ? 'Lengkap (5/5)' : `${applicantStore.uploadedDocsCount}/5 Diunggah`,
    isCompleted: applicantStore.isDocumentsComplete,
    isCurrent: applicantStore.state.admission.prodi1 && !applicantStore.isDocumentsComplete,
    icon: FileText,
  },
  {
    id: 'payment',
    number: 4,
    title: 'Biaya Pendaftaran',
    statusText: applicantStore.isRegPaymentComplete ? 'Lunas' : 'Rp 250.000',
    isCompleted: applicantStore.isRegPaymentComplete,
    isCurrent: applicantStore.isDocumentsComplete && !applicantStore.isRegPaymentComplete,
    icon: CreditCard,
  },
  {
    id: 'exam',
    number: 5,
    title: 'Proses Seleksi',
    statusText: applicantStore.isExamCompleted ? `Skor ${applicantStore.state.exam.score}/100` : applicantStore.isRegPaymentComplete ? 'CBT & Lisan' : 'Menunggu Bayar',
    isCompleted: applicantStore.isExamCompleted,
    isCurrent: applicantStore.isRegPaymentComplete && !applicantStore.isExamCompleted,
    icon: ClipboardCheck,
  },
  {
    id: 'result',
    number: 6,
    title: 'Daftar Ulang',
    statusText: applicantStore.isResultPassed ? 'Lulus Seleksi' : applicantStore.isExamCompleted ? 'Diproses' : 'Menunggu Seleksi',
    isCompleted: applicantStore.isResultPassed,
    isCurrent: applicantStore.isExamCompleted && !applicantStore.isResultPassed,
    icon: GraduationCap,
  },
]);

const copyRegNumber = async () => {
  const regNo = candidateRegNo.value;
  try {
    await navigator.clipboard.writeText(regNo);
    toastMessage.value = `Nomor Registrasi (${regNo}) berhasil disalin.`;
  } catch {
    toastMessage.value = `Nomor Registrasi: ${regNo}`;
  }
};

const switchTab = (tabId) => {
  applicantStore.setActiveTab(tabId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
