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
                  <span>Periksa & Inspeksi Berkas</span>
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
    <!-- MODAL TERPADU: MEJA KERJA VERIFIKASI & INSPEKSI DOKUMEN SPLIT-VIEW (1 WINDOW) -->
    <!-- ========================================================================= -->
    <div
      v-if="activeApplicant"
      class="fixed inset-0 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
      style="z-index: 50;"
      @click.self="closeVerifyDesk"
    >
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-7xl w-full h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        <!-- HEADER MODAL TERPADU (Tetap di atas, tidak tertutup/tergeser) -->
        <div class="flex-shrink-0 bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 bg-blue-100 text-[#1E3A8A] font-sora font-bold text-[10px] rounded uppercase tracking-wider">
                Meja Verifikasi & Inspeksi Dokumen
              </span>
              <span class="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-bold">
                {{ activeApplicant.id }}
              </span>
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                :class="{
                  'bg-emerald-100 text-emerald-800 border border-emerald-300': activeApplicant.documentStatus === 'verified',
                  'bg-rose-100 text-rose-800 border border-rose-300': activeApplicant.documentStatus === 'revision',
                  'bg-amber-100 text-amber-800 border border-amber-300': activeApplicant.documentStatus === 'pending'
                }"
              >
                {{ activeApplicant.documentStatus === 'verified' ? 'Semua Berkas Terverifikasi' : activeApplicant.documentStatus === 'revision' ? 'Ada Berkas Perlu Perbaikan' : 'Menunggu Verifikasi' }}
              </span>
            </div>

            <!-- Nama & Identitas Utama -->
            <div class="flex items-center gap-3 mt-1">
              <h3 class="font-sora font-extrabold text-base sm:text-xl text-slate-900 truncate">
                {{ activeApplicant.fullName }}
              </h3>
            </div>

            <!-- Meta Detail Calon Mahasiswa -->
            <div class="text-[11px] sm:text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-sans">
              <span>Prodi: <strong class="text-slate-800">{{ activeApplicant.prodi1 }}</strong></span>
              <span>•</span>
              <span>Asal Sekolah: <strong class="text-slate-800">{{ activeApplicant.schoolName }}</strong></span>
              <span>•</span>
              <span>NIK: <span class="font-mono text-slate-700 font-bold">{{ activeApplicant.nik }}</span></span>
              <span>•</span>
              <span>NISN: <span class="font-mono text-slate-700">{{ activeApplicant.nisn || '0058291044' }}</span></span>
            </div>
          </div>

          <!-- Master Actions & Close Button -->
          <div class="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <button
              @click="approveAllDocs"
              class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Setujui seluruh berkas persyaratan mahasiswa ini sekaligus"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="hidden sm:inline">Setujui Semua (5) Berkas</span>
              <span class="sm:hidden">Setujui Semua</span>
            </button>

            <!-- Tombol Tutup Silang Besar & Responsif -->
            <button
              @click="closeVerifyDesk"
              class="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl font-bold transition-colors cursor-pointer"
              title="Tutup Lembar Kerja (Esc)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- MOBILE TAB SWITCHER (Hanya tampil di layar kecil / smartphone) -->
        <div class="lg:hidden flex border-b border-slate-200 bg-slate-100 px-3 py-1.5 gap-2 flex-shrink-0">
          <button
            @click="activeMobileTab = 'list'"
            class="flex-1 py-1.5 px-3 rounded-lg text-xs font-sora font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="activeMobileTab === 'list' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Daftar Berkas ({{ activeApplicant.documents.length }})</span>
          </button>
          <button
            @click="activeMobileTab = 'viewer'"
            class="flex-1 py-1.5 px-3 rounded-lg text-xs font-sora font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="activeMobileTab === 'viewer' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span class="truncate">Inspeksi: {{ selectedDoc?.title.split('/')[0].trim() || 'Dokumen' }}</span>
          </button>
        </div>

        <!-- WORKBENCH BODY: 2-COLUMN MASTER-DETAIL SPLIT SCREEN -->
        <div class="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          <!-- =================================================================== -->
          <!-- PANEL KIRI: DAFTAR BERKAS DENGAN STATUS & QUICK ACTIONS (380px) -->
          <!-- =================================================================== -->
          <div
            v-show="activeMobileTab === 'list' || isDesktop"
            class="w-full lg:w-[380px] xl:w-[410px] flex-shrink-0 bg-slate-50/70 border-r border-slate-200 flex flex-col overflow-hidden"
          >
            <!-- Subheader Panel Kiri -->
            <div class="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
              <span class="font-sora font-bold text-slate-700">Pilih Berkas untuk Diinspeksi</span>
              <span class="font-mono text-[11px] font-semibold text-slate-500">
                {{ activeApplicant.verifiedDocsCount }}/{{ activeApplicant.documents.length }} Disetujui
              </span>
            </div>

            <!-- Scrollable Document List -->
            <div class="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
              <div
                v-for="(doc, idx) in activeApplicant.documents"
                :key="doc.id"
                @click="selectDoc(doc)"
                class="p-3.5 rounded-2xl border transition-all cursor-pointer relative group"
                :class="[
                  selectedDoc?.id === doc.id
                    ? 'border-[#1E3A8A] bg-blue-50/50 shadow-xs ring-2 ring-[#1E3A8A]/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60',
                ]"
              >
                <!-- Indikator Seleksi Aktif -->
                <div
                  v-if="selectedDoc?.id === doc.id"
                  class="absolute left-0 top-3 bottom-3 w-1 bg-[#1E3A8A] rounded-r-full"
                ></div>

                <!-- Judul & Badge Status -->
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-start gap-2 min-w-0">
                    <span class="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {{ idx + 1 }}
                    </span>
                    <div class="min-w-0">
                      <div class="font-sora font-bold text-xs text-slate-900 leading-snug truncate">
                        {{ doc.title }}
                      </div>
                      <div class="text-[11px] font-mono mt-0.5 truncate" :class="doc.filename && doc.filename !== 'Belum diunggah' ? 'text-slate-500' : 'text-amber-600 font-medium'">
                        {{ doc.filename || 'Belum diunggah' }}
                      </div>
                    </div>
                  </div>

                  <!-- Status Tag -->
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md whitespace-nowrap flex-shrink-0"
                    :class="{
                      'bg-emerald-100 text-emerald-800 border border-emerald-200': doc.status === 'verified',
                      'bg-rose-100 text-rose-800 border border-rose-200': doc.status === 'revision',
                      'bg-amber-100 text-amber-800 border border-amber-200': doc.status === 'pending'
                    }"
                  >
                    {{ doc.status === 'verified' ? 'Disetujui' : doc.status === 'revision' ? 'Revisi' : 'Menunggu' }}
                  </span>
                </div>

                <!-- Cuplikan Catatan Panitia (jika ada) -->
                <div
                  v-if="doc.notes"
                  class="mt-2 text-[11px] p-2 rounded-lg border text-slate-600 font-sans"
                  :class="doc.status === 'revision' ? 'bg-rose-50/70 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200/60'"
                >
                  <span class="font-semibold">Catatan:</span> {{ doc.notes }}
                </div>

                <!-- Tombol Aksi Cepat per Item -->
                <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100" @click.stop>
                  <button
                    @click="selectDoc(doc); activeMobileTab = 'viewer'"
                    class="flex-1 py-1 px-2 rounded-lg font-sora font-semibold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    :class="selectedDoc?.id === doc.id ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A]'"
                    title="Periksa tampilan fisik dokumen ini di penampil"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Inspeksi</span>
                  </button>

                  <button
                    @click="setDocStatus(doc.id, 'verified', 'Dokumen terverifikasi sah dan sesuai standar BTH.')"
                    class="py-1 px-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-lg font-sora font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                    title="Setujui dokumen ini"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Setujui</span>
                  </button>

                  <button
                    @click="openRevisionModal(doc)"
                    class="py-1 px-2.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200 rounded-lg font-sora font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                    title="Minta mahasiswa memperbaiki berkas ini"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Revisi</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer Panel Kiri -->
            <div class="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2 flex-shrink-0">
              <span class="text-[11px] text-slate-500 font-mono">
                Total: <strong>5 Dokumen Wajib</strong>
              </span>
              <button
                @click="closeVerifyDesk"
                class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup Meja Kerja
              </button>
            </div>
          </div>

          <!-- =================================================================== -->
          <!-- PANEL KANAN: PENAMPIL DOKUMEN & TOOLBAR INSPEKSI (FLEX-1) -->
          <!-- =================================================================== -->
          <div
            v-show="activeMobileTab === 'viewer' || isDesktop"
            class="flex-1 flex flex-col bg-slate-100/90 overflow-hidden min-h-0"
          >
            <!-- TOOLBAR INSPEKSI DOKUMEN (Zoom, Rotate, Reset, Format Info) -->
            <div class="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
              <!-- Info Dokumen Sedang Diinspeksi -->
              <div class="flex items-center gap-2 min-w-0">
                <span class="w-6 h-6 rounded-lg bg-blue-50 text-[#1E3A8A] font-bold text-xs flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <div class="min-w-0">
                  <div class="font-sora font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {{ selectedDoc?.title }}
                  </div>
                  <div class="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 truncate">
                    <span v-if="selectedDoc?.fileBlobUrl" class="text-emerald-700 font-semibold">● Berkas Asli Pendaftar</span>
                    <span v-else class="text-blue-700 font-semibold">● Arsip Faksimili Resmi BTH</span>
                    <span>•</span>
                    <span class="truncate">{{ selectedDoc?.filename }}</span>
                  </div>
                </div>
              </div>

              <!-- Kontrol Zoom, Rotasi, & Reset -->
              <div class="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                <!-- Zoom Out -->
                <button
                  @click="zoomOut"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  title="Perkecil Tampilan (Zoom Out)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>

                <!-- Zoom Level Indicator -->
                <span class="text-xs font-mono text-slate-700 px-1 font-bold min-w-[42px] text-center">
                  {{ Math.round(zoomScale * 100) }}%
                </span>

                <!-- Zoom In -->
                <button
                  @click="zoomIn"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  title="Perbesar Tampilan (Zoom In)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                <!-- Rotate 90 deg -->
                <button
                  @click="rotateDoc"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Putar Dokumen 90° Searah Jarum Jam"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span class="hidden md:inline text-[11px]">90°</span>
                </button>

                <!-- Reset View -->
                <button
                  @click="resetView"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  title="Kembalikan ke Tampilan Semula (100%, 0°)"
                >
                  Reset
                </button>

                <!-- Open / Print Document -->
                <button
                  @click="openInNewWindow"
                  class="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Buka Berkas / Cetak Dokumen"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span class="hidden sm:inline text-[11px] font-semibold">Buka Tab</span>
                </button>
              </div>
            </div>

            <!-- CANVAS PENAMPIL DOKUMEN REAL & DINAMIS -->
            <div class="flex-1 overflow-auto p-4 flex items-center justify-center relative min-h-0 bg-slate-200/40">
              
              <!-- KASUS A1: BERKAS ASLI GAMBAR (JPG, PNG, WEBP, BASE64) -->
              <div
                v-if="selectedDoc?.fileBlobUrl && isImageDoc(selectedDoc)"
                class="transition-transform duration-200 ease-out origin-center flex items-center justify-center max-w-full"
                :style="{ transform: `scale(${zoomScale}) rotate(${rotationDeg}deg)` }"
              >
                <img
                  :src="selectedDoc.fileBlobUrl"
                  :alt="selectedDoc.title"
                  class="max-h-[60vh] max-w-full object-contain rounded-xl shadow-xl border-4 border-white bg-white"
                />
              </div>

              <!-- KASUS A2: BERKAS ASLI PDF (IFRAME EMBED) -->
              <div
                v-else-if="selectedDoc?.fileBlobUrl && isPdfDoc(selectedDoc)"
                class="w-full h-full max-w-4xl max-h-[64vh] flex flex-col rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-white"
              >
                <div class="px-3 py-1.5 bg-slate-800 text-white text-[11px] font-mono flex items-center justify-between">
                  <span>Pratinjau PDF: {{ selectedDoc.filename }}</span>
                  <a :href="selectedDoc.fileBlobUrl" target="_blank" class="text-blue-300 hover:underline">Unduh PDF Asli</a>
                </div>
                <iframe
                  :src="selectedDoc.fileBlobUrl"
                  class="w-full flex-1 border-0"
                  title="Penampil PDF Dokumen"
                ></iframe>
              </div>

              <!-- KASUS B: FAKSIMILI DOKUMEN RESMI OTENTIK SPESIFIK MAHASISWA -->
              <div
                v-else
                class="w-full max-w-2xl bg-white rounded-2xl p-5 sm:p-7 border border-slate-300 shadow-xl my-auto text-slate-800 font-sans relative overflow-hidden transition-transform duration-200 origin-center"
                :style="{ transform: `scale(${zoomScale}) rotate(${rotationDeg}deg)` }"
              >
                <!-- Watermark Lambang Kampus BTH -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                  <img src="/assets/icons/bth.png" alt="BTH Watermark" class="w-80 h-80 object-contain" />
                </div>

                <!-- 1. DOKUMEN IJAZAH / SKL (doc-1) -->
                <div v-if="selectedDoc?.id === 'doc-1'" class="space-y-3.5 relative z-10 text-xs">
                  <div class="text-center pb-2 border-b-2 border-slate-900">
                    <div class="font-serif font-bold text-[10px] text-slate-600 uppercase tracking-widest">
                      KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
                    </div>
                    <div class="font-sora font-extrabold text-sm sm:text-base text-slate-900 uppercase mt-0.5">
                      {{ activeApplicant.schoolName || 'SMA NEGERI 1 TASIKMALAYA' }}
                    </div>
                    <div class="font-sora font-bold text-xs text-blue-900 mt-1 uppercase tracking-wide">
                      SURAT KETERANGAN LULUS (SKL) / IJAZAH SEKOLAH MENENGAH
                    </div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">
                      Nomor: 421.3/{{ activeApplicant.id.slice(-4) }}/SMAN1/2026
                    </div>
                  </div>

                  <div class="space-y-1.5 py-1 text-xs">
                    <div class="text-slate-700">Kepala Sekolah menerangkan bahwa:</div>
                    <div class="grid grid-cols-3 gap-1 pl-3 font-sans">
                      <span class="text-slate-500 font-medium">Nama Siswa</span>
                      <span class="col-span-2 font-bold text-slate-900 uppercase font-sora">{{ activeApplicant.fullName }}</span>
                      <span class="text-slate-500 font-medium">Nomor Induk Siswa (NISN)</span>
                      <span class="col-span-2 font-mono font-bold text-slate-800">{{ activeApplicant.nisn || '0058291044' }}</span>
                      <span class="text-slate-500 font-medium">Nomor Induk Kependudukan (NIK)</span>
                      <span class="col-span-2 font-mono text-slate-800">{{ activeApplicant.nik }}</span>
                      <span class="text-slate-500 font-medium">Nilai Rata-Rata Ujian</span>
                      <span class="col-span-2 font-mono font-black text-emerald-700 text-sm">{{ activeApplicant.averageScore || '86.50' }} / 100</span>
                    </div>
                    <div class="text-slate-700 pt-1 leading-relaxed">
                      Dinyatakan <strong>LULUS</strong> dari satuan pendidikan dan memenuhi seluruh syarat kelulusan akademik.
                    </div>
                  </div>

                  <div class="flex justify-between items-end pt-3 border-t border-slate-200">
                    <div class="text-[10px] text-slate-500 font-mono">
                      ID Arsip: SKL-{{ activeApplicant.id }}<br />
                      Terdaftar Dapodik Kemendikbud
                    </div>
                    <div class="text-right text-[11px]">
                      <div>Tasikmalaya, 15 Mei 2026</div>
                      <div class="font-semibold text-slate-800">Kepala Sekolah,</div>
                      <div class="h-10 flex items-center justify-end">
                        <span class="px-2 py-0.5 border border-emerald-600 text-emerald-700 font-bold font-mono text-[9px] rounded uppercase">CAP BASAH SEKOLAH ✓</span>
                      </div>
                      <div class="font-bold underline text-slate-900">Dr. H. Dudung Rusmana, M.Pd.</div>
                      <div class="text-[10px] text-slate-500 font-mono">NIP. 19680312 199403 1 003</div>
                    </div>
                  </div>
                </div>

                <!-- 2. DOKUMEN KTP ELEKTRONIK (doc-2) -->
                <div v-else-if="selectedDoc?.id === 'doc-2'" class="space-y-3 relative z-10 text-xs bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                  <div class="text-center pb-2 border-b border-blue-300 flex items-center justify-between">
                    <div class="text-left">
                      <div class="font-bold font-mono text-[11px] text-slate-800 tracking-wider">PROVINSI JAWA BARAT</div>
                      <div class="font-bold font-mono text-xs text-slate-900 uppercase">KOTA TASIKMALAYA</div>
                    </div>
                    <span class="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold text-[10px] rounded">e-KTP</span>
                  </div>

                  <div class="font-mono font-black text-sm sm:text-base text-slate-900 tracking-wider py-1 border-b border-blue-200">
                    NIK : {{ activeApplicant.nik }}
                  </div>

                  <div class="grid grid-cols-3 gap-1.5 font-mono text-[11px] text-slate-800">
                    <span class="text-slate-500">Nama</span>
                    <span class="col-span-2 font-bold uppercase">{{ activeApplicant.fullName }}</span>
                    <span class="text-slate-500">Tempat/Tgl Lahir</span>
                    <span class="col-span-2">TASIKMALAYA, 14-05-2008</span>
                    <span class="text-slate-500">Jenis Kelamin</span>
                    <span class="col-span-2 uppercase">{{ activeApplicant.gender || 'LAKI-LAKI' }}</span>
                    <span class="text-slate-500">Alamat</span>
                    <span class="col-span-2">JL. KAHURIPAN NO. 42 RT 03 RW 08</span>
                    <span class="text-slate-500">Kel/Desa</span>
                    <span class="col-span-2">KAHURIPAN, KEC. TAWANG</span>
                    <span class="text-slate-500">Pekerjaan</span>
                    <span class="col-span-2">PELAJAR / MAHASISWA</span>
                    <span class="text-slate-500">Kewarganegaraan</span>
                    <span class="col-span-2">WNI (BERLAKU SEUMUR HIDUP)</span>
                  </div>
                </div>

                <!-- 3. DOKUMEN KARTU KELUARGA (doc-3) -->
                <div v-else-if="selectedDoc?.id === 'doc-3'" class="space-y-3 relative z-10 text-xs">
                  <div class="text-center pb-2 border-b border-slate-300">
                    <div class="font-serif font-bold text-[10px] text-slate-600 uppercase">
                      REPUBLIK INDONESIA • KEMENTERIAN DALAM NEGERI
                    </div>
                    <h4 class="font-sora font-extrabold text-sm text-slate-900 uppercase mt-0.5">
                      KARTU KELUARGA (KK)
                    </h4>
                    <div class="font-mono text-xs font-bold text-slate-800 mt-0.5">
                      No. 3278012809050012
                    </div>
                  </div>

                  <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-sans space-y-1">
                    <div class="flex justify-between">
                      <span class="text-slate-500">Nama Terdaftar:</span>
                      <span class="font-bold text-slate-900 uppercase">{{ activeApplicant.fullName }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-500">Status Hubungan:</span>
                      <span class="font-medium text-slate-800">Anak Kandung</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-500">Kependudukan:</span>
                      <span class="text-emerald-700 font-semibold">Tervalidasi SIAK Disdukcapil</span>
                    </div>
                  </div>
                </div>

                <!-- 4. PAS FOTO RESMI 4x6 (doc-4) -->
                <div v-else-if="selectedDoc?.id === 'doc-4'" class="text-center space-y-3 relative z-10">
                  <div class="inline-block p-2 bg-slate-100 rounded-2xl border border-slate-300 shadow-sm">
                    <div class="w-32 h-44 bg-gradient-to-b from-red-600 to-red-700 rounded-xl flex flex-col items-center justify-between p-3 text-white shadow-inner relative overflow-hidden">
                      <div class="text-[9px] font-mono tracking-wider opacity-80">RASIO RESMI 4x6</div>
                      <div class="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mt-2">
                        <svg class="w-10 h-10 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <div class="font-mono text-[10px] font-bold uppercase truncate max-w-full">
                        {{ activeApplicant.fullName }}
                      </div>
                    </div>
                  </div>
                  <div class="text-xs text-slate-500">
                    Format pasfoto formal berlatar merah tervalidasi memenuhi standar kartu ujian CBT dan KTM Mahasiswa BTH.
                  </div>
                </div>

                <!-- 5. SURAT KETERANGAN SEHAT & BEBAS BUTA WARNA (doc-5) -->
                <div v-else class="space-y-3 relative z-10 text-xs">
                  <div class="text-center pb-2 border-b-2 border-slate-900">
                    <div class="font-serif font-bold text-[10px] text-slate-600 uppercase">
                      PEMERINTAH KOTA TASIKMALAYA • DINAS KESEHATAN
                    </div>
                    <div class="font-sora font-extrabold text-sm text-slate-900 uppercase">
                      KLINIK PRATAMA RAWAT INAP KESEHATAN
                    </div>
                    <div class="font-sora font-bold text-xs text-blue-900 uppercase mt-0.5">
                      SURAT KETERANGAN DOKTER PEMERIKSAAN KESEHATAN PMB
                    </div>
                  </div>

                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-sans">
                    <div class="flex justify-between">
                      <span class="text-slate-500">Nama Calon Mahasiswa:</span>
                      <span class="font-bold text-slate-900 uppercase">{{ activeApplicant.fullName }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-500">Pemeriksaan Fisik & Tensi:</span>
                      <span class="font-semibold text-emerald-700">Sehat Jasmani (115/75 mmHg)</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-500">Uji Buta Warna (Ishihara Test):</span>
                      <span class="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                        BEBAS BUTA WARNA (TOTAL & PARSIAL) ✓
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500 pt-1 italic">
                      *Memenuhi kriteria kesehatan akademik program studi Fakultas Farmasi & Ilmu Kesehatan Universitas BTH.
                    </div>
                  </div>

                  <div class="flex justify-between items-end pt-2 border-t border-slate-200 text-[11px]">
                    <div class="font-mono text-[10px] text-slate-400">Reg: MED-BTH-{{ activeApplicant.id.slice(-5) }}</div>
                    <div class="text-right">
                      <div>Tasikmalaya, 18 Mei 2026</div>
                      <div class="font-semibold text-slate-800">Dokter Pemeriksa,</div>
                      <div class="py-1 text-emerald-700 font-bold font-mono text-[10px]">[STEMPEL KLINIK RESMI]</div>
                      <div class="font-bold underline text-slate-900">dr. Faisal Rahman, Sp.Ok.</div>
                      <div class="text-[10px] text-slate-500 font-mono">SIP: 446.1/1042/SIP-D/2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FOOTER AKSI VERIFIKASI DOKUMEN AKTIF (Terpasang Rapi di Bawah Penampil) -->
            <div class="bg-white border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
              <!-- Info Status Dokumen Terpilih Saat Ini -->
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-xs text-slate-500 font-sans">Status Berkas:</span>
                <span
                  class="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
                  :class="{
                    'bg-emerald-100 text-emerald-800 border border-emerald-300': selectedDoc?.status === 'verified',
                    'bg-rose-100 text-rose-800 border border-rose-300': selectedDoc?.status === 'revision',
                    'bg-amber-100 text-amber-800 border border-amber-300': selectedDoc?.status === 'pending'
                  }"
                >
                  {{ selectedDoc?.status === 'verified' ? 'Disetujui Sah' : selectedDoc?.status === 'revision' ? 'Perlu Perbaikan' : 'Menunggu Verifikasi' }}
                </span>
                <span v-if="selectedDoc?.notes" class="text-xs text-slate-500 truncate max-w-xs hidden md:inline">
                  — {{ selectedDoc.notes }}
                </span>
              </div>

              <!-- Tombol-tombol Aksi Utama -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <!-- Tombol Setujui Dokumen Ini -->
                <button
                  @click="approveCurrentDoc"
                  class="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Setujui dokumen ini dan lanjutkan ke berkas berikutnya"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Setujui Berkas Ini</span>
                </button>

                <!-- Tombol Minta Perbaikan -->
                <button
                  @click="openRevisionModal(selectedDoc)"
                  class="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Minta mahasiswa mengunggah ulang dengan catatan spesifik"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Minta Perbaikan</span>
                </button>

                <!-- Tombol Navigasi Berkas Berikutnya -->
                <button
                  @click="selectNextDoc"
                  class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sora font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  title="Periksa berkas berikutnya"
                >
                  <span class="hidden sm:inline">Berikutnya</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL DIALOG REVISI BERKAS (OVERLAY Z-INDEX TERTINGGI, BERSIH & JELAS) -->
    <!-- ========================================================================= -->
    <div
      v-if="showRevisionDialog"
      class="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-fadeIn"
      style="z-index: 100;"
      @click.self="showRevisionDialog = false"
    >
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                Catatan Permintaan Revisi Berkas
              </h3>
              <p class="text-[11px] text-slate-500 font-mono">
                {{ targetRevisionDoc?.title }}
              </p>
            </div>
          </div>
          <button
            @click="showRevisionDialog = false"
            class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 text-xl font-bold rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div class="space-y-2 text-xs">
          <label class="block font-medium text-slate-700 font-sans">
            Pilih Alasan Cepat Standar Panitia:
          </label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="chip in revisionChips"
              :key="chip"
              type="button"
              @click="applyRevisionChip(chip)"
              class="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 rounded-lg text-[11px] transition-colors border border-slate-200 text-left cursor-pointer"
            >
              + {{ chip }}
            </button>
          </div>
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-medium text-slate-700 font-sans">
            Detail Instruksi Perbaikan untuk Calon Mahasiswa:
          </label>
          <textarea
            v-model="revisionText"
            rows="3"
            class="w-full p-3 bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl outline-none font-sans text-xs text-slate-800 transition-colors"
            placeholder="Tuliskan catatan instruksi perbaikan spesifik..."
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            @click="showRevisionDialog = false"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button
            @click="submitRevisionNote"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Kirim Catatan Revisi
          </button>
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
const activeMobileTab = ref('viewer');
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

// Window resize listener for responsive split view
const handleResize = () => {
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 1024;
  }
};

