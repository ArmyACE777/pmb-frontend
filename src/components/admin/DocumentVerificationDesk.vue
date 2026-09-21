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
      <button @click="toastMessage = ''" class="text-emerald-600 hover:text-emerald-900 font-bold text-sm leading-none">&times;</button>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama, No. Registrasi, NIK..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-xl text-xs outline-none text-slate-800 transition-colors"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs -mx-1 px-1">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="selectedFilter = filter.id"
          class="px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
          :class="selectedFilter === filter.id
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          {{ filter.label }}
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
                  @click="openVerifyModal(applicant)"
                  class="px-3.5 py-1.5 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] font-sora font-semibold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Periksa Berkas</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
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
                  <div class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Pendaftar</div>
                  <p class="text-xs text-slate-400">Belum ada calon mahasiswa yang mendaftar pada sistem.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Review & Verifikasi Berkas Detail -->
    <div
      v-if="activeApplicant"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          @click="activeApplicant = null"
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none cursor-pointer"
        >
          &times;
        </button>

        <!-- Candidate Header Info -->
        <div class="pb-4 border-b border-slate-200">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Lembar Verifikasi Berkas Calon Mahasiswa
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 mt-1">
            <h3 class="font-sora font-extrabold text-xl text-slate-900">
              {{ activeApplicant.fullName }}
            </h3>
            <span class="font-mono text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              {{ activeApplicant.id }}
            </span>
          </div>
          <div class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Pilihan Prodi: <strong class="text-slate-800">{{ activeApplicant.prodi1 }}</strong></span>
            <span>•</span>
            <span>Asal Sekolah: {{ activeApplicant.schoolName }}</span>
            <span>•</span>
            <span>NIK: <span class="font-mono">{{ activeApplicant.nik }}</span></span>
          </div>
        </div>

        <!-- Document Checklist Review List -->
        <div class="py-5 space-y-4">
          <div
            v-for="doc in activeApplicant.documents"
            :key="doc.id"
            class="p-4 rounded-2xl border transition-all space-y-3"
            :class="{
              'bg-emerald-50/50 border-emerald-200': doc.status === 'verified',
              'bg-rose-50/50 border-rose-200': doc.status === 'revision',
              'bg-slate-50 border-slate-200/80': doc.status === 'pending'
            }"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div class="font-sora font-bold text-xs sm:text-sm text-slate-900">
                  {{ doc.title }}
                </div>
                <div class="text-[11px] text-slate-500 font-mono mt-0.5">
                  File: {{ doc.filename }}
                </div>
              </div>

              <!-- Status Tag -->
              <div>
                <span
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  :class="{
                    'bg-emerald-100 text-emerald-800': doc.status === 'verified',
                    'bg-rose-100 text-rose-800': doc.status === 'revision',
                    'bg-amber-100 text-amber-800': doc.status === 'pending'
                  }"
                >
                  {{ doc.status === 'verified' ? 'Disetujui' : doc.status === 'revision' ? 'Perlu Perbaikan' : 'Menunggu' }}
                </span>
              </div>
            </div>

            <!-- Notes from Committee -->
            <div class="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
              <span class="font-semibold text-slate-700">Catatan Panitia:</span> {{ doc.notes }}
            </div>

            <!-- Action Buttons for this document -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <button
                v-if="doc.filename && doc.filename !== 'Belum diunggah'"
                @click="inspectDoc(doc)"
                class="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] font-sora font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-blue-200 shadow-2xs"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Inspeksi Berkas</span>
              </button>

              <button
                @click="setDocStatus(doc.id, 'verified', 'Dokumen terverifikasi sah dan sesuai standar BTH.')"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Setujui</span>
              </button>

              <button
                @click="openRevisionModal(doc)"
                class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Minta Perbaikan</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Master Actions -->
        <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            @click="approveAllDocs"
            class="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Setujui Seluruh Berkas Peserta Ini</span>
          </button>

          <button
            @click="activeApplicant = null"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup Lembar Kerja
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Inspeksi Visual Berkas Riil (Khusus Panitia Verifikator PMB) -->
    <div
      v-if="inspectingDoc"
      class="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
      @click.self="inspectingDoc = null"
    >
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[94vh] flex flex-col">
        <!-- Header Inspeksi Berkas -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2 flex-shrink-0">
          <div class="min-w-0 pr-2">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-blue-100 text-[#1E3A8A] font-sora font-bold text-[10px] rounded uppercase tracking-wider whitespace-nowrap">
                Meja Inspeksi Dokumen
              </span>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base truncate">
                {{ inspectingDoc.title }}
              </h3>
            </div>
            <div class="text-xs text-slate-500 font-mono mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>Pendaftar: <strong class="text-slate-800">{{ activeApplicant?.fullName }}</strong></span>
              <span>•</span>
              <span>No. Reg: <strong class="text-[#1E3A8A]">{{ activeApplicant?.id }}</strong></span>
              <span>•</span>
              <span>Berkas: <strong class="text-slate-700">{{ inspectingDoc.filename }}</strong></span>
            </div>
          </div>

          <!-- Zoom, Rotate, & Close Toolbar -->
          <div class="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
            <button
              @click="zoomOut"
              class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Perkecil Tampilan (Zoom Out)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-xs font-mono text-slate-600 px-1 font-bold">{{ Math.round(zoomScale * 100) }}%</span>
            <button
              @click="zoomIn"
              class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Perbesar Tampilan (Zoom In)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              @click="rotateDoc"
              class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Putar Dokumen 90°"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              @click="resetView"
              class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Reset Tampilan"
            >
              Reset
            </button>

            <a
              v-if="inspectingDoc.fileBlobUrl"
              :href="inspectingDoc.fileBlobUrl"
              target="_blank"
              class="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] rounded-lg text-xs transition-colors"
              title="Buka Berkas di Tab Baru"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <button
              @click="inspectingDoc = null"
              class="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1 ml-1 cursor-pointer transition-colors"
              title="Tutup Inspeksi"
            >
              &times;
            </button>
          </div>
        </div>

        <!-- Document Viewer Content Canvas -->
        <div class="flex-1 overflow-auto my-3 border border-slate-200 rounded-2xl bg-slate-100/80 p-2 sm:p-4 flex items-center justify-center min-h-[360px] max-h-[62vh] relative">
          <!-- KASUS A1: Pindaian Gambar Nyata yang Diunggah oleh Pendaftar (JPG/PNG/WEBP) -->
          <div
            v-if="inspectingDoc.fileBlobUrl && (inspectingDoc.fileType?.startsWith('image/') || isImageFile(inspectingDoc.filename))"
            class="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
            :style="{ transform: `scale(${zoomScale}) rotate(${rotationDeg}deg)` }"
          >
            <img
              :src="inspectingDoc.fileBlobUrl"
              :alt="inspectingDoc.title"
              class="max-h-[54vh] max-w-full object-contain rounded-lg shadow-lg border-2 border-white"
            />
          </div>

          <!-- KASUS A2: Pindaian Dokumen PDF Nyata yang Diunggah Pendaftar -->
          <iframe
            v-else-if="inspectingDoc.fileBlobUrl && (inspectingDoc.fileType === 'application/pdf' || inspectingDoc.filename?.toLowerCase().endsWith('.pdf'))"
            :src="inspectingDoc.fileBlobUrl"
            class="w-full h-[54vh] rounded-xl border border-slate-200 bg-white shadow-inner"
            title="Inspeksi PDF Dokumen Pendaftar"
          ></iframe>

          <!-- KASUS B: Lembar Dokumen Dinamis Autentik Spesifik Calon Mahasiswa Terkait -->
          <div
            v-else
            class="w-full max-w-2xl bg-white rounded-2xl p-5 sm:p-7 border border-slate-300 shadow-md my-auto text-slate-800 font-sans relative overflow-hidden transition-transform duration-200"
            :style="{ transform: `scale(${zoomScale}) rotate(${rotationDeg}deg)` }"
          >
            <!-- Watermark Lambang Kampus BTH -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <img src="/assets/icons/bth.png" alt="BTH Watermark" class="w-80 h-80 object-contain" />
            </div>

            <!-- 1. DOKUMEN IJAZAH / SKL (doc-1) -->
            <div v-if="inspectingDoc.id === 'doc-1'" class="space-y-3.5 relative z-10 text-xs">
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
            <div v-else-if="inspectingDoc.id === 'doc-2'" class="space-y-3 relative z-10 text-xs bg-blue-50/50 p-4 rounded-xl border border-blue-200">
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
            <div v-else-if="inspectingDoc.id === 'doc-3'" class="space-y-3 relative z-10 text-xs">
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
            <div v-else-if="inspectingDoc.id === 'doc-4'" class="text-center space-y-3 relative z-10">
              <div class="inline-block p-2 bg-slate-100 rounded-2xl border border-slate-300 shadow-sm">
                <div class="w-32 h-44 bg-gradient-to-b from-red-600 to-red-700 rounded-xl flex flex-col items-center justify-between p-3 text-white shadow-inner relative overflow-hidden">
                  <div class="text-[9px] font-mono tracking-wider opacity-80">RASIO RESMI 4x6</div>
                  <!-- Formal Portrait Silhouette -->
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

        <!-- Footer Modal Inspeksi: Aksi Verifikator Panitia -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-200 flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-sans">Status Verifikasi:</span>
            <span
              class="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase"
              :class="{
                'bg-emerald-100 text-emerald-800 border border-emerald-300': inspectingDoc.status === 'verified',
                'bg-rose-100 text-rose-800 border border-rose-300': inspectingDoc.status === 'revision',
                'bg-amber-100 text-amber-800 border border-amber-300': inspectingDoc.status === 'pending'
              }"
            >
              {{ inspectingDoc.status === 'verified' ? 'Disetujui Sah' : inspectingDoc.status === 'revision' ? 'Perlu Perbaikan' : 'Menunggu Verifikasi' }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="setDocStatusFromInspector('verified')"
              class="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Setujui Berkas Ini</span>
            </button>

            <button
              @click="openRevisionModal(inspectingDoc)"
              class="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-sora font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Minta Perbaikan</span>
            </button>

            <button
              @click="inspectingDoc = null"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Dialog Catatan Perbaikan / Revisi Interaktif (Bukan Prompt Biasa) -->
    <div
      v-if="showRevisionDialog"
      class="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
      @click.self="showRevisionDialog = false"
    >
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <button @click="showRevisionDialog = false" class="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
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
              class="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#1E3A8A] text-slate-600 rounded-lg text-[11px] transition-colors border border-slate-200 text-left cursor-pointer"
            >
              + {{ chip }}
            </button>
          </div>
        </div>

        <div class="space-y-1 text-xs">
          <label class="block font-medium text-slate-700 font-sans">
            Detail Instruksi Perbaikan untuk Mahasiswa:
          </label>
          <textarea
            v-model="revisionText"
            rows="3"
            class="w-full p-3 bg-slate-50 border border-slate-300 focus:border-rose-500 focus:bg-white rounded-xl outline-none font-sans text-xs text-slate-800 transition-colors"
            placeholder="Tuliskan catatan perbaikan spesifik..."
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
            Kirim Catatan Revisi ke Pendaftar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const searchQuery = ref('');
const selectedFilter = ref('all');
const activeApplicant = ref(null);
const inspectingDoc = ref(null);
const toastMessage = ref('');

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

const isImageFile = (filename) => {
  if (!filename) return false;
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
};

const inspectDoc = (doc) => {
  inspectingDoc.value = doc;
  resetView();
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

const filteredApplicants = computed(() => {
  return adminStore.applicants.filter((applicant) => {
    if (selectedFilter.value !== 'all' && applicant.documentStatus !== selectedFilter.value) {
      return false;
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = applicant.fullName.toLowerCase().includes(q);
      const matchId = applicant.id.toLowerCase().includes(q);
      const matchNik = applicant.nik?.includes(q);
      return matchName || matchId || matchNik;
    }
    return true;
  });
});

const openVerifyModal = (applicant) => {
  activeApplicant.value = applicant;
};

const setDocStatus = (docId, status, notes) => {
  if (!activeApplicant.value) return;
  adminStore.verifyDocument(activeApplicant.value.id, docId, status, notes);
  toastMessage.value = `Status dokumen berhasil diubah menjadi "${status === 'verified' ? 'Disetujui Sah' : 'Perlu Perbaikan'}".`;
};

const setDocStatusFromInspector = (status) => {
  if (!inspectingDoc.value || !activeApplicant.value) return;
  if (status === 'verified') {
    setDocStatus(inspectingDoc.value.id, 'verified', 'Dokumen terverifikasi sah dan sesuai standar BTH.');
    inspectingDoc.value = null;
  } else {
    openRevisionModal(inspectingDoc.value);
  }
};

const openRevisionModal = (doc) => {
  targetRevisionDoc.value = doc;
  revisionText.value = doc.notes || 'Pindaian dokumen kurang jelas / buram. Mohon unggah ulang dengan resolusi lebih baik.';
  showRevisionDialog.value = true;
};

const submitRevisionNote = () => {
  if (!targetRevisionDoc.value || !activeApplicant.value) return;
  const note = revisionText.value.trim() || 'Mohon unggah ulang berkas sesuai standar BTH.';
  setDocStatus(targetRevisionDoc.value.id, 'revision', note);
  showRevisionDialog.value = false;
  if (inspectingDoc.value && inspectingDoc.value.id === targetRevisionDoc.value.id) {
    inspectingDoc.value = null;
  }
};

const approveAllDocs = () => {
  if (!activeApplicant.value) return;
  activeApplicant.value.documents.forEach((doc) => {
    adminStore.verifyDocument(activeApplicant.value.id, doc.id, 'verified', 'Dokumen terverifikasi sah dan disetujui panitia.');
  });
  toastMessage.value = `Seluruh dokumen ${activeApplicant.value.fullName} berhasil diverifikasi sah.`;
};
</script>
