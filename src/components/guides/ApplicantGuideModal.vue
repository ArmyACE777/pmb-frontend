<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn"
      @click.self="close"
    >
      <div
        class="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200/90 relative max-h-[90vh] flex flex-col font-sans overflow-hidden"
      >
        <!-- Modal Top Accent Strip -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-emerald-500 absolute top-0 left-0"></div>

        <!-- Header Modal -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold border border-blue-200/60 shadow-2xs">
              <BookOpen class="w-5 h-5 text-[#1E3A8A]" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-sora font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Buku Panduan Pendaftaran PMB
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/70 text-[#1E3A8A] border border-blue-200 font-mono">
                  TA 2026/2027
                </span>
              </div>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Petunjuk resmi tahapan penerimaan mahasiswa baru Universitas Bakti Tunas Husada
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="close"
            class="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-xl font-bold leading-none"
            aria-label="Tutup Panduan"
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
          <!-- TAB 1: ALUR PENDAFTARAN -->
          <div v-if="activeTab === 'alur'" class="space-y-4 animate-fadeIn">
            <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5">
              <Info class="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
              <p class="text-[11px] text-blue-900 leading-relaxed font-sans">
                Pendaftaran PMB BTH dilakukan secara daring penuh. Pastikan Anda menyelesaikan tiap tahapan berurutan agar dapat mencetak Kartu Peserta Ujian dan Kartu Registrasi Resmi.
              </p>
            </div>

            <div class="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div v-for="(step, idx) in stepsFlow" :key="idx" class="relative">
                <div
                  class="absolute -left-6 top-0 w-5 h-5 rounded-full bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] font-sora font-extrabold text-[10px] flex items-center justify-center shadow-2xs"
                >
                  {{ idx + 1 }}
                </div>
                <div class="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 transition-colors">
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm">
                      {{ step.title }}
                    </h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold">
                      {{ step.badge }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {{ step.desc }}
                  </p>
                  <div v-if="step.hint" class="mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-flex items-center gap-1">
                    <CheckCircle class="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>{{ step.hint }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: KETENTUAN BERKAS -->
          <div v-else-if="activeTab === 'berkas'" class="space-y-4 animate-fadeIn">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div class="font-sora font-bold text-slate-900 flex items-center gap-2">
                  <FileText class="w-4 h-4 text-[#1E3A8A]" />
                  <span>Format File Didukung</span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  Dokumen wajib berupa pindaian (scan) asli dalam format <strong>PDF</strong> atau foto <strong>JPG / PNG</strong> berkualitas tajam.
                </p>
              </div>

              <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div class="font-sora font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-emerald-600" />
                  <span>Ukuran Maksimal</span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  Maksimal <strong>2 MB</strong> per dokumen. Pastikan teks dan nomor identitas (NIK / NISN) terbaca jelas tanpa blur.
                </p>
              </div>
            </div>

            <div class="space-y-2.5">
              <h4 class="font-sora font-bold text-slate-900 text-xs">Daftar Dokumen Wajib:</h4>
              <div class="space-y-2">
                <div v-for="doc in requiredDocs" :key="doc.name" class="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <div class="w-7 h-7 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {{ doc.num }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-sora font-semibold text-slate-900 text-xs">{{ doc.name }}</span>
                      <span v-if="doc.required" class="text-rose-500 font-bold text-[10px]">*Wajib</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{{ doc.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: TATA CARA PEMBAYARAN -->
          <div v-else-if="activeTab === 'biaya'" class="space-y-4 animate-fadeIn">
            <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
              <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p class="text-[11px] text-emerald-900 leading-relaxed font-sans">
                Pembayaran biaya pendaftaran dan UKT telah terintegrasi dengan Payment Gateway resmi (Duitku). Status pembayaran diverifikasi <strong>secara otomatis 24/7 dalam 1-2 menit</strong> tanpa perlu kirim bukti transfer manual.
              </p>
            </div>

            <div class="space-y-3">
              <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2">
                <div class="flex items-center gap-2 text-slate-900 font-sora font-bold text-xs sm:text-sm">
                  <CreditCard class="w-4 h-4 text-[#1E3A8A]" />
                  <span>1. Pembayaran via Virtual Account (VA) Bank</span>
                </div>
                <ol class="list-decimal list-inside text-[11px] text-slate-600 space-y-1.5 leading-relaxed pl-1">
                  <li>Pilih salah satu bank mitra resmi (<strong>BSI, Mandiri, BRI, atau BCA</strong>) di halaman Biaya & Tagihan.</li>
                  <li>Salin 16 digit Nomor Virtual Account yang terbit.</li>
                  <li>Buka aplikasi m-Banking / ATM Anda, pilih menu <strong>Transfer / Pembayaran &gt; Virtual Account</strong>.</li>
                  <li>Pastikan nama tagihan muncul: <strong>Universitas BTH - [Nama Anda]</strong>.</li>
                  <li>Selesaikan transaksi, status tagihan otomatis menjadi <span class="text-emerald-700 font-bold">LUNAS</span>.</li>
                </ol>
              </div>

              <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2">
                <div class="flex items-center gap-2 text-slate-900 font-sora font-bold text-xs sm:text-sm">
                  <QrCode class="w-4 h-4 text-emerald-600" />
                  <span>2. Pembayaran via QRIS (Semua E-Wallet & Bank)</span>
                </div>
                <ol class="list-decimal list-inside text-[11px] text-slate-600 space-y-1.5 leading-relaxed pl-1">
                  <li>Pilih opsi metode <strong>QRIS</strong> pada invoice tagihan.</li>
                  <li>Buka aplikasi e-Wallet (GoPay, OVO, Dana, ShopeePay) atau m-Banking apapun berlogo QRIS.</li>
                  <li>Arahkan kamera ke kode QR dinamis di layar dan konfirmasi nominal pembayaran.</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- TAB 4: CBT & WAWANCARA -->
          <div v-else-if="activeTab === 'ujian'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <div class="flex items-center gap-2 text-slate-900 font-sora font-bold text-xs sm:text-sm">
                <MonitorPlay class="w-4 h-4 text-[#1E3A8A]" />
                <span>Tata Tertib Ujian Mandiri Komputer (CBT Daring)</span>
              </div>
              <ul class="space-y-2 text-[11px] text-slate-600 leading-relaxed list-disc list-inside">
                <li>Ujian CBT terdiri dari <strong>60 butir soal pilihan ganda</strong> dengan durasi <strong>90 menit</strong>.</li>
                <li>Materi ujian meliputi: <em>Literasi Sains Medis/Kefarmasian, Penalaran Logika Komputasi, serta Literasi Bahasa & Skolastik</em>.</li>
                <li>Ujian dapat diakses melalui laptop atau smartphone yang terhubung koneksi internet stabil.</li>
                <li>Jawaban tersimpan otomatis secara real-time. Gunakan tombol <strong>Tandai Ragu-ragu</strong> bila ingin mengkaji ulang jawaban.</li>
              </ul>
            </div>

            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <div class="flex items-center gap-2 text-slate-900 font-sora font-bold text-xs sm:text-sm">
                <Video class="w-4 h-4 text-emerald-600" />
                <span>Wawancara Daring Bersama Dosen Penguji</span>
              </div>
              <ul class="space-y-2 text-[11px] text-slate-600 leading-relaxed list-disc list-inside">
                <li>Khusus program studi Fakultas Ilmu Kesehatan (Farmasi, Keperawatan, Kebidanan, TLM).</li>
                <li>Sesi wawancara berlangsung melalui <strong>Google Meet / Zoom</strong> sesuai tautan ruang virtual yang tertera di modul Ujian.</li>
                <li>Kenakan pakaian kemeja rapi berkerah dan aktifkan kamera sepanjang sesi berlangsung.</li>
              </ul>
            </div>
          </div>

          <!-- TAB 5: REGISTRASI ULANG & NIM -->
          <div v-else-if="activeTab === 'nim'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <div class="flex items-center gap-2 text-slate-900 font-sora font-bold text-xs sm:text-sm">
                <Award class="w-4 h-4 text-[#1E3A8A]" />
                <span>Alur Kelulusan & Penetapan Nomor Induk Mahasiswa (NIM)</span>
              </div>
              <div class="space-y-2.5 text-[11px] text-slate-600 leading-relaxed">
                <div class="flex items-start gap-2">
                  <span class="w-5 h-5 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span><strong>Unduh Surat Keputusan Kelulusan (LoA):</strong> Buka tab <em>Hasil Kelulusan</em> dan unduh dokumen resmi bertanda tangan digital Rektor.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="w-5 h-5 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span><strong>Pelunasan Biaya Kuliah (UKT Semester 1):</strong> Pembayaran UKT dapat dilakukan sekaligus atau melalui program cicilan bertahap yang disetujui panitia.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="w-5 h-5 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span><strong>Penerbitan NIM Resmi & Akun SIAKAD:</strong> Segera setelah UKT terverifikasi, sistem menerbitkan NIM resmi, pembagian gugus PKKMB, dan akses portal akademik SIAKAD BTH.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <a
              :href="guidePdfUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Download class="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh E-Book Panduan (PDF)</span>
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=6282117100200"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-colors border border-emerald-200/80 cursor-pointer"
              title="Hubungi WhatsApp Helpdesk PMB"
            >
              <HelpCircle class="w-3.5 h-3.5 text-emerald-600" />
              <span class="hidden sm:inline">Tanya Helpdesk WA</span>
            </a>
          </div>

          <button
            type="button"
            @click="close"
            class="w-full sm:w-auto px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import {
  BookOpen,
  Info,
  CheckCircle,
  FileText,
  ShieldCheck,
  CreditCard,
  QrCode,
  MonitorPlay,
  Video,
  Award,
  Download,
  HelpCircle,
  Layers,
} from 'lucide-vue-next';

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  guidePdfUrl: {
    type: String,
    default: 'https://pmb.bth.ac.id/panduan-pendaftaran-2026.pdf',
  },
});

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};

const activeTab = ref('alur');

const tabs = [
  { id: 'alur', label: '1. Alur 6 Langkah', icon: Layers },
  { id: 'berkas', label: '2. Syarat Berkas', icon: FileText },
  { id: 'biaya', label: '3. Cara Bayar', icon: CreditCard },
  { id: 'ujian', label: '4. Ujian CBT & Lisan', icon: MonitorPlay },
  { id: 'nim', label: '5. Kelulusan & NIM', icon: Award },
];

const stepsFlow = [
  {
    title: 'Langkah 1: Pengisian Biodata Profil',
    badge: 'Biodata & Sekolah',
    desc: 'Lengkapi identitas diri, NIK, alamat lengkap, data orang tua/wali, dan asal sekolah SMA/SMK/MA sederajat.',
    hint: 'Dapat memanfaatkan scanner OCR KTP untuk pengisian instan.',
  },
  {
    title: 'Langkah 2: Pemilihan Jalur & Program Studi',
    badge: 'Jalur Masuk',
    desc: 'Pilih jalur penerimaan (Reguler, Prestasi Akademik/Non-Akademik, Kemitraan BK, atau KIP-K) serta pilihan 1 dan 2 prodi idaman Anda.',
    hint: 'Gunakan kode referal sekolah dari Guru BK jika Anda mendapatkan rekomendasi khusus.',
  },
  {
    title: 'Langkah 3: Pembayaran Biaya Pendaftaran Formulir',
    badge: 'Biaya PMB',
    desc: 'Lakukan pelunasan invoice biaya formulir via Virtual Account atau QRIS otomatis untuk mengunci pilihan program studi.',
    hint: 'Tagihan terkonfirmasi seketika dalam 1 menit.',
  },
  {
    title: 'Langkah 4: Pengunggahan Berkas Dokumen Persyaratan',
    badge: 'Unggah Dokumen',
    desc: 'Unggah berkas pindaian ijazah/SKL, transkrip nilai, KTP, Kartu Keluarga, dan pasfoto terbaru ukuran maksimal 2 MB.',
    hint: 'Pastikan seluruh teks dan cap stempel terbaca tajam.',
  },
  {
    title: 'Langkah 5: Mengikuti Ujian CBT Mandiri & Wawancara Daring',
    badge: 'Seleksi Masuk',
    desc: 'Akses lembar ujian CBT 60 butir soal secara mandiri dan ikuti sesi wawancara daring bersama Dosen Penguji Fakultas.',
    hint: 'Hasil nilai langsung tampil setelah Anda menekan tombol Selesaikan Ujian.',
  },
  {
    title: 'Langkah 6: Pengumuman Kelulusan, UKT, & Penetapan NIM',
    badge: 'Mahasiswa Baru',
    desc: 'Unduh Surat Keputusan Kelulusan (LoA), selesaikan registrasi ulang UKT Semester 1, dan dapatkan Nomor Induk Mahasiswa (NIM) resmi.',
    hint: 'Akun SIAKAD dan plot Gugus PKKMB akan aktif otomatis.',
  },
];

const requiredDocs = [
  {
    num: '1',
    name: 'Pindaian Ijazah Asli atau Surat Keterangan Lulus (SKL)',
    required: true,
    notes: 'Bagi lulusan tahun berjalan yang belum memiliki ijazah resmi, dapat menggunakan SKL bertanda tangan Kepala Sekolah & cap stempel basah.',
  },
  {
    num: '2',
    name: 'Pindaian Kartu Tanda Penduduk (KTP) / Kartu Pelajar',
    required: true,
    notes: 'Pastikan NIK 16 digit terbaca jelas dan sesuai data di Dukcapil.',
  },
  {
    num: '3',
    name: 'Pindaian Kartu Keluarga (KK)',
    required: true,
    notes: 'Digunakan untuk verifikasi data orang tua/wali calon mahasiswa.',
  },
  {
    num: '4',
    name: 'Pasfoto Resmi Berwarna Terbaru (3x4 atau 4x6)',
    required: true,
    notes: 'Format formal dengan latar belakang merah atau biru, berpakaian kemeja sopan (bukan foto santai atau selfie).',
  },
  {
    num: '5',
    name: 'Surat Keterangan Sehat & Bebas Buta Warna (Khusus Prodi Kesehatan)',
    required: false,
    notes: 'Diterbitkan oleh Puskesmas, Rumah Sakit, atau Klinik Dokter pemerintah/swasta untuk prodi Farmasi, Keperawatan, Kebidanan, & TLM.',
  },
];
</script>
