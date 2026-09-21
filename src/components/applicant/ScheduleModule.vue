<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-lg text-slate-900">
          Jadwal Seleksi & Ruang Ujian CBT
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Rincian jadwal ujian berbasis komputer (CBT), tes wawancara peminatan, dan tata tertib seleksi.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-blue-50 text-[#1E3A8A] border border-blue-200/80 rounded-full text-xs font-semibold font-sora">
          Sesi Terjadwal
        </span>
      </div>
    </div>

    <!-- Timeline Seleksi Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- 1. CBT Online Card -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 font-sora">
              Tahap 1 • Seleksi Akademik
            </span>
            <span
              class="text-xs font-semibold"
              :class="applicantStore.isExamCompleted ? 'text-emerald-600' : applicantStore.isRegPaymentComplete ? 'text-blue-600' : 'text-amber-600'"
            >
              {{ applicantStore.isExamCompleted ? 'Ujian Selesai' : applicantStore.isRegPaymentComplete ? 'Siap Diikuti' : 'Menunggu Bayar' }}
            </span>
          </div>

          <h3 class="font-sora font-bold text-slate-900 text-base mb-2">
            Ujian CBT Online Mandiri
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed mb-4">
            Tes Potensi Skolastik, Matematika Dasar, Pemahaman Sains/Farmasi, dan Bahasa Inggris.
          </p>

          <div class="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div class="flex justify-between">
              <span class="text-slate-500">Tanggal:</span>
              <strong class="text-slate-800">{{ schedule.cbt.date }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Waktu:</span>
              <strong class="text-[#1E3A8A] font-mono">{{ schedule.cbt.time }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Lokasi:</span>
              <span class="text-slate-700 text-right">{{ schedule.cbt.room }}</span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 mt-4">
          <button
            v-if="!applicantStore.isRegPaymentComplete"
            @click="$emit('switch-tab', 'payment')"
            class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Bayar Formulir untuk Sesi CBT</span>
          </button>
          <button
            v-else-if="applicantStore.isExamCompleted"
            @click="$emit('switch-tab', 'exam')"
            class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Lihat Skor CBT ({{ applicantStore.state.exam.score }}/100)</span>
          </button>
          <button
            v-else
            @click="$emit('switch-tab', 'exam')"
            class="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Buka Portal Ujian CBT</span>
          </button>
        </div>
      </div>

      <!-- 2. Wawancara Card -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60 font-sora">
              Tahap 2 • Wawancara
            </span>
            <span class="text-xs text-slate-500 font-semibold">Terkonfirmasi</span>
          </div>

          <h3 class="font-sora font-bold text-slate-900 text-base mb-2">
            Wawancara Peminatan
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed mb-4">
            Konfirmasi minat bakat, komitmen studi, dan verifikasi fisik buta warna program studi kesehatan.
          </p>

          <div class="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div class="flex justify-between">
              <span class="text-slate-500">Tanggal:</span>
              <strong class="text-slate-800">{{ schedule.interview.date }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Waktu:</span>
              <strong class="text-[#1E3A8A] font-mono">{{ schedule.interview.time }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Tempat:</span>
              <span class="text-slate-700 text-right">{{ schedule.interview.location }}</span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 mt-4">
          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-600 font-mono">
            ID Zoom: {{ zoomMeetingId }} (Pass: BTH2026)
          </div>
        </div>
      </div>

      <!-- 3. Pengumuman Kelulusan Card -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 font-sora">
              Tahap 3 • Keputusan
            </span>
            <span
              class="text-xs font-semibold"
              :class="applicantStore.isResultPassed ? 'text-emerald-600' : applicantStore.isExamCompleted ? 'text-blue-600' : 'text-slate-400'"
            >
              {{ applicantStore.isResultPassed ? 'Tersedia (Lulus)' : applicantStore.isExamCompleted ? 'Dalam Evaluasi' : 'Belum Tersedia' }}
            </span>
          </div>

          <h3 class="font-sora font-bold text-slate-900 text-base mb-2">
            Pengumuman Kelulusan
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed mb-4">
            Surat Keputusan Rektor resmi mengenai penetapan kelulusan calon mahasiswa baru.
          </p>

          <div class="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div class="flex justify-between">
              <span class="text-slate-500">Rilis Pengumuman:</span>
              <strong class="text-emerald-700">{{ schedule.announcementDate }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Format:</span>
              <span class="text-slate-700">Digital LoA & SK Rektor</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Status:</span>
              <strong
                :class="applicantStore.isResultPassed ? 'text-emerald-600' : applicantStore.isExamCompleted ? 'text-blue-600' : 'text-slate-400'"
              >
                {{ applicantStore.isResultPassed ? 'Dapat Diakses Sekarang' : applicantStore.isExamCompleted ? 'Menunggu Sidang Pleno' : 'Menunggu Pelaksanaan Ujian' }}
              </strong>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 mt-4">
          <button
            @click="$emit('switch-tab', 'result')"
            class="w-full py-2.5 font-sora font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="applicantStore.isResultPassed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ applicantStore.isResultPassed ? 'Unduh Surat Penerimaan (LoA)' : 'Buka Status Kelulusan' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tata Tertib Seleksi PMB BTH -->
    <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
          Tata Tertib & Persiapan Peserta Seleksi
        </h3>
        <span class="text-xs text-slate-400">SK Panitia PMB 2026</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
        <div class="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div class="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            1
          </div>
          <div>
            <strong class="block text-slate-900 mb-0.5">Perangkat & Koneksi Komputer</strong>
            Gunakan laptop atau PC desktop dengan koneksi internet stabil (minimal 5 Mbps) dan peramban Google Chrome atau Mozilla Firefox versi terbaru.
          </div>
        </div>

        <div class="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div class="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            2
          </div>
          <div>
            <strong class="block text-slate-900 mb-0.5">Kehadiran Tepat Waktu</strong>
            Peserta wajib masuk ke portal ujian paling lambat 15 menit sebelum waktu pengerjaan dimulai untuk melakukan sinkronisasi token ujian.
          </div>
        </div>

        <div class="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div class="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            3
          </div>
          <div>
            <strong class="block text-slate-900 mb-0.5">Integritas & Kejujuran Akademik</strong>
            Dilarang membuka tab baru, mencari jawaban via mesin pencari, atau dibantu oleh pihak lain selama sesi tes berlangsung.
          </div>
        </div>

        <div class="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div class="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            4
          </div>
          <div>
            <strong class="block text-slate-900 mb-0.5">Penetapan Hasil Bersifat Final</strong>
            Hasil seleksi ditetapkan melalui Rapat Dewan Pimpinan Universitas BTH dan keputusan tidak dapat diganggu gugat.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useApplicantStore } from '@/stores/applicant';

defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const schedule = computed(() => applicantStore.state.schedule);
const zoomMeetingId = computed(() => {
  const regSuffix = applicantStore.state.candidate?.registrationNumber?.split('-').pop() || '2026';
  return `894 2026 ${regSuffix.slice(-4)}`;
});
</script>
