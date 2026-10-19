<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#1E3A8A] selection:text-white">
    <!-- ========================================================================= -->
    <!-- 1. TOP NAVBAR RESMI UNIVERSITAS BTH                                       -->
    <!-- ========================================================================= -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <!-- Brand Sisi Kiri (Logo & Tagline BTH) -->
        <div class="flex items-center gap-3 cursor-pointer" @click="goToList">
          <img
            :src="cmsStore.identity.emblemUrl || '/assets/icons/bth-logo.svg'"
            :alt="cmsStore.identity.name || 'Logo Universitas Bakti Tunas Husada'"
            class="h-11 w-auto object-contain flex-shrink-0"
            onerror="this.src='/assets/icons/bth-emblem.png'"
          />
          <div class="flex flex-col">
            <h1 class="text-base sm:text-lg font-sora font-bold text-gray-900 leading-tight">
              {{ cmsStore.identity.name || 'Universitas Bakti Tunas Husada' }}
            </h1>
            <small class="font-sora font-semibold text-gray-500 text-[11px] leading-tight">
              <i>{{ cmsStore.identity.tagline || 'Transforming New Generation' }}</i>
            </small>
          </div>
        </div>

        <!-- Profil Sisi Kanan (Akun Login & Dropdown) -->
        <div class="relative">
          <button
            type="button"
            @click="isProfileDropdownOpen = !isProfileDropdownOpen"
            class="flex items-center gap-3 text-gray-700 hover:text-gray-900 focus:outline-none transition p-1.5 rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            <div class="hidden sm:flex flex-col text-right">
              <span class="text-xs font-semibold text-gray-800">{{ currentUserDisplayName }}</span>
              <span class="text-[11px] text-gray-500 font-mono">{{ currentUserDisplayEmail }}</span>
            </div>
            <div class="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-sora font-bold text-xs text-gray-700 shadow-xs">
              {{ userInitials }}
            </div>
          </button>

          <!-- Dropdown Menu Profil -->
          <div
            v-if="isProfileDropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1"
          >
            <div class="px-3 py-2 border-b border-gray-100 sm:hidden">
              <div class="text-xs font-bold text-gray-800">{{ currentUserDisplayName }}</div>
              <div class="text-[10px] text-gray-500 font-mono truncate">{{ currentUserDisplayEmail }}</div>
            </div>

            <button
              type="button"
              @click="goToList"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition text-left cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>Daftar Pengelolaan</span>
            </button>

            <a
              :href="cmsStore.links.bkWaGroup || 'https://chat.whatsapp.com/BTH-MitraGuruBK2026'"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition text-left font-medium"
            >
              <svg class="w-4 h-4 fill-current text-emerald-600 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Forum WhatsApp Mitra BK</span>
            </a>

            <div class="border-t border-gray-100 my-1"></div>

            <button
              type="button"
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg transition text-left cursor-pointer font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- ========================================================================= -->
    <!-- 2. KONTEN UTAMA SESUAI ALUR (DAFTAR PENGELOLAAN & DETAIL REFERAL)          -->
    <!-- ========================================================================= -->
    <main class="flex-grow py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Banner WhatsApp Guru BK (Clean, Minimalis, Tanpa Gradient/Dot/Neon) -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div class="space-y-0.5">
            <h2 class="text-sm font-semibold text-slate-900 font-sora">
              Forum Koordinasi Guru BK
            </h2>
            <p class="text-xs text-slate-500 font-sans">
              Kanal komunikasi dan koordinasi resmi mitra sekolah dengan panitia PMB Universitas BTH.
            </p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <a
              :href="cmsStore.links.bkWaGroup || 'https://chat.whatsapp.com/BTH-MitraGuruBK2026'"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sans text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <svg class="w-4 h-4 fill-current text-white flex-shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Buka Grup WhatsApp</span>
            </a>
          </div>
        </div>

        <!-- ===================================================================== -->
        <!-- VIEW 1: DAFTAR PENGELOLAAN (LIST CARD REFERAL)                       -->
        <!-- ===================================================================== -->
        <div v-if="currentView === 'list'" class="space-y-4">
          <div class="flex items-center justify-between">
            <h1 class="font-sora font-bold text-lg text-slate-900">
              Daftar Kode Referal Sekolah
            </h1>
            <span class="text-xs text-slate-500 font-sans">
              {{ activeReferralsList.length }} sekolah mitra terdaftar
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="referal in activeReferralsList"
              :key="referal.id"
              class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div class="space-y-3">
                <!-- Header Kartu -->
                <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h2 class="font-sora font-bold text-base text-slate-900 leading-tight">
                      {{ referal.institution || referal.schoolName }}
                    </h2>
                    <p class="text-xs text-slate-500 mt-0.5 font-sans">
                      {{ referal.schoolCity || 'Mitra PMB Universitas BTH' }}
                    </p>
                  </div>
                  <span
                    class="px-2.5 py-0.5 rounded text-[11px] font-semibold border flex-shrink-0"
                    :class="referal.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
                  >
                    {{ referal.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-2 gap-3 text-xs font-sans">
                  <div>
                    <span class="text-slate-500 text-[11px] block">Kode Referal:</span>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                        {{ referal.code }}
                      </span>
                      <button
                        type="button"
                        @click="copyCode(referal.code)"
                        class="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer transition"
                        title="Salin Kode"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 16h8M8 12h8m-8-4h8m-2-4H6a2 2 0 00-2 2v12a2 2 0 002 2h8l6-6V6a2 2 0 00-2-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span class="text-slate-500 text-[11px] block">Guru BK / PIC:</span>
                    <span class="font-medium text-slate-800 mt-0.5 block truncate">
                      {{ referal.picName || '-' }}
                    </span>
                  </div>

                  <div>
                    <span class="text-slate-500 text-[11px] block">Pendaftar Terhubung:</span>
                    <span class="font-bold text-slate-900 mt-0.5 block">
                      {{ getStudentCount(referal) }} Siswa
                    </span>
                  </div>

                  <div>
                    <span class="text-slate-500 text-[11px] block">Hak Komisi:</span>
                    <span class="font-semibold text-slate-800 mt-0.5 block">
                      {{ referal.commissionType === 'percentage' || referal.commissionType === 'persen' ? referal.commissionValue + '% / siswa' : 'Rp ' + formatRupiah(referal.commissionValue || 50000) + ' / siswa' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Footer Tombol -->
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[11px] text-slate-500 font-sans">
                  Wilayah: <strong class="text-slate-700">{{ referal.schoolCity || 'Jawa Barat' }}</strong>
                </span>
                <button
                  type="button"
                  @click="openDetail(referal)"
                  class="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  Lihat Detail
                </button>
              </div>
            </div>

            <!-- Jika Kosong -->
            <div v-if="activeReferralsList.length === 0" class="col-span-full bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
              Belum ada data kode referal sekolah yang terdaftar pada akun ini.
            </div>
          </div>
        </div>

        <!-- ===================================================================== -->
        <!-- VIEW 2: DETAIL KODE REFERAL (CLEAN & TERSTRUKTUR)                    -->
        <!-- ===================================================================== -->
        <div v-else-if="currentView === 'detail' && selectedReferal" class="space-y-5">
          <!-- Header Bar: Navigasi Kembali & Identitas Mitra -->
          <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="goToList"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Kembali ke Daftar Sekolah"
              >
                <span>&larr;</span>
                <span>Kembali</span>
              </button>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="font-sora font-bold text-base sm:text-lg text-slate-900 leading-tight">
                    {{ selectedReferal.schoolName || selectedReferal.institution }}
                  </h1>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-semibold border"
                    :class="selectedReferal.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
                  >
                    {{ selectedReferal.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-sans mt-0.5">
                  Kode Referal: <strong class="font-mono text-slate-800">{{ selectedReferal.code }}</strong>
                  <span class="mx-1.5 text-slate-300">•</span>
                  PIC: <strong class="text-slate-800">{{ selectedReferal.picName }}</strong> ({{ selectedReferal.picPhone || '-' }})
                  <span class="mx-1.5 text-slate-300">•</span>
                  Kota: {{ selectedReferal.schoolCity || '-' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
              <button
                type="button"
                @click="copyCode(selectedReferal.code)"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 16h8M8 12h8m-8-4h8m-2-4H6a2 2 0 00-2 2v12a2 2 0 002 2h8l6-6V6a2 2 0 00-2-2z" />
                </svg>
                <span>Salin Kode</span>
              </button>
            </div>
          </div>

          <!-- Metrik Ringkas: 5 Kartu Seragam & Bersih (Tanpa Warna-Warni / Tanpa Dot / Tanpa AI Tags) -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div class="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
              <span class="text-xs text-slate-500 font-medium">Total Pendaftar</span>
              <div class="my-1">
                <span class="text-lg sm:text-xl font-bold font-mono text-slate-900">
                  {{ getStudentCount(selectedReferal) }} Siswa
                </span>
              </div>
              <span class="text-[11px] text-slate-500">
                {{ financialSummary.verifiedCount }} pembayaran lunas
              </span>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
              <span class="text-xs text-slate-500 font-medium">Penerimaan Bruto</span>
              <div class="my-1">
                <span class="text-lg sm:text-xl font-bold font-mono text-slate-900">
                  Rp {{ formatRupiah(financialSummary.totalGross) }}
                </span>
              </div>
              <span class="text-[11px] text-slate-500">
                Biaya formulir siswa
              </span>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
              <span class="text-xs text-slate-500 font-medium">Hak Komisi Guru BK</span>
              <div class="my-1">
                <span class="text-lg sm:text-xl font-bold font-mono text-slate-900">
                  Rp {{ formatRupiah(financialSummary.totalCommission) }}
                </span>
              </div>
              <span class="text-[11px] text-slate-500">
                {{ financialSummary.commissionType === 'percentage' || financialSummary.commissionType === 'persen' ? financialSummary.commissionValue + '% per transaksi' : 'Rp ' + formatRupiah(financialSummary.commissionValue) + ' / siswa' }}
              </span>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
              <span class="text-xs text-slate-500 font-medium">Kewajiban Setor Netto</span>
              <div class="my-1">
                <span class="text-lg sm:text-xl font-bold font-mono text-slate-900">
                  Rp {{ formatRupiah(financialSummary.netPayableToCampus) }}
                </span>
              </div>
              <span class="text-[11px] text-slate-500">
                Bruto dikurangi komisi
              </span>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
              <span class="text-xs text-slate-500 font-medium">Sisa Siap Disetor</span>
              <div class="my-1">
                <span class="text-lg sm:text-xl font-bold font-mono text-slate-900">
                  Rp {{ formatRupiah(financialSummary.remainingToSettle) }}
                </span>
              </div>
              <span class="text-[11px] text-slate-500">
                {{ financialSummary.remainingToSettle > 0 ? 'Perlu disetor ke kampus' : 'Setoran lunas' }}
              </span>
            </div>
          </div>

          <!-- Tab Navigasi Konten Utama & Tombol Aksi -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <!-- Tabs -->
              <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto overflow-x-auto no-scrollbar max-w-full">
                <button
                  type="button"
                  @click="detailTab = 'students'"
                  class="px-3.5 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  :class="detailTab === 'students' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  Data Siswa Pendaftar ({{ filteredStudents.length }})
                </button>
                <button
                  type="button"
                  @click="detailTab = 'settlements'"
                  class="px-3.5 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  :class="detailTab === 'settlements' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  Riwayat Setoran Kampus ({{ (financialSummary.settlements || []).length }})
                </button>
              </div>

              <!-- Tombol Ajukan Setoran -->
              <button
                type="button"
                @click="openSettlementModal"
                class="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Ajukan Setoran ke Kampus</span>
              </button>
            </div>

            <!-- TAB 1: DATA SISWA PENDAFTAR -->
            <div v-if="detailTab === 'students'" class="p-4 sm:p-5 space-y-4">
              <!-- Bar Pencarian & Ekspor -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="relative w-full sm:w-72">
                  <input
                    v-model="searchKeyword"
                    type="text"
                    placeholder="Cari nama, email, NIK, prodi..."
                    @keyup.enter="applySearch"
                    class="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] text-xs text-slate-900 bg-white placeholder:text-slate-400 font-sans"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.8"
                    stroke="currentColor"
                    class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>

                <button
                  type="button"
                  @click="exportStudentList"
                  class="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  title="Unduh Data Siswa ke CSV"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-3.5 h-3.5 text-slate-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Ekspor CSV</span>
                </button>
              </div>

              <!-- Mobile Cards (< md) -->
              <div class="block md:hidden divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                <div
                  v-for="(student, index) in filteredStudents"
                  :key="student.id || index"
                  class="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <!-- Top Row: Student Name & Payment Status Badge -->
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="font-sora font-bold text-slate-900 text-xs">{{ student.name }}</div>
                      <div class="text-[11px] text-slate-500 mt-0.5">{{ student.email }}</div>
                    </div>
                    <span
                      v-if="student.status_approve === 'SUCCESS'"
                      class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap"
                    >
                      Lunas
                    </span>
                    <span
                      v-else-if="student.status_approve === 'pending' || student.status_approve === 'panding'"
                      class="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap"
                    >
                      Menunggu Verifikasi
                    </span>
                    <span
                      v-else-if="student.status_approve === 'REJECTED'"
                      class="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap"
                    >
                      Ditolak
                    </span>
                    <span
                      v-else
                      class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap"
                    >
                      Belum Bayar
                    </span>
                  </div>

                  <!-- Details Grid -->
                  <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div class="flex justify-between items-center text-slate-600">
                      <span class="text-[11px]">Program Studi:</span>
                      <strong class="text-slate-800 text-xs">{{ student.prodi || '-' }}</strong>
                    </div>
                    <div class="flex justify-between items-center text-slate-600">
                      <span class="text-[11px]">NIK / NISN:</span>
                      <span class="font-mono text-slate-700 text-xs">{{ student.nik || student.nisn || '-' }}</span>
                    </div>
                    <div class="flex justify-between items-center pt-1 border-t border-slate-200/60">
                      <span class="text-[11px] text-slate-600">Biaya Formulir:</span>
                      <span class="font-mono font-bold text-slate-900 text-xs">
                        Rp {{ formatRupiah(student.nominal || 0) }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions (if pending) -->
                  <div
                    v-if="student.status_approve === 'pending' || student.status_approve === 'panding'"
                    class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2"
                  >
                    <button
                      type="button"
                      @click="handleApprove(student)"
                      class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition cursor-pointer text-center"
                    >
                      Setujui
                    </button>
                    <button
                      type="button"
                      @click="handleReject(student)"
                      class="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium transition cursor-pointer text-center"
                    >
                      Tolak
                    </button>
                  </div>
                </div>

                <div v-if="filteredStudents.length === 0" class="p-8 text-center text-slate-500 text-xs">
                  Belum ada siswa pendaftar yang menggunakan kode referal ini.
                </div>
              </div>

              <!-- Tabel Siswa (>= md) -->
              <div class="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
                <table class="w-full border-collapse text-xs">
                  <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th class="px-3.5 py-2.5 text-center w-12">#</th>
                      <th class="px-3.5 py-2.5 text-left">Nama Siswa</th>
                      <th class="px-3.5 py-2.5 text-left">Email / Kontak</th>
                      <th class="px-3.5 py-2.5 text-left">Program Studi</th>
                      <th class="px-3.5 py-2.5 text-center">NIK / NISN</th>
                      <th class="px-3.5 py-2.5 text-right font-mono">Nominal Biaya</th>
                      <th class="px-3.5 py-2.5 text-center">Status Pembayaran</th>
                      <th class="px-3.5 py-2.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-sans">
                    <tr
                      v-for="(student, index) in filteredStudents"
                      :key="student.id || index"
                      class="hover:bg-slate-50 transition-colors"
                    >
                      <td class="px-3.5 py-2.5 text-center text-slate-400 font-mono">{{ index + 1 }}</td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap font-medium text-slate-900">
                        {{ student.name }}
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-slate-600">
                        {{ student.email }}
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-slate-700">
                        {{ student.prodi || '-' }}
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-center text-slate-500 font-mono">
                        {{ student.nik || student.nisn || '-' }}
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-right font-medium text-slate-900 font-mono">
                        Rp {{ formatRupiah(student.nominal || 0) }}
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-center">
                        <span
                          v-if="student.status_approve === 'SUCCESS'"
                          class="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          Lunas
                        </span>
                        <span
                          v-else-if="student.status_approve === 'pending' || student.status_approve === 'panding'"
                          class="px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200"
                        >
                          Menunggu Verifikasi
                        </span>
                        <span
                          v-else-if="student.status_approve === 'REJECTED'"
                          class="px-2.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200"
                        >
                          Ditolak
                        </span>
                        <span
                          v-else
                          class="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          Belum Bayar
                        </span>
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-center">
                        <div
                          v-if="student.status_approve === 'pending' || student.status_approve === 'panding'"
                          class="flex items-center justify-center gap-1.5"
                        >
                          <button
                            type="button"
                            @click="handleApprove(student)"
                            class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            @click="handleReject(student)"
                            class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-medium transition cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                        <span v-else class="text-slate-400 font-mono text-xs">
                          -
                        </span>
                      </td>
                    </tr>
                    <tr v-if="filteredStudents.length === 0">
                      <td colspan="8" class="px-4 py-8 text-center text-slate-500 text-xs">
                        Belum ada siswa pendaftar yang menggunakan kode referal ini.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 2: RIWAYAT SETORAN KAMPUS -->
            <div v-else-if="detailTab === 'settlements'" class="p-4 sm:p-5 space-y-4">
              <!-- Banner Notifikasi Setoran Menunggu Verifikasi (Clean, Tanpa Emoji/Warna-Warni) -->
              <div
                v-if="financialSummary.settledSubmitted > 0"
                class="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs text-slate-700"
              >
                <span>
                  Terdapat setoran sebesar <strong>Rp {{ formatRupiah(financialSummary.settledSubmitted) }}</strong> dalam antrean verifikasi Biro Keuangan Kampus.
                </span>
                <span class="text-[11px] font-semibold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded">
                  Menunggu Verifikasi
                </span>
              </div>

              <!-- Mobile Cards (< md) -->
              <div class="block md:hidden divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                <div
                  v-for="(st, idx) in financialSummary.settlements"
                  :key="st.id || idx"
                  class="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <!-- Top Row: Reference No & Status -->
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="font-mono font-bold text-slate-900 text-xs">{{ st.referenceNo }}</div>
                      <div class="text-[11px] text-slate-500 mt-0.5">{{ st.transferDate }}</div>
                    </div>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-semibold border whitespace-nowrap"
                      :class="st.status === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : (st.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200')"
                    >
                      {{ st.status === 'VERIFIED' ? 'Disetujui' : (st.status === 'REJECTED' ? 'Ditolak' : 'Menunggu Verifikasi') }}
                    </span>
                  </div>

                  <!-- Bank & Amount Details -->
                  <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div class="flex justify-between items-center text-slate-600">
                      <span class="text-[11px]">Bank Pengirim:</span>
                      <strong class="text-slate-800 text-xs">{{ st.bankName }}</strong>
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono">Tujuan: Rek. PMB Kampus BTH</div>
                    <div class="flex justify-between items-center pt-1 border-t border-slate-200/60">
                      <span class="text-[11px] text-slate-600">Nominal Setoran:</span>
                      <span class="font-mono font-bold text-slate-900 text-xs">
                        Rp {{ formatRupiah(st.amount) }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="button"
                      @click="previewProofModalUrl = st.proofUrl"
                      class="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-xs font-medium transition cursor-pointer text-center"
                    >
                      Lihat Bukti Transfer
                    </button>
                  </div>
                </div>

                <div v-if="!financialSummary.settlements || financialSummary.settlements.length === 0" class="p-8 text-center text-slate-500 text-xs">
                  Belum ada riwayat pengajuan setoran untuk kode ini.
                </div>
              </div>

              <!-- Tabel Setoran (>= md) -->
              <div class="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
                <table class="w-full border-collapse text-xs">
                  <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th class="px-3.5 py-2.5 text-center w-12">#</th>
                      <th class="px-3.5 py-2.5 text-left">Tanggal Transfer</th>
                      <th class="px-3.5 py-2.5 text-left">No. Resi / Referensi</th>
                      <th class="px-3.5 py-2.5 text-left">Bank Pengirim & Rekening Tujuan</th>
                      <th class="px-3.5 py-2.5 text-right font-mono">Nominal Netto</th>
                      <th class="px-3.5 py-2.5 text-center">Bukti Transfer</th>
                      <th class="px-3.5 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-sans">
                    <tr
                      v-for="(st, idx) in financialSummary.settlements"
                      :key="st.id || idx"
                      class="hover:bg-slate-50 transition"
                    >
                      <td class="px-3.5 py-2.5 text-center text-slate-400 font-mono">{{ idx + 1 }}</td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-slate-700">{{ st.transferDate }}</td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap font-mono font-medium text-slate-800">{{ st.referenceNo }}</td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-slate-600">
                        <div>{{ st.bankName }}</div>
                        <div class="text-[11px] text-slate-400 font-mono">Ke Rek. PMB Kampus BTH</div>
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-right font-mono font-bold text-slate-900">
                        Rp {{ formatRupiah(st.amount) }}
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-center">
                        <button
                          type="button"
                          @click="previewProofModalUrl = st.proofUrl"
                          class="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[11px] font-medium transition cursor-pointer"
                        >
                          Lihat Bukti
                        </button>
                      </td>
                      <td class="px-3.5 py-2.5 whitespace-nowrap text-center">
                        <span
                          class="px-2.5 py-0.5 rounded text-[11px] font-medium border"
                          :class="st.status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : (st.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200')"
                        >
                          {{ st.status === 'VERIFIED' ? 'Disetujui' : (st.status === 'REJECTED' ? 'Ditolak' : 'Menunggu Verifikasi') }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!financialSummary.settlements || financialSummary.settlements.length === 0">
                      <td colspan="7" class="px-4 py-8 text-center text-slate-500 text-xs">
                        Belum ada riwayat pengajuan setoran untuk kode ini.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ========================================================================= -->
    <!-- 3. FOOTER RESMI PMB UNIVERSITAS BTH                                       -->
    <!-- ========================================================================= -->
    <footer class="bg-white border-t border-slate-200 py-4 px-4 text-center">
      <small class="text-slate-500 font-sans text-xs">
        Copyright &copy; 2026 - Sistem Penerimaan Mahasiswa Baru Universitas BTH
      </small>
    </footer>

    <!-- ========================================================================= -->
    <!-- MODAL TELEPORT: AJUKAN SETORAN KE KAMPUS (BERSIH & FORMAL)                -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div
        v-if="showSettlementModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm"
        @click.self="showSettlementModal = false"
      >
        <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden my-auto">
          <!-- Header Modal -->
          <div class="p-5 pb-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-base">
                Ajukan Setoran Dana PMB ke Kampus
              </h3>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Kode Referal: <strong class="text-slate-800 font-mono">{{ selectedReferal?.code }}</strong> • {{ selectedReferal?.schoolName }}
              </p>
            </div>
            <button
              type="button"
              @click="showSettlementModal = false"
              class="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Body -->
          <form @submit.prevent="submitSettlementToCampus" class="p-5 space-y-4 text-xs font-sans flex-1 overflow-y-auto">
            <!-- Ringkasan Finansial Singkat -->
            <div class="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center text-xs">
              <div>
                <div class="text-[11px] text-slate-500">Total Bruto</div>
                <div class="font-mono font-bold text-slate-900 mt-0.5">Rp {{ formatRupiah(financialSummary.totalGross) }}</div>
              </div>
              <div>
                <div class="text-[11px] text-slate-500">Hak Komisi BK</div>
                <div class="font-mono font-bold text-slate-900 mt-0.5">- Rp {{ formatRupiah(financialSummary.totalCommission) }}</div>
              </div>
              <div>
                <div class="text-[11px] text-slate-500 font-semibold">Wajib Setor Netto</div>
                <div class="font-mono font-bold text-slate-900 mt-0.5">Rp {{ formatRupiah(financialSummary.netPayableToCampus) }}</div>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Nominal yang Ditransfer (Netto) *</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono font-bold">Rp</span>
                  <input
                    v-model.number="settlementForm.amount"
                    type="number"
                    min="10000"
                    required
                    class="w-full pl-10 pr-3.5 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono text-sm font-bold text-slate-900 bg-white"
                  />
                </div>
                <span class="text-[10px] text-gray-500 mt-0.5 block">
                  Sisa tagihan yang belum disetor: Rp {{ formatRupiah(financialSummary.remainingToSettle) }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Tanggal Transfer *</label>
                  <input
                    v-model="settlementForm.transferDate"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] bg-white text-xs"
                  />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Bank Pengirim *</label>
                  <input
                    v-model="settlementForm.bankName"
                    required
                    placeholder="Contoh: BSI / Mandiri / BRI"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Rekening Tujuan Kampus *</label>
                <select
                  v-model="settlementForm.targetCampusBank"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] bg-white text-xs"
                >
                  <option value="BSI (Bank Syariah Indonesia) - 7142998812 a.n PMB Universitas BTH">
                    BSI (Bank Syariah Indonesia) - 7142998812 a.n PMB Universitas BTH
                  </option>
                  <option value="Bank Mandiri - 131-00-9988776-5 a.n Universitas Bakti Tunas Husada">
                    Bank Mandiri - 131-00-9988776-5 a.n Universitas Bakti Tunas Husada
                  </option>
                  <option value="Bank BNI - 088-7766-5544 a.n Universitas BTH PMB">
                    Bank BNI - 088-7766-5544 a.n Universitas BTH PMB
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">No. Referensi / Resi Transfer *</label>
                <input
                  v-model="settlementForm.referenceNo"
                  required
                  placeholder="Contoh: TRX-BSI-982314 / Nomor Jurnal Struk"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] font-mono text-xs bg-white"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Unggah Bukti Struk / Slip Transfer *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  @change="handleProofFileUpload"
                  class="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] text-xs bg-slate-50"
                />
                <div v-if="settlementForm.proofUrl" class="mt-2 flex items-center gap-2">
                  <img :src="settlementForm.proofUrl" alt="Preview Bukti" class="w-12 h-12 object-cover rounded-md border border-slate-300 shadow-2xs" />
                  <span class="text-[11px] text-emerald-700 font-medium">✓ Bukti transfer siap dikirim</span>
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  v-model="settlementForm.notes"
                  placeholder="Keterangan gelombang / rincian siswa"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E3A8A] bg-white text-xs"
                />
              </div>
            </div>

            <!-- Footer Modal Buttons -->
            <div class="pt-3 border-t border-slate-100 flex justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                @click="showSettlementModal = false"
                class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Kirim Bukti Setoran</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL PREVIEW BUKTI TRANSFER -->
      <div
        v-if="previewProofModalUrl"
        class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="previewProofModalUrl = ''"
      >
        <div class="bg-white rounded-xl max-w-lg w-full p-4 overflow-hidden shadow-xl border border-slate-200 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 class="font-sora font-semibold text-sm text-slate-900">Bukti Transfer Setoran Kampus</h4>
            <button
              type="button"
              @click="previewProofModalUrl = ''"
              class="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex justify-center bg-slate-50 rounded-lg p-2 max-h-[70vh] overflow-auto border border-slate-200">
            <img :src="previewProofModalUrl" alt="Bukti Transfer" class="max-w-full max-h-[60vh] object-contain rounded" />
          </div>
          <div class="text-right">
            <button
              type="button"
              @click="previewProofModalUrl = ''"
              class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useReferralStore } from '@/stores/referral';
import { useCmsStore } from '@/stores/cms';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const referralStore = useReferralStore();
const cmsStore = useCmsStore();
const toast = useToast();

const currentView = ref('list'); // 'list' | 'detail'
const detailTab = ref('students'); // 'students' | 'settlements'
const selectedReferalCode = ref('');
const searchKeyword = ref('');
const isProfileDropdownOpen = ref(false);

// Objek referal yang dipilih (Reaktif langsung dari Pinia store tanpa circular dependency)
const selectedReferal = computed(() => {
  if (!selectedReferalCode.value) return null;
  return referralStore.findReferralByCode(selectedReferalCode.value) || null;
});

// Profil Pengguna Aktif
const currentUserDisplayName = computed(() => {
  if (selectedReferal.value?.picName) return selectedReferal.value.picName;
  if (authStore.currentUser && authStore.currentUser.role !== 'applicant') {
    return authStore.currentUser.name || authStore.currentUser.full_name;
  }
  return (
    referralStore.currentBkSession?.picName ||
    'Drs. Hendra Permana, M.Pd.'
  );
});

const currentUserDisplayEmail = computed(() => {
  if (selectedReferal.value?.email) return selectedReferal.value.email;
  if (authStore.currentUser && authStore.currentUser.role !== 'applicant') {
    return authStore.currentUser.email;
  }
  return (
    referralStore.currentBkSession?.email ||
    'bk.polos@sekolah.sch.id'
  );
});

const userInitials = computed(() => {
  const name = currentUserDisplayName.value;
  if (!name) return 'KR';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

// Daftar referal yang dikelola oleh user aktif
const activeReferralsList = computed(() => {
  const userEmail = currentUserDisplayEmail.value;
  return referralStore.getReferralsForUser(userEmail);
});

// Rincian Keuangan Reaktif untuk Detail BK
const financialSummary = computed(() => {
  return referralStore.getFinancialSummary(selectedReferal.value);
});

// Modal Ajukan Setoran ke Kampus
const showSettlementModal = ref(false);
const previewProofModalUrl = ref('');
const settlementForm = ref({
  amount: 0,
  transferDate: new Date().toISOString().split('T')[0],
  bankName: 'Bank Syariah Indonesia (BSI)',
  accountNumber: '',
  targetCampusBank: 'BSI (Bank Syariah Indonesia) - 7142998812 a.n PMB Universitas BTH',
  referenceNo: '',
  proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
  notes: '',
});

const openSettlementModal = () => {
  const fin = financialSummary.value;
  settlementForm.value = {
    amount: fin.remainingToSettle > 0 ? fin.remainingToSettle : (fin.netPayableToCampus || 250000),
    transferDate: new Date().toISOString().split('T')[0],
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '',
    targetCampusBank: 'BSI (Bank Syariah Indonesia) - 7142998812 a.n PMB Universitas BTH',
    referenceNo: `TRX-${Date.now().toString().slice(-6)}`,
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    notes: `Setoran pendaftaran siswa kode ${selectedReferal.value?.code || ''}`,
  };
  showSettlementModal.value = true;
};

const handleProofFileUpload = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      settlementForm.value.proofUrl = event.target?.result;
    };
    reader.readAsDataURL(file);
  }
};

const submitSettlementToCampus = () => {
  if (!selectedReferal.value) return;
  if (!settlementForm.value.amount || settlementForm.value.amount <= 0) {
    toast.error('Nominal setoran harus lebih dari 0.');
    return;
  }
  if (!settlementForm.value.referenceNo.trim()) {
    toast.error('Nomor referensi / resi transfer wajib diisi.');
    return;
  }

  const fin = financialSummary.value;
  const res = referralStore.submitSettlement({
    referralCode: selectedReferal.value.code,
    amount: settlementForm.value.amount,
    grossAmount: fin.totalGross,
    commissionAmount: fin.totalCommission,
    transferDate: settlementForm.value.transferDate,
    bankName: settlementForm.value.bankName,
    accountNumber: settlementForm.value.accountNumber,
    referenceNo: settlementForm.value.referenceNo,
    proofUrl: settlementForm.value.proofUrl,
    notes: settlementForm.value.notes,
  });

  if (res.success) {
    toast.success('Pengajuan setoran berhasil dikirim ke Biro Keuangan Kampus!');
    showSettlementModal.value = false;
  } else {
    toast.error(res.message || 'Gagal mengirim pengajuan setoran.');
  }
};

// Total pengguna untuk kartu referal
const getStudentCount = (referal) => {
  if (Array.isArray(referal?.students) && referal.students.length > 0) {
    return referal.students.length;
  }
  return referal?.registeredCount || 0;
};

// Filter daftar siswa pada halaman detail
const filteredStudents = computed(() => {
  if (!selectedReferal.value || !Array.isArray(selectedReferal.value.students)) {
    return [];
  }
  const query = searchKeyword.value.trim().toLowerCase();
  if (!query) {
    return selectedReferal.value.students;
  }
  return selectedReferal.value.students.filter(
    (s) =>
      (s.name && s.name.toLowerCase().includes(query)) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.nik && String(s.nik).includes(query)) ||
      (s.nisn && String(s.nisn).includes(query)) ||
      (s.prodi && s.prodi.toLowerCase().includes(query))
  );
});

// Navigasi ke Detail
const openDetail = (referal) => {
  selectedReferalCode.value = referal.code;
  currentView.value = 'detail';
  detailTab.value = 'students';
  searchKeyword.value = '';
  isProfileDropdownOpen.value = false;
  // Sinkronkan ke URL query param
  router.replace({ path: '/bk', query: { code: referal.code } });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Kembali ke List
const goToList = () => {
  selectedReferalCode.value = '';
  currentView.value = 'list';
  detailTab.value = 'students';
  searchKeyword.value = '';
  isProfileDropdownOpen.value = false;
  router.replace({ path: '/bk' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Salin Kode Referal / Kode Pembayaran
const copyCode = async (text) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`Kode "${text}" berhasil disalin!`);
  } catch {
    toast.info(`Kode: ${text}`);
  }
};

// Filter Pencarian
const applySearch = () => {
  if (searchKeyword.value.trim()) {
    toast.info(`Menampilkan hasil pencarian untuk: "${searchKeyword.value}"`);
  }
};

// Approval & Rejection Pembayaran Siswa
const handleApprove = (student) => {
  if (!selectedReferal.value) return;
  const ok = referralStore.approveStudentPayment(selectedReferal.value.code, student.id);
  if (ok) {
    toast.success(`Pembayaran ${student.name} berhasil disetujui.`);
  }
};

const handleReject = (student) => {
  if (!selectedReferal.value) return;
  const ok = referralStore.rejectStudentPayment(selectedReferal.value.code, student.id);
  if (ok) {
    toast.warning(`Pembayaran ${student.name} telah ditolak.`);
  }
};

// Ekspor Daftar Siswa Pengguna Kode ke CSV
const exportStudentList = () => {
  if (!selectedReferal.value || !Array.isArray(selectedReferal.value.students) || selectedReferal.value.students.length === 0) {
    toast.info('Belum ada data siswa untuk diekspor.');
    return;
  }
  const headers = ['No', 'Nama Siswa', 'Email', 'NIK', 'NISN', 'Program Studi', 'Nominal (Rp)', 'Status Pembayaran'];
  const rows = selectedReferal.value.students.map((s, i) => {
    const statusText = s.status_approve === 'SUCCESS'
      ? 'Lunas'
      : (s.status_approve === 'pending' || s.status_approve === 'panding'
        ? 'Menunggu Verifikasi'
        : (s.status_approve === 'REJECTED' ? 'Ditolak' : 'Belum Bayar'));
    return [
      i + 1,
      `"${s.name || '-'}"`,
      `"${s.email || '-'}"`,
      `'${s.nik || '-'}'`,
      `'${s.nisn || '-'}'`,
      `"${s.prodi || '-'}"`,
      Number(s.nominal || 0),
      `"${statusText}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `data_siswa_${selectedReferal.value.code}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success(`Data siswa pengguna kode ${selectedReferal.value.code} berhasil diunduh (CSV).`);
};

// Logout
const handleLogout = () => {
  isProfileDropdownOpen.value = false;
  referralStore.logoutBk();
  authStore.clearAuth();
  toast.info('Sesi akun Guru BK telah diakhiri.');
  router.push('/login');
};

// Format Rupiah
const formatRupiah = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return Number(val).toLocaleString('id-ID');
};

// Pantau perubahan query param kode referal secara reaktif
watch(
  () => route.query.code,
  (newCode) => {
    if (newCode) {
      const clean = String(newCode).trim().toUpperCase();
      const found = referralStore.findReferralByCode(clean);
      if (found) {
        selectedReferalCode.value = found.code;
        currentView.value = 'detail';
      }
    }
  },
  { immediate: true }
);

// Inisialisasi dari Query Param jika ada, atau auto-select jika akun khusus 1 kode
onMounted(() => {
  const codeParam =
    route.query.code ||
    authStore.currentUser?.code ||
    referralStore.currentBkSession?.code;
  if (codeParam) {
    const clean = String(codeParam).trim().toUpperCase();
    const found = referralStore.findReferralByCode(clean);
    if (found) {
      selectedReferalCode.value = found.code;
      currentView.value = 'detail';
    }
  } else if (activeReferralsList.value.length === 1) {
    selectedReferalCode.value = activeReferralsList.value[0].code;
    currentView.value = 'detail';
  }

  // Realtime Cross-Tab, Cross-Window, & InPrivate Synchronization
  referralStore.syncFromSharedServer();
  const syncInterval = setInterval(() => {
    referralStore.syncFromSharedServer();
  }, 3000);

  const handleWindowFocus = () => {
    referralStore.syncFromSharedServer();
    referralStore.reloadFromStorage();
  };
  window.addEventListener('focus', handleWindowFocus);

  const handleStorageChange = (e) => {
    if (
      e.key === 'bth_pmb_referrals_v2' ||
      e.key === 'bth_bk_session' ||
      (e.key && e.key.startsWith('bth_applicant_v3_'))
    ) {
      referralStore.reloadFromStorage();
    }
  };
  const handleReferralUpdated = () => {
    referralStore.reloadFromStorage();
  };
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('bth_referral_updated', handleReferralUpdated);

  // Tutup dropdown jika klik di luar
  const handleClickOutside = (e) => {
    if (!e.target.closest('.relative')) {
      isProfileDropdownOpen.value = false;
    }
  };
  window.addEventListener('click', handleClickOutside);

  onBeforeUnmount(() => {
    clearInterval(syncInterval);
    window.removeEventListener('focus', handleWindowFocus);
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('bth_referral_updated', handleReferralUpdated);
    window.removeEventListener('click', handleClickOutside);
  });
});
</script>
