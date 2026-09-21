<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#2563EB] selection:text-white">
    <!-- Top Institutional Navbar for Admin -->
    <header class="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs backdrop-blur-md bg-white/95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <!-- Brand Info with Crest & Admin Role Badge -->
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 p-1 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs">
            <img src="/assets/icons/bth.png" alt="Logo Universitas BTH" class="h-8 w-8 object-contain" />
          </div>
          <div>
            <div class="font-sora font-extrabold text-slate-900 text-sm sm:text-base leading-snug tracking-tight flex items-center gap-2">
              <span>Universitas Bakti Tunas Husada</span>
              <span class="px-2 py-0.5 bg-[#1E3A8A] text-white text-[10px] font-bold rounded font-mono uppercase tracking-wider">
                PANITIA PMB
              </span>
            </div>
            <div class="text-[11px] sm:text-xs text-[#2563EB] font-semibold flex items-center gap-1.5">
              <span>Portal Administrator & Seleksi Penerimaan</span>
              <span class="text-slate-300">•</span>
              <span class="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-medium">Gelombang 1</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Switcher to Applicant Portal & Admin Profile -->
        <div class="flex items-center gap-3">
          <!-- Switch to Applicant Portal Link -->
          <router-link
            to="/dashboard"
            class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] text-xs font-sora font-semibold rounded-xl transition-all border border-slate-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Ke Portal Calon Mahasiswa</span>
          </router-link>

          <!-- Admin Avatar Pill -->
          <div class="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <div class="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white font-sora font-bold text-xs flex items-center justify-center shadow-xs">
              AD
            </div>
            <div class="hidden md:block">
              <div class="text-xs font-bold text-slate-900 font-sora leading-tight">
                Panitia PMB BTH
              </div>
              <div class="text-[10px] text-slate-400">
                admin.pmb@bth.ac.id
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
      <!-- Admin Sub-Navigation Desks Bar -->
      <div class="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3 sm:p-4 mb-6">
        <div class="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div>
            <h1 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Meja Kerja Operasional Penerimaan Mahasiswa Baru
            </h1>
            <p class="text-xs text-slate-500">
              Pilih meja kerja untuk mengelola verifikasi dokumen, keuangan, penilaian CBT, dan penetapan NIM.
            </p>
          </div>
          <button
            @click="syncPortalData"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-slate-600 hover:text-[#1E3A8A] bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Sinkronkan data pendaftar aktif dari portal pendaftaran"
          >
            <svg class="w-3.5 h-3.5 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Sinkronkan Portal</span>
          </button>
        </div>

        <!-- 7 Desks Horizontal Tabs (Fitur 1-13 Lengkap Sesuai Timeline) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <button
            v-for="desk in desks"
            :key="desk.id"
            @click="activeDesk = desk.id"
            class="p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between group cursor-pointer"
            :class="activeDesk === desk.id
              ? 'bg-blue-50/90 border-[#1E3A8A] text-[#1E3A8A] ring-2 ring-blue-100 shadow-xs'
              : 'bg-white border-slate-200/70 hover:bg-slate-50 text-slate-600'"
          >
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-xs font-bold font-sora">{{ desk.title }}</span>
              <span
                v-if="desk.badge"
                class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                :class="activeDesk === desk.id ? 'bg-[#1E3A8A] text-white' : 'bg-amber-100 text-amber-800'"
              >
                {{ desk.badge }}
              </span>
            </div>
            <div class="text-[10px] text-slate-400 truncate w-full">
              {{ desk.subtitle }}
            </div>
          </button>
        </div>
      </div>

      <!-- Active Desk Rendering -->
      <main class="animate-fadeIn pb-12">
        <!-- Meja 1: Ringkasan & Statistik -->
        <AdminOverviewDesk v-if="activeDesk === 'overview'" />

        <!-- Meja 2: Verifikasi Berkas -->
        <DocumentVerificationDesk v-else-if="activeDesk === 'verification'" />

        <!-- Meja 3: Rekonsiliasi Keuangan -->
        <PaymentReconciliationDesk v-else-if="activeDesk === 'finance'" />

        <!-- Meja 4: Seleksi CBT & Wawancara -->
        <SelectionScoringDesk v-else-if="activeDesk === 'scoring'" />

        <!-- Meja 5: Penetapan NIM & Onboarding -->
        <StudentEnrolmentDesk v-else-if="activeDesk === 'enrolment'" />

        <!-- Meja 6: Dashboard Institusional Multi-Tingkat (Fitur 12 Timeline) -->
        <InstitutionalDashboardDesk v-else-if="activeDesk === 'institutional'" />

        <!-- Meja 7: Pusat Pelaporan & Broadcast Notifikasi (Fitur 13 Timeline) -->
        <ReportingNotificationDesk v-else-if="activeDesk === 'reporting'" />
      </main>
    </div>

    <!-- Institutional Footer -->
    <footer class="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4">
        &copy; 2026 Sekretariat PMB Universitas Bakti Tunas Husada. Sistem Informasi Penerimaan Mahasiswa Baru Terpadu.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';

import AdminOverviewDesk from '@/components/admin/AdminOverviewDesk.vue';
import DocumentVerificationDesk from '@/components/admin/DocumentVerificationDesk.vue';
import PaymentReconciliationDesk from '@/components/admin/PaymentReconciliationDesk.vue';
import SelectionScoringDesk from '@/components/admin/SelectionScoringDesk.vue';
import StudentEnrolmentDesk from '@/components/admin/StudentEnrolmentDesk.vue';
import InstitutionalDashboardDesk from '@/components/admin/InstitutionalDashboardDesk.vue';
import ReportingNotificationDesk from '@/components/admin/ReportingNotificationDesk.vue';

const adminStore = useAdminStore();
const activeDesk = ref('overview');

const desks = computed(() => [
  {
    id: 'overview',
    title: '1. Ringkasan & KPI',
    subtitle: 'Statistik & kuota',
    badge: null,
  },
  {
    id: 'verification',
    title: '2. Verifikasi Berkas',
    subtitle: 'Validasi syarat',
    badge: adminStore.pendingVerificationCount > 0 ? `${adminStore.pendingVerificationCount}` : null,
  },
  {
    id: 'finance',
    title: '3. Rekonsiliasi VA',
    subtitle: 'Formulir & UKT',
    badge: null,
  },
  {
    id: 'scoring',
    title: '4. Seleksi & CBT',
    subtitle: 'Nilai wawancara',
    badge: null,
  },
  {
    id: 'enrolment',
    title: '5. Penetapan NIM',
    subtitle: 'Plotting PKKMB',
    badge: null,
  },
  {
    id: 'institutional',
    title: '6. Dashboard Institusi',
    subtitle: 'Rektor, Dekan, Prodi',
    badge: 'Pro',
  },
  {
    id: 'reporting',
    title: '7. Laporan & Broadcast',
    subtitle: 'Ekspor & notifikasi',
    badge: null,
  },
]);

const syncPortalData = () => {
  adminStore.syncCurrentApplicant();
};
</script>
