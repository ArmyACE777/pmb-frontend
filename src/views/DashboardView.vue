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

    <!-- Top Academic Welcome Banner (BTH Almamater Style) -->
    <div class="bg-gradient-to-r from-[#1E3A8A] via-[#1b3478] to-[#12285a] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-bth relative overflow-hidden border border-blue-900/40">
      <!-- Watermark Lambang BTH -->
      <img
        src="/assets/icons/bth.png"
        alt="BTH Motif"
        class="absolute -right-12 -bottom-12 w-64 opacity-5 pointer-events-none select-none filter invert"
      />

      <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="max-w-2xl space-y-3">
          <!-- Gelombang & Akreditasi Badge -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/30 text-amber-300 rounded-full text-xs font-semibold font-sora">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              {{ applicantStore.state.admission.track }}
            </span>
            <span class="px-2.5 py-1 bg-white/10 text-blue-100 rounded-full text-xs font-mono">
              TA {{ applicantStore.state.admission.academicYear }}
            </span>
            <span class="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-semibold">
              Terakreditasi BAN-PT & LAM-PTKes
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-sora font-extrabold text-white tracking-tight leading-tight">
            Selamat Datang, {{ applicantStore.state.candidate.fullName }}
          </h1>
          <p class="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
            Portal resmi pendaftaran mahasiswa baru <strong>Universitas Bakti Tunas Husada</strong>. Kelola data diri, pantau berkas, ikuti ujian CBT online, dan unduh dokumen kelulusan resmi.
          </p>

          <!-- Nomor Registrasi & Info Bar -->
          <div class="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <div class="inline-flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 font-mono">
              <span class="text-blue-300">No. Registrasi:</span>
              <span class="font-bold text-white tracking-wider">{{ applicantStore.state.candidate.registrationNumber }}</span>
              <button
                @click="copyRegNumber"
                class="text-amber-300 hover:text-amber-200 transition-colors ml-1 cursor-pointer"
                title="Salin Nomor Registrasi"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <span class="bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-blue-200 font-mono">
              {{ applicantStore.state.candidate.email }}
            </span>
            <span class="bg-emerald-500/90 text-white font-semibold px-3 py-1.5 rounded-xl uppercase tracking-wider text-[11px] shadow-xs">
              {{ applicantStore.state.admission.status }}
            </span>
          </div>
        </div>

        <!-- Dynamic Circular Progress Gauge Card -->
        <div class="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex items-center gap-4 flex-shrink-0">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                class="text-white/20"
                stroke-width="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="text-amber-400"
                stroke-width="3.5"
                stroke-dasharray="75, 100"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span class="absolute font-sora font-bold text-sm text-white">75%</span>
          </div>
          <div>
            <span class="text-xs font-sora font-bold text-white block">Progres Pendaftaran</span>
            <span class="text-[11px] text-blue-200 block mt-0.5">6 dari 8 Tahap Selesai</span>
            <span class="text-[11px] font-semibold text-amber-300 mt-1 block">
              Dinyatakan Lulus Seleksi
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stepper Navigation: 8 Tahap PMB BTH -->
    <div class="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-5 mb-6">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
            Alur Tahapan Pendaftaran Mahasiswa Baru
          </h2>
          <p class="text-xs text-slate-500">
            Pilih menu tahapan di bawah untuk mengelola data dan melihat rincian proses seleksi.
          </p>
        </div>
        <button
          @click="resetStoreData"
          class="text-[11px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          title="Kembalikan ke data awal bawaan"
        >
          Reset Demo Data
        </button>
      </div>

      <!-- Steps Buttons Horizontal Scroll / Wrap Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <button
          v-for="step in steps"
          :key="step.id"
          @click="activeTab = step.id"
          class="p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between group text-left cursor-pointer"
          :class="activeTab === step.id
            ? 'bg-blue-50/90 border-[#1E3A8A] text-[#1E3A8A] ring-2 ring-blue-100'
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

    <!-- Active Component Container -->
    <main class="animate-fadeIn pb-12">
      <!-- 1. Applicant Profile -->
      <ProfileModule v-if="activeTab === 'profile'" />

      <!-- 2. Admission & Track Selection -->
      <AdmissionModule v-else-if="activeTab === 'admission'" />

      <!-- 3. Document Management -->
      <DocumentModule v-else-if="activeTab === 'documents'" />

      <!-- 4. Payment & Finance -->
      <PaymentModule v-else-if="activeTab === 'payment'" />

      <!-- 5. Selection & Schedule -->
      <ScheduleModule v-else-if="activeTab === 'schedule'" @switch-tab="switchTab" />

      <!-- 6. Exam CBT Portal -->
      <ExamModule v-else-if="activeTab === 'exam'" @switch-tab="switchTab" />

      <!-- 7. Selection Result & Re-registration -->
      <ResultModule v-else-if="activeTab === 'result'" @switch-tab="switchTab" />

      <!-- 8. NIM & Student Onboarding -->
      <OnboardingModule v-else-if="activeTab === 'onboarding'" />
    </main>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useApplicantStore } from '@/stores/applicant';

