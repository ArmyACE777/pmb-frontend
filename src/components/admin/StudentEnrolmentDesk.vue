<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Penerbitan NIM & Registrasi Mahasiswa Baru
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Penetapan Nomor Induk Mahasiswa resmi, pembagian gugus PKKMB 2026, dan aktivasi akun SIAKAD.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <button
          @click="handleExportSevima"
          class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          title="Unduh seluruh data calon mahasiswa dalam format 62 kolom SEVIMA"
        >
          <FileSpreadsheet class="w-3.5 h-3.5" />
          <span>Ekspor SEVIMA (.xls)</span>
        </button>

        <button
          @click="showImportModal = true"
          class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          title="Unggah berkas migrasi SEVIMA untuk impor massal"
        >
          <Upload class="w-3.5 h-3.5 text-slate-500" />
          <span>Impor Data SEVIMA</span>
        </button>
      </div>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari mahasiswa, No. Registrasi, NIM..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white rounded-lg text-xs outline-none text-slate-800 transition-colors"
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
          class="px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
          :class="selectedFilter === filter.id
            ? 'bg-[#1E3A8A] text-white font-semibold'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Mobile Card View (< md) -->
    <div class="block md:hidden space-y-3">
      <div
        v-if="currentRole === 'superadmin' && filteredApplicants.some(a => a.payments.uktFee.status === 'paid' && !a.onboarding.nim)"
        class="pb-1"
      >
        <button
          @click="runAutoSync"
          class="w-full py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
        >
          Sinkronkan Semua yang Lunas
        </button>
      </div>

      <div
        v-for="applicant in filteredApplicants"
        :key="'mobile-' + applicant.id"
        class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="font-mono font-bold text-xs text-[#1E3A8A]">{{ applicant.id }}</div>
            <div class="font-sora font-bold text-slate-900 text-sm mt-0.5">{{ applicant.fullName }}</div>
            <div class="text-[11px] text-slate-500">{{ applicant.prodi1 }}</div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap inline-block"
              :class="applicant.payments.uktFee.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'"
            >
              UKT: {{ applicant.payments.uktFee.status === 'paid' ? 'Lunas' : 'Belum' }}
            </span>
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap inline-block"
              :class="applicant.selection.passedStatus === 'passed' ? 'bg-blue-50 text-[#1E3A8A] border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'"
            >
              {{ applicant.selection.passedStatus === 'passed' ? 'Lulus Seleksi' : 'Evaluasi' }}
            </span>
          </div>
        </div>

        <!-- Detail NIM & Gugus PKKMB (2 Kolom Ringkas) -->
        <div class="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-xs">
          <div class="border-r border-slate-200 pr-2">
            <div class="text-[10px] text-slate-400 font-medium">NIM Terbit</div>
            <div v-if="applicant.onboarding.nim" class="font-mono font-bold text-slate-900 mt-0.5">
              {{ applicant.onboarding.nim }}
            </div>
            <div v-else class="text-[11px] text-slate-400 italic mt-0.5">Belum Terbit</div>
          </div>
          <div class="pl-1">
            <div class="text-[10px] text-slate-400 font-medium">Gugus PKKMB</div>
            <div v-if="applicant.onboarding.pkkmbGroup" class="font-medium text-slate-800 mt-0.5">
              {{ applicant.onboarding.pkkmbGroup }}
            </div>
            <div v-else class="text-[11px] text-slate-400 italic mt-0.5">Belum Diplot</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="applicant.onboarding.nim"
            @click="openEnrolModal(applicant)"
            class="flex-1 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
          >
            Lihat / Koreksi Data
          </button>
          <button
            v-else-if="applicant.selection.passedStatus === 'passed' && applicant.payments.uktFee.status === 'paid'"
            @click="generateApplicantNimDirectly(applicant)"
            class="flex-1 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
          >
            Terbitkan NIM Sekarang
          </button>
          <div
            v-else
            class="flex-1 text-center text-[11px] text-slate-400 italic py-1"
          >
            NIM otomatis diterbitkan saat UKT lunas
          </div>

          <button
            @click="confirmDeleteApplicant(applicant)"
            class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Hapus Akun Mahasiswa"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="filteredApplicants.length === 0" class="py-10 text-center text-slate-400 bg-white rounded-xl border border-slate-200 p-6">
        <p class="text-xs">Belum ada mahasiswa yang sesuai kriteria.</p>
      </div>
    </div>

    <!-- Banner Informasi Otomatisasi Sistem -->
    <div class="bg-gradient-to-r from-blue-50/90 to-emerald-50/90 border border-blue-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5 sm:mt-0">
          NIM
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="font-sora font-bold text-xs sm:text-sm text-slate-900">
              Penerbitan NIM Otomatis (T.A. 2026/2027)
            </h4>
          </div>
          <p class="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            NIM dan Gugus PKKMB diterbitkan otomatis seketika mahasiswa melunasi UKT Semester 1.
          </p>
        </div>
      </div>
      <button
        v-if="currentRole === 'superadmin'"
        @click="runAutoSync"
        class="self-start sm:self-auto px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center shrink-0 shadow-2xs flex items-center gap-1.5"
      >
        <span>Sinkronkan Semua yang Lunas</span>
      </button>
    </div>

    <!-- Desktop Enrolment Table (>= md) -->
    <div class="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-sora font-bold text-slate-900 text-sm">
            Daftar Calon Mahasiswa Terdaftar & Siap Terbit NIM
          </h3>
          <p class="text-[11px] text-slate-500">
            NIM terbit otomatis sesuai urutan sequence program studi & langsung siap diekspor ke format SEVIMA.
          </p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700 min-w-[880px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] tracking-wider whitespace-nowrap">
            <tr>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[130px]">No. Registrasi</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[200px]">Nama Mahasiswa & Prodi</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[120px]">Status Seleksi</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[110px]">Status UKT</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[150px]">NIM Diterbitkan</th>
              <th class="py-3.5 px-4 font-bold whitespace-nowrap min-w-[150px]">Gugus PKKMB 2026</th>
              <th class="py-3.5 px-4 font-bold text-right whitespace-nowrap min-w-[120px]">Aksi / Koreksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr
              v-for="applicant in filteredApplicants"
              :key="applicant.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <!-- Reg -->
              <td class="py-3.5 px-4 font-mono font-bold text-[#1E3A8A] whitespace-nowrap">
                {{ applicant.id }}
              </td>

              <!-- Name & Prodi -->
              <td class="py-3.5 px-4 min-w-[200px]">
                <div class="font-sora font-bold text-slate-900 whitespace-nowrap">{{ applicant.fullName }}</div>
                <div class="text-[11px] text-slate-500 whitespace-nowrap">{{ applicant.prodi1 }}</div>
              </td>

              <!-- Selection -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  class="text-xs font-medium whitespace-nowrap inline-flex items-center gap-1"
                  :class="applicant.selection.passedStatus === 'passed' ? 'text-emerald-700 font-semibold' : 'text-slate-600'"
                >
                  <span v-if="applicant.selection.passedStatus === 'passed'" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {{ applicant.selection.passedStatus === 'passed' ? 'Lulus Seleksi' : 'Dalam Evaluasi' }}
                </span>
              </td>

              <!-- UKT Status -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  class="text-xs font-medium whitespace-nowrap inline-flex items-center gap-1"
                  :class="applicant.payments.uktFee.status === 'paid' ? 'text-emerald-700 font-semibold' : 'text-slate-500'"
                >
                  <span v-if="applicant.payments.uktFee.status === 'paid'" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {{ applicant.payments.uktFee.status === 'paid' ? 'Lunas' : 'Belum Lunas' }}
                </span>
              </td>

              <!-- NIM -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div v-if="applicant.onboarding.nim">
                  <span class="font-mono font-bold text-xs text-slate-900 bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2 py-0.5 rounded shadow-2xs">
                    {{ applicant.onboarding.nim }}
                  </span>
                </div>
                <div v-else-if="applicant.selection.passedStatus === 'passed' && applicant.payments.uktFee.status === 'paid'" class="inline-flex items-center gap-1 text-blue-600 font-medium text-[11px]">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                  <span>Siap Terbit</span>
                </div>
                <span v-else class="text-[11px] text-slate-400 italic whitespace-nowrap">Menunggu Lunas UKT</span>
              </td>

              <!-- PKKMB Group -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span v-if="applicant.onboarding.pkkmbGroup" class="text-xs text-slate-800 font-medium whitespace-nowrap">
                  {{ applicant.onboarding.pkkmbGroup }}
                </span>
                <span v-else class="text-[11px] text-slate-400 italic whitespace-nowrap">Diplot saat Lunas</span>
              </td>

              <!-- Action -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-1.5 justify-end">
                  <button
                    v-if="applicant.onboarding.nim"
                    @click="openEnrolModal(applicant)"
                    class="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    Lihat / Koreksi Data
                  </button>
                  <button
                    v-else-if="applicant.selection.passedStatus === 'passed' && applicant.payments.uktFee.status === 'paid'"
                    @click="generateApplicantNimDirectly(applicant)"
                    class="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    Terbitkan Sekarang
                  </button>
                  <span
                    v-else
                    class="text-[11px] text-slate-400 italic"
                  >
                    Saat Lunas UKT
                  </span>

                  <button
                    @click="confirmDeleteApplicant(applicant)"
                    class="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 rounded transition-colors cursor-pointer shadow-2xs"
                    title="Hapus Akun Mahasiswa"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredApplicants.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400">
                <div class="max-w-xs mx-auto space-y-2">
                  <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Mahasiswa Terdaftar</div>
                  <p class="text-xs text-slate-400">Belum ada calon mahasiswa yang melunasi UKT atau diterbitkan NIM.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Enrolment Cards (< md) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="applicant in filteredApplicants"
        :key="applicant.id"
        class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
      >
        <!-- Header: No Reg & Status Badges -->
        <div class="flex items-start justify-between gap-2">
          <div>
            <span class="font-mono font-bold text-xs text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 inline-block">
              {{ applicant.id }}
            </span>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-1.5">
            <span
              class="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              :class="applicant.selection.passedStatus === 'passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'"
            >
              {{ applicant.selection.passedStatus === 'passed' ? 'Lulus' : 'Evaluasi' }}
            </span>
            <span
              class="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              :class="applicant.payments.uktFee.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
            >
              {{ applicant.payments.uktFee.status === 'paid' ? 'Lunas UKT' : 'Belum Lunas' }}
            </span>
          </div>
        </div>

        <!-- Candidate Info -->
        <div>
          <h4 class="font-sora font-bold text-slate-900 text-sm leading-snug">{{ applicant.fullName }}</h4>
          <p class="text-xs text-slate-500 mt-0.5">{{ applicant.prodi1 }}</p>
        </div>

        <!-- Academic Metadata: NIM & Gugus -->
        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block font-sora">NIM Mahasiswa</span>
            <span v-if="applicant.onboarding.nim" class="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-block mt-0.5">
              {{ applicant.onboarding.nim }}
            </span>
            <span v-else-if="applicant.selection.passedStatus === 'passed' && applicant.payments.uktFee.status === 'paid'" class="text-[11px] text-blue-600 font-medium inline-flex items-center gap-1 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              <span>Siap Terbit</span>
            </span>
            <span v-else class="text-[11px] text-slate-400 italic block mt-0.5">Menunggu UKT</span>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block font-sora">Gugus PKKMB 2026</span>
            <span v-if="applicant.onboarding.pkkmbGroup" class="text-xs text-slate-800 font-medium block mt-0.5 truncate" :title="applicant.onboarding.pkkmbGroup">
              {{ applicant.onboarding.pkkmbGroup }}
            </span>
            <span v-else class="text-[11px] text-slate-400 italic block mt-0.5">Diplot saat Lunas</span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            @click="confirmDeleteApplicant(applicant)"
            class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Hapus Akun Mahasiswa"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>

          <div class="flex items-center gap-2">
            <button
              v-if="applicant.onboarding.nim"
              @click="openEnrolModal(applicant)"
              class="w-full sm:w-auto px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center shadow-2xs"
            >
              Lihat / Koreksi Data
            </button>
            <button
              v-else-if="applicant.selection.passedStatus === 'passed' && applicant.payments.uktFee.status === 'paid'"
              @click="generateApplicantNimDirectly(applicant)"
              class="w-full sm:w-auto px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center shadow-2xs"
            >
              Terbitkan NIM Sekarang
            </button>
            <span
              v-else
              class="text-[11px] text-slate-400 italic"
            >
              Menunggu Pelunasan UKT
            </span>
          </div>
        </div>
      </div>

      <div v-if="filteredApplicants.length === 0" class="py-10 bg-white rounded-xl border border-slate-200 text-center text-slate-400 p-6 space-y-2">
        <p class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Mahasiswa Terdaftar</p>
        <p class="text-xs text-slate-400">Belum ada calon mahasiswa yang melunasi UKT atau diterbitkan NIM.</p>
      </div>
    </div>

    <!-- Modal Generate NIM & Gugus -->
    <Teleport to="body">
      <div
        v-if="activeApplicant"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="activeApplicant = null"
      >
        <div class="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 relative my-auto max-h-[90vh] overflow-y-auto">
        <button
          @click="activeApplicant = null"
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-xl font-bold leading-none cursor-pointer"
        >
          &times;
        </button>

        <div class="pb-3 border-b border-slate-200 mb-4">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Penetapan Nomor Induk Mahasiswa (NIM)
          </div>
          <h3 class="font-sora font-bold text-lg text-slate-900 mt-0.5">
            {{ activeApplicant.fullName }}
          </h3>
          <div class="text-xs text-slate-500">
            {{ activeApplicant.prodi1 }} | TA 2026/2027
          </div>
        </div>

        <form @submit.prevent="saveNim" class="space-y-4 text-xs">
          <div>
            <label class="block font-medium text-slate-700 mb-1">Nomor Induk Mahasiswa (NIM)</label>
            <input
              v-model="formNim"
              type="text"
              maxlength="10"
              required
              class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-lg outline-none text-slate-900 font-mono font-bold text-base"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              Standar BTH: 26 (Angkatan 2026) + Kode Fakultas/Prodi + No Urut.
            </p>
          </div>

          <div>
            <label class="block font-medium text-slate-700 mb-1">Kelompok Gugus Orientasi (PKKMB 2026)</label>
            <select
              v-model="formGroup"
              class="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#1E3A8A] rounded-lg outline-none text-slate-800"
            >
              <option value="Gugus 01 - Hygeia Farmasi">Gugus 01 - Hygeia Farmasi</option>
              <option value="Gugus 02 - Galen Kefarmasian">Gugus 02 - Galen Kefarmasian</option>
              <option value="Gugus 03 - Hygeia Farmasi">Gugus 03 - Hygeia Farmasi</option>
              <option value="Gugus 05 - Asklepios Kesehatan">Gugus 05 - Asklepios Kesehatan</option>
              <option value="Gugus 07 - Turing Informatika">Gugus 07 - Turing Informatika</option>
              <option value="Gugus 08 - Lovelace Komputer">Gugus 08 - Lovelace Komputer</option>
            </select>
          </div>

          <div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="confirmDeleteApplicant(activeApplicant)"
              class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              title="Hapus Akun Mahasiswa"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Hapus Akun</span>
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="activeApplicant = null"
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Simpan & Terbitkan NIM
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- MODAL IMPOR MASSAL DATA FORMAT SEVIMA -->
  <Teleport to="body">
    <div
      v-if="showImportModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn font-sans"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header Modal -->
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-sora font-bold text-sm text-slate-900">
                Impor Data Biodata Pendaftar Format SEVIMA
              </h3>
              <p class="text-[11px] text-slate-500">
                Sesuai standar template 62 kolom (kolom hijau wajib terisi).
              </p>
            </div>
          </div>
          <button
            @click="closeImportModal"
            class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body Modal -->
        <div class="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <!-- Step 1: Upload Box -->
          <div
            class="border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer"
            :class="isDragging ? 'border-[#1E3A8A] bg-blue-50/50' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            @click="triggerFileInput"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept=".csv,.txt,.xls,.xlsx"
              class="hidden"
              @change="handleFileInputChange"
            />
            <Upload class="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div class="font-medium text-slate-700">
              Klik atau tarik file CSV / Excel format SEVIMA ke sini
            </div>
            <div class="text-[10px] text-slate-400 mt-1">
              Mendukung file .csv (pemisah titik-koma / koma) & tabel SEVIMA
            </div>
          </div>

          <!-- Pratinjau Hasil Pembacaan -->
          <div v-if="importParseResult" class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-3">
                <span class="font-bold text-slate-800 whitespace-nowrap">Ringkasan Validasi:</span>
                <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap inline-block">
                  {{ importParseResult.validCount }} Valid (Siap Impor)
                </span>
                <span v-if="importParseResult.invalidCount > 0" class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 whitespace-nowrap inline-block">
                  {{ importParseResult.invalidCount }} Tidak Valid
                </span>
              </div>
              <button
                type="button"
                @click="downloadSevimaTemplate"
                class="text-[11px] text-[#1E3A8A] font-semibold hover:underline"
              >
                Unduh Template Kosong
              </button>
            </div>

            <!-- Error List jika ada baris yang hilang kolom wajib -->
            <div v-if="importParseResult.errors.length > 0" class="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <div class="font-bold text-rose-900 text-[11px]">Peringatan Kolom Wajib Hijau Kosong:</div>
              <div v-for="(err, idx) in importParseResult.errors" :key="idx" class="text-[10px] text-rose-700">
                • {{ err.message }}
              </div>
            </div>

            <!-- Preview Data Sample -->
            <div class="border border-slate-200 rounded-xl overflow-x-auto">
              <table class="w-full text-left text-[11px]">
                <thead class="bg-slate-100 text-slate-700 sticky top-0 font-semibold border-b border-slate-200">
                  <tr>
                    <th class="p-2">No</th>
                    <th class="p-2">Kode Pendaftar</th>
                    <th class="p-2">Nama Pendaftar</th>
                    <th class="p-2">L/P</th>
                    <th class="p-2">Tgl Lahir</th>
                    <th class="p-2">Program</th>
                    <th class="p-2">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr v-for="rec in importParseResult.records.slice(0, 15)" :key="rec.rowNumber">
                    <td class="p-2 text-slate-400 font-mono">{{ rec.rowNumber }}</td>
                    <td class="p-2 font-mono font-bold text-[#1E3A8A]">{{ rec.data.registrationNumber || '-' }}</td>
                    <td class="p-2 font-medium text-slate-800">{{ rec.data.fullName || '-' }}</td>
                    <td class="p-2">{{ rec.data.gender || '-' }}</td>
                    <td class="p-2 font-mono text-[10px]">{{ rec.data.birthDate || '-' }}</td>
                    <td class="p-2">{{ rec.data.programType || 'IPA' }}</td>
                    <td class="p-2">
                      <span
                        class="px-1.5 py-0.5 rounded text-[9px] font-bold"
                        :class="rec.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                      >
                        {{ rec.isValid ? 'Valid' : 'Kolom Wajib Kosong' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer Modal -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            @click="downloadSevimaTemplate"
            class="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Unduh Format Blanko SEVIMA (.xls)
          </button>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="closeImportModal"
              class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="commitSevimaImport"
              :disabled="!importParseResult || importParseResult.validCount === 0 || isImporting"
              class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {{ isImporting ? 'Mengimpor Data...' : `Simpan ${importParseResult?.validCount || 0} Data ke Sistem` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal Konfirmasi Hapus Akun Mahasiswa -->
  <DeleteStudentModal
    v-model="showDeleteModal"
    :student="studentToDelete"
    @deleted="handleStudentDeleted"
  />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useToast } from '@/composables/useToast';
import { PRODI_METADATA } from '@/stores/applicant';
import { FileSpreadsheet, Upload, X, Trash2 } from 'lucide-vue-next';
import { exportToSevimaMigrationExcel, parseSevimaImportContent } from '@/utils/exportHelper';
import DeleteStudentModal from '@/components/admin/DeleteStudentModal.vue';

const props = defineProps({
  currentRole: {
    type: String,
    default: 'superadmin',
  },
});

const adminStore = useAdminStore();
const toast = useToast();
const activeApplicant = ref(null);
const formNim = ref('');
const formGroup = ref('Gugus 01 - Hygeia Farmasi');
const searchQuery = ref('');
const selectedFilter = ref('all');

// Delete Student State
const showDeleteModal = ref(false);
const studentToDelete = ref(null);

const confirmDeleteApplicant = (applicant) => {
  studentToDelete.value = applicant;
  showDeleteModal.value = true;
};

const handleStudentDeleted = (student) => {
  if (activeApplicant.value && student && activeApplicant.value.id === student.id) {
    activeApplicant.value = null;
  }
};

// Import SEVIMA States
const showImportModal = ref(false);
const fileInputRef = ref(null);
const isDragging = ref(false);
const importParseResult = ref(null);
const isImporting = ref(false);

const handleExportSevima = () => {
  const list = adminStore.applicants || [];
  if (list.length === 0) {
    toast.error('Belum ada data pendaftar untuk diekspor.');
    return;
  }
  exportToSevimaMigrationExcel({
    filename: `Format_Migrasi_SEVIMA_PMB_BTH_${new Date().toISOString().split('T')[0]}`,
    applicants: list,
  });
  toast.success(`Berhasil mengekspor ${list.length} pendaftar ke format tabel migrasi SEVIMA.`);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileInputChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    readFileContent(file);
  }
};

const handleFileDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file) {
    readFileContent(file);
  }
};

