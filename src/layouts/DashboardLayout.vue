<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-bth-blue selection:text-white">
    <!-- Top Institutional Navbar -->
    <header class="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs backdrop-blur-md bg-white/95">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="h-16 sm:h-20 flex items-center justify-between gap-2 lg:gap-6">
          <!-- Brand Info with Crest & Mobile Menu Button -->
          <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <!-- Mobile Menu Toggle Button (visible on < lg) -->
            <button
              @click="toggleMobileNav"
              class="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex-shrink-0"
              aria-label="Buka Menu Navigasi"
            >
              <svg v-if="!showMobileNav" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Official Institutional Crest & Brand Title -->
            <button @click="navigateTo('overview')" class="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer">
              <div class="w-8 h-8 sm:w-11 sm:h-11 p-1 sm:p-1.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:border-blue-300 transition-colors">
                <img src="/assets/icons/bth.png" alt="Logo Universitas BTH" class="h-5 w-5 sm:h-8 sm:w-8 object-contain" />
              </div>

              <div class="flex flex-col">
                <div class="font-sora font-extrabold text-slate-900 text-xs sm:text-sm lg:text-base leading-tight tracking-tight whitespace-nowrap">
                  <span class="sm:hidden">Universitas BTH</span>
                  <span class="hidden sm:inline">Universitas Bakti Tunas Husada</span>
                </div>
                <div class="text-[10px] sm:text-xs text-bth-blue font-semibold flex items-center gap-1.5 whitespace-nowrap">
                  <span>
                    <span class="sm:hidden">Portal PMB</span>
                    <span class="hidden sm:inline">Portal Calon Mahasiswa Baru</span>
                  </span>
                  <span class="text-slate-300">•</span>
                  <span class="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded font-mono font-medium text-[9px] sm:text-[10px]">
                    <span class="sm:hidden">2026</span>
                    <span class="hidden sm:inline">Gel. 1 TA 2026/2027</span>
                  </span>
                </div>
              </div>
            </button>
          </div>

          <!-- Center: Desktop Structured Macro Navigation Bar (visible on lg+) -->
          <nav class="hidden lg:flex items-center gap-1 xl:gap-2">
            <!-- 1. Beranda (Hub Ringkasan) -->
            <button
              @click="navigateTo('overview')"
              class="px-3 py-2 rounded-xl text-xs font-sora font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              :class="applicantStore.activeTab === 'overview'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold ring-1 ring-blue-100 shadow-2xs'
                : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50'"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Beranda</span>
            </button>

            <!-- 2. Pendaftaran & Berkas (Structured Dropdown for Stages 1 to 4) -->
            <div class="relative" @mouseenter="showRegistrationDropdown = true" @mouseleave="showRegistrationDropdown = false">
              <button
                @click="navigateTo('profile')"
                class="px-3 py-2 rounded-xl text-xs font-sora font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="['profile', 'admission', 'documents', 'payment'].includes(applicantStore.activeTab)
                  ? 'bg-blue-50 text-[#1E3A8A] font-bold ring-1 ring-blue-100 shadow-2xs'
                  : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50'"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Pendaftaran & Berkas</span>
                <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': showRegistrationDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Structured Dropdown Box -->
              <transition name="fade">
                <div
                  v-if="showRegistrationDropdown"
                  class="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-fadeIn space-y-1"
                >
                  <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora border-b border-slate-100 flex items-center justify-between">
                    <span>Tahap Formulir & Dokumen</span>
                    <span class="text-[#1E3A8A] font-mono">{{ registrationProgressText }}</span>
                  </div>

                  <!-- 1. Biodata -->
                  <button
                    @click="navigateTo('profile', 'section-pribadi')"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between group cursor-pointer"
                    :class="applicantStore.activeTab === 'profile' ? 'bg-blue-50/80 text-[#1E3A8A] font-semibold' : 'hover:bg-slate-50 text-slate-700'"
                  >
                    <div>
                      <div class="font-sora font-semibold text-slate-800 group-hover:text-[#1E3A8A] flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full" :class="applicantStore.isProfileComplete ? 'bg-emerald-500' : 'bg-amber-400'"></span>
                        1. Biodata Calon Mahasiswa
                      </div>
                      <div class="text-[10px] text-slate-400 mt-0.5">KTP, asal sekolah, domisili, orang tua</div>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                          :class="applicantStore.isProfileComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                      {{ applicantStore.isProfileComplete ? 'Lengkap' : 'Lengkapi' }}
                    </span>
                  </button>

                  <!-- 2. Jalur & Prodi -->
                  <button
                    @click="navigateTo('admission')"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between group cursor-pointer"
                    :class="applicantStore.activeTab === 'admission' ? 'bg-blue-50/80 text-[#1E3A8A] font-semibold' : 'hover:bg-slate-50 text-slate-700'"
                  >
                    <div>
                      <div class="font-sora font-semibold text-slate-800 group-hover:text-[#1E3A8A] flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full" :class="applicantStore.state.admission.prodi1 ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                        2. Jalur & Program Studi
                      </div>
                      <div class="text-[10px] text-slate-400 mt-0.5">Jalur Reguler & Pilihan 1 & 2</div>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                          :class="applicantStore.state.admission.prodi1 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                      {{ applicantStore.state.admission.prodi1 ? 'Terpilih' : 'Pilih' }}
                    </span>
                  </button>

                  <!-- 3. Berkas Dokumen -->
                  <button
                    @click="navigateTo('documents')"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between group cursor-pointer"
                    :class="applicantStore.activeTab === 'documents' ? 'bg-blue-50/80 text-[#1E3A8A] font-semibold' : 'hover:bg-slate-50 text-slate-700'"
                  >
                    <div>
                      <div class="font-sora font-semibold text-slate-800 group-hover:text-[#1E3A8A] flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full" :class="applicantStore.uploadedDocsCount >= 3 ? 'bg-emerald-500' : 'bg-amber-400'"></span>
                        3. Berkas Dokumen
                      </div>
                      <div class="text-[10px] text-slate-400 mt-0.5">Ijazah/SKL, KTP, KK, Surat Sehat</div>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                          :class="applicantStore.uploadedDocsCount >= 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                      {{ applicantStore.uploadedDocsCount }}/5 Berkas
                    </span>
                  </button>

                  <!-- 4. Biaya Formulir Pendaftaran -->
                  <button
                    @click="navigateTo('payment')"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between group cursor-pointer"
                    :class="applicantStore.activeTab === 'payment' ? 'bg-blue-50/80 text-[#1E3A8A] font-semibold' : 'hover:bg-slate-50 text-slate-700'"
                  >
                    <div>
                      <div class="font-sora font-semibold text-slate-800 group-hover:text-[#1E3A8A] flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full" :class="applicantStore.isRegPaymentComplete ? 'bg-emerald-500' : 'bg-amber-400'"></span>
                        4. Biaya Formulir
                      </div>
                      <div class="text-[10px] text-slate-400 mt-0.5">Tagihan VA Rp 250.000</div>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                          :class="applicantStore.isRegPaymentComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                      {{ applicantStore.isRegPaymentComplete ? 'Lunas ✓' : 'Belum Bayar' }}
                    </span>
                  </button>
                </div>
              </transition>
            </div>

            <!-- 3. Seleksi CBT (Stage 5) -->
            <button
              @click="navigateTo('exam')"
              class="px-3 py-2 rounded-xl text-xs font-sora font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              :class="applicantStore.activeTab === 'exam'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold ring-1 ring-blue-100 shadow-2xs'
                : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50'"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Seleksi CBT</span>
              <span v-if="applicantStore.isExamCompleted" class="w-2 h-2 rounded-full bg-emerald-500" title="Ujian Telah Diselesaikan"></span>
              <span v-else-if="applicantStore.isRegPaymentComplete" class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" title="Sesi Ujian Aktif"></span>
            </button>

            <!-- 4. Kelulusan & Daftar Ulang (Stage 6) -->
            <button
              @click="navigateTo('result')"
              class="px-3 py-2 rounded-xl text-xs font-sora font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              :class="applicantStore.activeTab === 'result'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold ring-1 ring-blue-100 shadow-2xs'
                : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50'"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <span>Kelulusan & Daftar Ulang</span>
              <span v-if="applicantStore.isResultPassed" class="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                LULUS
              </span>
            </button>
          </nav>

          <!-- Right Side: Unified Helpdesk, Notifications & User Account -->
          <div class="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <!-- Single Unified Bantuan & CS Online Button (Eliminating Redundancy) -->
            <button
              @click="showHelpdeskModal = true"
              class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-800 text-xs font-sora font-semibold transition-all cursor-pointer shadow-2xs"
              title="Pusat Layanan Informasi, Panduan & WhatsApp Helpdesk Resmi PMB"
            >
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <svg class="w-3.5 h-3.5 text-emerald-700 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Bantuan & CS</span>
            </button>

            <!-- Interactive Notification Bell Dropdown -->
            <div class="relative">
              <button
                @click="toggleNotifications"
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-slate-200 text-slate-600 hover:text-bth-navy hover:bg-slate-50 flex items-center justify-center relative transition-colors cursor-pointer"
                aria-label="Pemberitahuan Pendaftaran"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <!-- Notification Dot -->
                <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {{ unreadCount }}
                </span>
              </button>

              <!-- Notifications Dropdown Box -->
              <div
                v-if="showNotifications"
                class="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 sm:w-96 max-w-sm sm:max-w-none mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-fadeIn max-h-[82vh] flex flex-col"
              >
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 flex-shrink-0">
                  <span class="font-sora font-bold text-sm text-slate-800">Pemberitahuan & Informasi</span>
                  <button @click="markAllAsRead" class="text-[11px] text-bth-blue hover:underline font-medium cursor-pointer">
                    Tandai Dibaca
                  </button>
                </div>
                <div class="space-y-2.5 overflow-y-auto pr-1 flex-1">
                  <div
                    v-for="(notif, idx) in notifications"
                    :key="idx"
                    class="p-3 rounded-xl transition-colors"
                    :class="notif.isRead ? 'bg-slate-50/50' : 'bg-blue-50/60 border border-blue-100'"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <span class="font-sora font-semibold text-xs text-slate-800">{{ notif.title }}</span>
                      <span class="text-[10px] text-slate-400 whitespace-nowrap">{{ notif.time }}</span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ notif.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Profile Pill & Dropdown (With Portal Panitia gracefully relocated inside) -->
            <div class="relative">
              <button
                @click="showProfileMenu = !showProfileMenu"
                class="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer"
                title="Menu Akun Pengguna"
              >
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1E3A8A] text-white font-sora font-bold text-[11px] sm:text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                  {{ userInitials }}
                </div>
                <div class="hidden sm:block">
                  <div class="text-xs font-bold text-slate-900 font-sora truncate max-w-[130px] leading-tight">
                    {{ authStore.currentUser?.full_name || 'Calon Mahasiswa' }}
                  </div>
                  <div class="text-[10px] text-slate-400 truncate max-w-[130px] font-mono">
                    {{ candidateRegNoShort }}
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="hidden sm:block h-3.5 w-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': showProfileMenu }" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showProfileMenu"
                class="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 z-50 animate-fadeIn"
              >
                <!-- Account Identity Header -->
                <div class="px-3 py-2 border-b border-slate-100 mb-1">
                  <div class="text-xs font-bold text-slate-900 font-sora truncate">
                    {{ authStore.currentUser?.full_name || 'Calon Mahasiswa' }}
                  </div>
                  <div class="text-[10px] text-slate-400 truncate">
                    {{ authStore.currentUser?.email }}
                  </div>
                  <div class="mt-1.5 flex items-center justify-between text-[10px] bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 font-mono">
                    <span class="text-slate-500">No. Reg:</span>
                    <span class="font-bold text-[#1E3A8A]">{{ applicantStore.state.candidate?.registrationNumber || '-' }}</span>
                  </div>
                </div>

                <!-- Quick Action Links -->
                <div class="py-1 space-y-1">
                  <button
                    @click="navigateTo('profile'); showProfileMenu = false"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Biodata Calon Mahasiswa</span>
                  </button>

                  <button
                    @click="navigateTo('documents'); showProfileMenu = false"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Status Dokumen & Berkas</span>
                  </button>

                  <button
                    @click="showHelpdeskModal = true; showProfileMenu = false"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pusat Layanan Bantuan PMB</span>
                  </button>
                </div>

                <!-- Switcher to Portal Panitia (Relocated Elegantly Inside Menu) -->
                <div class="border-t border-slate-100 pt-1.5 mt-1">
                  <router-link
                    to="/admin"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1E3A8A] bg-blue-50/70 hover:bg-blue-100 flex items-center justify-between transition-colors font-sora group"
                  >
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Portal Panitia PMB</span>
                    </div>
                    <span class="text-[9px] bg-[#1E3A8A] text-white px-1.5 py-0.2 rounded font-mono font-bold">
                      ADMIN
                    </span>
                  </router-link>
                </div>

                <!-- Logout -->
                <div class="border-t border-slate-100 pt-1 mt-1">
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-sora cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Horizontal Swipeable Sub-Bar for Mobile (< lg) -->
        <div class="lg:hidden border-t border-slate-100 py-1.5 -mx-3 px-3 overflow-x-auto no-scrollbar flex items-center gap-1.5 bg-slate-50/80">
          <button
            @click="navigateTo('overview')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'overview'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Beranda</span>
          </button>

          <button
            @click="navigateTo('profile')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'profile'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Biodata</span>
          </button>

          <button
            @click="navigateTo('admission')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'admission'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Jalur</span>
          </button>

          <button
            @click="navigateTo('documents')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'documents'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Berkas</span>
          </button>

          <button
            @click="navigateTo('payment')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'payment'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Tagihan</span>
          </button>

          <button
            @click="navigateTo('exam')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'exam'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Ujian CBT</span>
          </button>

          <button
            @click="navigateTo('result')"
            class="px-2.5 py-1 rounded-xl text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'result'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            <span>Kelulusan</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Full Topbar Navigation Drawer (Aligned 100% with Macro Navigation) -->
    <div
      v-if="showMobileNav"
      class="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-start p-3 pt-18 animate-fadeIn"
      @click.self="showMobileNav = false"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 max-w-sm w-full mx-auto animate-fadeIn max-h-[85vh] overflow-y-auto space-y-4">
        <!-- Close & Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <img src="/assets/icons/bth.png" alt="BTH" class="w-6 h-6 object-contain" />
            <span class="font-sora font-bold text-sm text-slate-900">Navigasi Portal PMB</span>
          </div>
          <button @click="showMobileNav = false" class="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 leading-none cursor-pointer">
            &times;
          </button>
        </div>

        <!-- Section 1: Menu Utama PMB (4 Macro Pillars) -->
        <div>
          <div class="text-xs font-bold text-slate-400 mb-2 font-sora uppercase tracking-wider">
            Menu Utama
          </div>
          <div class="space-y-1">
            <!-- 1. Beranda -->
            <button
              @click="navigateTo('overview')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'overview'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <svg class="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Beranda</span>
            </button>

            <!-- 2. Pendaftaran & Berkas (Accordion) -->
            <div>
              <button
                @click="mobileRegistrationOpen = !mobileRegistrationOpen"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
                :class="['profile', 'admission', 'documents', 'payment'].includes(applicantStore.activeTab)
                  ? 'bg-blue-50/70 text-[#1E3A8A] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'"
              >
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Pendaftaran & Berkas</span>
                </div>
                <svg
                  class="w-4 h-4 text-slate-400 transition-transform duration-200"
                  :class="{ 'rotate-180': mobileRegistrationOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Submenu Pendaftaran & Berkas -->
              <div v-if="mobileRegistrationOpen" class="pl-11 pr-2 py-1 space-y-1 border-l-2 border-slate-100 ml-5 my-1">
                <button
                  @click="navigateTo('profile', 'section-pribadi')"
                  class="w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                  :class="applicantStore.activeTab === 'profile' ? 'text-[#1E3A8A] font-bold bg-blue-50/60' : 'text-slate-600 hover:text-[#1E3A8A]'"
                >
                  <span>1. Biodata Calon Mahasiswa</span>
                  <span class="text-[10px] text-emerald-600 font-bold" v-if="applicantStore.isProfileComplete">✓</span>
                </button>
                <button
                  @click="navigateTo('admission')"
                  class="w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                  :class="applicantStore.activeTab === 'admission' ? 'text-[#1E3A8A] font-bold bg-blue-50/60' : 'text-slate-600 hover:text-[#1E3A8A]'"
                >
                  <span>2. Jalur & Program Studi</span>
                  <span class="text-[10px] text-emerald-600 font-bold" v-if="applicantStore.state.admission.prodi1">✓</span>
                </button>
                <button
                  @click="navigateTo('documents')"
                  class="w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                  :class="applicantStore.activeTab === 'documents' ? 'text-[#1E3A8A] font-bold bg-blue-50/60' : 'text-slate-600 hover:text-[#1E3A8A]'"
                >
                  <span>3. Berkas Dokumen</span>
                  <span class="text-[10px] font-mono text-slate-400">{{ applicantStore.uploadedDocsCount }}/5</span>
                </button>
                <button
                  @click="navigateTo('payment')"
                  class="w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                  :class="applicantStore.activeTab === 'payment' ? 'text-[#1E3A8A] font-bold bg-blue-50/60' : 'text-slate-600 hover:text-[#1E3A8A]'"
                >
                  <span>4. Biaya Formulir</span>
                  <span class="text-[10px] text-emerald-600 font-bold" v-if="applicantStore.isRegPaymentComplete">✓ Lunas</span>
                </button>
              </div>
            </div>

            <!-- 3. Seleksi CBT -->
            <button
              @click="navigateTo('exam')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'exam'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <svg class="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Seleksi CBT Online</span>
            </button>

            <!-- 4. Kelulusan & Daftar Ulang -->
            <button
              @click="navigateTo('result')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'result'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <svg class="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <span>Kelulusan & Daftar Ulang</span>
            </button>
          </div>
        </div>

        <!-- Section 2: Layanan & Akses Panitia -->
        <div class="border-t border-slate-100 pt-3">
          <div class="text-xs font-bold text-slate-400 mb-2 font-sora uppercase tracking-wider">
            Layanan PMB
          </div>
          <div class="space-y-1">
            <!-- Bantuan -->
            <button
              @click="showMobileNav = false; showHelpdeskModal = true"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div class="flex-1 flex items-center justify-between">
                <span>Pusat Bantuan & CS</span>
                <span class="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Online</span>
              </div>
            </button>

            <!-- Portal Panitia (Mobile Link) -->
            <router-link
              to="/admin"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-[#1E3A8A] bg-blue-50/70 hover:bg-blue-100 transition-colors text-left"
            >
              <svg class="w-5 h-5 text-[#1E3A8A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div class="flex-1 flex items-center justify-between">
                <span>Portal Panitia PMB</span>
                <span class="text-[9px] bg-[#1E3A8A] text-white font-mono px-1.5 py-0.2 rounded">ADMIN</span>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Section 3: Akun & Keluar -->
        <div class="border-t border-slate-100 pt-3">
          <button
            @click="showMobileNav = false; handleLogout()"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
          >
            <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Pusat Bantuan & Helpdesk Resmi PMB BTH -->
    <div
      v-if="showHelpdeskModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      @click.self="showHelpdeskModal = false"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[88vh] overflow-y-auto space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">Pusat Layanan & Bantuan PMB</h3>
              <p class="text-[11px] text-slate-500">Sekretariat Penerimaan Mahasiswa Baru Universitas BTH</p>
            </div>
          </div>
          <button @click="showHelpdeskModal = false" class="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 leading-none cursor-pointer">
            &times;
          </button>
        </div>

        <div class="space-y-3 text-xs text-slate-600">
          <!-- WhatsApp Hotline -->
          <a
            href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Helpdesk%20PMB%20BTH%2C%20saya%20ingin%20bertanya%20mengenai%20pendaftaran."
            target="_blank"
            rel="noopener noreferrer"
            class="p-3.5 bg-emerald-50/70 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200 transition-colors flex items-center justify-between gap-3 group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                WA
              </div>
              <div>
                <div class="font-sora font-bold text-emerald-900 text-xs sm:text-sm">WhatsApp Helpdesk Resmi</div>
                <div class="text-[11px] text-emerald-700">0821-1710-0200 (Respon Cepat)</div>
              </div>
            </div>
            <span class="text-[11px] font-semibold text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-200 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              Chat Sekarang &rarr;
            </span>
          </a>

          <!-- Info Kampus -->
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div class="flex justify-between items-start gap-2">
              <span class="text-slate-500">Gedung Pelayanan:</span>
              <span class="font-semibold text-slate-800 text-right">Sekretariat PMB, Gedung Rektorat Lt. 1</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-slate-500">Alamat:</span>
              <span class="font-semibold text-slate-800 text-right">Jl. Cilolohan No. 36, Tasikmalaya 46115</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-slate-500">Jam Operasional:</span>
              <span class="font-semibold text-slate-800 text-right">Senin - Jumat (08.00 - 16.00 WIB)</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-slate-500">Surel Resmi:</span>
              <span class="font-mono font-semibold text-[#1E3A8A]">pmb@bth.ac.id</span>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <button
            @click="showHelpdeskModal = false"
            class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer font-sora"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Body -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <slot />
    </main>

    <!-- Official BTH Institutional Footer -->
    <footer class="bg-white border-t border-slate-200/80 py-6 text-slate-500 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div class="flex items-center gap-3">
          <img src="/assets/icons/bth.png" alt="BTH" class="w-8 h-8 object-contain" />
          <div>
            <div class="font-sora font-bold text-slate-800 text-xs">Universitas Bakti Tunas Husada</div>
            <div class="text-[11px] text-slate-400">Gedung Rektorat & Sekretariat PMB • Jl. Cilolohan No. 36, Tasikmalaya 46115</div>
          </div>
        </div>
        <div class="text-[11px] text-slate-400 leading-relaxed font-sans">
          &copy; 2026 Panitia Penerimaan Mahasiswa Baru Universitas BTH. Seluruh Hak Dilindungi.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import { useApplicantStore } from '@/stores/applicant';

const router = useRouter();
const authStore = useAuthStore();
const applicantStore = useApplicantStore();

const showNotifications = ref(false);
const showProfileMenu = ref(false);
const showMobileNav = ref(false);
const showRegistrationDropdown = ref(false);
const mobileRegistrationOpen = ref(true);
const showHelpdeskModal = ref(false);
const readNotificationIndices = ref(new Set());

const toggleMobileNav = () => {
  showMobileNav.value = !showMobileNav.value;
  if (showNotifications.value) showNotifications.value = false;
  if (showProfileMenu.value) showProfileMenu.value = false;
};

const navigateTo = (tab, section = null) => {
  if (router.currentRoute.value.path !== '/dashboard') {
    router.push('/dashboard');
  }
  applicantStore.setActiveTab(tab, section);
  showMobileNav.value = false;
  showRegistrationDropdown.value = false;
};

const registrationProgressCount = computed(() => {
  let count = 0;
  if (applicantStore.isProfileComplete) count++;
  if (applicantStore.isAdmissionComplete) count++;
  if (applicantStore.uploadedDocsCount >= 3) count++;
  if (applicantStore.isRegPaymentComplete) count++;
  return count;
});

const registrationProgressText = computed(() => {
  return `${registrationProgressCount.value}/4 Selesai`;
});

const candidateRegNoShort = computed(() => {
  return applicantStore.state.candidate?.registrationNumber || 'BTH-2026';
});

const isAdmin = computed(() => {
  return authStore.isSuperAdmin || (authStore.userRoles && authStore.userRoles.includes('admin_pmb'));
});

const notifications = computed(() => {
  const list = [];
  
  if (applicantStore.isUktPaid) {
    list.push({
      title: 'Pelunasan UKT Semester 1 Berhasil',
      desc: `Registrasi ulang lunas. NIM ${applicantStore.state.onboarding.nim || 'resmi'} telah aktif dan tercatat pada SIAKAD BTH.`,
      time: applicantStore.state.payments.uktFee.paidAt || 'Terkini',
      isRead: readNotificationIndices.value.has('ukt'),
      key: 'ukt',
    });
  } else if (applicantStore.isResultPassed) {
    list.push({
      title: 'Selamat! Anda Dinyatakan Lulus Seleksi PMB',
      desc: `Surat Keputusan Rektor (${applicantStore.state.result.decisionLetterNo || 'LoA'}) telah terbit. Silakan lakukan pembayaran UKT Semester 1.`,
      time: 'Pengumuman Resmi',
      isRead: readNotificationIndices.value.has('passed'),
      key: 'passed',
    });
  } else if (applicantStore.isExamCompleted) {
    list.push({
      title: 'Ujian Mandiri CBT Telah Diselesaikan',
      desc: `Skor CBT Anda (${applicantStore.state.exam.score}/100) berhasil direkam. Dewan juri sedang memproses penetapan kelulusan.`,
      time: applicantStore.state.exam.completedAt || 'Terkini',
      isRead: readNotificationIndices.value.has('exam'),
      key: 'exam',
    });
  } else if (applicantStore.isRegPaymentComplete) {
    list.push({
      title: 'Pembayaran Formulir Terkonfirmasi',
      desc: 'Sesi Ujian CBT Online Anda telah diaktifkan. Silakan kerjakan ujian mandiri pada menu Jadwal & CBT.',
      time: applicantStore.state.payments.registrationFee.paidAt || 'Terkini',
      isRead: readNotificationIndices.value.has('regpay'),
      key: 'regpay',
    });
  }

  const revisionDocs = applicantStore.state.documents.filter((d) => d.status === 'revision');
  if (revisionDocs.length > 0) {
    list.push({
      title: 'Perhatian: Berkas Memerlukan Perbaikan',
      desc: `${revisionDocs.length} berkas (${revisionDocs.map((d) => d.title).join(', ')}) memerlukan unggah ulang sesuai catatan verifikator.`,
      time: 'Tindakan Diperlukan',
      isRead: readNotificationIndices.value.has('revision'),
      key: 'revision',
    });
  }

  list.push({
    title: 'Informasi Pendaftaran PMB 2026/2027',
    desc: 'Selamat datang di Portal PMB Universitas BTH. Lengkapi biodata, unggah berkas, dan ikuti seleksi online.',
    time: 'Pengumuman',
    isRead: readNotificationIndices.value.has('welcome'),
    key: 'welcome',
  });

  list.push({
    title: 'Sekretariat & Helpdesk PMB',
    desc: 'Bantuan pendaftaran dan validasi berkas dapat ditanyakan via WhatsApp resmi 0821-1710-0200.',
    time: 'Layanan Kampus',
    isRead: true,
    key: 'helpdesk',
  });

  return list;
});

const unreadCount = computed(() => notifications.value.filter((n) => !n.isRead).length);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showProfileMenu.value) showProfileMenu.value = false;
};

const markAllAsRead = () => {
  notifications.value.forEach((n) => {
    if (n.key) readNotificationIndices.value.add(n.key);
  });
};

const userInitials = computed(() => {
  const name = authStore.currentUser?.full_name || 'CM';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

const handleLogout = async () => {
  await authStore.logout();
  applicantStore.resetAllData();
  router.push('/login');
};
</script>
