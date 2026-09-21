<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Pengumuman Kelulusan & Alur Daftar Ulang
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Surat penetapan resmi kelulusan calon mahasiswa baru dan panduan registrasi ulang semester 1.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sora border transition-colors"
          :class="result.isPassed
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : exam.status !== 'completed'
              ? 'bg-slate-100 text-slate-600 border border-slate-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="result.isPassed ? 'bg-emerald-500' : exam.status !== 'completed' ? 'bg-slate-400' : 'bg-amber-500'"
          ></span>
          <span>
            {{ result.isPassed
              ? 'Diterima / Lulus Seleksi'
              : exam.status !== 'completed'
                ? 'Ujian Belum Diikuti'
                : 'Nilai Belum Memenuhi Passing Grade' }}
          </span>
        </span>
      </div>
    </div>

    <!-- STATE 1: BELUM SELESAI UJIAN -->
    <div v-if="!exam.status || exam.status !== 'completed'" class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs text-center max-w-xl mx-auto space-y-4 my-6 sm:my-8 animate-fadeIn">
      <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center mx-auto">
        <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 class="font-sora font-bold text-base sm:text-lg text-slate-900">Ujian CBT Belum Diselesaikan</h3>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          Surat penetapan hasil kelulusan dan Surat Penerimaan (LoA) resmi akan diterbitkan setelah Anda menyelesaikan Ujian Mandiri CBT Online.
        </p>
      </div>
      <button
        @click="$emit('switch-tab', 'exam')"
        class="w-full sm:w-auto px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
      >
        Menuju Ujian CBT Online
      </button>
    </div>

    <!-- STATE 2: BELUM MEMENUHI PASSING GRADE -->
    <div v-else-if="!result.isPassed" class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs text-center max-w-xl mx-auto space-y-4 my-6 sm:my-8 animate-fadeIn">
      <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
        <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h3 class="font-sora font-bold text-base sm:text-lg text-slate-900">Nilai Belum Memenuhi Passing Grade</h3>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">
          Skor Ujian CBT Anda (<strong>{{ exam.score }}/100</strong>) belum mencapai passing grade minimal (70). Anda dapat mengulang pengerjaan ujian untuk memenuhi syarat penerimaan.
        </p>
      </div>
      <button
        @click="$emit('switch-tab', 'exam')"
        class="w-full sm:w-auto px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
      >
        Kerjakan Ulang Ujian CBT
      </button>
    </div>

    <!-- STATE 3: LULUS SELEKSI -->
    <div v-else class="space-y-6 animate-fadeIn">
      <!-- Official Acceptance Banner (BTH Identity) -->
      <div class="bg-gradient-to-r from-[#1E3A8A] via-[#1b3478] to-[#12285a] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-bth relative overflow-hidden border border-blue-900/40">
      <div class="relative z-10 space-y-3.5 sm:space-y-4 max-w-3xl">
        <div class="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-amber-400/20 border border-amber-300/30 text-amber-300 rounded-full text-[11px] sm:text-xs font-semibold font-sora">
          <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400"></span>
          <span class="truncate">SK Rektor: {{ result.decisionLetterNo }}</span>
        </div>

        <div>
          <h3 class="text-xl sm:text-2xl lg:text-3xl font-sora font-extrabold tracking-tight text-white leading-tight">
            Selamat, {{ candidate.fullName }}!
          </h3>
          <p class="text-xs sm:text-sm text-blue-100/90 mt-1 leading-relaxed">
            Berdasarkan hasil seleksi berkas, nilai Ujian CBT Online, dan tes wawancara, Anda resmi dinyatakan <strong>LULUS SELEKSI</strong> sebagai calon mahasiswa baru Universitas Bakti Tunas Husada.
          </p>
        </div>

        <!-- Accepted Program Studi Info Card -->
        <div class="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div class="text-[10px] sm:text-[11px] text-blue-200 uppercase font-bold tracking-wider">Program Studi Diterima</div>
            <div class="font-sora font-extrabold text-base sm:text-xl text-white mt-0.5">
              {{ result.acceptedProdi }}
            </div>
            <div class="text-xs text-amber-300 mt-0.5">
              {{ result.acceptedFaculty }} • Jenjang Sarjana ({{ result.acceptedDegree }})
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="openLoAModal = true"
              class="w-full sm:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-sora font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Unduh / Cetak Surat Penerimaan (LoA)</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rincian Nilai Seleksi & Alur Daftar Ulang -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Rincian Nilai Seleksi (Col 1) -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base pb-3 border-b border-slate-100">
          Rincian Skor Seleksi Akademik
        </h3>

        <div class="space-y-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span class="text-slate-600">Nilai Ujian CBT:</span>
            <strong class="font-sora text-sm text-[#1E3A8A]">{{ exam.score }} / 100</strong>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span class="text-slate-600">Rata-rata Rapor:</span>
            <strong class="font-sora text-sm text-slate-800">{{ candidate.averageScore }}</strong>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span class="text-slate-600">Hasil Wawancara:</span>
            <strong class="font-sora text-sm text-emerald-700">A (Sangat Direkomendasikan)</strong>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span class="text-slate-600">Uji Bebas Buta Warna:</span>
            <strong class="font-sora text-sm text-emerald-700">Memenuhi Syarat (Normal)</strong>
          </div>
        </div>

        <div class="p-3 bg-blue-50 rounded-xl text-[11px] text-slate-600 leading-relaxed border border-blue-200/60">
          Keputusan kelulusan telah disahkan oleh Senat dan Dewan Pimpinan Universitas BTH.
        </div>
      </div>

      <!-- Alur Registrasi Ulang (Col 2) -->
      <div class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Alur Tahapan Registrasi & Daftar Ulang
            </h3>
            <p class="text-xs text-slate-500">
              Batas waktu penyelesaian: <strong>{{ result.reRegistrationPeriod }}</strong>
            </p>
          </div>
          <span class="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            Wajib
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <!-- Step 1: UKT Payment -->
          <div class="p-4 rounded-xl border transition-all flex items-start justify-between gap-4"
               :class="payments.uktFee.status === 'paid' ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200/80'">
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                   :class="payments.uktFee.status === 'paid' ? 'bg-emerald-600 text-white' : 'bg-[#1E3A8A] text-white'">
                <span v-if="payments.uktFee.status === 'paid'">✓</span>
                <span v-else>1</span>
              </div>
              <div>
                <div class="font-sora font-bold text-slate-900">
                  Pembayaran Biaya UKT & Registrasi Semester 1
                </div>
                <div class="text-slate-500 mt-0.5">
                  Nominal: <strong>Rp 6.500.000</strong> via Virtual Account BSI/Mandiri
                </div>
              </div>
            </div>
            <button
              @click="$emit('switch-tab', 'payment')"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
              :class="payments.uktFee.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#1E3A8A] text-white hover:bg-[#172554]'"
            >
              {{ payments.uktFee.status === 'paid' ? 'Sudah Lunas' : 'Bayar Sekarang' }}
            </button>
          </div>

          <!-- Step 2: Berkas Fisik -->
          <div class="p-4 rounded-xl border bg-slate-50 border-slate-200/80 flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </div>
              <div>
                <div class="font-sora font-bold text-slate-900">
                  Penyelarasan & Validasi Berkas Fisik
                </div>
                <div class="text-slate-500 mt-0.5">
                  Penyerahan fotokopi ijazah legalisir & pas foto di Gedung Rektorat Kampus BTH.
                </div>
              </div>
            </div>
            <span class="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex-shrink-0">
              25 Okt - 05 Nov
            </span>
          </div>

          <!-- Step 3: Jas Almamater & Onboarding -->
          <div class="p-4 rounded-xl border bg-slate-50 border-slate-200/80 flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </div>
              <div>
                <div class="font-sora font-bold text-slate-900">
                  Pengambilan Almamater & Aktivasi Akun Mahasiswa
                </div>
                <div class="text-slate-500 mt-0.5">
                  Penerbitan Nomor Induk Mahasiswa (NIM), email institusi, dan Kartu Tanda Mahasiswa (KTM) resmi oleh Biro Administrasi Akademik & Kemahasiswaan (BAAK) pasca lunas UKT.
                </div>
              </div>
            </div>
            <span class="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex-shrink-0">
              Layanan BAAK BTH
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Modal Digital LoA (Letter of Acceptance) Resmi BTH -->
    <div
      v-if="openLoAModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[88vh] overflow-y-auto">
        <button
          @click="openLoAModal = false"
          class="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1 cursor-pointer"
        >
          &times;
        </button>

        <!-- Official Letterhead (Kop Surat Resmi) -->
        <div class="text-center pb-4 border-b-2 border-slate-900">
          <div class="text-[11px] sm:text-xs uppercase font-bold text-slate-600 tracking-widest">
            Yayasan Bakti Tunas Husada Tasikmalaya
          </div>
          <div class="font-sora font-black text-base sm:text-xl text-[#1E3A8A] tracking-tight mt-0.5">
            UNIVERSITAS BAKTI TUNAS HUSADA
          </div>
          <div class="text-[10px] sm:text-[11px] text-slate-500 mt-1">
            Jalan Cilolohan Nomor 36, Kahuripan, Tawang, Kota Tasikmalaya, Jawa Barat 46115<br />
            Laman: www.universitas-bth.ac.id | Pos-el: pmb@bth.ac.id | Telp: (0265) 334111
          </div>
        </div>

        <!-- LoA Content -->
        <div class="py-4 sm:py-6 space-y-3.5 sm:space-y-4 text-xs text-slate-800 leading-relaxed">
          <div class="text-center space-y-1">
            <h4 class="font-sora font-extrabold text-xs sm:text-base text-slate-900 uppercase">
              SURAT KETERANGAN PENERIMAAN (LETTER OF ACCEPTANCE)
            </h4>
            <div class="font-mono text-[10px] sm:text-[11px] text-slate-500">
              Nomor: {{ result.decisionLetterNo }}
            </div>
          </div>

          <p>
            Rektor Universitas Bakti Tunas Husada, berdasarkan hasil rapat dewan juri seleksi Penerimaan Mahasiswa Baru Tahun Akademik 2026/2027 yang dilaksanakan pada tanggal {{ result.decisionDate }}, menerangkan bahwa:
          </p>

          <div class="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200 space-y-1.5 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Nomor Registrasi:</span>
              <strong class="sm:col-span-2 font-mono text-slate-900">{{ candidate.registrationNumber }}</strong>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Nama Lengkap:</span>
              <strong class="sm:col-span-2 text-slate-900">{{ candidate.fullName }}</strong>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Asal Sekolah:</span>
              <span class="sm:col-span-2 text-slate-800">{{ candidate.schoolName }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Program Studi Diterima:</span>
              <strong class="sm:col-span-2 text-[#1E3A8A] font-sora">{{ result.acceptedProdi }} ({{ result.acceptedDegree }})</strong>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span class="text-slate-500">Fakultas:</span>
              <span class="sm:col-span-2 text-slate-800">{{ result.acceptedFaculty }}</span>
            </div>
          </div>

          <p>
            Dinyatakan <strong>LULUS SELEKSI</strong> dan diterima sebagai Calon Mahasiswa Baru Universitas Bakti Tunas Husada Tahun Akademik 2026/2027.
          </p>

          <p>
            Demikian surat keterangan ini diterbitkan untuk dipergunakan sebagaimana mestinya dalam proses daftar ulang dan registrasi akademik.
          </p>

          <!-- Signature & Digital Stamp -->
          <div class="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div class="text-[10px] text-slate-400 font-mono">
              Dokumen resmi terverifikasi secara elektronik oleh Sistem PMB BTH.
            </div>
            <div class="text-left sm:text-right space-y-1 w-full sm:w-auto">
              <div class="text-slate-500 text-[11px]">Tasikmalaya, {{ result.decisionDate }}</div>
              <div class="font-bold text-slate-900 font-sora">Rektor Universitas BTH,</div>
              <div class="h-10 sm:h-12 flex items-center justify-start sm:justify-end">
                <span class="font-mono text-[11px] text-[#1E3A8A] border border-blue-300 bg-blue-50 px-2 py-0.5 rounded">
                  [Tanda Tangan Digital Tersertifikasi]
                </span>
              </div>
              <div class="font-sora font-bold text-slate-900 underline">Prof. Dr. apt. Mohamad Yanuar, M.Si.</div>
              <div class="text-[10px] text-slate-500">NIP. 19740512 200112 1 002</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            @click="printLoA"
            class="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak Dokumen LoA</span>
          </button>
          <button
            @click="openLoAModal = false"
            class="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            Tutup
          </button>
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
const result = computed(() => applicantStore.state.result);
const exam = computed(() => applicantStore.state.exam);
const payments = computed(() => applicantStore.state.payments);

const openLoAModal = ref(false);

const printLoA = () => {
  window.print();
};
</script>