const readFileContent = (file) => {
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const text = evt.target.result;
      const res = parseSevimaImportContent(text);
      importParseResult.value = res;
      toast.success(`File terbaca: ${res.validCount} baris valid siap diimpor.`);
    } catch (err) {
      toast.error(err.message || 'Gagal memproses file. Pastikan format CSV/tabel valid.');
    }
  };
  reader.readAsText(file);
};

const closeImportModal = () => {
  showImportModal.value = false;
  importParseResult.value = null;
};

const downloadSevimaTemplate = () => {
  exportToSevimaMigrationExcel({
    filename: 'Template_Kosong_Migrasi_SEVIMA_PMB_BTH',
    applicants: [],
  });
  toast.info('Template blanko 62-kolom SEVIMA berhasil diunduh.');
};

const commitSevimaImport = () => {
  if (!importParseResult.value || importParseResult.value.validCount === 0) return;
  isImporting.value = true;
  try {
    let importedCount = 0;
    const validRecords = importParseResult.value.records.filter((r) => r.isValid);
    validRecords.forEach((r) => {
      const d = r.data;
      const newApp = {
        id: d.registrationNumber || `BTH-2026-REG-${Math.floor(10000 + Math.random() * 90000)}`,
        fullName: d.fullName,
        email: d.email || `${d.fullName.toLowerCase().replace(/\s+/g, '.') || 'pendaftar'}@bth.ac.id`,
        phone: d.phone || '081234567890',
        prodi1: d.prodiChoice1 || 'S1 Farmasi',
        status: 'registered',
        isVerified: true,
        candidate: {
          fullName: d.fullName,
          nik: d.nik,
          birthPlace: d.birthPlace,
          birthDate: d.birthDate,
          gender: d.gender === 'P' ? 'Perempuan' : 'Laki-laki',
          schoolName: d.schoolName || 'SMA/SMK Mitra',
          schoolMajor: d.majorName || 'IPA',
          graduationYear: d.graduationYear || '2025',
          programType: d.programType || 'IPA',
          lastEducation: d.lastEducation || 'SMA',
          institutionType: d.institutionType || '7',
          almamaterSize: d.almamaterSize || 'L',
        },
        selection: {
          passedStatus: 'passed',
        },
        payments: {
          registrationFee: { status: 'paid', amount: 250000 },
          uktFee: { status: 'paid', amount: 5000000 },
        },
        onboarding: {
          nim: d.nim || '',
          pkkmbGroup: 'Gugus 01 - Hygeia Farmasi',
        },
      };
      adminStore.applicants.unshift(newApp);
      importedCount++;
    });
    adminStore.syncAllLocalApplicants();
    toast.success(`Berhasil mengimpor ${importedCount} data pendaftar baru dari format SEVIMA!`);
    closeImportModal();
  } catch (err) {
    toast.error('Terjadi kendala saat menyimpan data impor.');
  } finally {
    isImporting.value = false;
  }
};