// Keyboard listener for Escape key to cleanly close modals
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (showRevisionDialog.value) {
      showRevisionDialog.value = false;
    } else if (activeApplicant.value) {
      closeVerifyDesk();
    }
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleKeyDown);
});

// Viewer Interactive Controls (Zoom & Rotate)
const zoomScale = ref(1);
const rotationDeg = ref(0);

const zoomIn = () => {
  if (zoomScale.value < 2.5) zoomScale.value += 0.25;
};

const zoomOut = () => {
  if (zoomScale.value > 0.5) zoomScale.value -= 0.25;
};

const rotateDoc = () => {
  rotationDeg.value = (rotationDeg.value + 90) % 360;
};

const resetView = () => {
  zoomScale.value = 1;
  rotationDeg.value = 0;
};

// Document type detection helpers
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

// Open in new tab or print
const openInNewWindow = () => {
  if (selectedDoc.value?.fileBlobUrl) {
    window.open(selectedDoc.value.fileBlobUrl, '_blank');
  } else {
    window.print();
  }
};

// Select a document to view in the inspection canvas
const selectDoc = (doc) => {
  selectedDoc.value = doc;
  resetView();
};

// Select next / prev document in list
const selectNextDoc = () => {
  if (!activeApplicant.value || !selectedDoc.value) return;
  const docs = activeApplicant.value.documents;
  const currentIndex = docs.findIndex((d) => d.id === selectedDoc.value.id);
  const nextIndex = (currentIndex + 1) % docs.length;
  selectDoc(docs[nextIndex]);
};

