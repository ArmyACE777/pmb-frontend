<template>
  <div class="space-y-6">
    <!-- Header Modul -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Pengumuman & Daftar Ulang
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Status kelulusan seleksi calon mahasiswa dan panduan registrasi ulang semester 1.
        </p>
      </div>
      <div class="text-xs text-slate-500 font-sans self-start sm:self-auto">
        Status: <strong class="text-slate-800 font-semibold">{{ applicantStore.isResultPassed ? 'Dinyatakan Lulus Seleksi' : applicantStore.isExamCompleted ? 'Hasil Sedang Diverifikasi' : 'Menunggu Ujian' }}</strong>
      </div>
    </div>

    <!-- KONDISI 1: BELUM LULUS / PROSES SELEKSI BERJALAN -->
    <div v-if="!applicantStore.isResultPassed" class="max-w-2xl mx-auto space-y-6 my-4">
      <!-- Status Card Minimalis (Tanpa Simbol/Logo AI) -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-center space-y-4 animate-fadeIn">
        <div class="space-y-1.5">
          <h3 class="font-sora font-bold text-base sm:text-lg text-slate-900">
            {{ !applicantStore.isExamCompleted ? 'Ujian CBT Belum Diselesaikan' : 'Hasil Ujian Sedang Diverifikasi' }}
          </h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {{ !applicantStore.isExamCompleted
              ? 'Silakan selesaikan Ujian Mandiri CBT Online agar nilai seleksi dapat diproses oleh panitia PMB BTH.'
              : 'Skor ujian Anda telah tersimpan. Pengumuman kelulusan resmi dan surat penerimaan akan dibuka serentak pada tanggal jadwal pengumuman.'
            }}
          </p>
        </div>

        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
          <span class="text-slate-400">Jadwal Pengumuman Resmi:</span>
          <strong class="text-slate-800 font-semibold">{{ schedule?.announcementDate || '24 Oktober 2026' }}</strong>
        </div>

        <div v-if="!applicantStore.isExamCompleted" class="pt-2">
          <button
            @click="$emit('switch-tab', 'exam')"
            class="w-full sm:w-auto rounded-xl px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            Buka Ujian CBT Online
          </button>
        </div>
      </div>

      <!-- Alur Registrasi Ulang Ringkas (Simple 3-Step) -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div class="text-xs font-semibold text-slate-700">Tahapan Setelah Pengumuman:</div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span class="font-mono text-[10px] text-slate-400 font-bold uppercase">Langkah 1</span>
            <div class="font-semibold text-slate-800">Unduh LoA Resmi</div>
            <p class="text-[11px] text-slate-500">Surat penerimaan berstempel Rektor BTH.</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span class="font-mono text-[10px] text-slate-400 font-bold uppercase">Langkah 2</span>
            <div class="font-semibold text-slate-800">Pelunasan UKT</div>
            <p class="text-[11px] text-slate-500">Pembayaran UKT semester 1 via Virtual Account.</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span class="font-mono text-[10px] text-slate-400 font-bold uppercase">Langkah 3</span>
            <div class="font-semibold text-slate-800">Aktivasi NIM & Berkas</div>
            <p class="text-[11px] text-slate-500">Penyerahan berkas fisik & almamater di BAAK.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- KONDISI 2: RESMI DINYATAKAN LULUS SELEKSI -->
    <div v-else class="space-y-6 animate-fadeIn">
      <!-- Acceptance Banner BTH -->
      <div class="bg-gradient-to-r from-[#1E3A8A] via-[#1b3478] to-[#12285a] text-white rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden border border-blue-900/40">
        <div class="relative z-10 space-y-3 max-w-3xl">
          <div class="inline-flex items-center px-2.5 py-0.5 bg-amber-400/20 border border-amber-300/30 text-amber-300 rounded-md text-[11px] font-medium">
            <span>SK Rektor: {{ result.decisionLetterNo }}</span>
          </div>

          <div>
            <h3 class="text-xl sm:text-2xl font-sora font-bold text-white tracking-tight">
              Selamat, {{ candidate.fullName }}!
            </h3>
            <p class="text-xs sm:text-sm text-blue-100/90 mt-1 leading-relaxed">
              Anda resmi dinyatakan <strong>LULUS SELEKSI</strong> sebagai calon mahasiswa baru Universitas Bakti Tunas Husada.
            </p>
          </div>

          <!-- Accepted Prodi & LoA Button -->
          <div class="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
            <div>
              <div class="text-[10px] text-blue-200 uppercase font-semibold tracking-wider">Program Studi Diterima</div>
              <div class="font-sora font-bold text-base sm:text-lg text-white mt-0.5">
                {{ result.acceptedProdi }}
              </div>
              <div class="text-xs text-amber-300 mt-0.5">
                {{ result.acceptedFaculty }} - Jenjang Sarjana ({{ result.acceptedDegree }})
              </div>
            </div>

            <button
              @click="openLoAModal = true"
              class="rounded-xl px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-xs transition-all shadow-xs cursor-pointer flex-shrink-0"
            >
              Unduh Surat Penerimaan (LoA)
            </button>
          </div>
        </div>
      </div>

      <!-- Two Column Layout: Langkah Daftar Ulang & Hasil Skor -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Kolom 1: Tahapan Daftar Ulang Mahasiswa Baru -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Langkah Registrasi Ulang
            </h3>
            <span class="text-xs text-slate-500">25 Okt - 05 Nov 2026</span>
          </div>

          <div class="space-y-3 text-xs">
            <!-- Step 1: Bayar UKT -->
            <div class="p-3.5 rounded-xl border flex items-center justify-between gap-3"
                 :class="payments.uktFee?.status === 'paid' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200/80'">
              <div>
                <div class="font-semibold text-slate-900">1. Pelunasan UKT Semester 1</div>
                <div class="text-slate-500 mt-0.5">Nominal: <strong>Rp 6.500.000</strong> via VA Bank BSI / Mandiri</div>
              </div>
              <button
                @click="$emit('switch-tab', 'payment')"
                class="rounded-lg px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-colors flex-shrink-0"
                :class="payments.uktFee?.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#1E3A8A] text-white hover:bg-[#172554]'"
              >
                {{ payments.uktFee?.status === 'paid' ? 'Lunas' : 'Bayar Sekarang' }}
              </button>
            </div>

            <!-- Step 2: Berkas Fisik di Kampus -->
            <div class="p-3.5 rounded-xl border bg-slate-50 border-slate-200/80 flex items-center justify-between gap-3">
              <div>
                <div class="font-semibold text-slate-900">2. Validasi Berkas Fisik & KTM</div>
                <div class="text-slate-500 mt-0.5">Penyerahan ijazah terlegalisasi & pasfoto di Gedung BAAK Rektorat Lantai 1</div>
              </div>
              <span class="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex-shrink-0">
                Layanan BAAK
              </span>
            </div>

            <!-- Step 3: Almamater -->
            <div class="p-3.5 rounded-xl border bg-slate-50 border-slate-200/80 flex items-center justify-between gap-3">
              <div>
                <div class="font-semibold text-slate-900">3. Pengambilan Almamater & NIM</div>
                <div class="text-slate-500 mt-0.5">Penerbitan kartu mahasiswa resmi dan email institusi @bth.ac.id</div>
              </div>
              <span class="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex-shrink-0">
                07 - 12 Nov
              </span>
            </div>
          </div>
        </div>

        <!-- Kolom 2: Rincian Skor Seleksi -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Rincian Skor Seleksi Akademik
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Hasil penilaian resmi panitia penerimaan mahasiswa baru.</p>
          </div>

          <div class="space-y-2 text-xs">
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Nilai Ujian CBT Online:</span>
              <strong class="font-sora text-sm text-[#1E3A8A]">{{ exam.score }} / 100</strong>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Rata-rata Rapor:</span>
              <strong class="text-slate-800">{{ candidate.averageScore || '88.5' }}</strong>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Hasil Evaluasi Wawancara:</span>
              <strong class="text-emerald-700 font-medium">A (Sangat Direkomendasikan)</strong>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 flex items-center justify-between">
              <span class="text-slate-600">Pemeriksaan Kesehatan:</span>
              <strong class="text-emerald-700 font-medium">Memenuhi Syarat (Sehat)</strong>
            </div>
          </div>

          <p class="text-[11px] text-slate-500 leading-relaxed pt-1">
            Keputusan kelulusan telah disahkan oleh Senat Akademik Universitas BTH dan bersifat mutlak.
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL DIGITAL LETTER OF ACCEPTANCE (LoA) RESMI BTH -->
    <div
      v-if="openLoAModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[88vh] overflow-y-auto">
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
          <div class="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-snug">
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
            class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs transition-all shadow-xs cursor-pointer text-center"
          >
            Cetak Dokumen LoA
          </button>
          <button
            @click="openLoAModal = false"
            class="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useApplicantStore } from '@/stores/applicant';