const filters = [
  { id: 'all', label: 'Semua Mahasiswa' },
  { id: 'enrolled', label: 'Sudah Ada NIM' },
  { id: 'eligible', label: 'Siap Terbit NIM' },
  { id: 'unpaid', label: 'Menunggu UKT' },
];

const filteredApplicants = computed(() => {
  return adminStore.applicants.filter((applicant) => {
    // Status filter
    if (selectedFilter.value === 'enrolled') {
      if (!applicant.onboarding?.nim) return false;
    } else if (selectedFilter.value === 'eligible') {
      if (applicant.selection?.passedStatus !== 'passed' || applicant.payments?.uktFee?.status !== 'paid' || applicant.onboarding?.nim) {
        return false;
      }
    } else if (selectedFilter.value === 'unpaid') {
      if (applicant.payments?.uktFee?.status === 'paid') return false;
    }

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = (applicant.fullName || '').toLowerCase().includes(q);
      const matchId = (applicant.id || '').toLowerCase().includes(q);
      const matchNim = (applicant.onboarding?.nim || '').toLowerCase().includes(q);
      const matchProdi = (applicant.prodi1 || '').toLowerCase().includes(q);
      return matchName || matchId || matchNim || matchProdi;
    }
    return true;
  });
});

const openEnrolModal = (applicant) => {
  activeApplicant.value = applicant;
  const meta = PRODI_METADATA[applicant.prodi1] || { code: '01', gugus: 'Gugus 01 - Hygeia Farmasi' };
  const regSuffix = (applicant.id || '').replace(/\D/g, '').slice(-4) || '1001';

  let jalurDigit = '1';
  const track = (applicant.track || '').toLowerCase();
  if (track.includes('prestasi') || track.includes('pmdk')) jalurDigit = '2';
  else if (track.includes('beasiswa') || track.includes('kip')) jalurDigit = '3';
  else if (track.includes('pindahan')) jalurDigit = '4';

  formNim.value = applicant.onboarding?.nim || `26${meta.code}${jalurDigit}${regSuffix.padStart(4, '0')}`;
  formGroup.value = applicant.onboarding?.pkkmbGroup || meta.gugus;
};

const saveNim = () => {
  if (!activeApplicant.value) return;
  adminStore.generateNim(activeApplicant.value.id, formNim.value, formGroup.value);
  toast.success(`Nomor Induk Mahasiswa (${formNim.value}) berhasil diterbitkan untuk ${activeApplicant.value.fullName}.`);
  activeApplicant.value = null;
};

const generateApplicantNimDirectly = (applicant) => {
  const nim = adminStore.autoGenerateNimForApplicant(applicant);
  toast.success(`NIM ${nim} berhasil diterbitkan otomatis untuk ${applicant.fullName}.`);
};

const runAutoSync = () => {
  const count = adminStore.syncAutoEnrollAllEligible();
  if (count > 0) {
    toast.success(`Berhasil menerbitkan NIM otomatis untuk ${count} calon mahasiswa baru.`);
  } else {
    toast.info('Semua calon mahasiswa yang telah Lulus & Lunas UKT sudah memiliki NIM resmi.');
  }
};

const generateAllEligible = () => {
  runAutoSync();
};

onMounted(() => {
  // Jalankan auto-enrolment seketika meja kerja dibuka untuk memastikan seluruh pendaftar yang lunas langsung memiliki NIM
  adminStore.syncAutoEnrollAllEligible();
});
</script>
