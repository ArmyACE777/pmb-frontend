<template>
  <div class="font-sans text-slate-700">
    <!-- ========================================================= -->
    <!-- MODE MODAL: Tab Underline Minimal + Konten To The Point   -->
    <!-- ========================================================= -->
    <template v-if="mode === 'modal'">
      <!-- Tab Underline Minimal (Tanpa Ikon/Kotak Berlebih) -->
      <div class="flex flex-wrap gap-x-5 gap-y-1 border-b border-slate-200 mb-5">
        <button
          v-for="sec in sections"
          :key="sec.id"
          type="button"
          @click="activeSection = sec.id"
          class="pb-2.5 text-xs font-sora transition-colors cursor-pointer border-b-2 -mb-px"
          :class="activeSection === sec.id
            ? 'border-[#1E3A8A] text-[#1E3A8A] font-semibold'
            : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'"
        >
          {{ sec.label }}
        </button>
      </div>

      <!-- 1. Alur 6 Tahap -->
      <div v-if="activeSection === 'flow'" class="divide-y divide-slate-100">
        <div
          v-for="step in stepsFlow"
          :key="step.number"
          class="py-3 first:pt-0 last:pb-0 flex items-start gap-3"
        >
          <span class="text-xs font-mono font-bold text-[#1E3A8A] w-5 shrink-0 pt-0.5">
            0{{ step.number }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="font-sora font-semibold text-xs sm:text-sm text-slate-900">
              {{ step.title }}
            </div>
            <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- 2. Jalur & Prodi -->
      <div v-else-if="activeSection === 'tracks'" class="space-y-5">
        <div>
          <h3 class="font-sora font-semibold text-xs uppercase tracking-wider text-slate-400 mb-2">
            Jalur Masuk ({{ cmsStore.identity.activeWave || 'Gelombang 1' }})
          </h3>
          <div class="divide-y divide-slate-100 border-t border-b border-slate-100">
            <div
              v-for="track in trackList"
              :key="track.id || track.name"
              class="py-2.5 flex items-baseline justify-between gap-4 text-xs"
            >
              <div>
                <div class="font-sora font-semibold text-slate-900">{{ track.name }}</div>
                <div class="text-slate-500 mt-0.5">{{ track.description }}</div>
              </div>
              <span class="font-mono font-semibold text-slate-800 shrink-0">
                {{ Number(track.fee) === 0 ? 'Rp 0' : formatRupiah(track.fee) }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-sora font-semibold text-xs uppercase tracking-wider text-slate-400 mb-2">
            Program Studi & Estimasi UKT
          </h3>
          <div class="divide-y divide-slate-100 border-t border-b border-slate-100">
            <div
              v-for="prodi in studyProgramList"
              :key="prodi.code"
              class="py-2 flex items-center justify-between gap-3 text-xs"
            >
              <div class="min-w-0">
                <span class="font-medium text-slate-900">{{ prodi.name }}</span>
                <span class="text-slate-400 ml-1.5">{{ prodi.faculty }}</span>
              </div>
              <span class="font-mono text-slate-700 shrink-0">{{ formatRupiah(prodi.uktFee) }}/smt</span>
            </div>
          </div>
          <p class="text-[11px] text-slate-500 mt-2.5">
            Pilih Prodi Utama (wajib) dan Prodi Kedua (opsional). Pilihan terkunci setelah formulir lunas.
          </p>
        </div>
      </div>

      <!-- 3. Syarat Berkas -->
      <div v-else-if="activeSection === 'documents'" class="space-y-4">
        <p class="text-xs text-slate-500">
          Format file: <strong class="text-slate-700">PDF, JPG, atau PNG</strong> (maks. <strong class="text-slate-700">2 MB</strong> per berkas).
        </p>

        <div>
          <h3 class="font-sora font-semibold text-xs uppercase tracking-wider text-slate-400 mb-2">
            Berkas Pokok (Wajib Semua Jalur)
          </h3>
          <ul class="divide-y divide-slate-100 border-t border-b border-slate-100 text-xs">
            <li v-for="doc in baseDocuments" :key="doc.name" class="py-2">
              <span class="font-semibold text-slate-900">{{ doc.name }}</span>
              <span class="text-slate-500"> — {{ doc.note }}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-sora font-semibold text-xs uppercase tracking-wider text-slate-400 mb-2">
            Berkas Khusus Sesuai Jalur
          </h3>
          <ul class="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
            <li><strong class="text-slate-800">Prestasi / Rapor:</strong> Rapor semester 1–5 & piagam prestasi.</li>
            <li><strong class="text-slate-800">Beasiswa KIP-K:</strong> Kartu KIP-Kuliah / SKTM.</li>
            <li><strong class="text-slate-800">Kemitraan Guru BK:</strong> Surat rekomendasi / kode referal resmi Guru BK.</li>
          </ul>
        </div>
      </div>

      <!-- 4. Pembayaran -->
      <div v-else-if="activeSection === 'payment'" class="divide-y divide-slate-100 text-xs">
        <div class="py-3 first:pt-0">
          <div class="font-sora font-semibold text-slate-900">Virtual Account & QRIS</div>
          <p class="text-slate-600 mt-0.5 leading-relaxed">
            Tersedia VA 6 bank (BSI, BCA, Mandiri, BRI, BNI, CIMB Niaga) dan QRIS dengan verifikasi otomatis.
          </p>
        </div>
        <div class="py-3">
          <div class="font-sora font-semibold text-slate-900">Transfer Manual</div>
          <p class="text-slate-600 mt-0.5 leading-relaxed">
            Unggah bukti transfer (JPG/PNG/PDF maks. 5 MB) pada tagihan untuk diverifikasi admin keuangan.
          </p>
        </div>
        <div class="py-3">
          <div class="font-sora font-semibold text-slate-900">Bebas Biaya (Kode Referal BK & KIP-K)</div>
          <p class="text-slate-600 mt-0.5 leading-relaxed">
            Jalur KIP-K (Rp 0) dan kode referal Guru BK terverifikasi langsung membebaskan biaya formulir.
          </p>
        </div>
        <div class="py-3 last:pb-0">
          <div class="font-sora font-semibold text-slate-900">Perpanjangan Tagihan & Cicilan UKT</div>
          <p class="text-slate-600 mt-0.5 leading-relaxed">
            Tagihan kedaluwarsa dapat diperpanjang dari detail tagihan. UKT Semester 1 tersedia opsi bayar penuh atau cicilan.
          </p>
        </div>
      </div>

      <!-- 5. Seleksi -->
      <div v-else-if="activeSection === 'exam'" class="divide-y divide-slate-100 text-xs">
        <div class="py-3 first:pt-0">
          <div class="font-sora font-semibold text-slate-900">Tahap 1 — Ujian CBT Online (Jalur Tes)</div>
          <p class="text-slate-600 mt-0.5 leading-relaxed">
            Durasi 60 menit dengan passing grade {{ passingGrade }}. Jika belum memenuhi ambang batas, peserta dapat mengulang CBT atau mendaftar jalur/prodi lain tanpa mengisi ulang biodata.
          </p>
        </div>
        <div class="py-3">
          <div class="font-sora font-semibold text-slate-900">Tahap 1 — Bebas Tes Tulis (Jalur Prestasi / Rapor)</div>
          <p class="text-slate-600 mt-0.5 leading-relaxed">
            Peserta jalur Prestasi / Rapor dinilai langsung berdasarkan rapor semester 1–5 dan portofolio tanpa soal CBT.
          </p>
        </div>
        <div class="py-3 last:pb-0">
          <div class="font-sora font-semibold text-slate-900">Tahap 2 — Wawancara Daring</div>
          <p class="text-slate-600 mt-0.5 leading-relaxed">
            Dilaksanakan melalui Google Meet atau Zoom pada menu Proses Seleksi, lalu klik konfirmasi kehadiran wawancara.
          </p>
        </div>
      </div>

      <!-- 6. Kelulusan & FAQ -->
      <div v-else-if="activeSection === 'result'" class="space-y-5 text-xs">
        <div class="space-y-1.5">
          <h3 class="font-sora font-semibold text-xs uppercase tracking-wider text-slate-400">
            Kelulusan, Daftar Ulang & NIM
          </h3>
          <ol class="space-y-1 text-slate-600 list-decimal list-inside leading-relaxed">
            <li>Cek pengumuman SK Rektor dan unduh Letter of Acceptance (LoA) di menu <strong class="text-slate-800">Daftar Ulang</strong>.</li>
            <li>Selesaikan pelunasan atau cicilan UKT Semester 1 pada menu <strong class="text-slate-800">Biaya & Tagihan</strong>.</li>
            <li>NIM resmi dan akses grup onboarding mahasiswa baru aktif otomatis setelah UKT lunas.</li>
          </ol>
        </div>

        <div v-if="faqList.length > 0">
          <h3 class="font-sora font-semibold text-xs uppercase tracking-wider text-slate-400 mb-2">
            Pertanyaan Umum
          </h3>
          <div class="divide-y divide-slate-100 border-t border-b border-slate-100">
            <div v-for="faq in faqList" :key="faq.id || faq.question" class="py-2.5">
              <div class="font-sora font-semibold text-slate-900">{{ faq.question }}</div>
              <p class="text-slate-600 mt-0.5 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ========================================================= -->
    <!-- MODE PAGE (/panduan): Dokumen Bersih Satu Kolom + TOC     -->
    <!-- ========================================================= -->
    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Daftar Isi Ringkas -->
        <aside class="lg:col-span-3 lg:sticky lg:top-20 print:hidden">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Daftar Isi
          </div>
          <nav class="space-y-1 border-l border-slate-200 pl-3">
            <a
              v-for="(sec, idx) in sections"
              :key="sec.id"
              :href="'#panduan-' + sec.id"
              class="block py-1 text-xs font-medium text-slate-600 hover:text-[#1E3A8A] transition-colors"
            >
              {{ idx + 1 }}. {{ sec.label }}
            </a>
          </nav>
        </aside>

        <!-- Konten Dokumen Utama -->
        <div class="lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-200 px-6 sm:px-8">
          <!-- 1. Alur -->
          <section id="panduan-flow" class="py-6 space-y-3 scroll-mt-20">
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">1. Alur 6 Tahap Pendaftaran</h2>
            <div class="divide-y divide-slate-100">
              <div v-for="step in stepsFlow" :key="step.number" class="py-2.5 flex items-start gap-3 text-xs">
                <span class="font-mono font-bold text-[#1E3A8A] w-5 shrink-0">0{{ step.number }}</span>
                <div>
                  <div class="font-sora font-semibold text-slate-900">{{ step.title }}</div>
                  <p class="text-slate-600 mt-0.5 leading-relaxed">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 2. Jalur & Prodi -->
          <section id="panduan-tracks" class="py-6 space-y-4 scroll-mt-20">
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">2. Jalur Masuk & Program Studi</h2>
            <div class="divide-y divide-slate-100 border-t border-b border-slate-100 text-xs">
              <div v-for="track in trackList" :key="track.id || track.name" class="py-2.5 flex justify-between gap-4">
                <div>
                  <div class="font-semibold text-slate-900">{{ track.name }}</div>
                  <div class="text-slate-500 mt-0.5">{{ track.description }}</div>
                </div>
                <span class="font-mono font-semibold text-slate-800 shrink-0">
                  {{ Number(track.fee) === 0 ? 'Rp 0' : formatRupiah(track.fee) }}
                </span>
              </div>
            </div>
            <div class="divide-y divide-slate-100 border-t border-b border-slate-100 text-xs">
              <div v-for="prodi in studyProgramList" :key="prodi.code" class="py-2 flex justify-between gap-3">
                <div>
                  <span class="font-medium text-slate-900">{{ prodi.name }}</span>
                  <span class="text-slate-400 ml-1.5">{{ prodi.faculty }}</span>
                </div>
                <span class="font-mono text-slate-700 shrink-0">{{ formatRupiah(prodi.uktFee) }}/smt</span>
              </div>
            </div>
          </section>

          <!-- 3. Berkas -->
          <section id="panduan-documents" class="py-6 space-y-3 scroll-mt-20 text-xs">
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">3. Syarat Berkas Dokumen</h2>
            <p class="text-slate-500">Format: PDF, JPG, atau PNG (maks. 2 MB per file).</p>
            <ul class="divide-y divide-slate-100 border-t border-b border-slate-100">
              <li v-for="doc in baseDocuments" :key="doc.name" class="py-2">
                <span class="font-semibold text-slate-900">{{ doc.name }}</span>
                <span class="text-slate-500"> — {{ doc.note }}</span>
              </li>
            </ul>
            <p class="text-slate-600">
              <strong class="text-slate-800">Berkas khusus jalur:</strong> Rapor smt 1–5 & piagam (Prestasi), Kartu KIP/SKTM (KIP-K), atau Surat Rekomendasi / Kode Referal (Kemitraan BK).
            </p>
          </section>

          <!-- 4. Pembayaran -->
          <section id="panduan-payment" class="py-6 space-y-2.5 scroll-mt-20 text-xs">
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">4. Cara Pembayaran & Referal BK</h2>
            <ul class="space-y-1.5 text-slate-600 list-disc list-inside leading-relaxed">
              <li><strong class="text-slate-800">Virtual Account & QRIS:</strong> BSI, BCA, Mandiri, BRI, BNI, CIMB Niaga, dan QRIS.</li>
              <li><strong class="text-slate-800">Transfer Manual:</strong> Unggah bukti transfer (maks. 5 MB) pada kartu tagihan.</li>
              <li><strong class="text-slate-800">Bebas Biaya Formulir:</strong> Jalur KIP-K (Rp 0) atau Kode Referal resmi Guru BK.</li>
              <li><strong class="text-slate-800">Cicilan UKT & Perpanjangan:</strong> Tersedia pengajuan perpanjangan tagihan kedaluwarsa dan cicilan UKT Semester 1.</li>
            </ul>
          </section>

          <!-- 5. Seleksi -->
          <section id="panduan-exam" class="py-6 space-y-2.5 scroll-mt-20 text-xs">
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">5. Proses Seleksi (CBT & Wawancara)</h2>
            <ul class="space-y-1.5 text-slate-600 list-disc list-inside leading-relaxed">
              <li><strong class="text-slate-800">Ujian CBT (Jalur Tes):</strong> Durasi 60 menit, Passing Grade {{ passingGrade }}. Bisa ulang CBT atau tambah pendaftaran jalur/prodi lain jika belum lulus.</li>
              <li><strong class="text-slate-800">Bebas Tes (Prestasi / Rapor):</strong> Penilaian dari verifikasi nilai rapor & portofolio tanpa soal CBT.</li>
              <li><strong class="text-slate-800">Wawancara Daring:</strong> Melalui Google Meet atau Zoom pada menu Proses Seleksi disertai konfirmasi kehadiran.</li>
            </ul>
          </section>

          <!-- 6. Kelulusan & FAQ -->
          <section id="panduan-result" class="py-6 space-y-4 scroll-mt-20 text-xs">
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">6. Kelulusan, Daftar Ulang & FAQ</h2>
            <ol class="space-y-1 text-slate-600 list-decimal list-inside leading-relaxed">
              <li>Cek pengumuman SK Rektor dan unduh LoA pada menu Daftar Ulang.</li>
              <li>Lunasi UKT Semester 1 (penuh atau cicilan) untuk penerbitan NIM resmi.</li>
            </ol>
            <div v-if="faqList.length > 0" class="divide-y divide-slate-100 border-t border-slate-100">
              <div v-for="faq in faqList" :key="faq.id || faq.question" class="py-2.5">
                <div class="font-semibold text-slate-900">{{ faq.question }}</div>
                <p class="text-slate-600 mt-0.5 leading-relaxed">{{ faq.answer }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCmsStore } from '@/stores/cms';

defineProps({
  mode: {
    type: String,
    default: 'modal',
    validator: (val) => ['modal', 'page'].includes(val),
  },
});

const cmsStore = useCmsStore();
const activeSection = ref('flow');
const passingGrade = 70;

const sections = [
  { id: 'flow', label: 'Alur 6 Tahap' },
  { id: 'tracks', label: 'Jalur & Prodi' },
  { id: 'documents', label: 'Berkas' },
  { id: 'payment', label: 'Pembayaran' },
  { id: 'exam', label: 'Seleksi' },
  { id: 'result', label: 'Kelulusan & FAQ' },
];

const stepsFlow = [
  {
    number: 1,
    title: 'Profil & Biodata',
    description: 'Lengkapi data pribadi, domisili, orang tua/wali, dan asal sekolah (tersedia Scanner OCR KTP).',
  },
  {
    number: 2,
    title: 'Jalur Pendaftaran & Prodi',
    description: 'Pilih jalur masuk serta Prodi Pilihan 1 (wajib) dan Pilihan 2 (opsional).',
  },
  {
    number: 3,
    title: 'Biaya & Aktivasi Formulir',
    description: 'Bayar formulir via VA/QRIS/transfer manual atau aktifkan Kode Referal Guru BK (Rp 0) untuk membuka akses seleksi.',
  },
  {
    number: 4,
    title: 'Unggah Berkas Persyaratan',
    description: 'Unggah 5 berkas pokok dan berkas pendukung khusus sesuai jalur (PDF/JPG/PNG, maks. 2 MB).',
  },
  {
    number: 5,
    title: 'Proses Seleksi (CBT & Wawancara)',
    description: 'Ikuti CBT 60 menit (atau seleksi rapor pada jalur Bebas Tes) dan sesi Wawancara Daring.',
  },
  {
    number: 6,
    title: 'Kelulusan, Daftar Ulang & NIM',
    description: 'Unduh LoA dan selesaikan pelunasan/cicilan UKT Semester 1 untuk penerbitan NIM resmi.',
  },
];

const baseDocuments = [
  { name: 'Ijazah / SKL', note: 'Scan asli ijazah SMA/SMK/MA atau SKL/rapor akhir.' },
  { name: 'KTP / Kartu Pelajar', note: 'Identitas diri yang masih berlaku dan terbaca jelas.' },
  { name: 'Kartu Keluarga (KK)', note: 'Scan KK terbaru yang memuat nama pendaftar.' },
  { name: 'Pas Foto 4x6', note: 'Foto formal latar belakang polos.' },
  { name: 'Surat Keterangan Sehat', note: 'Surat keterangan sehat dari fasilitas kesehatan resmi.' },
];

const trackList = computed(() => (Array.isArray(cmsStore.tracks) ? cmsStore.tracks : []));
const studyProgramList = computed(() => (Array.isArray(cmsStore.studyPrograms) ? cmsStore.studyPrograms : []));
const faqList = computed(() => (Array.isArray(cmsStore.faqs) ? cmsStore.faqs : []));

const formatRupiah = (amount) => {
  return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
};
</script>
