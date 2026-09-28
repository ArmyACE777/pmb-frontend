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
      <!-- 1. Hero Card: Identitas Resmi Calon Mahasiswa & Status Seleksi -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <!-- Left: Identitas Calon Mahasiswa -->
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-blue-700 text-white font-sora font-bold text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-xs border border-blue-800/20 overflow-hidden">
              <img
                v-if="candidatePhoto"
                :src="candidatePhoto"
                alt="Foto Profil Calon Mahasiswa"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ candidateInitials }}</span>
            </div>

            <div class="space-y-1 min-w-0">
              <div class="flex items-center gap-2">
                <h1 class="text-base sm:text-lg font-sora font-bold text-slate-900 tracking-tight capitalize truncate">
                  {{ candidateName }}
                </h1>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1E3A8A] border border-blue-200 font-semibold hidden xs:inline-block">
                  PMB 2026
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-sans">
                <span>No. Reg: <strong class="font-mono text-slate-800 font-semibold">{{ candidateRegNo }}</strong></span>
                <button
                  @click="copyRegNumber"
                  class="text-slate-400 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                  title="Salin Nomor Registrasi"
                >
                  <Copy class="w-3.5 h-3.5" />
                </button>
                <span class="text-slate-300">•</span>
                <span class="text-slate-700 font-medium">{{ applicantStore.state?.admission?.track || 'Jalur Reguler Gelombang 1' }}</span>
                <template v-if="applicantStore.state?.admission?.prodi1">
                  <span class="text-slate-300">•</span>
                  <span class="font-semibold text-slate-900">{{ applicantStore.state.admission.prodi1 }}</span>
                  <span class="text-slate-500 text-[11px]">({{ applicantStore.state?.admission?.prodi1Degree || 'S1' }})</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Right: Status Seleksi Resmi -->
          <div class="flex flex-col sm:items-end gap-1.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
            <span class="text-[11px] font-sans text-slate-400 font-medium">Status Pendaftaran Resmi</span>
            <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-2xs"
              :class="statusBadgeClass"
            >
              <span class="w-2 h-2 rounded-full" :class="statusDotColor"></span>
              <span>{{ applicantStore.overallStatus.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Alur Tahapan Pendaftaran: Connected Milestone Stepper (Terstruktur, Single-Action, Non-AI) -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-5">
        <!-- Header Stepper & Progress Metric -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Tahapan Pendaftaran & Seleksi Masuk
            </h2>
            <p class="text-xs text-slate-500 mt-0.5 font-sans">
              Pantau progres penyelesaian 6 tahapan resmi PMB Universitas Bakti Tunas Husada.
            </p>
          </div>

          <!-- Progress Bar -->
          <div class="flex items-center gap-3 self-start sm:self-auto">
            <div class="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-[#1E3A8A] rounded-full transition-all duration-500"
                :style="{ width: `${(applicantStore.completedStepsCount / 6) * 100}%` }"
              ></div>
            </div>
            <span class="font-sora font-semibold text-xs text-slate-700 whitespace-nowrap">
              {{ applicantStore.completedStepsCount }} / 6 Selesai
            </span>
          </div>
        </div>

        <!-- 6 Step Connected Bar -->
        <div class="py-1">
          <div class="relative">
            <!-- Connecting Line between step nodes (Visible on lg+) -->
            <div class="hidden lg:block absolute top-4 left-10 right-10 h-0.5 bg-slate-100 -z-0">
              <div
                class="h-full bg-emerald-500 transition-all duration-500"
                :style="{ width: `${Math.min(100, Math.max(0, ((applicantStore.completedStepsCount - 1) / 5) * 100))}%` }"
              ></div>
            </div>

            <!-- 6 Nodes Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-2 relative z-10">
              <button
                v-for="(step, idx) in steps"
                :key="step.id"
                @click="switchTab(step.id)"
                class="group flex flex-col items-center text-center p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-50 focus:outline-none"
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

                <!-- Subtitle Text -->
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

        <!-- Integrated Next Action (Ringkas, Terarah, Menyatu) -->
        <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 -mx-5 sm:-mx-7 -mb-5 sm:-mb-7 px-5 sm:px-7 py-3.5 rounded-b-2xl">
          <div class="flex items-center gap-3">
            <span class="text-xs font-sora font-semibold text-slate-700">Langkah Aktif:</span>
            <span class="text-xs font-sora font-bold text-[#1E3A8A]">{{ nextActionInfo.title }}</span>
          </div>

          <button
            @click="handleNextAction(nextActionInfo.tab, nextActionInfo.section)"
            class="rounded-lg px-4 py-2 font-medium text-xs text-white bg-[#1E3A8A] hover:bg-[#172554] transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-2xs"
          >
            <span>{{ nextActionInfo.cta }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- 3. Dua Kolom Informasi Esensial: Jadwal Seleksi PMB & Status Administrasi Cepat -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Kolom Kiri: Agenda & Timeline Resmi PMB BTH (Col 7) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <Calendar class="w-4 h-4 text-[#1E3A8A]" />
                <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                  Jadwal & Agenda Seleksi PMB
                </h3>
              </div>
              <span class="text-[11px] font-mono font-semibold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                T.A. 2026/2027
              </span>
            </div>

            <!-- List Timeline Terstruktur -->
            <div class="space-y-3">
              <div
                v-for="(item, idx) in timelineEvents"
                :key="idx"
                class="p-3.5 rounded-xl border transition-all flex items-start gap-3.5 text-xs font-sans"
                :class="item.isDone
                  ? 'bg-emerald-50/40 border-emerald-200/70'
                  : item.isActive
                    ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100'
                    : 'bg-slate-50/60 border-slate-100'"
              >
                <!-- Indicator Bullet -->
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-bold"
                  :class="item.isDone
                    ? 'bg-emerald-600 text-white'
                    : item.isActive
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-slate-200 text-slate-500'"
                >
                  <Check v-if="item.isDone" class="w-3.5 h-3.5 stroke-[2.5]" />
                  <span v-else>{{ idx + 1 }}</span>
                </div>

                <!-- Event Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 class="font-sora font-semibold text-slate-900 text-xs">
                      {{ item.title }}
                    </h4>
                    <span
                      class="text-[11px] font-medium font-sans whitespace-nowrap"
                      :class="item.isDone ? 'text-emerald-700' : item.isActive ? 'text-[#1E3A8A] font-semibold' : 'text-slate-500'"
                    >
                      {{ item.date }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {{ item.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Ringkasan Administrasi & Kontak Layanan BTH (Col 5) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Card Ringkasan Berkas & Biaya -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <h3 class="font-sora font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Ringkasan Dokumen & Pembayaran
            </h3>

            <!-- Item Berkas -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <FileText class="w-4 h-4 text-slate-500" />
                <div>
                  <div class="font-medium text-slate-800">Berkas Persyaratan</div>
                  <div class="text-[11px] text-slate-500">
                    {{ applicantStore.uploadedDocsCount }} dari 5 berkas diunggah
                  </div>
                </div>
              </div>
              <button
                @click="switchTab('documents')"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
              >
                Buka Berkas
              </button>
            </div>

            <!-- Item Biaya Pendaftaran -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <CreditCard class="w-4 h-4 text-slate-500" />
                <div>
                  <div class="font-medium text-slate-800">Biaya Formulir PMB</div>
                  <div class="text-[11px]" :class="applicantStore.isRegPaymentComplete ? 'text-emerald-700 font-semibold' : 'text-amber-700'">
                    {{ applicantStore.isRegPaymentComplete ? 'Lunas (Rp 250.000)' : 'Menunggu Bayar (Rp 250.000)' }}
                  </div>
                </div>
              </div>
              <button
                @click="switchTab('payment')"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
              >
                {{ applicantStore.isRegPaymentComplete ? 'Bukti Bayar' : 'Bayar Sekarang' }}
              </button>
            </div>

            <!-- Item CBT / Seleksi -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <ClipboardCheck class="w-4 h-4 text-slate-500" />
                <div>
                  <div class="font-medium text-slate-800">Ujian Mandiri CBT</div>
                  <div class="text-[11px]" :class="applicantStore.isExamCompleted ? 'text-emerald-700 font-semibold' : 'text-slate-500'">
                    {{ applicantStore.isExamCompleted ? `Skor: ${applicantStore.state.exam.score}/100` : applicantStore.isRegPaymentComplete ? 'Sesi CBT Siap Dikerjakan' : 'Menunggu Bayar Formulir' }}
                  </div>
                </div>
              </div>
              <button
                @click="switchTab('exam')"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
              >
                Buka CBT
              </button>
            </div>
          </div>

          <!-- Card Layanan Bantuan Resmi Universitas BTH -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3 text-xs font-sans">
            <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building class="w-4 h-4 text-[#1E3A8A]" />
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                Pusat Layanan PMB BTH
              </h3>
            </div>

            <div class="space-y-2 text-[11px] text-slate-600 leading-relaxed">
              <div class="flex items-start gap-2">
                <MapPin class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>Gedung Rektorat Lt. 1, Universitas Bakti Tunas Husada, Jl. Cilolohan No. 36 Kota Tasikmalaya.</span>
              </div>

              <div class="flex items-center gap-2">
                <Clock class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Senin - Jumat: 08.00 - 16.00 WIB | Sabtu: 08.00 - 13.00 WIB</span>
              </div>

              <div class="flex items-center gap-2">
                <Phone class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Hotline: (0265) 334111 | WhatsApp: <strong>0812-2026-BTH</strong></span>
              </div>
            </div>
          </div>
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
      <PaymentModule v-else-if="activeTab === 'payment'" @switch-tab="switchTab" />

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
  LifeBuoy,
  RotateCcw,
  BookOpen,
  Calendar,
  Building,
  MapPin,
  Phone,
  Clock
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
  return applicantStore.state?.candidate?.fullName || authStore.currentUser?.full_name || 'Calon Mahasiswa';
});

const candidateInitials = computed(() => {
  const name = (candidateName.value || '').trim();
  if (!name) return 'CM';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
});

const candidatePhoto = computed(() => {
  return applicantStore.candidatePhoto || authStore.currentUser?.avatar || null;
});

const candidateRegNo = computed(() => {
  return applicantStore.state?.candidate?.registrationNumber || 'BTH-2026-REG-00000';
});

const statusBadgeClass = computed(() => {
  const theme = applicantStore.overallStatus.theme;
  if (theme === 'emerald') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (theme === 'blue') return 'bg-blue-50 text-[#1E3A8A] border-blue-200';
  if (theme === 'indigo') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (theme === 'amber') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (theme === 'rose') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
});

const statusDotColor = computed(() => {
  const theme = applicantStore.overallStatus.theme;
  if (theme === 'emerald') return 'bg-emerald-500';
  if (theme === 'blue') return 'bg-blue-600';
  if (theme === 'indigo') return 'bg-indigo-600';
  if (theme === 'amber') return 'bg-amber-500';
  if (theme === 'rose') return 'bg-rose-500';
  return 'bg-slate-400';
});

const currentStageLabel = computed(() => {
  if (applicantStore.isResultPassed) return 'Dinyatakan Lulus Seleksi';
  if (applicantStore.isExamFailed) return 'Belum Lulus Seleksi (Bisa Tambah Pendaftaran)';
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
  if (!applicantStore.isRegPaymentComplete) {
    return {
      title: 'Selesaikan Pembayaran Biaya Pendaftaran',
      desc: 'Selesaikan pembayaran biaya registrasi formulir PMB sebesar Rp 250.000 agar sesi pendaftaran dan Ujian CBT Online aktif.',
      cta: 'Bayar Biaya Pendaftaran Sekarang',
      tab: 'payment',
      section: null,
      badge: 'Langkah 3: Biaya Pendaftaran',
      theme: 'amber',
      icon: CreditCard,
    };
  }
  if (!applicantStore.isDocumentsComplete) {
    return {
      title: 'Unggah Berkas Persyaratan Pendaftaran',
      desc: `Baru ${applicantStore.uploadedDocsCount} dari 5 berkas diunggah. Silakan lengkapi pindaian KTP, Ijazah/SKL, dan pasfoto resmi Anda.`,
      cta: 'Unggah Berkas Dokumen',
      tab: 'documents',
      section: null,
      badge: 'Langkah 4: Berkas Dokumen',
      theme: 'blue',
      icon: FileText,
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
    if (applicantStore.isExamFailed) {
      return {
        title: 'Hasil Seleksi: Belum Memenuhi Syarat Kelulusan',
        desc: `Nilai CBT Anda (${applicantStore.state?.exam?.score ?? 0}/100) belum mencapai ambang batas 70. Silakan tambah pendaftaran baru untuk memilih jalur atau prodi lain.`,
        cta: 'Tambah Pendaftaran Jalur / Pilihan Lain',
        tab: 'result',
        section: null,
        badge: 'Belum Lulus Seleksi',
        theme: 'rose',
        icon: RotateCcw,
      };
    }
    return {
      title: 'Ujian Selesai - Verifikasi Nilai CBT',
      desc: `Skor CBT Anda (${applicantStore.state?.exam?.score ?? 0}/100) sedang ditinjau panitia PMB. Pengumuman resmi maksimal 1x24 jam.`,
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
      desc: `Diterima di ${applicantStore.state?.admission?.prodi1 || 'Program Studi Pilihan'}. Unduh Surat Penerimaan (LoA) & selesaikan registrasi ulang UKT.`,
      cta: 'Daftar Ulang & Pembayaran UKT',
      tab: 'result',
      section: null,
      badge: 'Lulus Seleksi',
      theme: 'emerald',
    };
  }
  return {
    title: 'Daftar Ulang Selesai - Resmi Menjadi Mahasiswa BTH!',
    desc: `NIM resmi Anda: ${applicantStore.state?.onboarding?.nim || 'resmi'}. Silakan persiapkan diri menyambut kegiatan PKKMB 2026.`,
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
    statusText: applicantStore.state?.admission?.prodi1 || 'Pilih Prodi & Jalur',
    isCompleted: applicantStore.isAdmissionComplete,
    isCurrent: applicantStore.isProfileComplete && !applicantStore.isAdmissionComplete,
    icon: Compass,
  },
  {
    id: 'payment',
    number: 3,
    title: 'Biaya Pendaftaran',
    statusText: applicantStore.isRegPaymentComplete ? 'Lunas' : 'Rp 250.000',
    isCompleted: applicantStore.isRegPaymentComplete,
    isCurrent: applicantStore.isAdmissionComplete && !applicantStore.isRegPaymentComplete,
    icon: CreditCard,
  },
  {
    id: 'documents',
    number: 4,
    title: 'Berkas Dokumen',
    statusText: applicantStore.isDocumentsComplete ? 'Lengkap (5/5)' : `${applicantStore.uploadedDocsCount}/5 Diunggah`,
    isCompleted: applicantStore.isDocumentsComplete,
    isCurrent: applicantStore.isRegPaymentComplete && !applicantStore.isDocumentsComplete,
    icon: FileText,
  },
  {
    id: 'exam',
    number: 5,
    title: 'Proses Seleksi',
    statusText: applicantStore.isExamCompleted ? `Skor ${applicantStore.state?.exam?.score ?? 0}/100` : applicantStore.isRegPaymentComplete ? 'CBT & Lisan' : 'Menunggu Bayar',
    isCompleted: applicantStore.isExamCompleted,
    isCurrent: applicantStore.isRegPaymentComplete && !applicantStore.isExamCompleted,
    icon: ClipboardCheck,
  },
  {
    id: 'result',
    number: 6,
    title: 'Daftar Ulang',
    statusText: applicantStore.isResultPassed ? 'Lulus Seleksi' : applicantStore.isExamFailed ? 'Tidak Lulus' : applicantStore.isExamCompleted ? 'Diproses' : 'Menunggu Seleksi',
    isCompleted: applicantStore.isResultPassed,
    isCurrent: applicantStore.isExamCompleted && !applicantStore.isResultPassed,
    icon: GraduationCap,
  },
]);

const timelineEvents = computed(() => [
  {
    title: 'Pengisian Formulir Biodata & Berkas Dokumen',
    date: 'Aktif Berjalan',
    desc: 'Melengkapi profil identitas, pilihan program studi, dan berkas persyaratan resmi.',
    isDone: applicantStore.isProfileComplete && applicantStore.isAdmissionComplete && applicantStore.isDocumentsComplete,
    isActive: !applicantStore.isProfileComplete || !applicantStore.isAdmissionComplete || !applicantStore.isDocumentsComplete,
  },
  {
    title: 'Pembayaran Formulir Pendaftaran',
    date: 'Batas: 3 Hari Kerja',
    desc: 'Pembayaran Rp 250.000 via Virtual Account BSI / Mandiri untuk aktivasi sesi Ujian CBT.',
    isDone: applicantStore.isRegPaymentComplete,
    isActive: applicantStore.isAdmissionComplete && !applicantStore.isRegPaymentComplete,
  },
  {
    title: 'Ujian Mandiri Berbasis Komputer (CBT) & Wawancara',
    date: applicantStore.state.schedule?.cbt?.date || 'Sesuai Jadwal Sesi',
    desc: 'Pelaksanaan ujian potensi akademik daring dan presensi tes lisan / wawancara.',
    isDone: applicantStore.isExamCompleted,
    isActive: applicantStore.isRegPaymentComplete && !applicantStore.isExamCompleted,
  },
  {
    title: 'Pengumuman Kelulusan & Surat Penerimaan (LoA)',
    date: applicantStore.state.schedule?.announcementDate || 'Jadwal Pengumuman',
    desc: 'Pengumuman resmi SK Rektor dan penerbitan Letter of Acceptance (LoA).',
    isDone: applicantStore.isResultPassed,
    isActive: applicantStore.isExamCompleted && !applicantStore.isResultPassed,
  },
  {
    title: 'Daftar Ulang & Pembayaran UKT Semester 1',
    date: 'Masa Registrasi Ulang',
    desc: 'Pelunasan UKT semester 1 dan penerbitan Nomor Induk Mahasiswa (NIM) resmi BTH.',
    isDone: applicantStore.isUktPaid,
    isActive: applicantStore.isResultPassed && !applicantStore.isUktPaid,
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
