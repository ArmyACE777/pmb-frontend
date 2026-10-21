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
        <div class="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#1E3A8A] to-blue-600 absolute top-0 left-0"></div>

        <!-- Header Modal -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200/60 shadow-2xs">
              <Megaphone class="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-sora font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  SOP & Panduan Tim Marketing Lapangan
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                  PMB Promosi
                </span>
              </div>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Pedoman sosialisasi sekolah, pameran pendidikan, dan pelaporan kunjungan lapangan Universitas BTH
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
          <!-- TAB 1: SOP KUNJUNGAN -->
          <div v-if="activeTab === 'sop'" class="space-y-4 animate-fadeIn">
            <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5">
              <Compass class="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
              <p class="text-[11px] text-blue-900 leading-relaxed font-sans">
                Setiap kunjungan sosialisasi sekolah dan pameran kampus (Edu Fair) wajib dilaksanakan dengan mengedepankan citra profesionalisme Universitas Bakti Tunas Husada.
              </p>
            </div>

            <div class="space-y-2.5">
              <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2">
                <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <ClipboardCheck class="w-4 h-4 text-emerald-600" />
                  <span>Tahapan Wajib Kunjungan Lapangan</span>
                </h4>
                <ol class="list-decimal list-inside text-[11px] text-slate-600 space-y-2 pl-1 leading-relaxed">
                  <li><strong>Pra-Kunjungan:</strong> Bawa surat tugas resmi kampus dari Humas/PMB, pastikan persediaan brosur cetak, flyer program beasiswa, dan suvenir mencukupi.</li>
                  <li><strong>Pelaksanaan di Sekolah:</strong> Berpakaian blazer/almamater rapi, presentasikan keunggulan prodi (Farmasi A, Keperawatan, Kebidanan, Analis Kesehatan/TLM, S1 IT & Bisnis).</li>
                  <li><strong>Arahkan Registrasi:</strong> Bimbing siswa langsung scan QR Code atau memasukkan <em>Kode Referal Marketing</em> Anda untuk mendapatkan kemudahan verifikasi.</li>
                  <li><strong>Pasca-Kunjungan:</strong> Submit laporan kunjungan di sistem pada hari yang sama dengan menyertakan foto dokumentasi dan GPS geolokasi.</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- TAB 2: KODE REFERAL -->
          <div v-else-if="activeTab === 'kode'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Tag class="w-4 h-4 text-[#1E3A8A]" />
                <span>Mekanisme Kode Referal Marketing Staf</span>
              </h4>
              <div class="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                <p>Kode Referal staf marketing berfungsi sebagai pengait data otomatis antara calon mahasiswa dengan akun marketing Anda.</p>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <strong class="text-slate-900 block font-sora">Cara Pengecekan:</strong>
                  <p>Kode referal Anda dapat dilihat pada kartu identitas profil di dashboard ini. Siswa menginput kode ini saat mendaftar di halaman <em>Pilih Jalur & Prodi</em>.</p>
                </div>
                <p class="text-[11px] text-slate-500">
                  Data pendaftar yang berhasil menginput kode Anda akan otomatis tampil di tab <strong>Siswa Binaan Marketing</strong> beserta status pembayaran dan kelulusannya.
                </p>
              </div>
            </div>
          </div>

          <!-- TAB 3: PENGISIAN LAPORAN -->
          <div v-else-if="activeTab === 'laporan'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <MapPin class="w-4 h-4 text-rose-500" />
                <span>Ketentuan Pelaporan & Validasi GPS Geolocation</span>
              </h4>
              <ul class="list-disc list-inside text-[11px] text-slate-600 space-y-2 pl-1 leading-relaxed">
                <li>
                  <strong>Nama Sekolah & Kontak Guru BK:</strong> Isi nama sekolah lengkap beserta nama kontak person Bapak/Ibu Guru BK yang mendampingi kunjungan.
                </li>
                <li>
                  <strong>Jumlah Audiens Siswa:</strong> Cantumkan estimasi jumlah siswa kelas XII yang hadir dalam ruang presentasi / aula.
                </li>
                <li>
                  <strong>Foto Dokumentasi:</strong> Unggah foto dokumentasi kegiatan yang menampilkan suasana sosialisasi / serah terima cinderamata dengan pihak sekolah.
                </li>
                <li>
                  <strong>Validasi Titik Koordinat GPS:</strong> Tekan tombol <em>"Ambil Lokasi Saat Ini"</em> saat masih berada di area sekolah agar latitude & longitude tercatat valid untuk audit panitia.
                </li>
              </ul>
            </div>
          </div>

          <!-- TAB 4: TARGET KPI & KOMISI -->
          <div v-else-if="activeTab === 'target'" class="space-y-4 animate-fadeIn">
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <h4 class="font-sora font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Target class="w-4 h-4 text-emerald-600" />
                <span>Indikator Kinerja Utama (KPI) & Insentif Promosi</span>
              </h4>
              <div class="space-y-2.5 text-[11px] text-slate-600 leading-relaxed">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong class="text-slate-900 block font-sora mb-1">Target Kunjungan Sekolah:</strong>
                  <p>Minimal <strong>20 sekolah mitra per bulan</strong> selama periode promosi aktif (Oktober - Mei).</p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong class="text-slate-900 block font-sora mb-1">Insentif Konversi Siswa Binaan:</strong>
                  <p>Bonus apresiasi prestasi diberikan bagi pendaftar binaan yang berhasil mencapai tahap <strong>Formulir Lunas</strong> dan <strong>Registrasi Ulang UKT (Mahasiswa Baru Resmi)</strong> sesuai SK Rektor BTH tentang Kebijakan Insentif Promosi Kampus.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div class="text-[11px] text-slate-500 font-sans">
            Biro Hubungan Masyarakat & Promosi Penerimaan Mahasiswa Baru BTH
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
  Megaphone,
  Compass,
  ClipboardCheck,
  Tag,
  MapPin,
  Target,
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

const activeTab = ref('sop');

const tabs = [
  { id: 'sop', label: '1. SOP Kunjungan', icon: ClipboardCheck },
  { id: 'kode', label: '2. Kode Referal', icon: Tag },
  { id: 'laporan', label: '3. Pelaporan GPS', icon: MapPin },
  { id: 'target', label: '4. Target & Insentif', icon: Target },
];
</script>