import { selectionApi } from '@/api/selection';
import { studentApi } from '@/api/student';

defineEmits(['switch-tab']);

const applicantStore = useApplicantStore();
const candidate = computed(() => applicantStore.state.candidate);
const result = computed(() => applicantStore.state.result);
const exam = computed(() => applicantStore.state.exam);
const payments = computed(() => applicantStore.state.payments);
const schedule = computed(() => applicantStore.state.schedule);

const openLoAModal = ref(false);

onMounted(async () => {
  try {
    const selRes = await selectionApi.getMyResult().catch(() => null);
    if (selRes?.data?.data) {
      const d = selRes.data.data;
      if (d.decision_letter_no) applicantStore.state.result.decisionLetterNo = d.decision_letter_no;
      if (d.status === 'passed') applicantStore.state.result.isPassed = true;
      if (d.accepted_program) applicantStore.state.result.acceptedProdi = d.accepted_program;
    }
  } catch (err) {
    console.warn('Selection API Notice (fallback):', err?.message);
  }

  try {
    const studRes = await studentApi.getMyStatus().catch(() => null);
    if (studRes?.data?.data) {
      const s = studRes.data.data;
      if (s.nim) applicantStore.state.onboarding.nim = s.nim;
      if (s.pkkmb_group) applicantStore.state.onboarding.pkkmbGroup = s.pkkmb_group;
    }
  } catch (err) {
    console.warn('Student API Notice (fallback):', err?.message);
  }
});

const printLoA = () => {
  window.print();
};
</script>
