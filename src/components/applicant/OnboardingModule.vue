<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          NIM, Akun Kampus & Kartu Mahasiswa (KTM)
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Identitas resmi mahasiswa aktif, kredensial akademik, dan panduan orientasi kampus (PKKMB).
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sora transition-colors"
          :class="isEnrolled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="isEnrolled ? 'bg-emerald-600' : 'bg-amber-500'"></span>
          <span>{{ isEnrolled ? 'Mahasiswa Aktif 2026/2027' : 'Menunggu Pelunasan UKT' }}</span>
        </span>
      </div>
    </div>

    <!-- Alert Toast Feedback -->
    <div
      v-if="toastMessage"
      class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-fadeIn"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-sm leading-none">&times;</button>
    </div>

    <!-- STATE 1: BELUM LUNAS UKT / BELUM MEMILIKI NIM -->
    <div v-if="!isEnrolled" class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center max-w-xl mx-auto space-y-4 my-8 animate-fadeIn">
      <div class="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      </div>
      <div>
        <h3 class="font-sora font-bold text-lg text-slate-900">Aktivasi NIM & KTM Belum Aktif</h3>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          Nomor Induk Mahasiswa (NIM), akun pos-el institusi kampus (@bth.ac.id), dan Kartu Tanda Mahasiswa (KTM) virtual akan otomatis diterbitkan setelah Anda menyelesaikan pelunasan registrasi ulang UKT Semester 1.
        </p>
      </div>
      <button
        @click="$emit('switch-tab', 'payment')"
        class="px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
      >
        Menuju Pembayaran UKT Semester 1
      </button>
    </div>

    <!-- STATE 2: SUDAH MEMILIKI NIM (MAHASISWA AKTIF) -->
    <div v-else class="space-y-6 animate-fadeIn">
      <!-- Top Grid: NIM & Email Kampus -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 1. NIM Card -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Nomor Induk Mahasiswa (NIM)
              </span>
              <span class="px-2.5 py-0.5 bg-blue-50 text-[#1E3A8A] font-bold text-[10px] rounded border border-blue-200/60 font-mono">
                RESMI
              </span>
            </div>
            <div class="font-mono font-black text-3xl text-[#1E3A8A] tracking-wider">
              {{ onboarding.nim }}
            </div>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              Gunakan NIM ini sebagai identitas dalam sistem informasi akademik (SIAKAD), presensi perkuliahan, dan perpustakaan BTH.
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <button
              @click="copyText(onboarding.nim, 'Nomor Induk Mahasiswa')"
              class="px-3.5 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Salin NIM</span>
            </button>
            <span class="text-[11px] text-emerald-600 font-medium">Tercatat di PD-Dikti</span>
          </div>
        </div>

        <!-- 2. Email Kampus Card -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Email Institusi Kampus
              </span>
              <span class="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded border border-emerald-200 font-mono">
                GOOGLE WORKSPACE
              </span>
            </div>
            <div class="font-mono font-bold text-lg sm:text-xl text-slate-800 break-all">
              {{ onboarding.studentEmail }}
            </div>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              Akses Google Drive tanpa batas, Google Classroom, repositori skripsi, dan jurnal ilmiah terindeks Scopus.
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <button
              @click="copyText(onboarding.studentEmail, 'Alamat Email Mahasiswa')"
              class="px-3.5 py-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Salin Email</span>
            </button>
            <span class="text-[11px] text-slate-500">Sandi Default: BTH#2026</span>
          </div>
        </div>
      </div>

      <!-- Kartu Tanda Mahasiswa (KTM) Virtual Section -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Kartu Tanda Mahasiswa (KTM) Virtual
            </h3>
            <p class="text-xs text-slate-500">
              Kartu tanda mahasiswa resmi Universitas BTH berteknologi barcode terintegrasi sistem presensi.
            </p>
          </div>
          <button
            @click="windowPrint"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Unduh / Cetak KTM</span>
          </button>
        </div>

        <!-- Realistic BTH Student ID Card (Physical Ratio) -->
        <div class="max-w-md mx-auto">
          <div class="bg-gradient-to-br from-[#1E3A8A] via-[#172554] to-[#0f172a] text-white rounded-2xl p-6 shadow-xl border border-blue-900/40 relative overflow-hidden">
            <!-- Geometric Background Lines -->
            <div class="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border-4 border-amber-400/20 pointer-events-none"></div>
            <div class="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border border-blue-400/10 pointer-events-none"></div>

            <!-- KTM Header -->
            <div class="flex items-center justify-between pb-4 border-b border-white/15 relative z-10">
              <div>
                <div class="font-sora font-extrabold text-xs tracking-wider text-amber-300 uppercase">
                  Universitas Bakti Tunas Husada
                </div>
                <div class="text-[10px] text-blue-200 tracking-wider">
                  KARTU TANDA MAHASISWA
                </div>
              </div>
              <div class="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-amber-400 font-sora">
                BTH
              </div>
            </div>

            <!-- KTM Body: Avatar & Info -->
            <div class="py-5 flex items-center gap-4 relative z-10">
              <!-- Student Avatar -->
              <div class="w-20 h-24 rounded-xl bg-slate-200 border-2 border-amber-400/60 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 shadow-md">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>

              <!-- Student Metadata -->
              <div class="space-y-1 text-xs">
                <div class="font-sora font-bold text-sm sm:text-base text-white leading-tight">
                  {{ candidate.fullName }}
                </div>
                <div class="font-mono font-bold text-amber-300 text-sm">
                  NIM: {{ onboarding.nim }}
                </div>
                <div class="text-blue-200 text-[11px]">
                  {{ onboarding.studyProgram }}
                </div>
                <div class="text-blue-300 text-[10px]">
                  {{ onboarding.faculty }}
                </div>
              </div>
            </div>

            <!-- KTM Footer: Barcode & Validity -->
            <div class="pt-3 border-t border-white/15 flex items-center justify-between text-[10px] relative z-10 font-mono">
              <div>
                <div class="text-slate-400">BERLAKU HINGGA:</div>
                <div class="font-bold text-white">AGUSTUS 2030</div>
              </div>
              <div class="text-right">
                <!-- Barcode KTM -->
                <div class="h-6 flex items-center gap-0.5 justify-end">
                  <span class="w-0.5 h-6 bg-white"></span>
                  <span class="w-1 h-6 bg-white"></span>
                  <span class="w-0.5 h-6 bg-white"></span>
                  <span class="w-1.5 h-6 bg-white"></span>
                  <span class="w-0.5 h-6 bg-white"></span>
                  <span class="w-2 h-6 bg-white"></span>
                  <span class="w-0.5 h-6 bg-white"></span>
                  <span class="w-1 h-6 bg-white"></span>
                  <span class="w-0.5 h-6 bg-white"></span>
                  <span class="w-1.5 h-6 bg-white"></span>
                </div>
                <div class="text-slate-400 mt-0.5">{{ onboarding.nim }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informasi Orientasi Kampus (PKKMB 2026) -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base pb-3 border-b border-slate-100">
          Informasi Pengenalan Kehidupan Kampus (PKKMB 2026)
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span class="text-slate-500">Kelompok Gugus:</span>
            <div class="font-sora font-bold text-[#1E3A8A] text-sm">{{ onboarding.pkkmbGroup }}</div>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span class="text-slate-500">Jadwal Pelaksanaan:</span>
            <div class="font-sora font-bold text-slate-800 text-sm">12 - 15 Agustus 2026</div>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span class="text-slate-500">Status Akses SIAKAD:</span>
            <div class="font-sora font-bold text-emerald-700 text-sm">{{ onboarding.siakadAccess }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApplicantStore } from '@/stores/applicant';

defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const candidate = computed(() => applicantStore.state.candidate);
const onboarding = computed(() => applicantStore.state.onboarding);
const isEnrolled = computed(() => !!(applicantStore.isUktPaid && onboarding.value.nim));

const toastMessage = ref('');

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    toastMessage.value = `${label} (${text}) berhasil disalin.`;
  } catch {
    toastMessage.value = `${label} (${text}) siap digunakan.`;
  }
};

const windowPrint = () => {
  window.print();
};
</script>
