<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn"
      @click.self="close"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200/90 relative max-h-[92vh] flex flex-col font-sans overflow-hidden"
      >
        <!-- Modal Top Accent Strip -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-indigo-600 to-amber-500 absolute top-0 left-0"></div>

        <!-- Header Modal -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200/60 shadow-2xs">
              <BookMarked class="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-sora font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Buku Panduan & SOP Panitia PMB
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                  SOP Internal BTH
                </span>
              </div>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Standar Operasional Prosedur kerja seluruh meja kerja panitia & pengelola penerimaan mahasiswa baru
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="close"
            class="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-xl font-bold leading-none"
            aria-label="Tutup SOP"
          >
            &times;
          </button>
        </div>

        <!-- Navigation Tabs Guide -->
        <div class="flex items-center gap-1.5 border-b border-slate-100 py-2.5 overflow-x-auto no-scrollbar flex-shrink-0 text-xs">
          <button
            type="button"
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-3.5 py-1.5 rounded-xl font-sora font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            :class="activeTab === tab.id
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <component :is="tab.icon" class="w-3.5 h-3.5" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Body Content Guide (Scrollable) -->
        <div class="flex-1 overflow-y-auto py-4 pr-1 text-xs text-slate-700 space-y-4">
          <!-- TAB 1: RBAC & MATRIKS WEWENANG -->
          <div v-if="activeTab === 'rbac'" class="space-y-4 animate-fadeIn">
            <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck class="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
              <p class="text-[11px] text-blue-900 leading-relaxed font-sans">
                Sistem PMB Universitas BTH menerapkan <em>Role-Based Access Control (RBAC)</em> ketat. Tiap panitia hanya diizinkan memproses data sesuai batas tanggung jawab tugas pokok dan fungsinya.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="role in rbacRoles" :key="role.code" class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full" :class="role.dotColor"></span>
                    <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm">{{ role.title }}</h4>
                  </div>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    {{ role.code }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed">{{ role.desc }}</p>
                <div class="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                  <strong class="text-slate-700">Wewenang Utama:</strong> {{ role.authorities }}
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: SOP VERIFIKASI BERKAS -->
          <div v-else-if="activeTab === 'verifikasi'" class="space-y-4 animate-fadeIn">
            <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
              <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div class="text-[11px] text-emerald-900 leading-relaxed font-sans space-y-1">
                <p class="font-bold">Standar Layanan (SLA) Verifikator:</p>
                <p>Seluruh dokumen yang diunggah pendaftar wajib diverifikasi dalam batas waktu maksimal <strong>1 x 24 jam</strong> sejak dokumen diunggah.</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2.5">
                <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <FileText class="w-4 h-4 text-[#1E3A8A]" />
                  <span>Pedoman Penilaian Keabsahan Dokumen</span>
                </h4>
                <div class="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                  <div class="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200/50">
                    <strong class="text-emerald-900">1. Kriteria Diterima (Disetujui):</strong>
                    <p class="mt-0.5">Pindaian asli berwarna, nama dan NIK cocok dengan KTP/Dukcapil, cap stempel basah atau tanda tangan digital resmi instansi terlihat jelas.</p>
                  </div>
                  <div class="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/50">
                    <strong class="text-amber-900">2. Kriteria Minta Perbaikan (Revisi):</strong>
                    <p class="mt-0.5">Pindaian miring/terpotong, resolusi buram/pecah, latar belakang pasfoto tidak sesuai ketentuan (bukan merah/biru). Verifikator <strong>wajib menuliskan catatan revisi yang spesifik</strong> ke pendaftar.</p>
                  </div>
                  <div class="p-2.5 bg-rose-50/50 rounded-xl border border-rose-200/50">
                    <strong class="text-rose-900">3. Kriteria Ditolak:</strong>
                    <p class="mt-0.5">Dokumen palsu, NIK tidak terdaftar, atau terindikasi manipulasi digital (editing tidak sah).</p>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2">
                <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <RotateCcw class="w-4 h-4 text-amber-600" />
                  <span>SOP Verifikasi Permohonan Pengunduran Diri</span>
                </h4>
                <ol class="list-decimal list-inside text-[11px] text-slate-600 space-y-1.5 pl-1 leading-relaxed">
                  <li>Periksa kelengkapan <strong>Surat Permohonan Pengunduran Diri bermaterai Rp 10.000</strong> yang ditandatangani mahasiswa dan orang tua/wali.</li>
                  <li>Periksa <strong>Bukti Diterima di PTN Akademik/Vokasi Negeri</strong> resmi (SNBP/SNBT).</li>
                  <li>Pastikan rekening bank tujuan pengembalian dana tercantum jelas atas nama calon mahasiswa atau orang tua.</li>
                  <li>Klik tombol <em>Setujui Pengunduran Diri</em> untuk meneruskan berkas ke Meja Keuangan guna proses refund.</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- TAB 3: SOP KEUANGAN & DUITKU -->
          <div v-else-if="activeTab === 'keuangan'" class="space-y-4 animate-fadeIn">
            <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5">
              <CreditCard class="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
              <p class="text-[11px] text-blue-900 leading-relaxed font-sans">
                Pembayaran formulir dan UKT menggunakan Payment Gateway <strong>Duitku</strong>. Transaksi masuk otomatis tercatat dalam Buku Besar (Ledger).
              </p>
            </div>

            <div class="space-y-3">
              <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2">
                <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <Scale class="w-4 h-4 text-[#1E3A8A]" />
                  <span>SOP Persetujuan Pengajuan Cicilan UKT</span>
                </h4>
                <ul class="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1 leading-relaxed">
                  <li>Pengajuan cicilan wajib melampirkan <strong>Surat Permohonan Keringanan & Slip Penghasilan Orang Tua</strong>.</li>
                  <li><strong>Tahap 1 (Uang Muka/DP):</strong> Minimal <strong>30% s/d 50%</strong> dari total UKT, wajib dilunasi sebelum jadwal Ujian Tengah Semester (UTS).</li>
                  <li><strong>Tahap 2 & 3:</strong> Dilunasi selambat-lambatnya sebelum Ujian Akhir Semester (UAS).</li>
                  <li>Setelah permohonan disetujui, sistem otomatis memecah tagihan menjadi invoice cicilan berjangka di portal camaba.</li>
                </ul>
              </div>

              <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2">
                <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <Banknote class="w-4 h-4 text-emerald-600" />
                  <span>SOP Pengembalian Dana (Refund) Mahasiswa Mundur</span>
                </h4>
                <ul class="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1 leading-relaxed">
                  <li>Pengembalian dana <strong>HANYA berlaku bagi biaya UKT Semester 1</strong> (Biaya pendaftaran formulir bersifat <em>non-refundable</em>).</li>
                  <li>Potongan administrasi sebesar <strong>10% - 20%</strong> sesuai ketentuan SK Rektor BTH.</li>
                  <li>Pencairan transfer refund diproses oleh Bagian Keuangan selambat-lambatnya <strong>14 hari kerja</strong> ke rekening terdaftar.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- TAB 4: CBT & PENILAIAN WAWANCARA -->
          <div v-else-if="activeTab === 'seleksi'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <MonitorPlay class="w-4 h-4 text-[#1E3A8A]" />
                <span>Ketentuan Pelaksanaan Ujian CBT Daring & Live Proctoring</span>
              </h4>
              <ul class="list-disc list-inside text-[11px] text-slate-600 space-y-1.5 pl-1 leading-relaxed">
                <li>Sistem mendeteksi perpindahan tab browser (tab-switch). Peserta yang berpindah tab lebih dari <strong>3 kali</strong> akan ditandai dengan badge merah <em>"Perlu Investigasi"</em> di meja penguji.</li>
                <li>Dosen penguji dapat mereset sesi peserta jika terjadi kendala teknis listrik padam atau putus koneksi resmi.</li>
              </ul>
            </div>

            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Award class="w-4 h-4 text-amber-600" />
                <span>Formula Penilaian Kelulusan Terintegrasi</span>
              </h4>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-mono text-[11px] leading-relaxed">
                Nilai Akhir (NA) = (Nilai CBT x 40%) + (Nilai Wawancara Dosen x 30%) + (Skor Berkas/Rapor x 30%)
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed">
                Peserta dinyatakan LULUS murni jika <strong>NA &ge; 70.00</strong> (untuk prodi S1 Farmasi & Keperawatan) atau <strong>NA &ge; 65.00</strong> untuk prodi lainnya.
              </p>
            </div>
          </div>

          <!-- TAB 5: PENETAPAN NIM & SEVIMA -->
          <div v-else-if="activeTab === 'nim'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <GraduationCap class="w-4 h-4 text-[#1E3A8A]" />
                <span>Prosedur Penetapan Nomor Induk Mahasiswa (NIM) BTH</span>
              </h4>
              <div class="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                <p>NIM resmi hanya dapat diterbitkan bagi calon mahasiswa yang memenuhi syarat <strong>3K</strong>:</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div class="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-center">
                    <strong class="text-blue-900 block font-sora">1. Kelulusan Sah</strong>
                    <span class="text-[10px] text-blue-700">Lulus seleksi CBT/Rapor</span>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-center">
                    <strong class="text-emerald-900 block font-sora">2. Keuangan Lunas</strong>
                    <span class="text-[10px] text-emerald-700">UKT Tahap 1 terbayar</span>
                  </div>
                  <div class="p-2.5 bg-purple-50/70 border border-purple-200/60 rounded-xl text-center">
                    <strong class="text-purple-900 block font-sora">3. Kelengkapan Berkas</strong>
                    <span class="text-[10px] text-purple-700">Semua dokumen verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Layers class="w-4 h-4 text-emerald-600" />
                <span>Sinkronisasi Data Mahasiswa Baru ke SIAKAD & SEVIMA Feeder</span>
              </h4>
              <p class="text-[11px] text-slate-600 leading-relaxed">
                Setelah NIM terbit, admin dapat menekan tombol <strong>"Ekspor Data Mahasiswa Baru (Format SEVIMA)"</strong> untuk mengunduh template siap unggah ke PDDIKTI Feeder Kemendikbudristek tanpa perlu input manual berulang.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div class="text-[11px] text-slate-500 font-sans">
            Dokumen SOP Revisi 2.4 - Biro Administrasi Akademik & Kemahasiswaan BTH
          </div>
          <button
            type="button"
            @click="close"
            class="w-full sm:w-auto px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            Selesai Membaca
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import {
  BookMarked,
  ShieldCheck,
  CheckCircle,
  FileText,
  RotateCcw,
  CreditCard,
  Scale,
  Banknote,
  MonitorPlay,
  Award,
  GraduationCap,
  Layers,
} from 'lucide-vue-next';

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};

const activeTab = ref('rbac');

const tabs = [
  { id: 'rbac', label: '1. Matriks Wewenang RBAC', icon: ShieldCheck },
  { id: 'verifikasi', label: '2. SOP Verifikasi Berkas', icon: FileText },
  { id: 'keuangan', label: '3. SOP Keuangan & Duitku', icon: CreditCard },
  { id: 'seleksi', label: '4. SOP CBT & Wawancara', icon: MonitorPlay },
  { id: 'nim', label: '5. SOP Penetapan NIM & SEVIMA', icon: GraduationCap },
];

const rbacRoles = [
  {
    title: 'Super Administrator',
    code: 'superadmin',
    dotColor: 'bg-rose-500',
    desc: 'Pemegang kuasa penuh sistem PMB, pengelolaan akun panitia, hak akses meja kerja, dan pembatalan status darurat.',
    authorities: 'Semua Meja Kerja, Log Audit, Konfigurasi Jalur & Kuota, Reset Kredensial Pengguna.',
  },
  {
    title: 'Tim Keuangan PMB',
    code: 'keuangan',
    dotColor: 'bg-emerald-500',
    desc: 'Pengelola arus transaksi keuangan penerimaan mahasiswa baru, rekonsiliasi gateway, dan verifikasi cicilan.',
    authorities: 'Meja Keuangan, Riwayat Transaksi Duitku, Verifikasi Refund Pengunduran Diri, Review Cicilan.',
  },
  {
    title: 'Verifikator Berkas',
    code: 'admin_pmb / verifikator',
    dotColor: 'bg-blue-500',
    desc: 'Pemeriksa kelayakan dan keabsahan dokumen persyaratan administratif calon mahasiswa baru.',
    authorities: 'Meja Verifikasi Berkas, Pemberian Status Valid/Revisi, Persetujuan Pindah Jalur.',
  },
  {
    title: 'Dosen Penguji Seleksi',
    code: 'dosen / penguji',
    dotColor: 'bg-amber-500',
    desc: 'Penguji proses seleksi akademik dan wawancara daring calon mahasiswa program sarjana & diploma.',
    authorities: 'Meja CBT & Bank Soal, Live Proctoring Ujian, Input Skor Wawancara, Penilaian Portofolio.',
  },
  {
    title: 'Ketua Program Studi (Kaprodi)',
    code: 'prodi',
    dotColor: 'bg-purple-500',
    desc: 'Pengawas kuota penerimaan program studi, kelulusan pendaftar, dan penetapan nomor induk mahasiswa (NIM).',
    authorities: 'Meja Mahasiswa Baru & NIM, Rekomendasi Kelulusan Prodi, Pembagian Gugus PKKMB.',
  },
  {
    title: 'Dekan & Pimpinan Rektorat',
    code: 'dekan / pimpinan',
    dotColor: 'bg-indigo-500',
    desc: 'Pimpinan pengambil kebijakan strategis penerimaan mahasiswa tingkat fakultas dan universitas.',
    authorities: 'Dashboard Eksekutif, Analitik Pendaftar, Penetapan SK Kelulusan Rektorat (LoA).',
  },
];
</script>