// Import 8 Tahap 1 Modules
import ProfileModule from '@/components/applicant/ProfileModule.vue';
import AdmissionModule from '@/components/applicant/AdmissionModule.vue';
import DocumentModule from '@/components/applicant/DocumentModule.vue';
import PaymentModule from '@/components/applicant/PaymentModule.vue';
import ScheduleModule from '@/components/applicant/ScheduleModule.vue';
import ExamModule from '@/components/applicant/ExamModule.vue';
import ResultModule from '@/components/applicant/ResultModule.vue';
import OnboardingModule from '@/components/applicant/OnboardingModule.vue';

const applicantStore = useApplicantStore();
const activeTab = ref('profile');
const toastMessage = ref('');

const steps = computed(() => [
  {
    id: 'profile',
    number: 1,
    title: 'Profil & Biodata',
    statusText: 'Terverifikasi',
    isCompleted: true,
  },
  {
    id: 'admission',
    number: 2,
    title: 'Jalur & Prodi',
    statusText: applicantStore.state.admission.prodi1,
    isCompleted: true,
  },
  {
    id: 'documents',
    number: 3,
    title: 'Berkas Dokumen',
    statusText: '4/5 Disetujui',
    isCompleted: true,
  },
  {
    id: 'payment',
    number: 4,
    title: 'Keuangan & UKT',
    statusText: applicantStore.state.payments.uktFee.status === 'paid' ? 'Semua Lunas' : 'Formulir Lunas',
    isCompleted: applicantStore.state.payments.uktFee.status === 'paid',
  },
  {
    id: 'schedule',
    number: 5,
    title: 'Jadwal & Ruang',
    statusText: 'Terjadwal',
    isCompleted: true,
  },
  {
    id: 'exam',
    number: 6,
    title: 'Ujian CBT',
    statusText: `Skor ${applicantStore.state.exam.score}/100`,
    isCompleted: applicantStore.state.exam.status === 'completed',
  },
  {
    id: 'result',
    number: 7,
    title: 'Hasil Kelulusan',
    statusText: 'Diterima S1 Farmasi',
    isCompleted: applicantStore.state.result.isPassed,
  },
  {
    id: 'onboarding',
    number: 8,
    title: 'NIM & KTM',
    statusText: `NIM ${applicantStore.state.onboarding.nim}`,
    isCompleted: true,
  },
]);

const copyRegNumber = async () => {
  const regNo = applicantStore.state.candidate.registrationNumber;
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

const resetStoreData = () => {
  if (confirm('Kembalikan seluruh data profil, dokumen, dan ujian ke data bawaan awal BTH?')) {
    applicantStore.resetAllData();
    toastMessage.value = 'Data bawaan pendaftaran berhasil di-reset.';
  }
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
