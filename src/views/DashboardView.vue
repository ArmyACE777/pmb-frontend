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
    <div class="bg-gradient-to-r from-[#1E3A8A] via-[#1b3478] to-[#12285a] text-white rounded-3xl p-6 sm:p-7 mb-7 shadow-bth relative overflow-hidden border border-blue-900/30">
      <!-- Watermark Lambang BTH -->
      <img
        src="/assets/icons/bth.png"
        alt="BTH Motif"
        class="absolute -right-8 -bottom-10 w-56 opacity-5 pointer-events-none select-none filter invert"
      />

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <!-- Left Side: Greetings & Identity -->
        <div class="space-y-2.5">
          <!-- Jalur & TA Pill -->
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs text-blue-100 rounded-full text-xs font-sora border border-white/10">
            <span class="font-semibold">{{ applicantStore.state.admission.track }}</span>
            <span class="text-white/40">•</span>
            <span class="font-mono text-blue-200">TA {{ applicantStore.state.admission.academicYear }}</span>
          </div>

          <div>
            <h1 class="text-2xl sm:text-3xl font-sora font-extrabold text-white tracking-tight leading-tight">
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
          <div class="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <!-- No Registrasi -->
            <div class="inline-flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 font-mono text-xs">
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
              class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-sora font-semibold text-xs border shadow-xs transition-all"
              :class="statusThemeClass"
            >
              <span class="w-2 h-2 rounded-full" :class="statusDotClass"></span>
              <span>{{ applicantStore.overallStatus.label }}</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Dynamic Circular Progress Gauge Card -->
        <div class="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-2xl flex items-center gap-4 flex-shrink-0 min-w-[240px] sm:min-w-[270px] shadow-sm self-start md:self-center">
          <!-- Circular Progress Ring (explicit w-16 h-16) -->
          <div class="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <svg class="w-16 h-16 transform -rotate-90 block" viewBox="0 0 36 36">
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
            <span class="absolute font-sora font-extrabold text-sm text-white inset-0 flex items-center justify-center pointer-events-none">
              {{ applicantStore.progressPercent }}%
            </span>
          </div>

          <!-- Progress Details -->
          <div class="flex-1 min-w-0">
            <span class="text-[10px] font-bold tracking-wider text-blue-200 uppercase font-sora block">
              Progres Pendaftaran
            </span>
            <span class="text-xs font-bold text-white block mt-0.5 font-sans">
              {{ applicantStore.completedStepsCount }} dari 6 Tahap Selesai
            </span>
            <div class="text-[11px] font-semibold text-amber-300 mt-1 truncate font-sora">
              {{ currentStageLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stepper Navigation: 6 Tahap Alur PMB BTH -->
    <div class="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-5 mb-6">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
            Alur Tahapan Pendaftaran
          </h2>
          <p class="text-xs text-slate-500">
            Pilih menu tahapan di bawah untuk melengkapi berkas, mengikuti ujian CBT, dan melihat kelulusan.
          </p>
        </div>
      </div>

      <!-- Steps Buttons Grid (6 Tahap) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          v-for="step in steps"
          :key="step.id"
          @click="activeTab = step.id"
          class="p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between group cursor-pointer"
          :class="activeTab === step.id
            ? 'bg-blue-50/90 border-[#1E3A8A] text-[#1E3A8A] ring-2 ring-blue-100 shadow-xs'
            : step.isCompleted
              ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
              : 'bg-white border-slate-200/60 hover:bg-slate-50 text-slate-500'"
        >
          <!-- Step Indicator Icon/Number -->
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors"
            :class="activeTab === step.id
              ? 'bg-[#1E3A8A] text-white'
              : step.isCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-600'"
          >
            <span v-if="step.isCompleted && activeTab !== step.id">✓</span>
            <span v-else>{{ step.number }}</span>
          </div>

          <div class="text-[11px] font-sora font-bold leading-tight text-center w-full"
               :class="activeTab === step.id ? 'text-[#1E3A8A]' : 'text-slate-800'">
            {{ step.title }}
          </div>

          <div class="text-[10px] text-center mt-0.5 truncate w-full"
               :class="step.isCompleted ? 'text-emerald-700 font-medium' : 'text-slate-400'">
            {{ step.statusText }}
          </div>
        </button>
      </div>
    </div>

    <!-- Active Component Container (6 Tahap Terpadu) -->
    <main class="animate-fadeIn pb-12">
      <!-- 1. Applicant Profile (identity-service) -->
      <ProfileModule v-if="activeTab === 'profile'" />

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
import { ref, computed } from 'vue';
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

const applicantStore = useApplicantStore();
const authStore = useAuthStore();
const activeTab = ref('profile');
const toastMessage = ref('');

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
  activeTab.value = tabId;
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