// Revision Dialog States
const showRevisionDialog = ref(false);
const targetRevisionDoc = ref(null);
const revisionText = ref('');

const revisionChips = [
  'Pindaian dokumen buram / teks angka tidak terbaca jelas.',
  'Bagian nilai ijazah atau nomor identitas terpotong.',
  'Masa berlaku dokumen telah habis / kedaluwarsa.',
  'Surat keterangan sehat belum memuat tes bebas buta warna.',
  'Berkas yang diunggah bukan dokumen asli atau salah file.',
];

const applyRevisionChip = (chip) => {
  revisionText.value = chip;
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

// Open unified verification desk for an applicant
const openVerifyDesk = (applicant) => {
  activeApplicant.value = applicant;
  // Default to first pending document, or first document
  const firstPending = applicant.documents.find((d) => d.status === 'pending' || d.status === 'revision');
  selectedDoc.value = firstPending || applicant.documents[0];
  resetView();
  activeMobileTab.value = 'viewer';
};

const closeVerifyDesk = () => {
  activeApplicant.value = null;
  selectedDoc.value = null;
  showRevisionDialog.value = false;
};

// Update status of a specific document
const setDocStatus = (docId, status, notes) => {
  if (!activeApplicant.value) return;
  adminStore.verifyDocument(activeApplicant.value.id, docId, status, notes);

  // Directly update activeApplicant's document in place for instant reactivity
  const target = activeApplicant.value.documents.find((d) => d.id === docId);
  if (target) {
    target.status = status;
    target.notes = notes;
  }

  // Recalculate applicant summary counts in place
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

  toastMessage.value = `Berkas "${target?.title || 'Dokumen'}" berhasil diubah menjadi "${status === 'verified' ? 'Disetujui Sah' : 'Perlu Perbaikan'}".`;
};

// Approve currently selected document from inspector footer
const approveCurrentDoc = () => {
  if (!selectedDoc.value || !activeApplicant.value) return;
  setDocStatus(selectedDoc.value.id, 'verified', 'Dokumen terverifikasi sah dan sesuai standar BTH.');
  
  // Auto-advance to next document needing attention
  const nextNeedingAction = activeApplicant.value.documents.find(
    (d) => d.id !== selectedDoc.value.id && d.status !== 'verified'
  );
  if (nextNeedingAction) {
    selectDoc(nextNeedingAction);
  }
};

const openRevisionModal = (doc) => {
  targetRevisionDoc.value = doc;
  revisionText.value = doc.notes || 'Pindaian dokumen kurang jelas / buram. Mohon unggah ulang dengan resolusi lebih baik.';
  showRevisionDialog.value = true;
};

const submitRevisionNote = () => {
  if (!targetRevisionDoc.value || !activeApplicant.value) return;
  const note = revisionText.value.trim() || 'Mohon unggah ulang berkas sesuai standar PMB BTH.';
  setDocStatus(targetRevisionDoc.value.id, 'revision', note);
  showRevisionDialog.value = false;
};

const approveAllDocs = () => {
  if (!activeApplicant.value) return;
  activeApplicant.value.documents.forEach((doc) => {
    adminStore.verifyDocument(activeApplicant.value.id, doc.id, 'verified', 'Dokumen terverifikasi sah dan disetujui panitia.');
    doc.status = 'verified';
    doc.notes = 'Dokumen terverifikasi sah dan disetujui panitia.';
  });
  activeApplicant.value.verifiedDocsCount = activeApplicant.value.documents.length;
  activeApplicant.value.pendingDocsCount = 0;
  activeApplicant.value.documentStatus = 'verified';
  toastMessage.value = `Seluruh dokumen ${activeApplicant.value.fullName} berhasil diverifikasi sah.`;
};
</script>
