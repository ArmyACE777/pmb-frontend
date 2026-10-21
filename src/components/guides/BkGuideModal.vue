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
        <div class="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-[#1E3A8A] to-blue-500 absolute top-0 left-0"></div>

        <!-- Header Modal -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200/60 shadow-2xs">
              <School class="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-sora font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Panduan Mitra Guru BK & Sekolah
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                  Program Kemitraan
                </span>
              </div>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Petunjuk teknis pengelolaan pendaftar binaan sekolah & apresiasi kemitraan Universitas BTH
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
          <!-- TAB 1: ALUR KEMITRAAN -->
          <div v-if="activeTab === 'alur'" class="space-y-4 animate-fadeIn">
            <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
              <CheckCircle class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p class="text-[11px] text-emerald-900 leading-relaxed font-sans">
                Universitas Bakti Tunas Husada memberikan penghargaan dan jalur prioritas bagi siswa/i yang direkomendasikan langsung oleh Bapak/Ibu Guru Bimbingan Konseling (BK) sekolah mitra.
              </p>
            </div>

            <div class="space-y-2.5">
              <h4 class="font-sora font-bold text-slate-900 text-xs">Keuntungan Program Kemitraan:</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div class="font-sora font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap class="w-4 h-4 text-[#1E3A8A]" />
                    <span>Untuk Siswa Binaan</span>
                  </div>
                  <ul class="text-[11px] text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
                    <li>Prioritas jadwal wawancara dan verifikasi berkas.</li>
                    <li>Pendampingan pemilihan program studi sesuai minat & bakat.</li>
                    <li>Peluang beasiswa kemitraan khusus prodi kesehatan & farmasi.</li>
                  </ul>
                </div>

                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div class="font-sora font-bold text-slate-900 flex items-center gap-2">
                    <Award class="w-4 h-4 text-emerald-600" />
                    <span>Untuk Sekolah & Guru BK</span>
                  </div>
                  <ul class="text-[11px] text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
                    <li>Insentif apresiasi kemitraan Rp 50.000 / pendaftar.</li>
                    <li>Sertifikat kemitraan resmi tingkat universitas.</li>
                    <li>Akses prioritas pelatihan Guru BK tahunan dari Fakultas BTH.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: PENGGUNAAN KODE REFERAL -->
          <div v-else-if="activeTab === 'referal'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Tag class="w-4 h-4 text-[#1E3A8A]" />
                <span>Cara Membagikan Kode Referal ke Siswa</span>
              </h4>
              <ol class="list-decimal list-inside text-[11px] text-slate-600 space-y-2 pl-1 leading-relaxed">
                <li>
                  Salin <strong>Kode Referal Sekolah</strong> yang tercantum di kartu profil atas dashboard Guru BK Anda.
                </li>
                <li>
                  Bagikan kode tersebut kepada siswa/i kelas XII yang berminat mendaftar ke Universitas BTH (bisa via grup WhatsApp kelas / pengumuman BK).
                </li>
                <li>
                  Arahkan siswa untuk membuat akun di <strong>pmb.bth.ac.id/register</strong>.
                </li>
                <li>
                  Pada formulir <em>Pilihan Jalur Pendaftaran</em>, siswa memasukkan kode referal Anda pada kolom <strong>"Kode Referal / Mitra Sekolah"</strong>.
                </li>
                <li>
                  Nama siswa secara otomatis muncul di tabel <strong>Data Siswa Pendaftar Binaan</strong> Anda secara real-time.
                </li>
              </ol>
            </div>
          </div>

          <!-- TAB 3: VALIDASI & STATUS SISWA -->
          <div v-else-if="activeTab === 'validasi'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <FileCheck class="w-4 h-4 text-emerald-600" />
                <span>Arti Status Siswa di Dashboard Guru BK</span>
              </h4>
              <div class="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                  <span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] whitespace-nowrap mt-0.5">TERDAFTAR</span>
                  <p>Siswa baru membuat akun dan memilih prodi, namun belum menyelesaikan pembayaran biaya pendaftaran formulir.</p>
                </div>
                <div class="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200/60 flex items-start gap-2">
                  <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] whitespace-nowrap mt-0.5">FORMULIR LUNAS</span>
                  <p>Siswa telah membayar biaya formulir. <strong>Pada tahap ini komisi kemitraan telah sah terhitung</strong>.</p>
                </div>
                <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60 flex items-start gap-2">
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] whitespace-nowrap mt-0.5">BERKAS VALID & LULUS</span>
                  <p>Dokumen siswa telah disetujui verifikator dan siswa telah mengikuti proses seleksi masuk.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: INSENTIF & PENCAIRAN -->
          <div v-else-if="activeTab === 'insentif'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Wallet class="w-4 h-4 text-amber-600" />
                <span>Skema Pencairan Dana Apresiasi Mitra</span>
              </h4>
              <div class="space-y-2.5 text-[11px] text-slate-600 leading-relaxed">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong class="text-slate-900 block font-sora mb-1">Opsi A: Potong Setoran Langsung (Pendaftaran Kolektif Sekolah)</strong>
                  <p>Bila sekolah mengumpulkan uang formulir siswa secara kolektif, Guru BK dapat <strong>langsung memotong komisi Rp 50.000 / siswa</strong> di sekolah, kemudian mentransfer nominal bersih ke rekening kampus BTH lalu mengunggah bukti setor di tab <em>Riwayat Setoran Kampus</em>.</p>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong class="text-slate-900 block font-sora mb-1">Opsi B: Transfer Rekening Mitra (Pendaftaran Mandiri Siswa)</strong>
                  <p>Bila siswa membayar formulir secara mandiri melalui Virtual Account/QRIS masing-masing, akumulasi apresiasi kemitraan akan ditransfer langsung oleh Bagian Keuangan Universitas BTH ke nomor rekening terdaftar Guru BK di akhir setiap gelombang.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div class="text-[11px] text-slate-500 font-sans">
            Layanan Mitra Sekolah & BK: <strong>0821-1710-0200</strong> (PIC Kemitraan BTH)
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
  School,
  CheckCircle,
  GraduationCap,
  Award,
  Tag,
  FileCheck,
  Wallet,
  Compass,
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

const activeTab = ref('alur');

const tabs = [
  { id: 'alur', label: '1. Alur Kemitraan', icon: Compass },
  { id: 'referal', label: '2. Kode Referal', icon: Tag },
  { id: 'validasi', label: '3. Status Siswa', icon: FileCheck },
  { id: 'insentif', label: '4. Insentif & Setoran', icon: Wallet },
];
</script>
