<template>
  <DashboardLayout>
    <!-- Floating Interactive Toast Feedback -->
    <transition name="toast-slide">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border backdrop-blur-md bg-slate-900/95 text-white border-slate-700"
      >
        <svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-xs sm:text-sm font-sans flex-1">{{ toastMessage }}</div>
        <button @click="toastMessage = ''" class="text-white/70 hover:text-white text-lg font-bold px-1">&times;</button>
      </div>
    </transition>

    <!-- Clean Top Academic Welcome Banner -->
    <div class="bg-gradient-to-r from-[#1E3A8A] via-[#1b3478] to-[#12285a] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 mb-5 sm:mb-7 shadow-bth relative overflow-hidden border border-blue-900/30">
      <!-- Watermark Lambang BTH -->
      <img
        src="/assets/icons/bth.png"
        alt="BTH Motif"
        class="absolute -right-8 -bottom-10 w-56 opacity-5 pointer-events-none select-none filter invert"
      />

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <!-- Left Side: Greetings & Identity -->
        <div class="space-y-2 sm:space-y-2.5">
          <!-- Jalur & TA Pill -->
          <div class="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-white/10 backdrop-blur-xs text-blue-100 rounded-full text-[11px] sm:text-xs font-sora border border-white/10">
            <span class="font-semibold">{{ applicantStore.state.admission.track }}</span>
            <span class="text-white/40">•</span>
            <span class="font-mono text-blue-200">TA {{ applicantStore.state.admission.academicYear }}</span>
          </div>

          <div>
            <h1 class="text-lg sm:text-2xl lg:text-3xl font-sora font-extrabold text-white tracking-tight leading-tight">
              Selamat Datang, {{ candidateName }}
            </h1>
            <p class="text-xs sm:text-sm text-blue-200 mt-1 font-sans">
              <template v-if="applicantStore.state.admission.prodi1">
                Program Studi Pilihan: <strong class="text-white">{{ applicantStore.state.admission.prodi1 }}</strong>
                <span class="text-blue-300/60 mx-1.5">•</span>
                Jenjang {{ applicantStore.state.admission.prodi1Degree }}
              </template>
              <template v-else>
                Status: <span class="text-amber-300 font-semibold">Silakan lengkapi biodata & tentukan program studi</span>
              </template>
            </p>
          </div>

          <!-- Concise Status & Reg Number Bar -->
          <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <!-- No Registrasi -->
            <div class="inline-flex items-center gap-1.5 sm:gap-2 bg-black/30 backdrop-blur-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10 font-mono text-[11px] sm:text-xs">
              <span class="text-blue-300">No. Registrasi:</span>
              <span class="font-bold text-white tracking-wider">{{ candidateRegNo }}</span>
              <button
                @click="copyRegNumber"
                class="text-amber-300 hover:text-amber-200 transition-colors ml-0.5 cursor-pointer"
                title="Salin Nomor Registrasi"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <!-- Integrated Reactive Status Pill -->
            <div
              class="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl font-sora font-semibold text-[11px] sm:text-xs border shadow-xs transition-all"
              :class="statusThemeClass"
            >
              <span class="w-2 h-2 rounded-full flex-shrink-0" :class="statusDotClass"></span>
              <span>{{ applicantStore.overallStatus.label }}</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Dynamic Circular Progress Gauge Card -->
        <div class="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 sm:px-5 sm:py-4 rounded-2xl flex items-center gap-3.5 sm:gap-4 flex-shrink-0 w-full md:w-auto md:min-w-[270px] shadow-sm">
          <!-- Circular Progress Ring -->
          <div class="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
            <svg class="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90 block" viewBox="0 0 36 36">
              <path
                class="text-white/20"
                stroke-width="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="text-amber-400 transition-all duration-500"
                stroke-width="3.5"
                :stroke-dasharray="`${applicantStore.progressPercent}, 100`"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span class="absolute font-sora font-extrabold text-xs sm:text-sm text-white inset-0 flex items-center justify-center pointer-events-none">
              {{ applicantStore.progressPercent }}%
            </span>
          </div>

          <!-- Progress Details -->
          <div class="flex-1 min-w-0">
            <span class="text-[9px] sm:text-[10px] font-bold tracking-wider text-blue-200 uppercase font-sora block">
              Progres Pendaftaran
            </span>
            <span class="text-[11px] sm:text-xs font-bold text-white block mt-0.5 font-sans">
              {{ applicantStore.completedStepsCount }} dari 6 Tahap Selesai
            </span>
            <div class="text-[10px] sm:text-[11px] font-semibold text-amber-300 mt-1 truncate font-sora">
              {{ currentStageLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stepper Navigation: 6 Tahap Alur PMB BTH -->
    <div class="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3.5 sm:p-5 mb-5 sm:mb-6">
      <div class="flex items-center justify-between pb-2.5 sm:pb-3 mb-3 border-b border-slate-100">
        <div>
          <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
            Alur Tahapan Pendaftaran
          </h2>
          <p class="text-[11px] sm:text-xs text-slate-500">
            Pilih menu tahapan di bawah untuk melengkapi berkas, mengikuti ujian CBT, dan melihat kelulusan.
          </p>
        </div>
        <button
          v-if="activeTab !== 'overview'"
          @click="switchTab('overview')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] text-xs font-sora font-semibold transition-colors cursor-pointer border border-blue-200/60"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="hidden sm:inline">Halaman Utama</span>
          <span class="sm:hidden">Ringkasan</span>
        </button>
      </div>

      <!-- Steps Buttons Grid (3 Kolom di Mobile = 2 Baris Simetris, 6 Kolom di Desktop) -->
      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
        <button
          v-for="step in steps"
          :key="step.id"
          @click="switchTab(step.id)"
          class="p-2 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between group cursor-pointer min-h-[78px] sm:min-h-[92px]"
          :class="activeTab === step.id
            ? 'bg-blue-50/90 border-[#1E3A8A] text-[#1E3A8A] ring-2 ring-blue-100 shadow-xs'
            : step.isCompleted
              ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
              : 'bg-white border-slate-200/60 hover:bg-slate-50 text-slate-500'"
        >
          <!-- Step Indicator Icon/Number -->
          <div
            class="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold mb-1 sm:mb-1.5 transition-colors flex-shrink-0"
            :class="activeTab === step.id
              ? 'bg-[#1E3A8A] text-white'
              : step.isCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-600'"
          >
            <span v-if="step.isCompleted && activeTab !== step.id">✓</span>
            <span v-else>{{ step.number }}</span>
          </div>

          <div class="text-[10px] sm:text-[11px] font-sora font-bold leading-tight text-center w-full truncate"
               :class="activeTab === step.id ? 'text-[#1E3A8A]' : 'text-slate-800'">
            {{ step.title }}
          </div>

          <div class="text-[9px] sm:text-[10px] text-center mt-0.5 truncate w-full"
               :class="step.isCompleted ? 'text-emerald-700 font-medium' : 'text-slate-400'">
            {{ step.statusText }}
          </div>
        </button>
      </div>
    </div>

    <!-- Active Component Container -->
    <main class="animate-fadeIn pb-12">
      <!-- 0. Halaman Utama / Hub Eksplorasi Portal PMB -->
      <div v-if="activeTab === 'overview'" class="space-y-6 sm:space-y-7">
        <!-- Next Recommended Action Banner -->
        <div
          class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-sm transition-all relative overflow-hidden"
          :class="nextActionCardClass"
        >
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1.5 max-w-2xl">
              <div
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold uppercase tracking-wider"
                :class="nextActionBadgeClass"
              >
                <span class="w-2 h-2 rounded-full animate-ping" :class="nextActionDotClass"></span>
                <span>{{ nextActionInfo.badge }}</span>
              </div>
              <h3 class="text-base sm:text-xl font-sora font-bold text-slate-900">
                {{ nextActionInfo.title }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                {{ nextActionInfo.desc }}
              </p>
            </div>

            <button
              @click="handleNextAction(nextActionInfo.tab, nextActionInfo.section)"
              class="px-5 py-3 rounded-xl sm:rounded-2xl font-sora font-semibold text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
              :class="nextActionButtonClass"
            >
              <span>{{ nextActionInfo.cta }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Agenda & Jadwal Penting PMB BTH TA 2026/2027 -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 class="font-sora font-bold text-sm sm:text-base text-slate-900">
                Jadwal & Agenda Penting PMB Gelombang 1 (TA 2026/2027)
              </h3>
              <p class="text-xs text-slate-500">
                Tenggat waktu resmi proses pendaftaran, ujian seleksi CBT, dan registrasi ulang mahasiswa baru.
              </p>
            </div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1E3A8A] border border-blue-200/80 rounded-full text-xs font-semibold font-sora self-start sm:self-auto">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>TA 2026/2027</span>
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span class="text-[10px] font-bold font-sora uppercase text-blue-600 tracking-wider">Tahap 1</span>
              <h4 class="font-sora font-bold text-xs text-slate-900 mt-1">Pendaftaran & Berkas</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">1 Jan - 30 April 2026</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span class="text-[10px] font-bold font-sora uppercase text-emerald-600 tracking-wider">Tahap 2</span>
              <h4 class="font-sora font-bold text-xs text-slate-900 mt-1">Ujian CBT Mandiri</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Fleksibel 24 Jam Online</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span class="text-[10px] font-bold font-sora uppercase text-indigo-600 tracking-wider">Tahap 3</span>
              <h4 class="font-sora font-bold text-xs text-slate-900 mt-1">Pengumuman Kelulusan</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Maks. 1x24 Jam Pasca CBT</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span class="text-[10px] font-bold font-sora uppercase text-amber-600 tracking-wider">Tahap 4</span>
              <h4 class="font-sora font-bold text-xs text-slate-900 mt-1">Daftar Ulang & UKT</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Maks. 14 Hari Pasca Lulus</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 1. Applicant Profile (identity-service) -->
      <ProfileModule v-else-if="activeTab === 'profile'" />

      <!-- 2. Admission & Track Selection (admission-service) -->
      <AdmissionModule v-else-if="activeTab === 'admission'" />

      <!-- 3. Document Management (admission-service) -->
      <DocumentModule v-else-if="activeTab === 'documents'" />

      <!-- 4. Payment & Registration Fee (finance-service) -->
      <PaymentModule v-else-if="activeTab === 'payment'" />

      <!-- 5. Exam CBT Portal & Schedule (exam-service & selection-service) -->
      <ExamModule v-else-if="activeTab === 'exam'" @switch-tab="switchTab" />

      <!-- 6. Selection Result & LoA (selection-service & admission-service) -->
      <ResultModule v-else-if="activeTab === 'result'" @switch-tab="switchTab" />
    </main>
  </DashboardLayout>
</template>

<script setup>
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
  if (route.query.unauthorized === 'admin') {
    toastMessage.value = 'Akses ditolak: Portal Panitia PMB hanya diperuntukkan bagi Panitia Seleksi & Superadmin.';
  }
});

// Bind activeTab seamlessly to Pinia store so Topbar, Mobile Drawer, and Dashboard Stay 100% Synchronized
const activeTab = computed({
  get: () => applicantStore.activeTab,
  set: (val) => applicantStore.setActiveTab(val),
});

const candidateName = computed(() => {
  return applicantStore.state.candidate.fullName || authStore.currentUser?.full_name || 'Calon Mahasiswa';
});

const candidateEmail = computed(() => {
  return applicantStore.state.candidate.email || authStore.currentUser?.email || '';
});

const candidateRegNo = computed(() => {
  return applicantStore.state.candidate.registrationNumber;
});

const statusThemeClass = computed(() => {
  const theme = applicantStore.overallStatus.theme;
  if (theme === 'emerald') return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
  if (theme === 'blue') return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
  if (theme === 'indigo') return 'bg-indigo-500/25 text-indigo-200 border-indigo-400/30';
  if (theme === 'amber') return 'bg-amber-400/20 text-amber-300 border-amber-300/30';
  return 'bg-white/10 text-blue-100 border-white/15';
});

const statusDotClass = computed(() => {
  const theme = applicantStore.overallStatus.theme;
  if (theme === 'emerald') return 'bg-emerald-400 animate-pulse';
  if (theme === 'blue') return 'bg-blue-400 animate-pulse';
  if (theme === 'indigo') return 'bg-indigo-400 animate-pulse';
  if (theme === 'amber') return 'bg-amber-400 animate-pulse';
  return 'bg-slate-300';
});

const currentStageLabel = computed(() => {
  if (applicantStore.isResultPassed) return 'Dinyatakan Lulus Seleksi';
  if (applicantStore.isExamCompleted) return 'Selesai Ujian CBT';
  if (applicantStore.isRegPaymentComplete) return 'Sesi Ujian CBT Aktif';
  if (applicantStore.isDocumentsComplete) return 'Berkas Persyaratan Lengkap';
  if (applicantStore.isAdmissionComplete) return 'Pilihan Prodi Terpilih';
  if (applicantStore.isProfileComplete) return 'Biodata Terisi Lengkap';
  return 'Pengisian Formulir Pendaftaran';
});

// Rekomendasi langkah selanjutnya dinamis
const nextActionInfo = computed(() => {
  if (!applicantStore.isProfileComplete) {
    return {
      title: 'Lengkapi Biodata & Identitas Pribadi',
      desc: 'Mohon lengkapi NIK, asal sekolah, alamat domisili, dan data orang tua untuk verifikasi berkas pendaftaran.',
      cta: 'Lengkapi Data Saya',
      tab: 'profile',
      section: 'section-pribadi',
      badge: 'Prioritas 1: Biodata',
      theme: 'amber',
    };
  }
  if (!applicantStore.isAdmissionComplete) {
    return {
      title: 'Tentukan Jalur & Program Studi Pilihan',
      desc: 'Pilih jalur pendaftaran (Reguler/Prestasi) serta Program Studi Pilihan 1 & 2 impian Anda di Universitas BTH.',
      cta: 'Pilih Jalur & Prodi',
      tab: 'admission',
      section: null,
      badge: 'Prioritas 2: Program Studi',
      theme: 'blue',
    };
  }
  if (!applicantStore.isDocumentsComplete) {
    return {
      title: 'Unggah Berkas Persyaratan Pendaftaran',
      desc: `Baru ${applicantStore.uploadedDocsCount} dari 5 berkas diunggah. Unggah scan KTP, Ijazah/SKL, dan pas foto resmi Anda.`,
      cta: 'Unggah Berkas Sekarang',
      tab: 'documents',
      section: null,
      badge: 'Prioritas 3: Berkas',
      theme: 'indigo',
    };
  }
  if (!applicantStore.isRegPaymentComplete) {
    return {
      title: 'Selesaikan Pembayaran Biaya Pendaftaran',
      desc: 'Selesaikan pembayaran biaya registrasi formulir PMB sebesar Rp 250.000 agar sesi Ujian CBT Online aktif.',
      cta: 'Bayar Biaya Pendaftaran',
      tab: 'payment',
      section: null,
      badge: 'Prioritas 4: Pembayaran',
      theme: 'amber',
    };
  }
  if (!applicantStore.isExamCompleted) {
    return {
      title: 'Sesi Ujian CBT Online Telah Aktif',
      desc: 'Anda siap mengikuti Computer-Based Test (CBT) PMB BTH secara fleksibel online dengan sistem proctoring modern.',
      cta: 'Mulai Ujian CBT Sekarang',
      tab: 'exam',
      section: null,
      badge: 'Prioritas 5: Ujian CBT',
      theme: 'emerald',
    };
  }
  if (!applicantStore.isResultPassed) {
    return {
      title: 'Ujian Selesai - Verifikasi Nilai CBT',
      desc: `Skor CBT Anda (${applicantStore.state.exam.score}/100) sedang ditinjau panitia PMB. Pengumuman resmi maksimal 1x24 jam.`,
      cta: 'Lihat Status Kelulusan',
      tab: 'result',
      section: null,
      badge: 'Menunggu Hasil',
      theme: 'blue',
    };
  }
  if (!applicantStore.isUktPaid) {
    return {
      title: 'Selamat! Anda Dinyatakan LULUS Seleksi PMB',
      desc: `Diterima di ${applicantStore.state.admission.prodi1}. Unduh Surat Penerimaan (LoA) & selesaikan Daftar Ulang UKT.`,
      cta: 'Daftar Ulang & Bayar UKT',
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

const nextActionCardClass = computed(() => {
  const theme = nextActionInfo.value.theme;
  if (theme === 'emerald') return 'bg-emerald-50/70 border-emerald-200 text-emerald-950';
  if (theme === 'blue') return 'bg-blue-50/70 border-blue-200 text-blue-950';
  if (theme === 'indigo') return 'bg-indigo-50/70 border-indigo-200 text-indigo-950';
  return 'bg-amber-50/70 border-amber-200 text-amber-950';
});

const nextActionBadgeClass = computed(() => {
  const theme = nextActionInfo.value.theme;
  if (theme === 'emerald') return 'bg-emerald-100 text-emerald-800';
  if (theme === 'blue') return 'bg-blue-100 text-blue-800';
  if (theme === 'indigo') return 'bg-indigo-100 text-indigo-800';
  return 'bg-amber-100 text-amber-800';
});

const nextActionDotClass = computed(() => {
  const theme = nextActionInfo.value.theme;
  if (theme === 'emerald') return 'bg-emerald-500';
  if (theme === 'blue') return 'bg-blue-500';
  if (theme === 'indigo') return 'bg-indigo-500';
  return 'bg-amber-500';
});

const nextActionButtonClass = computed(() => {
  const theme = nextActionInfo.value.theme;
  if (theme === 'emerald') return 'bg-emerald-700 hover:bg-emerald-800';
  if (theme === 'blue') return 'bg-[#1E3A8A] hover:bg-[#172554]';
  if (theme === 'indigo') return 'bg-indigo-700 hover:bg-indigo-800';
  return 'bg-amber-600 hover:bg-amber-700';
});

const handleNextAction = (tab, section = null) => {
  applicantStore.setActiveTab(tab, section);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const steps = computed(() => [
  {
    id: 'profile',
    number: 1,
    title: 'Profil & Biodata',
    statusText: applicantStore.isProfileComplete ? 'Terisi Lengkap' : 'Belum Lengkap',
    isCompleted: applicantStore.isProfileComplete,
  },
  {
    id: 'admission',
    number: 2,
    title: 'Jalur & Prodi',
    statusText: applicantStore.state.admission.prodi1 || 'Pilih Prodi',
    isCompleted: applicantStore.isAdmissionComplete,
  },
  {
    id: 'documents',
    number: 3,
    title: 'Berkas Dokumen',
    statusText: `${applicantStore.uploadedDocsCount}/5 Diunggah`,
    isCompleted: applicantStore.isDocumentsComplete,
  },
  {
    id: 'payment',
    number: 4,
    title: 'Biaya Formulir',
    statusText: applicantStore.isRegPaymentComplete ? 'Formulir Lunas' : 'Belum Bayar',
    isCompleted: applicantStore.isRegPaymentComplete,
  },
  {
    id: 'exam',
    number: 5,
    title: 'Jadwal & CBT',
    statusText: applicantStore.isExamCompleted ? `Skor ${applicantStore.state.exam.score}/100` : applicantStore.isRegPaymentComplete ? 'Siap Ujian' : 'Menunggu Bayar',
    isCompleted: applicantStore.isExamCompleted,
  },
  {
    id: 'result',
    number: 6,
    title: 'Hasil & LoA',
    statusText: applicantStore.isResultPassed ? 'Lulus Seleksi' : applicantStore.isExamCompleted ? 'Hasil Diproses' : 'Menunggu Ujian',
    isCompleted: applicantStore.isResultPassed,
  },
]);

const copyRegNumber = async () => {
  const regNo = candidateRegNo.value;
  try {
    await navigator.clipboard.writeText(regNo);
    toastMessage.value = `Nomor Registrasi (${regNo}) berhasil disalin ke papan klip.`;
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
