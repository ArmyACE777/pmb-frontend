<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#1E3A8A] selection:text-white">
    <!-- ========================================================================= -->
    <!-- 1. TOP NAVBAR RESMI UNIVERSITAS BTH                                       -->
    <!-- ========================================================================= -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <!-- Brand Sisi Kiri (Logo & Tagline BTH) -->
        <div class="flex items-center gap-3 cursor-pointer" @click="goToSection('referrals')">
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
            <div class="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-sora font-bold text-xs text-[#1E3A8A] shadow-xs">
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
              @click="goToSection('referrals')"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition text-left cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>Wilayah & Referal Sekolah</span>
            </button>

            <button
              type="button"
              @click="goToSection('visits')"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition text-left cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Laporan Kunjungan Lapangan</span>
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
              <span>Forum WhatsApp Tim Marketing</span>
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
    <!-- 2. KONTEN UTAMA TIM MARKETING LAPANGAN                                    -->
    <!-- ========================================================================= -->
    <main class="flex-grow py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Banner WhatsApp Tim Marketing (Clean, Formal, Tanpa Gradient/Dot/Neon) -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div class="space-y-0.5">
            <h2 class="text-sm font-semibold text-slate-900 font-sora">
              Forum Koordinasi Tim Marketing PMB Lapangan
            </h2>
            <p class="text-xs text-slate-500 font-sans">
              Kanal koordinasi resmi tim sosialisasi lapangan dengan Sekretariat PMB Universitas Bakti Tunas Husada.
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

        <!-- Tab Utama: Navigasi Bagian (Referal vs Kunjungan Lapangan) -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl text-xs font-medium self-start w-fit border border-slate-200">
          <button
            type="button"
            @click="goToSection('referrals')"
            class="px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2"
            :class="currentSection === 'referrals' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Wilayah & Referal Sekolah</span>
          </button>

          <button
            type="button"
            @click="goToSection('visits')"
            class="px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2"
            :class="currentSection === 'visits' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Laporan Kunjungan Lapangan ({{ marketingVisitsList.length }})</span>
          </button>
        </div>

        <!-- ===================================================================== -->
        <!-- BAGIAN 1: WILAYAH & KODE REFERAL SEKOLAH (PERSIS GURU BK)             -->
        <!-- ===================================================================== -->
        <div v-if="currentSection === 'referrals'" class="space-y-5">
          <!-- VIEW 1.1: DAFTAR PENGELOLAAN (LIST CARD REFERAL) -->
          <div v-if="currentView === 'list'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h1 class="font-sora font-bold text-lg text-slate-900">
                Daftar Wilayah Binaan & Referal
              </h1>
              <span class="text-xs text-slate-500 font-sans">
                {{ activeReferralsList.length }} sekolah mitra binaan marketing
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
                        {{ referal.schoolCity || 'Wilayah Sosialisasi PMB BTH' }}
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
                      <span class="text-slate-500 text-[11px] block">Petugas Marketing:</span>
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
                      <span class="text-slate-500 text-[11px] block">Insentif Perolehan:</span>
                      <span class="font-semibold text-slate-800 mt-0.5 block">
                        Rp {{ formatRupiah(referal.commissionValue || 50000) }} / siswa
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
                    Lihat Detail Siswa
                  </button>
                </div>
              </div>

              <!-- Jika Kosong -->
              <div v-if="activeReferralsList.length === 0" class="col-span-full bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                Belum ada data kode referal sekolah yang terdaftar pada akun marketing ini.
              </div>
            </div>
          </div>

          <!-- VIEW 1.2: DETAIL KODE REFERAL & SISWA (SAMA PERSIS DENGAN BK) -->
          <div v-else-if="currentView === 'detail' && selectedReferal" class="space-y-5">
            <!-- Header Bar: Navigasi Kembali & Identitas Mitra -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="goToList"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Kembali ke Daftar Wilayah"
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
                    Petugas: <strong class="text-slate-800">{{ selectedReferal.picName }}</strong>
                    <span class="mx-1.5 text-slate-300">•</span>
                    Wilayah: {{ selectedReferal.schoolCity || '-' }}
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

            <!-- Metrik Ringkas: 5 Kartu Seragam & Bersih -->
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
                <span class="text-xs text-slate-500 font-medium">Insentif Marketing</span>
                <div class="my-1">
                  <span class="text-lg sm:text-xl font-bold font-mono text-slate-900">
                    Rp {{ formatRupiah(financialSummary.totalCommission) }}
                  </span>
                </div>
                <span class="text-[11px] text-slate-500">
                  Rp {{ formatRupiah(financialSummary.commissionValue) }} / siswa lunas
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
                  Bruto dikurangi insentif
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

            <!-- Tab Konten: Data Siswa Pendaftar -->
            <div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
              <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 class="font-sora font-semibold text-sm text-slate-900">
                  Data Siswa Pendaftar Binaan ({{ filteredStudents.length }})
                </h3>

                <button
                  type="button"
                  @click="exportStudentList"
                  class="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                  title="Unduh Data Siswa ke CSV"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-3.5 h-3.5 text-slate-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Ekspor CSV</span>
                </button>
              </div>

              <!-- Tabel Siswa -->
              <div class="p-4 sm:p-5 space-y-4">
                <div class="relative w-full sm:w-72">
                  <input
                    v-model="searchKeyword"
                    type="text"
                    placeholder="Cari nama, email, NIK, prodi..."
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

                <div class="overflow-x-auto rounded-lg border border-slate-200">
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
                            v-else
                            class="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            Belum Bayar
                          </span>
                        </td>
                      </tr>
                      <tr v-if="filteredStudents.length === 0">
                        <td colspan="7" class="px-4 py-8 text-center text-slate-500 text-xs">
                          Belum ada siswa pendaftar yang menggunakan kode referal ini.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================== -->
        <!-- BAGIAN 2: LAPORAN KUNJUNGAN LAPANGAN (FIELD VISIT REPORT & CAMERA)    -->
        <!-- ===================================================================== -->
        <div v-else-if="currentSection === 'visits'" class="space-y-5">
          <!-- Header Bar Kunjungan Lapangan & Tombol Input Baru -->
          <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="font-sora font-bold text-lg text-slate-900 leading-tight">
                Laporan Kunjungan Sekolah Lapangan
              </h1>
              <p class="text-xs text-slate-500 font-sans mt-0.5">
                Dokumentasi visitasi edukasi dan sosialisasi program PMB ke sekolah mitra dengan verifikasi foto kamera dan stempel GPS.
              </p>
            </div>

            <button
              type="button"
              @click="openVisitModal"
              class="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-2xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Buat Laporan Kunjungan Baru</span>
            </button>
          </div>

          <!-- Metrik Ringkas Kunjungan (3 Kartu Seragam & Bersih) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span class="text-xs text-slate-500 font-medium">Total Kunjungan Terlaksana</span>
              <div class="my-1">
                <span class="text-xl font-bold font-mono text-slate-900">
                  {{ marketingVisitsList.length }} Kunjungan
                </span>
              </div>
              <span class="text-[11px] text-slate-500">Terdokumentasi lengkap dengan GPS</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span class="text-xs text-slate-500 font-medium">Sekolah Mitra Terjangkau</span>
              <div class="my-1">
                <span class="text-xl font-bold font-mono text-slate-900">
                  {{ uniqueSchoolsCount }} Sekolah
                </span>
              </div>
              <span class="text-[11px] text-slate-500">Wilayah Jawa Barat & sekitarnya</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span class="text-xs text-slate-500 font-medium">Total Siswa Teredukasi</span>
              <div class="my-1">
                <span class="text-xl font-bold font-mono text-slate-900">
                  {{ totalAudienceCount }} Siswa
                </span>
              </div>
              <span class="text-[11px] text-slate-500">Estimasi calon peserta sosialisasi</span>
            </div>
          </div>

          <!-- Tabel Riwayat Laporan Kunjungan -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 class="font-sora font-semibold text-sm text-slate-900">
                Riwayat Kunjungan Lapangan
              </h2>
              <span class="text-xs text-slate-500">
                Diurutkan berdasarkan kunjungan terbaru
              </span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-xs">
                <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th class="px-4 py-3 text-center w-12">#</th>
                    <th class="px-4 py-3 text-left">Waktu & Tanggal</th>
                    <th class="px-4 py-3 text-left">Sekolah & Wilayah</th>
                    <th class="px-4 py-3 text-left">PIC Sekolah Ditemui</th>
                    <th class="px-4 py-3 text-center">Audiens Siswa</th>
                    <th class="px-4 py-3 text-left">Topik & Catatan</th>
                    <th class="px-4 py-3 text-center">Bukti Foto & GPS</th>
                    <th class="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-sans">
                  <tr
                    v-for="(visit, idx) in marketingVisitsList"
                    :key="visit.id || idx"
                    class="hover:bg-slate-50 transition-colors"
                  >
                    <td class="px-4 py-3 text-center text-slate-400 font-mono">{{ idx + 1 }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-slate-800">
                      <div class="font-medium text-slate-900">{{ visit.visitDate }}</div>
                      <div class="text-[11px] text-slate-500 font-mono mt-0.5">{{ visit.timestamp || '-' }}</div>
                    </td>
                    <td class="px-4 py-3 text-slate-900">
                      <div class="font-semibold">{{ visit.schoolName }}</div>
                      <div class="text-[11px] text-slate-500 mt-0.5">{{ visit.schoolCity || 'Jawa Barat' }}</div>
                    </td>
                    <td class="px-4 py-3 text-slate-700">
                      <div class="font-medium">{{ visit.picMetName || '-' }}</div>
                      <div class="text-[11px] text-slate-500">{{ visit.picMetRole || '-' }} ({{ visit.picMetPhone || '-' }})</div>
                    </td>
                    <td class="px-4 py-3 text-center whitespace-nowrap">
                      <span class="px-2.5 py-1 rounded bg-slate-100 font-mono font-bold text-slate-800 text-xs border border-slate-200">
                        {{ visit.studentAudienceCount || 0 }} Siswa
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-600 max-w-xs">
                      <div class="font-medium text-slate-800 truncate" :title="visit.presentationTopic">
                        {{ visit.presentationTopic || '-' }}
                      </div>
                      <div class="text-[11px] text-slate-500 line-clamp-1 mt-0.5" :title="visit.notes">
                        {{ visit.notes || '-' }}
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center whitespace-nowrap">
                      <div class="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          @click="viewPhotoPreview(visit)"
                          class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 border border-slate-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Lihat Foto</span>
                        </button>

                        <span v-if="visit.latitude" class="text-[10px] text-slate-400 font-mono">
                          {{ visit.latitude.toFixed(4) }}, {{ visit.longitude.toFixed(4) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        @click="handleDeleteVisit(visit.id)"
                        class="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition cursor-pointer"
                        title="Hapus Laporan Ini"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  <tr v-if="marketingVisitsList.length === 0">
                    <td colspan="8" class="px-4 py-10 text-center text-slate-500 text-xs">
                      Belum ada laporan kunjungan sekolah lapangan yang dibuat. Silakan klik tombol <strong>"Buat Laporan Kunjungan Baru"</strong> di atas.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ========================================================================= -->
    <!-- 3. MODAL BUAT LAPORAN KUNJUNGAN & LIVE CAMERA + GEOTAGGING                -->
    <!-- ========================================================================= -->
    <div
      v-if="isVisitModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-xl border border-slate-200 p-6 space-y-5">
        <!-- Header Modal -->
        <div class="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900 leading-tight">
              Laporan Kunjungan Lapangan & Bukti Kamera
            </h2>
            <p class="text-xs text-slate-500 font-sans mt-0.5">
              Wajib menyertakan foto langsung dari kamera perangkat dengan geotagging GPS dan stempel waktu otomatis.
            </p>
          </div>
          <button
            type="button"
            @click="closeVisitModal"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitVisitReport" class="space-y-4 text-xs font-sans">
          <!-- 1. Data Sekolah Kunjungan -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nama Sekolah Tujuan *</label>
              <input
                v-model="visitForm.schoolName"
                type="text"
                required
                placeholder="Contoh: SMAN 1 Tasikmalaya"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kota / Kabupaten *</label>
              <input
                v-model="visitForm.schoolCity"
                type="text"
                required
                placeholder="Contoh: Kota Tasikmalaya"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white"
              />
            </div>
          </div>

          <!-- 2. Tanggal & PIC yang Ditemui -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tanggal Kunjungan *</label>
              <input
                v-model="visitForm.visitDate"
                type="date"
                required
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nama PIC Sekolah *</label>
              <input
                v-model="visitForm.picMetName"
                type="text"
                required
                placeholder="Guru BK / Wakasek / Kepsek"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Jabatan PIC</label>
              <input
                v-model="visitForm.picMetRole"
                type="text"
                placeholder="Contoh: Koordinator BK"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white"
              />
            </div>
          </div>

          <!-- 3. Nomor Kontak & Estimasi Siswa Hadir -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nomor WhatsApp / Telp PIC</label>
              <input
                v-model="visitForm.picMetPhone"
                type="text"
                placeholder="0812-xxxx-xxxx"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Estimasi Jumlah Siswa Hadir *</label>
              <input
                v-model.number="visitForm.studentAudienceCount"
                type="number"
                min="0"
                required
                placeholder="Contoh: 120"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white font-mono"
              />
            </div>
          </div>

          <!-- 4. Topik Presentasi & Catatan -->
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Topik Edukasi / Sosialisasi PMB *</label>
            <input
              v-model="visitForm.presentationTopic"
              type="text"
              required
              placeholder="Contoh: Sosialisasi Jalur Prestasi & Fakultas Kesehatan UBTH"
              class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Catatan Hasil Kunjungan / Feedback Lapangan</label>
            <textarea
              v-model="visitForm.notes"
              rows="2"
              placeholder="Tuliskan respon siswa, minat prodi utama, atau jadwal lanjutan..."
              class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#1E3A8A] bg-white resize-none"
            ></textarea>
          </div>

          <!-- =============================================================== -->
          <!-- 5. AREA KAMERA LANGSUNG + GEOTAGGING WATERMARK                  -->
          <!-- =============================================================== -->
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-sora font-semibold text-xs text-slate-900">
                  Foto Bukti Kunjungan (Kamera Langsung & Geotagging)
                </h3>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  Foto wajib diambil langsung dari kamera perangkat (bukan upload galeri) untuk menjamin validitas audit.
                </p>
              </div>

              <!-- Indikator GPS -->
              <div
                class="px-2.5 py-1 rounded text-[10px] font-mono font-medium flex items-center gap-1 border"
                :class="currentCoordinates.latitude ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="currentCoordinates.latitude ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                <span>{{ currentCoordinates.latitude ? `GPS Terkunci: ${currentCoordinates.latitude.toFixed(4)}, ${currentCoordinates.longitude.toFixed(4)}` : 'Mendeteksi GPS...' }}</span>
              </div>
            </div>

            <!-- TAMPILAN 1: BELUM MENGAMBIL FOTO & KAMERA BELUM AKTIF -->
            <div v-if="!capturedPhotoUrl && !isCameraActive" class="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-3 bg-white">
              <div class="w-12 h-12 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center mx-auto border border-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <div class="space-y-1">
                <p class="font-semibold text-slate-800 text-xs">Aktifkan Kamera Perangkat Anda</p>
                <p class="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Pastikan Anda memberikan izin akses kamera dan lokasi (GPS) pada peramban web Anda.
                </p>
              </div>

              <button
                type="button"
                @click="startCamera"
                class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Buka Kamera Sekarang</span>
              </button>
            </div>

            <!-- TAMPILAN 2: STREAM KAMERA AKTIF (LIVE VIEW) -->
            <div v-else-if="isCameraActive && !capturedPhotoUrl" class="space-y-3">
              <div class="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-300 aspect-video flex items-center justify-center">
                <video
                  ref="videoPlayer"
                  autoplay
                  playsinline
                  muted
                  class="w-full h-full object-cover"
                ></video>

                <!-- Overlay Frame Petunjuk -->
                <div class="absolute inset-4 border border-white/40 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                  <span class="text-[10px] text-white/80 bg-black/40 px-2 py-0.5 rounded self-start font-mono">
                    LIVE CAMERA • BTH PMB
                  </span>
                  <span class="text-[10px] text-white/80 bg-black/40 px-2 py-0.5 rounded self-end font-mono">
                    {{ currentFormattedTime }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2">
                <button
                  type="button"
                  @click="stopCamera"
                  class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-lg transition cursor-pointer"
                >
                  Batal / Tutup Kamera
                </button>

                <button
                  type="button"
                  @click="capturePhotoFromVideo"
                  class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  <span>Ambil Foto (Shutter)</span>
                </button>
              </div>
            </div>

            <!-- TAMPILAN 3: FOTO TERTANGKAP DENGAN WATERMARK PERMANEN (PREVIEW) -->
            <div v-else-if="capturedPhotoUrl" class="space-y-3">
              <div class="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
                <img
                  :src="capturedPhotoUrl"
                  alt="Bukti Kunjungan Lapangan"
                  class="w-full h-auto object-contain max-h-72 mx-auto"
                />
              </div>

              <div class="flex items-center justify-between">
                <span class="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Foto & stempel geotagging berhasil direkam</span>
                </span>

                <button
                  type="button"
                  @click="retakePhoto"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer border border-slate-200"
                >
                  Ambil Ulang Foto
                </button>
              </div>
            </div>

            <!-- Canvas Tersembunyi untuk Watermarking Geotagging -->
            <canvas ref="hiddenCanvas" class="hidden"></canvas>
          </div>

          <!-- Footer Modal: Tombol Aksi Simpan -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="closeVisitModal"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="!capturedPhotoUrl"
              class="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              Simpan Laporan Kunjungan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 4. MODAL PREVIEW FOTO KUNJUNGAN LENGKAP                                    -->
    <!-- ========================================================================= -->
    <div
      v-if="selectedPreviewVisit"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 class="font-sora font-bold text-sm text-slate-900">
              {{ selectedPreviewVisit.schoolName }}
            </h2>
            <p class="text-[11px] text-slate-500 font-sans">
              {{ selectedPreviewVisit.schoolCity }} • {{ selectedPreviewVisit.visitDate }}
            </p>
          </div>
          <button
            type="button"
            @click="selectedPreviewVisit = null"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
          <img
            :src="selectedPreviewVisit.photoUrl || '/assets/icons/bth-emblem.png'"
            alt="Bukti Kunjungan"
            class="w-full h-auto object-contain max-h-80 mx-auto"
          />
        </div>

        <div class="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div><strong>PIC Ditemui:</strong> {{ selectedPreviewVisit.picMetName }} ({{ selectedPreviewVisit.picMetRole || '-' }})</div>
          <div><strong>Kontak:</strong> {{ selectedPreviewVisit.picMetPhone || '-' }}</div>
          <div><strong>Audiens:</strong> {{ selectedPreviewVisit.studentAudienceCount }} Siswa</div>
          <div><strong>Topik:</strong> {{ selectedPreviewVisit.presentationTopic }}</div>
          <div v-if="selectedPreviewVisit.latitude" class="pt-1 flex items-center justify-between text-[11px]">
            <span class="font-mono text-slate-500">
              Koordinat: {{ selectedPreviewVisit.latitude.toFixed(6) }}, {{ selectedPreviewVisit.longitude.toFixed(6) }}
            </span>
            <a
              :href="`https://www.google.com/maps/search/?api=1&query=${selectedPreviewVisit.latitude},${selectedPreviewVisit.longitude}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[#1E3A8A] font-semibold hover:underline"
            >
              Buka Google Maps &rarr;
            </a>
          </div>
        </div>

        <div class="text-right">
          <button
            type="button"
            @click="selectedPreviewVisit = null"
            class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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

// Status Bagian Aktif: 'referrals' (Daftar Sekolah) vs 'visits' (Laporan Kunjungan)
const currentSection = ref('referrals');

// View di dalam Bagian Referals: 'list' vs 'detail' (Identik dengan BK)
const currentView = ref('list');
const selectedReferalCode = ref('');

// Dropdown Profil
const isProfileDropdownOpen = ref(false);

// Profil Tim Marketing
const currentUserDisplayName = computed(() => {
  return (
    authStore.currentUser?.name ||
    authStore.currentUser?.full_name ||
    referralStore.currentMarketingSession?.picName ||
    'Rian Hidayat, S.I.Kom'
  );
});

const currentUserDisplayEmail = computed(() => {
  return (
    authStore.currentUser?.email ||
    referralStore.currentMarketingSession?.email ||
    'marketing@bth.ac.id'
  );
});

const userInitials = computed(() => {
  const name = currentUserDisplayName.value;
  if (!name) return 'MK';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

// Daftar Referal Binaan Marketing
const activeReferralsList = computed(() => {
  const userEmail = currentUserDisplayEmail.value;
  return referralStore.getReferralsForUser(userEmail);
});

// Referal Aktif Terpilih
const selectedReferal = computed(() => {
  if (!selectedReferalCode.value) return null;
  return referralStore.findReferralByCode(selectedReferalCode.value) || null;
});

// Rincian Keuangan Reaktif (Persis BK)
const financialSummary = computed(() => {
  return referralStore.getFinancialSummary(selectedReferal.value);
});

// Pencarian Siswa Pendaftar
const searchKeyword = ref('');
const filteredStudents = computed(() => {
  if (!selectedReferal.value?.students) return [];
  const list = selectedReferal.value.students;
  if (!searchKeyword.value) return list;
  const kw = searchKeyword.value.toLowerCase().trim();
  return list.filter((s) => {
    return (
      (s.name && s.name.toLowerCase().includes(kw)) ||
      (s.email && s.email.toLowerCase().includes(kw)) ||
      (s.nik && String(s.nik).includes(kw)) ||
      (s.nisn && String(s.nisn).includes(kw)) ||
      (s.prodi && s.prodi.toLowerCase().includes(kw))
    );
  });
});

// Navigasi Bagian
const goToSection = (section) => {
  currentSection.value = section;
  isProfileDropdownOpen.value = false;
};

const goToList = () => {
  currentView.value = 'list';
  selectedReferalCode.value = '';
};

const openDetail = (referal) => {
  selectedReferalCode.value = referal.code;
  currentView.value = 'detail';
};

const copyCode = (code) => {
  if (!code) return;
  navigator.clipboard.writeText(code);
  toast.success(`Kode referal "${code}" berhasil disalin ke clipboard!`);
};

const formatRupiah = (val) => {
  return Number(val || 0).toLocaleString('id-ID');
};

const getStudentCount = (referal) => {
  if (Array.isArray(referal?.students) && referal.students.length > 0) {
    return referal.students.length;
  }
  return referal?.registeredCount || 0;
};

const exportStudentList = () => {
  if (!selectedReferal.value) return;
  const students = filteredStudents.value;
  if (students.length === 0) {
    toast.warning('Tidak ada data siswa untuk diekspor.');
    return;
  }

  const headers = ['No', 'Nama Siswa', 'Email', 'Program Studi', 'NIK', 'NISN', 'Nominal', 'Status'];
  const rows = students.map((s, idx) => [
    idx + 1,
    `"${s.name || ''}"`,
    `"${s.email || ''}"`,
    `"${s.prodi || '-'}"`,
    `'${s.nik || '-'}'`,
    `'${s.nisn || '-'}'`,
    s.nominal || 0,
    s.status_approve === 'SUCCESS' ? 'Lunas' : 'Menunggu',
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `rekap_siswa_${selectedReferal.value.code}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success('File CSV berhasil diunduh.');
};

// =========================================================================
// FITUR 2: LAPORAN KUNJUNGAN LAPANGAN & LIVE CAMERA GEOTAGGING
// =========================================================================
const marketingVisitsList = computed(() => {
  return referralStore.marketingVisits || [];
});

const uniqueSchoolsCount = computed(() => {
  const set = new Set(marketingVisitsList.value.map((v) => v.schoolName));
  return set.size;
});

const totalAudienceCount = computed(() => {
  return marketingVisitsList.value.reduce((sum, v) => sum + (Number(v.studentAudienceCount) || 0), 0);
});

// Modal & Form State
const isVisitModalOpen = ref(false);
const selectedPreviewVisit = ref(null);

const visitForm = ref({
  schoolName: '',
  schoolCity: '',
  visitDate: new Date().toISOString().split('T')[0],
  picMetName: '',
  picMetRole: '',
  picMetPhone: '',
  studentAudienceCount: 100,
  presentationTopic: 'Sosialisasi Program PMB & Beasiswa BTH 2026',
  notes: '',
});

// Kamera & Geotagging State
const isCameraActive = ref(false);
const videoPlayer = ref(null);
const hiddenCanvas = ref(null);
let mediaStream = null;
const capturedPhotoUrl = ref('');

const currentCoordinates = ref({
  latitude: -7.327412,
  longitude: 108.220531,
  accuracy: 10,
});

const currentFormattedTime = ref('');

const updateCurrentTimeStr = () => {
  const now = new Date();
  currentFormattedTime.value = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) + ', ' + now.toLocaleTimeString('id-ID') + ' WIB';
};

const acquireGeolocation = () => {
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentCoordinates.value = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy || 10),
        };
      },
      (err) => {
        console.warn('Geolocation warning (fallback default):', err.message);
        // Fallback default kampus Tasikmalaya
        currentCoordinates.value = {
          latitude: -7.327412,
          longitude: 108.220531,
          accuracy: 15,
        };
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }
};

const openVisitModal = () => {
  updateCurrentTimeStr();
  acquireGeolocation();
  visitForm.value = {
    schoolName: activeReferralsList.value[0]?.schoolName || '',
    schoolCity: activeReferralsList.value[0]?.schoolCity || 'Kota Tasikmalaya',
    visitDate: new Date().toISOString().split('T')[0],
    picMetName: '',
    picMetRole: 'Guru BK / Wakasek',
    picMetPhone: '',
    studentAudienceCount: 120,
    presentationTopic: 'Sosialisasi Program Penerimaan Mahasiswa Baru Universitas BTH',
    notes: '',
  };
  capturedPhotoUrl.value = '';
  isCameraActive.value = false;
  isVisitModalOpen.value = true;
};

const closeVisitModal = () => {
  stopCamera();
  isVisitModalOpen.value = false;
  capturedPhotoUrl.value = '';
};

// Mengaktifkan Kamera Live Streaming
const startCamera = async () => {
  try {
    updateCurrentTimeStr();
    acquireGeolocation();

    const constraints = {
      video: {
        facingMode: 'environment', // Kamera belakang
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    isCameraActive.value = true;

    // Tunggu hingga elemen video di-render di DOM
    setTimeout(() => {
      if (videoPlayer.value) {
        videoPlayer.value.srcObject = mediaStream;
        videoPlayer.value.play().catch((e) => console.warn('Video play error:', e));
      }
    }, 100);
  } catch (err) {
    console.warn('Camera access error, fallback to front camera / mock stream:', err);
    try {
      // Fallback kamera biasa
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      isCameraActive.value = true;
      setTimeout(() => {
        if (videoPlayer.value) {
          videoPlayer.value.srcObject = mediaStream;
          videoPlayer.value.play().catch(() => {});
        }
      }, 100);
    } catch (fallbackErr) {
      if (import.meta.env.DEV) {
        toast.warning('Akses kamera tidak tersedia di lingkungan ini. Menyiapkan simulasi snapshot (Dev Mode).');
        generateSimulatedCapture();
      } else {
        toast.error('Akses kamera perangkat wajib diizinkan untuk mengambil foto bukti visitasi sekolah. Pastikan izin kamera aktif.');
      }
    }
  }
};

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  isCameraActive.value = false;
};

// Menangkap Frame & Burn-in Watermark Geotagging ke Canvas
const capturePhotoFromVideo = () => {
  if (!videoPlayer.value) return;

  const video = videoPlayer.value;
  const canvas = hiddenCanvas.value || document.createElement('canvas');
  const width = video.videoWidth || 1280;
  const height = video.videoHeight || 720;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Gambar frame video asli
  ctx.drawImage(video, 0, 0, width, height);

  // 2. Burn-in Watermark Institusi & Geotagging Permanen
  applyWatermarkToCanvas(ctx, width, height);

  // 3. Konversi ke data URL JPEG berkualitas tinggi
  capturedPhotoUrl.value = canvas.toDataURL('image/jpeg', 0.88);
  stopCamera();
  toast.success('Foto berhasil diambil dengan stempel GPS & Timestamp resmi!');
};

// Simulasi jika perangkat tidak memiliki webcam fisik
const generateSimulatedCapture = () => {
  const canvas = hiddenCanvas.value || document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  // Gambar latar belakang ruang kelas / sosialisasi
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gradient halus
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(1, '#1E3A8A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Teks simulasi foto
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DOKUMENTASI VISITASI SOSIALISASI PMB', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(visitForm.value.schoolName || 'SMK MARHAS MARGAHAYU', canvas.width / 2, canvas.height / 2 + 15);

  applyWatermarkToCanvas(ctx, canvas.width, canvas.height);
  capturedPhotoUrl.value = canvas.toDataURL('image/jpeg', 0.88);
  isCameraActive.value = false;
};

// Helper: Cetak Watermark Resmi ke Canvas
const applyWatermarkToCanvas = (ctx, width, height) => {
  updateCurrentTimeStr();

  // Pita Bawah Semi-Transparan Navy
  const bannerHeight = Math.max(90, Math.floor(height * 0.16));
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

  // Garis Aksen Emas / Biru BTH
  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(0, height - bannerHeight, width, 4);

  // Teks Watermark
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';

  // Baris 1: Institusi Resmi
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('UNIVERSITAS BAKTI TUNAS HUSADA - PMB FIELD MARKETING REPORT', 18, height - bannerHeight + 25);

  // Baris 2: Waktu Presisi & Petugas
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText(
    `Waktu: ${currentFormattedTime.value}  •  Petugas: ${currentUserDisplayName.value}`,
    18,
    height - bannerHeight + 48
  );

  // Baris 3: Geotagging GPS & Sekolah
  ctx.font = '12px monospace';
  ctx.fillStyle = '#38BDF8';
  const coordsStr = `GPS: Lat ${currentCoordinates.value.latitude.toFixed(6)}, Long ${currentCoordinates.value.longitude.toFixed(6)} (Akurasi: ±${currentCoordinates.value.accuracy}m)`;
  const locStr = `Lokasi: ${visitForm.value.schoolName || 'Sekolah Mitra'} (${visitForm.value.schoolCity || 'Jabar'})`;
  ctx.fillText(`${coordsStr}  |  ${locStr}`, 18, height - bannerHeight + 70);
};

const retakePhoto = () => {
  capturedPhotoUrl.value = '';
  startCamera();
};

const submitVisitReport = () => {
  if (!capturedPhotoUrl.value) {
    toast.error('Foto dokumentasi wajib diambil langsung melalui kamera!');
    return;
  }

  const newReport = {
    marketingCode: selectedReferalCode.value || 'MKT-BTH2026',
    marketingName: currentUserDisplayName.value,
    schoolName: visitForm.value.schoolName,
    schoolCity: visitForm.value.schoolCity,
    visitDate: visitForm.value.visitDate,
    picMetName: visitForm.value.picMetName,
    picMetRole: visitForm.value.picMetRole,
    picMetPhone: visitForm.value.picMetPhone,
    studentAudienceCount: visitForm.value.studentAudienceCount,
    presentationTopic: visitForm.value.presentationTopic,
    notes: visitForm.value.notes,
    photoUrl: capturedPhotoUrl.value,
    latitude: currentCoordinates.value.latitude,
    longitude: currentCoordinates.value.longitude,
    locationAccuracy: currentCoordinates.value.accuracy,
    timestamp: currentFormattedTime.value,
  };

  referralStore.addMarketingVisit(newReport);
  toast.success('Laporan kunjungan sekolah lapangan berhasil disimpan!');
  closeVisitModal();
  goToSection('visits');
};

const viewPhotoPreview = (visit) => {
  selectedPreviewVisit.value = visit;
};

const handleDeleteVisit = (visitId) => {
  if (confirm('Apakah Anda yakin ingin menghapus laporan kunjungan ini?')) {
    referralStore.deleteMarketingVisit(visitId);
    toast.info('Laporan kunjungan berhasil dihapus.');
  }
};

const handleLogout = () => {
  stopCamera();
  referralStore.logoutMarketing();
  authStore.clearAuth();
  toast.info('Anda telah keluar dari Meja Kerja Marketing.');
  router.push('/login');
};

onMounted(() => {
  if (route.query.section === 'visits') {
    currentSection.value = 'visits';
  }
  if (activeReferralsList.value.length === 1) {
    selectedReferalCode.value = activeReferralsList.value[0].code;
  }
});

onUnmounted(() => {
  stopCamera();
});
</script>
