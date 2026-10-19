<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Verifikasi & Validasi Berkas Pendaftar
        </h2>
        <p class="text-xs text-slate-500 mt-0.5 font-sans">
          Periksa keabsahan pindaian ijazah, identitas kependudukan, pasfoto, dan surat keterangan sehat pendaftar.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="text-xs text-slate-500 font-sans">
          {{ pendingCount }} berkas menunggu verifikasi
        </span>
      </div>
    </div>

    <!-- Sub-Navigasi Verifikasi Berkas & Permohonan (CR-006 & CR-007) -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          @click="activeDeskSubTab = 'documents'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
          :class="activeDeskSubTab === 'documents'
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          Verifikasi Dokumen Persyaratan
        </button>

        <button
          @click="activeDeskSubTab = 'path_changes'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          :class="activeDeskSubTab === 'path_changes'
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          <span>Permohonan Pindah Jalur</span>
          <span
            v-if="pendingPathChangeCount > 0"
            class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
            :class="activeDeskSubTab === 'path_changes' ? 'bg-white text-[#1E3A8A]' : 'bg-blue-100 text-blue-800'"
          >
            {{ pendingPathChangeCount }}
          </span>
        </button>

        <button
          @click="activeDeskSubTab = 'withdrawals'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          :class="activeDeskSubTab === 'withdrawals'
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          <span>Pengunduran Diri Mahasiswa</span>
          <span
            v-if="pendingWithdrawalCount > 0"
            class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
            :class="activeDeskSubTab === 'withdrawals' ? 'bg-white text-[#1E3A8A]' : 'bg-amber-100 text-amber-800'"
          >
            {{ pendingWithdrawalCount }}
          </span>
        </button>
      </div>

      <!-- Realtime Synchronization Indicator & Action -->
      <div class="flex items-center gap-2.5">
        <span class="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-sans">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Sinkron {{ lastSyncText }}</span>
        </span>
        <button
          @click="syncAllDeskData(false)"
          :disabled="isSyncing"
          class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          title="Segarkan data terbaru dari database backend"
        >
          <svg class="w-3.5 h-3.5 text-slate-600" :class="{ 'animate-spin': isSyncing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isSyncing ? 'Sinkronisasi...' : 'Segarkan' }}</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: VERIFIKASI DOKUMEN PERSYARATAN -->
    <div v-if="activeDeskSubTab === 'documents'" class="space-y-4">
      <!-- Filter & Search Controls Bar -->
      <div class="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama, No. Registrasi, NIK..."
          class="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none text-slate-800 transition-colors"
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
          class="px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-1.5"
          :class="selectedFilter === filter.id
            ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          <span>{{ filter.label }}</span>
          <span
            class="px-1.5 py-0.2 rounded text-[10px] font-mono"
            :class="selectedFilter === filter.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'"
          >
            {{ getFilterCount(filter.id) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Applicants Document Table (Daftar Mahasiswa Dinamis & Akurat) -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <!-- Mobile Responsive Cards (Tampilan Khusus Mobile < md) -->
      <div class="block md:hidden divide-y divide-slate-100">
        <div
          v-for="applicant in filteredApplicants"
          :key="applicant.id"
          class="p-4 space-y-3 hover:bg-slate-50/80 transition-colors"
        >
          <!-- Top Row: Reg ID & Status -->
          <div class="flex items-center justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-xs text-[#1E3A8A]">{{ applicant.id }}</span>
              <span v-if="applicant.nik" class="text-[10px] text-slate-400 font-mono block">NIK: {{ applicant.nik }}</span>
            </div>

            <!-- Status Badge -->
            <span
              v-if="applicant.documentStatus === 'verified'"
              class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium whitespace-nowrap"
            >
              Terverifikasi Sah
            </span>
            <span
              v-else-if="applicant.documentStatus === 'revision'"
              class="inline-flex items-center px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-medium whitespace-nowrap"
            >
              Perlu Perbaikan
            </span>
            <span
              v-else-if="applicant.documentStatus === 'pending'"
              class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-medium whitespace-nowrap"
            >
              Menunggu Verifikasi
            </span>
            <span
              v-else
              class="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[11px] font-medium whitespace-nowrap"
            >
              Belum Unggah
            </span>
          </div>

          <!-- Middle: Name, School & Prodi -->
          <div class="space-y-0.5">
            <h4 class="font-sora font-bold text-slate-900 text-sm leading-snug">{{ applicant.fullName }}</h4>
            <div class="text-xs text-slate-500 font-sans">{{ applicant.schoolName }}</div>
            <div class="text-xs font-medium text-slate-700 pt-0.5">
              <span>{{ applicant.prodi1 }}</span>
              <span v-if="applicant.prodi2 && applicant.prodi2 !== '-'" class="text-[11px] text-slate-400 block">Pilihan 2: {{ applicant.prodi2 }}</span>
            </div>
          </div>

          <!-- Bottom: Documents Count & Action Button -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold whitespace-nowrap"
              :class="{
                'bg-emerald-50 text-emerald-700 border border-emerald-200': applicant.verifiedDocsCount === 5,
                'bg-amber-50 text-amber-700 border border-amber-200': applicant.verifiedDocsCount > 0 && applicant.verifiedDocsCount < 5,
                'bg-slate-100 text-slate-600 border border-slate-200': applicant.verifiedDocsCount === 0
              }"
            >
              {{ applicant.verifiedDocsCount }}/{{ applicant.documents.length }} Sah
            </span>

            <button
              @click="openVerifyDesk(applicant)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1E3A8A] border border-slate-200 font-sora font-semibold text-xs rounded-lg transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Inspeksi Berkas</span>
            </button>
          </div>
        </div>

        <div v-if="filteredApplicants.length === 0" class="py-12 text-center text-slate-400">
          <div class="font-sora font-semibold text-slate-700 text-sm">Tidak Ada Pendaftar</div>
          <p class="text-xs text-slate-400 mt-1">Tidak ada calon mahasiswa yang cocok dengan kriteria pencarian.</p>
        </div>
      </div>

      <!-- Desktop Data Table (hidden on mobile, visible md+) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[960px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider">
            <tr>
              <th class="py-3 px-4 font-bold whitespace-nowrap w-44">No. Registrasi / NIK</th>
              <th class="py-3 px-4 font-bold min-w-[200px]">Nama Lengkap & Asal Sekolah</th>
              <th class="py-3 px-4 font-bold min-w-[180px]">Program Studi Pilihan</th>
              <th class="py-3 px-4 font-bold text-center whitespace-nowrap w-28">Kelengkapan</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap w-48">Status Berkas</th>
              <th class="py-3 px-4 font-bold text-right whitespace-nowrap w-36">Aksi Panitia</th>
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
                <div v-if="applicant.prodi2 && applicant.prodi2 !== '-'" class="text-[10px] text-slate-400">Pilihan 2: {{ applicant.prodi2 }}</div>
              </td>

              <!-- Documents Count -->
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <span
                  class="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold whitespace-nowrap"
                  :class="{
                    'bg-emerald-50 text-emerald-700 border border-emerald-200': applicant.verifiedDocsCount === 5,
                    'bg-amber-50 text-amber-700 border border-amber-200': applicant.verifiedDocsCount > 0 && applicant.verifiedDocsCount < 5,
                    'bg-slate-100 text-slate-600 border border-slate-200': applicant.verifiedDocsCount === 0
                  }"
                >
                  {{ applicant.verifiedDocsCount }}/{{ applicant.documents.length }} Sah
                </span>
              </td>

              <!-- Status Badge Presisi & Bersih (Tanpa Dot AI) -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  v-if="applicant.documentStatus === 'verified'"
                  class="inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium whitespace-nowrap"
                >
                  Terverifikasi Sah
                </span>
                <span
                  v-else-if="applicant.documentStatus === 'revision'"
                  class="inline-flex items-center px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-medium whitespace-nowrap"
                >
                  Perlu Perbaikan
                </span>
                <span
                  v-else-if="applicant.documentStatus === 'pending'"
                  class="inline-flex items-center px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-medium whitespace-nowrap"
                >
                  Menunggu Verifikasi
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[11px] font-medium whitespace-nowrap"
                >
                  Belum Unggah Berkas
                </span>
              </td>

              <!-- Action Button: Ramping, Presisi, 1 Baris Penuh -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <button
                  @click="openVerifyDesk(applicant)"
                  class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1E3A8A] border border-slate-200 hover:border-slate-300 font-sora font-semibold text-xs rounded-lg transition-all shadow-2xs cursor-pointer active:scale-95"
                  title="Buka lembar inspeksi dokumen pendaftar"
                >
                  <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
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
  </div>

  <!-- TAB 2: PERMOHONAN PINDAH JALUR (CR-006) -->
  <div v-else-if="activeDeskSubTab === 'path_changes'" class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="font-sora font-bold text-slate-900 text-sm">
            Permohonan Pindah Jalur & Pilihan Program Studi
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Tinjau pengajuan alih jalur seleksi atau perubahan program studi pendaftar.
          </p>
        </div>
        <span class="text-xs text-slate-500 font-medium">{{ pathChangesList.length }} Pengajuan</span>
      </div>

      <!-- Mobile Cards (< md) -->
      <div class="block md:hidden divide-y divide-slate-100">
        <div
          v-for="item in pathChangesList"
          :key="item.id"
          class="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors"
        >
          <!-- Candidate & Status -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-sora font-bold text-slate-900 text-xs">{{ item.candidateName }}</div>
              <div class="text-[11px] font-mono text-slate-500">{{ item.regNo }}</div>
            </div>
            <span
              class="inline-block px-2 py-0.5 text-[10px] font-bold rounded border whitespace-nowrap"
              :class="item.status === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : item.status === 'rejected'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'"
            >
              {{ item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu Verifikasi' }}
            </span>
          </div>

          <!-- Old vs New Path / Prodi -->
          <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Jalur & Prodi Lama:</span>
              <div class="font-medium text-slate-700 text-xs">{{ item.oldTrack }}</div>
              <div class="text-[11px] text-slate-500">{{ item.oldProdi }}</div>
            </div>
            <div class="pt-2 border-t border-slate-200/60">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A] block">Jalur & Prodi Baru:</span>
              <div class="font-bold text-[#1E3A8A] text-xs">{{ item.newTrack }}</div>
              <div class="text-[11px] font-medium text-slate-800">{{ item.newProdi }}</div>
            </div>
          </div>

          <!-- Reason & Notes -->
          <div class="text-[11px] text-slate-600 space-y-1">
            <p class="leading-relaxed"><strong class="text-slate-700">Alasan:</strong> {{ item.reason }}</p>
            <div v-if="item.notes || item.reviewNote" class="text-[10px] text-slate-700 bg-amber-50/60 border border-amber-200/60 rounded px-2 py-1">
              <span class="font-semibold text-amber-800">Catatan Panitia:</span> {{ item.notes || item.reviewNote }}
            </div>
          </div>

          <!-- Actions -->
          <div v-if="item.status === 'pending'" class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              @click="openPathChangeReviewModal(item, 'approved')"
              class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded transition-colors text-center cursor-pointer"
            >
              Setujui
            </button>
            <button
              @click="openPathChangeReviewModal(item, 'rejected')"
              class="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded transition-colors text-center cursor-pointer"
            >
              Tolak
            </button>
          </div>
        </div>

        <div v-if="pathChangesList.length === 0" class="p-8 text-center text-slate-400 text-xs">
          Tidak ada permohonan pindah jalur saat ini.
        </div>
      </div>

      <!-- Desktop Table (>= md) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[860px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider whitespace-nowrap">
            <tr>
              <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[180px]">Pendaftar</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[180px]">Jalur & Prodi Lama</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[180px]">Jalur & Prodi Baru</th>
              <th class="py-3 px-4 font-bold min-w-[200px]">Alasan Pengajuan</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[140px]">Status</th>
              <th class="py-3 px-4 font-bold text-right whitespace-nowrap min-w-[130px]">Tindakan Panitia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr v-for="item in pathChangesList" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="py-3.5 px-4">
                <div class="font-sora font-bold text-slate-900">{{ item.candidateName }}</div>
                <div class="text-[11px] font-mono text-slate-500">{{ item.regNo }}</div>
              </td>
              <td class="py-3.5 px-4">
                <div class="font-medium text-slate-700">{{ item.oldTrack }}</div>
                <div class="text-[11px] text-slate-500">{{ item.oldProdi }}</div>
              </td>
              <td class="py-3.5 px-4">
                <div class="font-bold text-[#1E3A8A]">{{ item.newTrack }}</div>
                <div class="text-[11px] font-medium text-slate-800">{{ item.newProdi }}</div>
              </td>
              <td class="py-3.5 px-4 max-w-xs text-[11px] text-slate-600">
                <div>{{ item.reason }}</div>
                <div v-if="item.notes || item.reviewNote" class="text-[10px] text-slate-700 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 mt-1">
                  <span class="font-semibold text-slate-500">Catatan Panitia:</span> {{ item.notes || item.reviewNote }}
                </div>
              </td>
              <td class="py-3.5 px-4 whitespace-nowrap min-w-[150px]">
                <span
                  class="inline-block px-2.5 py-0.5 text-xs font-medium rounded border whitespace-nowrap"
                  :class="item.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : item.status === 'rejected'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'"
                >
                  {{ item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu Verifikasi' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <div v-if="item.status === 'pending'" class="flex items-center justify-end gap-2">
                  <button
                    @click="openPathChangeReviewModal(item, 'approved')"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
                  >
                    Setujui
                  </button>
                  <button
                    @click="openPathChangeReviewModal(item, 'rejected')"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded transition-colors cursor-pointer"
                  >
                    Tolak
                  </button>
                </div>
                <span v-else class="text-xs text-slate-400 font-medium">
                  Selesai
                </span>
              </td>
            </tr>
            <tr v-if="pathChangesList.length === 0">
              <td colspan="6" class="py-10 text-center text-slate-400 text-xs">
                Tidak ada permohonan pindah jalur saat ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- TAB 3: VERIFIKASI PENGUNDURAN DIRI (CR-007) -->
  <div v-else-if="activeDeskSubTab === 'withdrawals'" class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="font-sora font-bold text-slate-900 text-sm">
            Verifikasi Berkas Pengunduran Diri Mahasiswa
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Persetujuan pengunduran diri resmi calon mahasiswa yang telah melewati seleksi atau terbit NIM.
          </p>
        </div>
        <span class="text-xs text-slate-500 font-medium">{{ withdrawalsList.length }} Pengajuan</span>
      </div>

      <!-- Mobile Cards (< md) -->
      <div class="block md:hidden divide-y divide-slate-100">
        <div
          v-for="item in withdrawalsList"
          :key="item.id"
          class="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors"
        >
          <!-- Candidate & Status -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-sora font-bold text-slate-900 text-xs">{{ item.candidateName }}</div>
              <div class="text-[11px] font-mono text-slate-500">{{ item.regNo }} • {{ item.prodi }}</div>
            </div>
            <span
              class="inline-block px-2 py-0.5 text-[10px] font-bold rounded border whitespace-nowrap"
              :class="item.status === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : item.status === 'rejected'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'"
            >
              {{ item.status === 'approved' ? 'Pengunduran Diri Sah' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu Verifikasi' }}
            </span>
          </div>

          <!-- Meta badges (Category, Submitted date) -->
          <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span class="font-medium text-slate-700 px-2 py-0.5 rounded bg-slate-100 text-[11px]">{{ item.category }}</span>
            <span class="text-[11px] font-sans">{{ item.submittedAt }}</span>
          </div>

          <!-- Reason & Notes -->
          <div class="text-[11px] text-slate-600 space-y-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div class="italic leading-relaxed">"{{ item.reason }}"</div>
            <div class="text-[10px] text-slate-400 font-mono">Kode Verifikasi: {{ item.verificationCode }}</div>
            <div v-if="item.notes || item.reviewNote" class="text-[10px] text-slate-700 bg-amber-50/60 border border-amber-200/60 rounded px-2 py-1">
              <span class="font-semibold text-amber-800">Catatan Panitia:</span> {{ item.notes || item.reviewNote }}
            </div>
          </div>

          <!-- Actions -->
          <div v-if="item.status === 'pending'" class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              @click="openWithdrawalReviewModal(item, 'approved')"
              class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded transition-colors text-center cursor-pointer"
            >
              Setujui
            </button>
            <button
              @click="openWithdrawalReviewModal(item, 'rejected')"
              class="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded transition-colors text-center cursor-pointer"
            >
              Tolak
            </button>
          </div>
        </div>

        <div v-if="withdrawalsList.length === 0" class="p-8 text-center text-slate-400 text-xs">
          Tidak ada permohonan pengunduran diri saat ini.
        </div>
      </div>

      <!-- Desktop Table (>= md) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[880px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider whitespace-nowrap">
            <tr>
              <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[180px]">Pendaftar & Prodi</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[160px]">Kategori Alasan</th>
              <th class="py-3 px-4 font-bold min-w-[220px]">Rincian Surat Permohonan</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[140px]">Tanggal Pengajuan</th>
              <th class="py-3 px-4 font-bold whitespace-nowrap min-w-[140px]">Status Berkas</th>
              <th class="py-3 px-4 font-bold text-right whitespace-nowrap min-w-[130px]">Tindakan Panitia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr v-for="item in withdrawalsList" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="py-3.5 px-4">
                <div class="font-sora font-bold text-slate-900">{{ item.candidateName }}</div>
                <div class="text-[11px] font-mono text-slate-500">{{ item.regNo }} • {{ item.prodi }}</div>
              </td>
              <td class="py-3.5 px-4">
                <span class="font-medium text-slate-800">{{ item.category }}</span>
              </td>
              <td class="py-3.5 px-4 max-w-xs text-[11px] text-slate-600">
                <div class="line-clamp-2 italic">"{{ item.reason }}"</div>
                <div class="text-[10px] text-slate-400 mt-0.5 font-mono">Kode Verifikasi: {{ item.verificationCode }}</div>
                <div v-if="item.notes || item.reviewNote" class="text-[10px] text-slate-700 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 mt-1">
                  <span class="font-semibold text-slate-500">Catatan Panitia:</span> {{ item.notes || item.reviewNote }}
                </div>
              </td>
              <td class="py-3.5 px-4 font-sans text-slate-600">
                {{ item.submittedAt }}
              </td>
              <td class="py-3.5 px-4 whitespace-nowrap min-w-[170px]">
                <span
                  class="inline-block px-2.5 py-0.5 text-xs font-medium rounded border whitespace-nowrap"
                  :class="item.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : item.status === 'rejected'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'"
                >
                  {{ item.status === 'approved' ? 'Pengunduran Diri Sah' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu Verifikasi' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <div v-if="item.status === 'pending'" class="flex items-center justify-end gap-2">
                  <button
                    @click="openWithdrawalReviewModal(item, 'approved')"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
                  >
                    Setujui
                  </button>
                  <button
                    @click="openWithdrawalReviewModal(item, 'rejected')"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded transition-colors cursor-pointer"
                  >
                    Tolak
                  </button>
                </div>
                <span v-else class="text-xs text-slate-400 font-medium">
                  Selesai
                </span>
              </td>
            </tr>
            <tr v-if="withdrawalsList.length === 0">
              <td colspan="6" class="py-10 text-center text-slate-400 text-xs">
                Tidak ada permohonan pengunduran diri saat ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODAL INSPEKSI BERKAS: CLEAN ENTERPRISE 2-PANEL LAYOUT                   -->
  <!-- ========================================================================= -->
    <Teleport to="body">
      <div
        v-if="activeApplicant"
        class="fixed inset-0 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 z-[100]"
        @click.self="closeVerifyDesk"
      >
        <div class="bg-white rounded-xl w-full max-w-6xl h-[88vh] shadow-xl border border-slate-200 flex flex-col overflow-hidden relative font-sans text-slate-800">
          
          <!-- HEADER: Clean, Professional, Responsive -->
          <div class="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-b border-slate-200 flex items-start sm:items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                  {{ activeApplicant.fullName }}
                </h3>
                <span class="font-mono text-[11px] sm:text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 font-medium whitespace-nowrap inline-block">
                  {{ activeApplicant.id }}
                </span>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs font-medium whitespace-nowrap"
                  :class="{
                    'bg-emerald-50 text-emerald-700 border border-emerald-200': activeApplicant.documentStatus === 'verified',
                    'bg-rose-50 text-rose-700 border border-rose-200': activeApplicant.documentStatus === 'revision',
                    'bg-amber-50 text-amber-800 border border-amber-200': activeApplicant.documentStatus === 'pending',
                    'bg-slate-50 text-slate-600 border border-slate-200': activeApplicant.documentStatus === 'unuploaded'
                  }"
                >
                  <span>{{ activeApplicant.documentStatus === 'verified' ? '5/5 Berkas Sah' : activeApplicant.verifiedDocsCount + '/5 Berkas Sah' }}</span>
                </span>
              </div>
              <div class="text-[11px] sm:text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-0.5 font-sans">
                <span>Program Studi: <strong class="text-slate-700 font-medium">{{ activeApplicant.prodi1 }}</strong></span>
                <span class="text-slate-300">/</span>
                <span>Asal Sekolah: <span class="text-slate-600">{{ activeApplicant.schoolName || '-' }}</span></span>
                <span class="text-slate-300">/</span>
                <span>NIK: <span class="font-mono text-slate-600">{{ activeApplicant.nik || '-' }}</span></span>
              </div>
            </div>

            <!-- Tombol Tutup -->
            <button
              @click="closeVerifyDesk"
              class="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center text-lg transition-all cursor-pointer flex-shrink-0"
              title="Tutup (Esc)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- BODY: Two-Panel Professional Layout (Stacked on Mobile, 2-Panel on Desktop) -->
          <div class="flex-1 flex flex-col lg:flex-row min-h-0 bg-slate-50 overflow-hidden">
            <!-- MOBILE SELECTOR: Horizontal Swipeable Document Tabs (< lg) -->
            <div class="lg:hidden bg-white border-b border-slate-200 p-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 flex-shrink-0">
              <button
                v-for="(doc, idx) in activeApplicant.documents"
                :key="doc.id"
                @click="selectDoc(doc)"
                class="px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 border transition-all flex-shrink-0 cursor-pointer"
                :class="selectedDoc?.id === doc.id
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-2xs font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
              >
                <span>{{ idx + 1 }}. {{ getShortDocTitle(doc.id) }}</span>
                <span
                  class="text-[9px] px-1 py-0.2 rounded font-mono"
                  :class="selectedDoc?.id === doc.id
                    ? 'bg-white/20 text-white'
                    : doc.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.status === 'revision'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-600'"
                >
                  {{ doc.status === 'verified' ? 'Sah' : doc.status === 'revision' ? 'Revisi' : doc.filename && doc.filename !== 'Belum diunggah' ? 'Ada' : 'Kosong' }}
                </span>
              </button>
            </div>

            <!-- DESKTOP SIDEBAR: Daftar 5 Dokumen Persyaratan (lg+) -->
            <div class="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col flex-shrink-0">
              <div class="p-3 border-b border-slate-100 bg-slate-50/50">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">Berkas Persyaratan</span>
              </div>
              <div class="overflow-y-auto p-2 space-y-1 flex-1">
                <button
                  v-for="(doc, idx) in activeApplicant.documents"
                  :key="doc.id"
                  @click="selectDoc(doc)"
                  class="w-full text-left p-3 rounded-lg text-xs transition-all flex flex-col gap-1 cursor-pointer border"
                  :class="selectedDoc?.id === doc.id
                    ? 'bg-blue-50/60 border-blue-200 text-slate-900 shadow-2xs'
                    : 'bg-white border-transparent hover:bg-slate-50 text-slate-600 hover:border-slate-200'"
                >
                  <div class="flex items-center justify-between gap-1.5">
                    <span class="font-medium text-xs truncate" :class="selectedDoc?.id === doc.id ? 'text-[#1E3A8A] font-semibold' : 'text-slate-800'">
                      {{ idx + 1 }}. {{ getShortDocTitle(doc.id) }}
                    </span>
                    <span
                      class="text-[10px] font-medium px-1.5 py-0.2 rounded border flex-shrink-0"
                      :class="{
                        'bg-emerald-50 text-emerald-700 border-emerald-200': doc.status === 'verified',
                        'bg-rose-50 text-rose-700 border-rose-200': doc.status === 'revision',
                        'bg-amber-50 text-amber-800 border-amber-200': doc.filename && doc.filename !== 'Belum diunggah' && doc.status !== 'verified' && doc.status !== 'revision',
                        'bg-slate-100 text-slate-500 border-slate-200': !doc.filename || doc.filename === 'Belum diunggah'
                      }"
                    >
                      {{ doc.status === 'verified' ? 'Sah' : doc.status === 'revision' ? 'Revisi' : doc.filename && doc.filename !== 'Belum diunggah' ? 'Ditinjau' : 'Kosong' }}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-400 truncate font-mono">
                    {{ doc.filename && doc.filename !== 'Belum diunggah' ? doc.filename : 'Belum diunggah' }}
                  </div>
                </button>
              </div>
            </div>

            <!-- KANAN: Preview Dokumen & Detail Informasi -->
            <div class="flex-1 flex flex-col min-w-0 bg-slate-100 overflow-hidden">
              <!-- Dokumen Meta Bar -->
              <div class="px-5 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs flex-shrink-0">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-800 font-sora">{{ selectedDoc?.title }}</span>
                  <span class="text-slate-300">/</span>
                  <span class="font-mono text-slate-500 text-[11px]">{{ selectedDoc?.filename || 'Tidak ada file fisik' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-500 text-[11px]">Status:</span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap"
                    :class="{
                      'bg-emerald-50 text-emerald-700 border border-emerald-200': selectedDoc?.status === 'verified',
                      'bg-rose-50 text-rose-700 border border-rose-200': selectedDoc?.status === 'revision',
                      'bg-amber-50 text-amber-800 border border-amber-200': selectedDoc?.status === 'pending',
                      'bg-slate-100 text-slate-600 border border-slate-200': selectedDoc?.status === 'unuploaded'
                    }"
                  >
                    <span>{{ selectedDoc?.status === 'verified' ? 'Tervalidasi Sah' : selectedDoc?.status === 'revision' ? 'Perlu Perbaikan' : selectedDoc?.filename && selectedDoc?.filename !== 'Belum diunggah' ? 'Menunggu Penilaian' : 'Belum Diunggah' }}</span>
                  </span>
                </div>
              </div>

              <!-- Area Preview Dokumen -->
              <div class="flex-1 p-4 overflow-auto flex items-center justify-center">
                <!-- Case A: File Asli PDF -->
                <div
                  v-if="selectedDoc?.fileBlobUrl && isPdfDoc(selectedDoc)"
                  class="w-full h-full rounded-lg overflow-hidden border border-slate-300 bg-white flex flex-col"
                >
                  <iframe :src="selectedDoc.fileBlobUrl" class="w-full flex-1 border-0" title="PDF Viewer"></iframe>
                </div>

                <!-- Case B: File Asli Gambar -->
                <div
                  v-else-if="selectedDoc?.fileBlobUrl && isImageDoc(selectedDoc)"
                  class="w-full h-full flex items-center justify-center p-2"
                >
                  <img
                    :src="selectedDoc.fileBlobUrl"
                    :alt="selectedDoc.title"
                    class="max-h-[60vh] max-w-full object-contain rounded-lg border border-slate-300 bg-white p-1"
                  />
                </div>

                <!-- Case C: Belum ada file unggahan (Simple & Clean Message) -->
                <div
                  v-else
                  class="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto"
                >
                  <div class="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-xs mb-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 class="font-sora font-semibold text-slate-700 text-sm">Berkas Belum Diunggah</h4>
                  <p class="text-xs text-slate-500 mt-1">Pendaftar belum mengunggah file untuk dokumen ini.</p>

                  <!-- Catatan Revisi jika ada -->
                  <div v-if="selectedDoc?.notes && selectedDoc?.status === 'revision'" class="w-full mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 text-left">
                    <strong class="font-semibold block mb-0.5">Catatan Revisi:</strong>
                    <span>{{ selectedDoc.notes }}</span>
                  </div>
                </div>
              </div>

              <!-- Sub-Form Revisi jika dibuka -->
              <div
                v-if="isRevisionOpen"
                class="p-4 bg-white border-t border-rose-200 space-y-3 flex-shrink-0"
              >
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-xs text-rose-900">
                    Catatan Perbaikan untuk {{ selectedDoc?.title }}:
                  </span>
                  <button @click="isRevisionOpen = false" class="text-xs text-slate-400 hover:text-slate-700 cursor-pointer">
                    Batal
                  </button>
                </div>

                <div class="flex flex-wrap gap-1.5 text-xs">
                  <button
                    v-for="reason in quickReasons"
                    :key="reason"
                    type="button"
                    @click="revisionNote = reason"
                    class="px-2.5 py-1 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-200 hover:border-rose-200 rounded text-[11px] transition-colors cursor-pointer"
                  >
                    + {{ reason }}
                  </button>
                </div>

                <div class="flex gap-2">
                  <input
                    v-model="revisionNote"
                    type="text"
                    placeholder="Tuliskan instruksi perbaikan spesifik..."
                    class="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-lg text-xs outline-none text-slate-800"
                    @keyup.enter="submitRevision"
                  />
                  <button
                    @click="submitRevision"
                    class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </div>

              <!-- FOOTER AKSI: Presisi & Terstandar (Responsif Mobile) -->
              <div class="px-4 sm:px-5 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 flex-shrink-0">
                <div class="text-[11px] sm:text-xs text-slate-500">
                  <span v-if="selectedDoc?.notes && selectedDoc?.status === 'revision'" class="text-rose-700 truncate max-w-md inline-block">
                    Catatan: {{ selectedDoc.notes }}
                  </span>
                  <span v-else class="hidden xs:inline">
                    Gunakan tombol aksi untuk memverifikasi keabsahan dokumen.
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <!-- Terima Berkas -->
                  <button
                    @click="approveCurrentDoc"
                    class="flex-1 sm:flex-none justify-center px-3.5 py-2 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Terima Berkas</span>
                  </button>

                  <!-- Minta Revisi -->
                  <button
                    @click="toggleRevisionInput"
                    class="flex-1 sm:flex-none justify-center px-3.5 py-2 sm:py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 font-medium text-xs rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Minta Revisi</span>
                  </button>

                  <!-- Berikutnya -->
                  <button
                    @click="selectNextDoc"
                    class="px-3 py-2 sm:py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <span>Berikutnya</span>
                    <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL VERIFIKASI PENGUNDURAN DIRI MAHASISWA (CR-007) -->
    <Teleport to="body">
      <div
        v-if="withdrawalReviewModal.show"
        class="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs z-[110] animate-fadeIn font-sans"
        @click.self="withdrawalReviewModal.show = false"
      >
        <div class="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden font-sans">
          <!-- Header -->
          <div
            class="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
            :class="withdrawalReviewModal.status === 'approved' ? 'bg-emerald-50/60' : 'bg-rose-50/60'"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                :class="withdrawalReviewModal.status === 'approved' ? 'bg-emerald-600' : 'bg-rose-600'"
              >
                <svg v-if="withdrawalReviewModal.status === 'approved'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 class="font-sora font-bold text-sm text-slate-900">
                  {{ withdrawalReviewModal.status === 'approved' ? 'Pengesahan Pengunduran Diri Calon Mahasiswa' : 'Penolakan Pengunduran Diri Calon Mahasiswa' }}
                </h3>
                <p class="text-[11px] text-slate-500 font-sans">
                  {{ withdrawalReviewModal.status === 'approved' ? 'Sahkan permohonan dan nonaktifkan kepesertaan pendaftar secara resmi.' : 'Tolak permohonan dengan memberikan catatan resmi kepada pendaftar.' }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="withdrawalReviewModal.show = false"
              class="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer p-1"
            >
              &times;
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 space-y-4 text-xs">
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 font-sans">
              <div class="flex items-center justify-between">
                <span class="text-slate-500 text-[11px]">Nama Pendaftar:</span>
                <span class="font-sora font-bold text-slate-900">{{ withdrawalReviewModal.item?.candidateName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500 text-[11px]">No. Registrasi & Prodi:</span>
                <span class="font-mono text-slate-700">{{ withdrawalReviewModal.item?.regNo }} • {{ withdrawalReviewModal.item?.prodi }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500 text-[11px]">Kategori Alasan:</span>
                <span class="font-semibold text-slate-800">{{ withdrawalReviewModal.item?.category }}</span>
              </div>
              <div class="pt-1.5 border-t border-slate-200/70 text-slate-600 italic">
                "{{ withdrawalReviewModal.item?.reason }}"
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-700 font-sans">
                <span>Catatan & Pesan Resmi Panitia PMB</span>
                <span v-if="withdrawalReviewModal.status === 'rejected'" class="text-rose-500 ml-1">* (Wajib diisi)</span>
                <span v-else class="text-slate-400 font-normal ml-1">(Akan dicantumkan pada SK & dasbor)</span>
              </label>
              <textarea
                v-model="withdrawalReviewModal.note"
                rows="3"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none transition-colors"
                :placeholder="withdrawalReviewModal.status === 'approved' ? 'Tuliskan catatan pengesahan atau instruksi administratif...' : 'Tuliskan alasan penolakan secara jelas (minimal 5 karakter)...'"
              ></textarea>
              <p class="text-[11px] text-slate-500">
                {{ withdrawalReviewModal.status === 'approved' ? 'Catatan ini tersimpan resmi dan tampil pada dokumen SK pengunduran diri.' : 'Pendaftar akan menerima pemberitahuan beserta catatan penolakan ini.' }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 font-sans">
            <button
              type="button"
              @click="withdrawalReviewModal.show = false"
              :disabled="withdrawalReviewModal.isSubmitting"
              class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmWithdrawalReview"
              :disabled="withdrawalReviewModal.isSubmitting"
              class="px-4 py-2 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              :class="withdrawalReviewModal.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'"
            >
              <span>{{ withdrawalReviewModal.isSubmitting ? 'Memproses...' : (withdrawalReviewModal.status === 'approved' ? 'Sahkan Pengunduran Diri' : 'Kirim Penolakan') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL VERIFIKASI PERMOHONAN PINDAH JALUR (CR-006) -->
    <Teleport to="body">
      <div
        v-if="pathChangeReviewModal.show"
        class="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs z-[110] animate-fadeIn font-sans"
        @click.self="pathChangeReviewModal.show = false"
      >
        <div class="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden font-sans">
          <!-- Header -->
          <div
            class="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
            :class="pathChangeReviewModal.status === 'approved' ? 'bg-blue-50/70' : 'bg-rose-50/60'"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                :class="pathChangeReviewModal.status === 'approved' ? 'bg-[#1E3A8A]' : 'bg-rose-600'"
              >
                <svg v-if="pathChangeReviewModal.status === 'approved'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 class="font-sora font-bold text-sm text-slate-900">
                  {{ pathChangeReviewModal.status === 'approved' ? 'Persetujuan Pindah Jalur Pendaftaran' : 'Penolakan Pindah Jalur Pendaftaran' }}
                </h3>
                <p class="text-[11px] text-slate-500 font-sans">
                  {{ pathChangeReviewModal.status === 'approved' ? 'Setujui perubahan jalur dan alihkan berkas seleksi pendaftar.' : 'Tolak permohonan dengan memberikan catatan alasan resmi.' }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="pathChangeReviewModal.show = false"
              class="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer p-1"
            >
              &times;
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 space-y-4 text-xs">
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 font-sans">
              <div class="flex items-center justify-between">
                <span class="text-slate-500 text-[11px]">Nama Pendaftar:</span>
                <span class="font-sora font-bold text-slate-900">{{ pathChangeReviewModal.item?.candidateName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500 text-[11px]">Jalur Asal:</span>
                <span class="font-medium text-slate-700">{{ pathChangeReviewModal.item?.oldTrack }} ({{ pathChangeReviewModal.item?.oldProdi }})</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500 text-[11px]">Jalur Tujuan:</span>
                <span class="font-bold text-[#1E3A8A]">{{ pathChangeReviewModal.item?.newTrack }} ({{ pathChangeReviewModal.item?.newProdi }})</span>
              </div>
              <div class="pt-1.5 border-t border-slate-200/70 text-slate-600 italic">
                Alasan: "{{ pathChangeReviewModal.item?.reason }}"
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block font-semibold text-slate-700 font-sans">
                <span>Catatan & Pesan Panitia PMB</span>
                <span v-if="pathChangeReviewModal.status === 'rejected'" class="text-rose-500 ml-1">* (Wajib diisi)</span>
                <span v-else class="text-slate-400 font-normal ml-1">(Opsional)</span>
              </label>
              <textarea
                v-model="pathChangeReviewModal.note"
                rows="3"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none transition-colors"
                :placeholder="pathChangeReviewModal.status === 'approved' ? 'Tuliskan catatan persetujuan atau penyesuaian berkas...' : 'Tuliskan alasan penolakan secara jelas (minimal 5 karakter)...'"
              ></textarea>
              <p class="text-[11px] text-slate-500">
                Catatan ini akan tampil pada dasbor pendaftar untuk memberikan kepastian status seleksi.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 font-sans">
            <button
              type="button"
              @click="pathChangeReviewModal.show = false"
              :disabled="pathChangeReviewModal.isSubmitting"
              class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmPathChangeReview"
              :disabled="pathChangeReviewModal.isSubmitting"
              class="px-4 py-2 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              :class="pathChangeReviewModal.status === 'approved' ? 'bg-[#1E3A8A] hover:bg-[#172554]' : 'bg-rose-600 hover:bg-rose-700'"
            >
              <span>{{ pathChangeReviewModal.isSubmitting ? 'Memproses...' : (pathChangeReviewModal.status === 'approved' ? 'Setujui Pindah Jalur' : 'Kirim Penolakan') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useToast } from '@/composables/useToast';

const props = defineProps({
  currentRole: {
    type: String,
    default: 'superadmin',
  },
});

const adminStore = useAdminStore();
const toast = useToast();
const searchQuery = ref('');
const selectedFilter = ref('all');
const activeApplicant = ref(null);
const selectedDoc = ref(null);
const isRevisionOpen = ref(false);
const revisionNote = ref('');

const quickReasons = [
  'Pindaian dokumen buram / tidak terbaca jelas.',
  'Bagian nilai rapor atau nomor identitas terpotong.',
  'Masa berlaku dokumen telah habis / kedaluwarsa.',
  'Surat keterangan sehat belum memenuhi ketentuan institusi.',
  'Berkas yang diunggah bukan dokumen asli atau salah format file.',
];

// Short title for document tabs
const getShortDocTitle = (id) => {
  switch (id) {
    case 'doc-1': return 'Ijazah / SKL';
    case 'doc-2': return 'KTP / Identitas';
    case 'doc-3': return 'Kartu Keluarga';
    case 'doc-4': return 'Pasfoto 4x6';
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
  { id: 'unuploaded', label: 'Belum Unggah' },
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

  const isAllVerified = activeApplicant.value.documents.length > 0 && activeApplicant.value.documents.every((d) => d.status === 'verified');
  const hasRevision = activeApplicant.value.documents.some((d) => d.status === 'revision');
  const hasPending = activeApplicant.value.documents.some((d) => d.status === 'pending');

  if (isAllVerified) {
    activeApplicant.value.documentStatus = 'verified';
  } else if (hasRevision) {
    activeApplicant.value.documentStatus = 'revision';
  } else if (hasPending) {
    activeApplicant.value.documentStatus = 'pending';
  } else if (activeApplicant.value.verifiedDocsCount > 0) {
    activeApplicant.value.documentStatus = 'pending';
  } else {
    activeApplicant.value.documentStatus = 'unuploaded';
  }

  toast.success(
    `Status berkas "${target?.title || 'dokumen'}" berhasil diperbarui menjadi ${status === 'verified' ? 'Terverifikasi' : 'Perlu Perbaikan'}.`
  );
};

// =========================================================================
// CR-006: PERMOHONAN PINDAH JALUR & CR-007: PENGUNDURAN DIRI
// =========================================================================
const activeDeskSubTab = ref('documents');

// Data permohonan pindah jalur & pengunduran diri terhubung ke adminStore (dinamis & persisten)
const pathChangesList = computed(() => adminStore.pathChanges);
const withdrawalsList = computed(() => adminStore.withdrawals);

const isSyncing = ref(false);
const lastSyncText = ref('Baru saja');
let autoSyncTimer = null;

const syncAllDeskData = async (silent = false) => {
  if (!silent) isSyncing.value = true;
  try {
    await Promise.allSettled([
      adminStore.fetchPathChanges(),
      adminStore.fetchWithdrawals(),
      adminStore.fetchBackendApplicants(),
    ]);
    lastSyncText.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (!silent) {
      toast.success('Data permohonan dan berkas pendaftar berhasil disinkronkan.');
    }
  } catch (e) {
    if (!silent) {
      toast.error('Gagal menyinkronkan data.');
    }
  } finally {
    if (!silent) isSyncing.value = false;
  }
};

onMounted(() => {
  syncAllDeskData(true);
  // Auto polling setiap 20 detik agar data permohonan pendaftar masuk secara real-time
  autoSyncTimer = setInterval(() => {
    syncAllDeskData(true);
  }, 20000);
});

onUnmounted(() => {
  if (autoSyncTimer) {
    clearInterval(autoSyncTimer);
    autoSyncTimer = null;
  }
});

const pendingPathChangeCount = computed(() => {
  return pathChangesList.value.filter((p) => p.status === 'pending').length;
});

const pendingWithdrawalCount = computed(() => {
  return withdrawalsList.value.filter((w) => w.status === 'pending').length;
});

// Modal state untuk review pengunduran diri
const withdrawalReviewModal = reactive({
  show: false,
  item: null,
  status: 'approved',
  note: '',
  isSubmitting: false,
});

const openWithdrawalReviewModal = (item, status) => {
  withdrawalReviewModal.item = item;
  withdrawalReviewModal.status = status;
  withdrawalReviewModal.note = status === 'approved'
    ? 'Permohonan pengunduran diri telah disahkan panitia PMB. SK resmi diterbitkan dan status kepesertaan dinonaktifkan.'
    : '';
  withdrawalReviewModal.show = true;
};

const confirmWithdrawalReview = async () => {
  if (!withdrawalReviewModal.item) return;
  if (withdrawalReviewModal.status === 'rejected' && withdrawalReviewModal.note.trim().length < 5) {
    toast.error('Catatan alasan penolakan wajib diisi (minimal 5 karakter).');
    return;
  }

  withdrawalReviewModal.isSubmitting = true;
  try {
    await adminStore.reviewWithdrawal(
      withdrawalReviewModal.item.id,
      withdrawalReviewModal.status,
      withdrawalReviewModal.note.trim()
    );
    if (withdrawalReviewModal.status === 'approved') {
      toast.success(`Pengunduran diri atas nama ${withdrawalReviewModal.item.candidateName} telah resmi disahkan.`);
    } else {
      toast.info(`Permohonan pengunduran diri atas nama ${withdrawalReviewModal.item.candidateName} telah ditolak.`);
    }
    withdrawalReviewModal.show = false;
  } catch (err) {
    toast.error('Gagal memproses permohonan pengunduran diri: ' + (err.message || 'Kesalahan sistem'));
  } finally {
    withdrawalReviewModal.isSubmitting = false;
  }
};

// Modal state untuk review pindah jalur
const pathChangeReviewModal = reactive({
  show: false,
  item: null,
  status: 'approved',
  note: '',
  isSubmitting: false,
});

const openPathChangeReviewModal = (item, status) => {
  pathChangeReviewModal.item = item;
  pathChangeReviewModal.status = status;
  pathChangeReviewModal.note = status === 'approved'
    ? 'Permohonan pindah jalur disetujui. Kuota dan persyaratan administrasi pendaftar telah disesuaikan.'
    : '';
  pathChangeReviewModal.show = true;
};

const confirmPathChangeReview = async () => {
  if (!pathChangeReviewModal.item) return;
  if (pathChangeReviewModal.status === 'rejected' && pathChangeReviewModal.note.trim().length < 5) {
    toast.error('Catatan alasan penolakan wajib diisi (minimal 5 karakter).');
    return;
  }

  pathChangeReviewModal.isSubmitting = true;
  try {
    await adminStore.reviewPathChange(
      pathChangeReviewModal.item.id,
      pathChangeReviewModal.status,
      pathChangeReviewModal.note.trim()
    );
    if (pathChangeReviewModal.status === 'approved') {
      toast.success(`Permohonan pindah jalur atas nama ${pathChangeReviewModal.item.candidateName} (${pathChangeReviewModal.item.newTrack}) berhasil disetujui.`);
    } else {
      toast.info(`Permohonan pindah jalur atas nama ${pathChangeReviewModal.item.candidateName} telah ditolak.`);
    }
    pathChangeReviewModal.show = false;
  } catch (err) {
    toast.error('Gagal memproses permohonan pindah jalur: ' + (err.message || 'Kesalahan sistem'));
  } finally {
    pathChangeReviewModal.isSubmitting = false;
  }
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
