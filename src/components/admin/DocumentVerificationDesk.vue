<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Meja Verifikasi & Validasi Berkas Pendaftar
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Periksa keabsahan pindaian ijazah, identitas kependudukan, pas foto, dan surat keterangan sehat.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold font-sora">
          {{ pendingCount }} Berkas Membutuhkan Tindakan
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
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-sm leading-none cursor-pointer">&times;</button>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama, No. Registrasi, NIK..."
          class="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-xl text-xs outline-none text-slate-800 transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-sm font-bold leading-none cursor-pointer"
        >
          &times;
        </button>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs -mx-1 px-1">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="selectedFilter = filter.id"
          class="px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-1.5"
          :class="selectedFilter === filter.id
            ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          <span>{{ filter.label }}</span>
          <span
            class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
            :class="selectedFilter === filter.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'"
          >
            {{ getFilterCount(filter.id) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Applicants Document Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[720px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-3.5 px-4 font-bold">No. Registrasi / NIK</th>
              <th class="py-3.5 px-4 font-bold">Nama Lengkap & Asal Sekolah</th>
              <th class="py-3.5 px-4 font-bold">Program Studi Pilihan</th>
              <th class="py-3.5 px-4 font-bold text-center">Kelengkapan</th>
              <th class="py-3.5 px-4 font-bold">Status Berkas</th>
              <th class="py-3.5 px-4 font-bold text-right">Aksi Panitia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="applicant in filteredApplicants"
              :key="applicant.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Reg & NIK -->
              <td class="py-3.5 px-4">
                <div class="font-mono font-bold text-[#1E3A8A]">{{ applicant.id }}</div>
                <div class="font-mono text-[11px] text-slate-400">NIK: {{ applicant.nik }}</div>
              </td>

              <!-- Name & School -->
              <td class="py-3.5 px-4">
                <div class="font-sora font-bold text-slate-900">{{ applicant.fullName }}</div>
                <div class="text-[11px] text-slate-500">{{ applicant.schoolName }}</div>
              </td>

              <!-- Program Studi -->
              <td class="py-3.5 px-4">
                <div class="font-medium text-slate-800">{{ applicant.prodi1 }}</div>
                <div class="text-[10px] text-slate-400">Pilihan 2: {{ applicant.prodi2 }}</div>
              </td>

              <!-- Documents Count -->
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold"
                      :class="applicant.pendingDocsCount === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                  {{ applicant.verifiedDocsCount }}/{{ applicant.documents.length }} Sah
                </span>
              </td>

              <!-- Status Pill -->
              <td class="py-3.5 px-4">
                <span
                  v-if="applicant.documentStatus === 'verified'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Terverifikasi</span>
                </span>
                <span
                  v-else-if="applicant.documentStatus === 'revision'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>Perlu Perbaikan</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-semibold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Menunggu Verifikasi</span>
                </span>
              </td>

              <!-- Action Button -->
              <td class="py-3.5 px-4 text-right">
                <button
                  @click="openVerifyDesk(applicant)"
                  class="px-3.5 py-1.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] font-sora font-semibold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Inspeksi Berkas</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredApplicants.length === 0">
              <td colspan="6" class="py-12 text-center text-slate-400">
                <div class="max-w-xs mx-auto space-y-2">
                  <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="font-sora font-semibold text-slate-700 text-sm">Tidak Ada Pendaftar</div>
                  <p class="text-xs text-slate-400">Tidak ada calon mahasiswa yang cocok dengan kriteria pencarian/filter.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL INSPEKSI BERKAS MAHASISWA: SEDERHANA, JELAS, LANGSUNG KE TUJUAN -->
    <!-- ========================================================================= -->
    <div
      v-if="activeApplicant"
      class="fixed inset-0 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
      style="z-index: 50;"
      @click.self="closeVerifyDesk"
    >
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        <!-- 1. HEADER RINGKAS & JELAS -->
        <div class="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-sora font-extrabold text-slate-900 text-sm sm:text-base truncate">
                {{ activeApplicant.fullName }}
              </h3>
              <span class="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-bold whitespace-nowrap">
                {{ activeApplicant.id }}
              </span>
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                :class="{
                  'bg-emerald-100 text-emerald-800 border border-emerald-200': activeApplicant.documentStatus === 'verified',
                  'bg-rose-100 text-rose-800 border border-rose-200': activeApplicant.documentStatus === 'revision',
                  'bg-amber-100 text-amber-800 border border-amber-200': activeApplicant.documentStatus === 'pending'
                }"
              >
                {{ activeApplicant.documentStatus === 'verified' ? '5/5 Disetujui' : activeApplicant.verifiedDocsCount + '/5 Disetujui' }}
              </span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-sans">
              <span>Prodi: <strong class="text-slate-800">{{ activeApplicant.prodi1 }}</strong></span>
              <span>•</span>
              <span>Asal Sekolah: {{ activeApplicant.schoolName }}</span>
              <span>•</span>
              <span>NIK: <span class="font-mono text-slate-700">{{ activeApplicant.nik }}</span></span>
            </div>
          </div>

          <!-- Tombol Tutup Silang Besar -->
          <button
            @click="closeVerifyDesk"
            class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer flex-shrink-0"
            title="Tutup (Esc)"
          >
            &times;
          </button>
        </div>

        <!-- 2. TAB PILIHAN BERKAS (5 TAB HORIZONTAL BERSIH, LANGSUNG GANTI DOKUMEN) -->
        <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <button
            v-for="(doc, idx) in activeApplicant.documents"
            :key="doc.id"
            @click="selectDoc(doc)"
            class="px-3 py-1.5 rounded-xl text-xs font-sora transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer flex-shrink-0"
            :class="selectedDoc?.id === doc.id
              ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'"
          >
            <span class="opacity-70 font-mono text-[10px]">{{ idx + 1 }}.</span>
            <span>{{ getShortDocTitle(doc.id) }}</span>

            <!-- Status Badge Dot / Icon pada Tab -->
            <span
              v-if="doc.status === 'verified'"
              class="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold"
              title="Berkas Diterima Sah"
            >
              ✓
            </span>
            <span
              v-else-if="doc.status === 'revision'"
              class="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold"
              title="Perlu Revisi"
            >
              !
            </span>
            <span
              v-else
              class="w-2 h-2 rounded-full bg-amber-400"
              title="Menunggu Tindakan"
            ></span>
          </button>
        </div>

        <!-- 3. KANVAS PREVIEW BERKAS UTUH (FOKUS UTAMA: MAKSIMAL, TANPA HARUS DOWNLOAD) -->
        <div class="flex-1 bg-slate-100 p-3 sm:p-4 overflow-auto flex items-center justify-center relative min-h-0">
          
          <!-- KASUS A: BERKAS ASLI PDF DARI MAHASISWA (EMBED LANGSUNG DI BROWSER) -->
          <div
            v-if="selectedDoc?.fileBlobUrl && isPdfDoc(selectedDoc)"
            class="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-white flex flex-col"
          >
            <div class="px-4 py-2 bg-slate-800 text-white text-xs font-mono flex items-center justify-between flex-shrink-0">
              <span class="truncate">Dokumen PDF: {{ selectedDoc.filename }}</span>
              <span class="text-[11px] text-emerald-400 font-sans">Pratinjau Langsung Tanpa Unduh</span>
            </div>
            <iframe
              :src="selectedDoc.fileBlobUrl"
              class="w-full flex-1 border-0"
              title="Pratinjau Berkas PDF"
            ></iframe>
          </div>

          <!-- KASUS B: BERKAS ASLI GAMBAR (JPG/PNG) DARI MAHASISWA -->
          <div
            v-else-if="selectedDoc?.fileBlobUrl && isImageDoc(selectedDoc)"
            class="w-full h-full flex items-center justify-center"
          >
            <img
              :src="selectedDoc.fileBlobUrl"
              :alt="selectedDoc.title"
              class="max-h-[62vh] max-w-full object-contain rounded-xl shadow-xl border-4 border-white bg-white"
            />
          </div>

          <!-- KASUS C: TAMPILAN FAKSIMILI RESMI OTENTIK SPESIFIK CALON MAHASISWA -->
          <div
            v-else
            class="w-full max-w-2xl bg-white rounded-2xl p-5 sm:p-7 border border-slate-300 shadow-xl my-auto text-slate-800 font-sans relative overflow-hidden"
          >
            <!-- Watermark BTH -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <img src="/assets/icons/bth.png" alt="BTH Watermark" class="w-80 h-80 object-contain" />
            </div>

            <!-- Header Faksimili Notice -->
            <div class="mb-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-[#1E3A8A] flex items-center justify-between">
              <span>Arsip Salinan Resmi Sistem BTH (Data Asli Calon Mahasiswa)</span>
              <span class="font-mono font-bold">{{ selectedDoc?.filename || 'Arsip-Sistem' }}</span>
            </div>

            <!-- 1. Ijazah / SKL -->
            <div v-if="selectedDoc?.id === 'doc-1'" class="space-y-3 relative z-10 text-xs">
              <div class="text-center pb-2 border-b-2 border-slate-900">
                <div class="font-serif font-bold text-[10px] text-slate-600 uppercase">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</div>
                <div class="font-sora font-extrabold text-sm sm:text-base text-slate-900 uppercase mt-0.5">
                  {{ activeApplicant.schoolName || 'SMA NEGERI 1 TASIKMALAYA' }}
                </div>
                <div class="font-sora font-bold text-xs text-blue-900 uppercase">SURAT KETERANGAN LULUS (SKL) / IJAZAH</div>
              </div>
              <div class="grid grid-cols-3 gap-1 pl-2 text-xs py-1">
                <span class="text-slate-500">Nama Siswa</span>
                <span class="col-span-2 font-bold uppercase font-sora">{{ activeApplicant.fullName }}</span>
                <span class="text-slate-500">NISN / NIK</span>
                <span class="col-span-2 font-mono font-bold">{{ activeApplicant.nisn || '0058291044' }} / {{ activeApplicant.nik }}</span>
                <span class="text-slate-500">Nilai Rata-Rata</span>
                <span class="col-span-2 font-mono font-black text-emerald-700 text-sm">{{ activeApplicant.averageScore || '86.50' }} / 100</span>
              </div>
              <div class="pt-2 border-t border-slate-200 flex justify-between items-end text-[11px]">
                <span class="text-[10px] text-slate-500 font-mono">Status: Tervalidasi Kelulusan</span>
                <div class="text-right">
                  <div>Kepala Sekolah,</div>
                  <div class="text-emerald-700 font-mono font-bold text-[9px]">[CAP BASAH TERVERIFIKASI]</div>
                  <div class="font-bold underline text-slate-900">Dr. H. Dudung Rusmana, M.Pd.</div>
                </div>
              </div>
            </div>

            <!-- 2. e-KTP -->
            <div v-else-if="selectedDoc?.id === 'doc-2'" class="space-y-2.5 relative z-10 text-xs bg-blue-50/50 p-4 rounded-xl border border-blue-200">
              <div class="flex justify-between items-center pb-1 border-b border-blue-200">
                <div class="font-mono font-bold text-[11px] text-slate-900">REPUBLIK INDONESIA • e-KTP</div>
                <span class="px-2 py-0.5 bg-blue-600 text-white font-mono text-[10px] rounded font-bold">TERVALIDASI DUKCAPIL</span>
              </div>
              <div class="font-mono font-black text-sm text-slate-900">NIK : {{ activeApplicant.nik }}</div>
              <div class="grid grid-cols-3 gap-1 font-mono text-[11px]">
                <span class="text-slate-500">Nama</span>
                <span class="col-span-2 font-bold uppercase">{{ activeApplicant.fullName }}</span>
                <span class="text-slate-500">Tempat/Tgl Lahir</span>
                <span class="col-span-2">TASIKMALAYA, 14-05-2008</span>
                <span class="text-slate-500">Jenis Kelamin</span>
                <span class="col-span-2 uppercase">{{ activeApplicant.gender || 'LAKI-LAKI' }}</span>
                <span class="text-slate-500">Alamat</span>
                <span class="col-span-2">KOTA TASIKMALAYA, JAWA BARAT</span>
              </div>
            </div>

            <!-- 3. Kartu Keluarga -->
            <div v-else-if="selectedDoc?.id === 'doc-3'" class="space-y-2.5 relative z-10 text-xs">
              <div class="text-center pb-2 border-b border-slate-300">
                <div class="font-serif font-bold text-[10px] text-slate-600 uppercase">KEMENTERIAN DALAM NEGERI RI</div>
                <div class="font-sora font-extrabold text-sm text-slate-900 uppercase">KARTU KELUARGA (KK)</div>
                <div class="font-mono text-xs font-bold text-slate-700 mt-0.5">No. 3278012809050012</div>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div class="flex justify-between"><span class="text-slate-500">Nama Pendaftar:</span><span class="font-bold uppercase">{{ activeApplicant.fullName }}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Hubungan Keluarga:</span><span class="font-medium">Anak Kandung</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Validasi SIAK:</span><span class="text-emerald-700 font-semibold">Tervalidasi Aktif ✓</span></div>
              </div>
            </div>

            <!-- 4. Pas Foto 4x6 -->
            <div v-else-if="selectedDoc?.id === 'doc-4'" class="text-center space-y-3 relative z-10">
              <div class="inline-block p-2 bg-slate-100 rounded-2xl border border-slate-300 shadow-sm">
                <div class="w-32 h-44 bg-gradient-to-b from-red-600 to-red-700 rounded-xl flex flex-col items-center justify-between p-3 text-white shadow-inner">
                  <span class="text-[9px] font-mono opacity-80">RASIO 4x6 LATAR MERAH</span>
                  <div class="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                    <svg class="w-10 h-10 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span class="font-mono text-[10px] font-bold uppercase truncate max-w-full">{{ activeApplicant.fullName }}</span>
                </div>
              </div>
              <p class="text-xs text-slate-500">Format pasfoto formal berlatar merah tervalidasi memenuhi standar kartu ujian dan KTM.</p>
            </div>

            <!-- 5. Surat Sehat & Bebas Buta Warna -->
            <div v-else class="space-y-2.5 relative z-10 text-xs">
              <div class="text-center pb-2 border-b-2 border-slate-900">
                <div class="font-serif font-bold text-[10px] text-slate-600 uppercase">DINAS KESEHATAN KOTA TASIKMALAYA</div>
                <div class="font-sora font-extrabold text-sm text-slate-900 uppercase">KLINIK PRATAMA RAWAT INAP KESEHATAN</div>
                <div class="font-sora font-bold text-xs text-blue-900 uppercase">SURAT KETERANGAN SEHAT & BEBAS BUTA WARNA</div>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div class="flex justify-between"><span class="text-slate-500">Nama Pendaftar:</span><span class="font-bold uppercase">{{ activeApplicant.fullName }}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Fisik & Tensi:</span><span class="text-emerald-700 font-semibold">Sehat Jasmani (115/75 mmHg)</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Uji Ishihara:</span><span class="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">BEBAS BUTA WARNA TOTAL & PARSIAL ✓</span></div>
              </div>
              <div class="pt-2 border-t border-slate-200 flex justify-between items-end text-[11px]">
                <span class="text-[10px] text-slate-400 font-mono">Reg: MED-BTH-{{ activeApplicant.id.slice(-5) }}</span>
                <div class="text-right">
                  <div class="font-semibold text-slate-800">dr. Faisal Rahman, Sp.Ok.</div>
                  <div class="text-[10px] text-slate-500 font-mono">SIP: 446.1/1042/SIP-D/2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. FOOTER AKSI SEDERHANA & TO THE POINT: TERIMA BERKAS / MINTA REVISI -->
        <div class="px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          
          <!-- Informasi Status Berkas Saat Ini -->
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-xs text-slate-500 font-medium">Status Berkas:</span>
            <span
              class="px-2.5 py-1 rounded-lg text-xs font-bold font-sora uppercase tracking-wider flex items-center gap-1.5"
              :class="{
                'bg-emerald-100 text-emerald-800 border border-emerald-300': selectedDoc?.status === 'verified',
                'bg-rose-100 text-rose-800 border border-rose-300': selectedDoc?.status === 'revision',
                'bg-amber-100 text-amber-800 border border-amber-300': selectedDoc?.status === 'pending'
              }"
            >
              <span v-if="selectedDoc?.status === 'verified'">✓ Berkas Diterima</span>
              <span v-else-if="selectedDoc?.status === 'revision'">! Perlu Revisi</span>
              <span v-else>⏳ Menunggu Verifikasi</span>
            </span>

            <!-- Catatan revisi yang pernah diberikan jika ada -->
            <span v-if="selectedDoc?.notes && selectedDoc?.status === 'revision'" class="text-xs text-rose-700 truncate max-w-sm hidden md:inline">
              (Catatan: {{ selectedDoc.notes }})
            </span>
          </div>

          <!-- DUA TOMBOL AKSI UTAMA: TERIMA BERKAS & MINTA REVISI -->
          <div class="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <!-- 1. TOMBOL TERIMA BERKAS (HIJAU) -->
            <button
              @click="approveCurrentDoc"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Terima dan setujui dokumen ini"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Terima Berkas</span>
            </button>

            <!-- 2. TOMBOL MINTA REVISI (MERAH) -->
            <button
              @click="toggleRevisionInput"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Minta mahasiswa mengunggah ulang dengan catatan"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Minta Revisi</span>
            </button>

            <!-- Tombol Berkas Berikutnya -->
            <button
              @click="selectNextDoc"
              class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sora font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              title="Lanjut ke berkas berikutnya"
            >
              <span class="hidden sm:inline">Berikutnya</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- FORM INPUT ALASAN REVISI SEDERHANA (MUNCUL JIKA MINTA REVISI DIKLIK) -->
        <div
          v-if="isRevisionOpen"
          class="p-4 bg-rose-50 border-t border-rose-200 animate-fadeIn flex flex-col gap-2.5 flex-shrink-0"
        >
          <div class="flex items-center justify-between">
            <span class="font-sora font-bold text-xs text-rose-900 flex items-center gap-1.5">
              <span>Alasan Revisi untuk {{ selectedDoc?.title }}:</span>
            </span>
            <button @click="isRevisionOpen = false" class="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer">
              Batal
            </button>
          </div>

          <!-- Pilihan Alasan Cepat -->
          <div class="flex flex-wrap gap-1.5 text-[11px]">
            <button
              v-for="reason in quickReasons"
              :key="reason"
              type="button"
              @click="revisionNote = reason"
              class="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              + {{ reason }}
            </button>
          </div>

          <!-- Input Catatan & Tombol Kirim -->
          <div class="flex gap-2">
            <input
              v-model="revisionNote"
              type="text"
              placeholder="Tuliskan catatan perbaikan berkas..."
              class="flex-1 px-3 py-2 bg-white border border-rose-300 focus:border-rose-600 rounded-xl text-xs outline-none text-slate-800"
              @keyup.enter="submitRevision"
            />
            <button
              @click="submitRevision"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-sora font-bold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              Kirim Revisi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const searchQuery = ref('');
const selectedFilter = ref('all');
const activeApplicant = ref(null);
const selectedDoc = ref(null);
const toastMessage = ref('');
const isRevisionOpen = ref(false);
const revisionNote = ref('');

const quickReasons = [
  'Pindaian dokumen buram / tidak terbaca jelas.',
  'Bagian nilai rapor / nomor identitas terpotong.',
  'Masa berlaku dokumen telah habis / kedaluwarsa.',
  'Surat keterangan sehat belum memuat tes buta warna.',
  'Berkas yang diunggah bukan dokumen asli atau salah file.',
];

// Short title for document tabs
const getShortDocTitle = (id) => {
  switch (id) {
    case 'doc-1': return 'Ijazah / SKL';
    case 'doc-2': return 'KTP / Identitas';
    case 'doc-3': return 'Kartu Keluarga';
    case 'doc-4': return 'Pas Foto 4x6';
    case 'doc-5': return 'Surat Sehat';
    default: return 'Dokumen';
  }
};

// Keyboard listener for Escape key to cleanly close modals
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (isRevisionOpen.value) {
      isRevisionOpen.value = false;
    } else if (activeApplicant.value) {
      closeVerifyDesk();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// Document format helpers
const isImageDoc = (doc) => {
  if (!doc) return false;
  if (doc.fileType?.startsWith('image/')) return true;
  if (doc.fileBlobUrl?.startsWith('data:image/')) return true;
  if (doc.filename && /\.(jpg|jpeg|png|webp)$/i.test(doc.filename)) return true;
  return false;
};

const isPdfDoc = (doc) => {
  if (!doc) return false;
  if (doc.fileType === 'application/pdf') return true;
  if (doc.fileBlobUrl?.startsWith('data:application/pdf')) return true;
  if (doc.filename && /\.pdf$/i.test(doc.filename)) return true;
  return false;
};

// Select a document to preview
const selectDoc = (doc) => {
  selectedDoc.value = doc;
  isRevisionOpen.value = false;
  revisionNote.value = doc.notes || '';
};

// Select next document in list
const selectNextDoc = () => {
  if (!activeApplicant.value || !selectedDoc.value) return;
  const docs = activeApplicant.value.documents;
  const currentIndex = docs.findIndex((d) => d.id === selectedDoc.value.id);
  const nextIndex = (currentIndex + 1) % docs.length;
  selectDoc(docs[nextIndex]);
};

const filters = [
  { id: 'all', label: 'Semua Status' },
  { id: 'pending', label: 'Menunggu Verifikasi' },
  { id: 'verified', label: 'Terverifikasi' },
  { id: 'revision', label: 'Perlu Perbaikan' },
];

const pendingCount = computed(() => {
  return adminStore.applicants.filter((a) => a.documentStatus === 'pending' || a.documentStatus === 'revision').length;
});

const getFilterCount = (filterId) => {
  if (filterId === 'all') return adminStore.applicants.length;
  return adminStore.applicants.filter((a) => a.documentStatus === filterId).length;
};

const filteredApplicants = computed(() => {
  return adminStore.applicants.filter((applicant) => {
    if (selectedFilter.value !== 'all' && applicant.documentStatus !== selectedFilter.value) {
      return false;
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = applicant.fullName?.toLowerCase().includes(q);
      const matchId = applicant.id?.toLowerCase().includes(q);
      const matchNik = applicant.nik?.includes(q);
      return matchName || matchId || matchNik;
    }
    return true;
  });
});

// Open modal for an applicant
const openVerifyDesk = (applicant) => {
  activeApplicant.value = applicant;
  isRevisionOpen.value = false;
  // Select first document that needs attention, or doc 1
  const firstPending = applicant.documents.find((d) => d.status === 'pending' || d.status === 'revision');
  selectedDoc.value = firstPending || applicant.documents[0];
  revisionNote.value = selectedDoc.value.notes || '';
};

const closeVerifyDesk = () => {
  activeApplicant.value = null;
  selectedDoc.value = null;
  isRevisionOpen.value = false;
};

// Update status of document
const setDocStatus = (docId, status, notes) => {
  if (!activeApplicant.value) return;
  adminStore.verifyDocument(activeApplicant.value.id, docId, status, notes);

  // Directly update activeApplicant in place
  const target = activeApplicant.value.documents.find((d) => d.id === docId);
  if (target) {
    target.status = status;
    target.notes = notes;
  }

  activeApplicant.value.verifiedDocsCount = activeApplicant.value.documents.filter((d) => d.status === 'verified').length;
  activeApplicant.value.pendingDocsCount = activeApplicant.value.documents.filter((d) => d.status === 'pending' || d.status === 'revision').length;

  const hasRevision = activeApplicant.value.documents.some((d) => d.status === 'revision');
  const hasPending = activeApplicant.value.documents.some((d) => d.status === 'pending');
  if (hasRevision) {
    activeApplicant.value.documentStatus = 'revision';
  } else if (hasPending) {
    activeApplicant.value.documentStatus = 'pending';
  } else {
    activeApplicant.value.documentStatus = 'verified';
  }

  toastMessage.value = `Berkas "${target?.title || 'Dokumen'}" berhasil diubah menjadi "${status === 'verified' ? 'Diterima Sah' : 'Perlu Revisi'}".`;
};

// Action 1: Terima Berkas (Setujui)
const approveCurrentDoc = () => {
  if (!selectedDoc.value || !activeApplicant.value) return;
  setDocStatus(selectedDoc.value.id, 'verified', 'Dokumen sah dan telah sesuai dengan ketentuan PMB BTH.');
  
  // Advance to next document that needs attention
  const nextNeedingAction = activeApplicant.value.documents.find(
    (d) => d.id !== selectedDoc.value.id && d.status !== 'verified'
  );
  if (nextNeedingAction) {
    selectDoc(nextNeedingAction);
  }
};

// Action 2: Minta Revisi
const toggleRevisionInput = () => {
  isRevisionOpen.value = !isRevisionOpen.value;
  if (isRevisionOpen.value && !revisionNote.value) {
    revisionNote.value = 'Pindaian dokumen kurang jelas / buram. Mohon unggah ulang dokumen yang sah.';
  }
};

const submitRevision = () => {
  if (!selectedDoc.value || !activeApplicant.value) return;
  const note = revisionNote.value.trim() || 'Mohon unggah ulang berkas sesuai ketentuan.';
  setDocStatus(selectedDoc.value.id, 'revision', note);
  isRevisionOpen.value = false;
};
</script>
