<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-bth-blue selection:text-white">
    <!-- Main Sticky Dual-Tier Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <!-- Tier 1: Header Atas / Bawaan (Institutional Logo + User Identity) -->
      <div class="border-b border-slate-100/90 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="h-16 sm:h-20 flex items-center justify-between gap-3">
            <!-- Left: Brand Logo & Title -->
            <button @click="navigateTo('overview')" class="flex items-center gap-2.5 sm:gap-3.5 text-left group cursor-pointer flex-shrink-0">
              <img
                src="/assets/icons/bth-emblem.png"
                alt="Logo Resmi Universitas Bakti Tunas Husada"
                class="h-9 w-auto sm:h-11 object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-2xs"
              />
              <div class="flex flex-col">
                <div class="font-sora font-extrabold text-slate-900 text-sm sm:text-base lg:text-lg leading-tight tracking-tight whitespace-nowrap">
                  <span class="sm:hidden">Universitas BTH</span>
                  <span class="hidden sm:inline">Universitas Bakti Tunas Husada</span>
                </div>
                <div class="text-[11px] sm:text-xs text-slate-500 font-sans font-medium leading-tight mt-0.5">
                  Transforming New Generation
                </div>
              </div>
            </button>

            <!-- Right: User Identity & Actions -->
            <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <!-- Notifications Bell -->
              <div class="relative">
                <button
                  @click="toggleNotifications"
                  class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50 flex items-center justify-center relative transition-colors cursor-pointer"
                  title="Pemberitahuan Pendaftaran"
                  aria-label="Pemberitahuan Pendaftaran"
                >
                  <Bell class="w-4 h-4 text-slate-600" />
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

              <!-- User Profile Group (Name, Email & Avatar Circle) -->
              <div class="relative">
                <button
                  @click="showProfileMenu = !showProfileMenu"
                  class="flex items-center gap-2.5 sm:gap-3 text-right group cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-colors"
                  title="Menu Akun Pengguna"
                >
                  <div class="hidden sm:flex flex-col text-right">
                    <div class="font-sora font-semibold text-slate-900 text-xs sm:text-sm group-hover:text-[#1E3A8A] transition-colors leading-tight truncate max-w-[190px]">
                      {{ authStore.currentUser?.full_name || 'Ahmad Bin Fulan' }}
                    </div>
                    <div class="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors leading-tight font-sans truncate max-w-[190px]">
                      {{ authStore.currentUser?.email || 'ahmad@universitas-bth.ac.id' }}
                    </div>
                  </div>
                  <!-- Avatar Circle matching mockup image -->
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 text-slate-700 font-sora font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 group-hover:ring-2 group-hover:ring-blue-300 transition-all shadow-xs overflow-hidden">
                    <img
                      v-if="userPhoto"
                      :src="userPhoto"
                      alt="Foto Profil"
                      class="w-full h-full object-cover rounded-full"
                    />
                    <span v-else>{{ userInitials }}</span>
                  </div>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="showProfileMenu"
                  class="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 z-50 animate-fadeIn"
                >
                  <!-- Account Identity Header with Avatar -->
                  <div class="px-3 py-2.5 border-b border-slate-100 mb-1 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-sora font-bold text-xs flex items-center justify-center flex-shrink-0 border border-slate-200 overflow-hidden">
                      <img
                        v-if="userPhoto"
                        :src="userPhoto"
                        alt="Foto Profil"
                        class="w-full h-full object-cover rounded-full"
                      />
                      <span v-else>{{ userInitials }}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-xs font-bold text-slate-900 font-sora truncate">
                        {{ authStore.currentUser?.full_name || 'Calon Mahasiswa' }}
                      </div>
                      <div class="text-[10px] text-slate-400 truncate">
                        {{ authStore.currentUser?.email }}
                      </div>
                      <div class="mt-1 flex items-center justify-between text-[9px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-mono">
                        <span class="text-slate-500">Reg:</span>
                        <span class="font-bold text-[#1E3A8A]">{{ applicantStore.state.candidate?.registrationNumber || '-' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Quick Action Links: Pusat Bantuan & Logout -->
                  <div class="py-1 space-y-1">
                    <button
                      @click="showHelpdeskModal = true; showProfileMenu = false"
                      class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <HelpCircle class="w-4 h-4 text-emerald-600" />
                      <span>Pusat Layanan Bantuan PMB</span>
                    </button>

                    <div class="border-t border-slate-100 my-1"></div>

                    <button
                      @click="handleLogout"
                      class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut class="w-4 h-4 text-red-500" />
                      <span>Keluar dari Akun</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tier 2: Secondary Navigation Bar (Navbar BTH Bersih: Beranda, Biodata, Jalur Pendaftaran, Berkas, Seleksi CBT, Kelulusan & Daftar Ulang) -->
      <nav class="bg-white border-t border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-12">
            <!-- Left Side: Horizontal Navigation Links -->
            <div class="hidden lg:flex items-center gap-4 xl:gap-6">
              <!-- 1. Beranda -->
              <button
                @click="navigateTo('overview')"
                class="inline-flex items-center gap-1.5 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="applicantStore.activeTab === 'overview'
                  ? 'text-[#1E3A8A] font-bold border-b-2 border-[#1E3A8A]'
                  : 'text-slate-700 hover:text-[#1E3A8A]'"
              >
                <LayoutDashboard class="w-4 h-4 flex-shrink-0" />
                <span>Beranda</span>
              </button>

              <!-- 2. Profil -->
              <button
                @click="navigateTo('profile')"
                class="inline-flex items-center gap-1.5 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="applicantStore.activeTab === 'profile'
                  ? 'text-[#1E3A8A] font-bold border-b-2 border-[#1E3A8A]'
                  : 'text-slate-700 hover:text-[#1E3A8A]'"
              >
                <User class="w-4 h-4 flex-shrink-0" />
                <span>Profil</span>
              </button>

              <!-- 3. Jalur Pendaftaran -->
              <button
                @click="navigateTo('admission')"
                class="inline-flex items-center gap-1.5 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="applicantStore.activeTab === 'admission'
                  ? 'text-[#1E3A8A] font-bold border-b-2 border-[#1E3A8A]'
                  : 'text-slate-700 hover:text-[#1E3A8A]'"
              >
                <Compass class="w-4 h-4 flex-shrink-0" />
                <span>Jalur Pendaftaran</span>
              </button>

              <!-- 4. Biaya & Pembayaran -->
              <button
                @click="navigateTo('payment')"
                class="inline-flex items-center gap-1.5 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="applicantStore.activeTab === 'payment'
                  ? 'text-[#1E3A8A] font-bold border-b-2 border-[#1E3A8A]'
                  : 'text-slate-700 hover:text-[#1E3A8A]'"
              >
                <CreditCard class="w-4 h-4 flex-shrink-0" />
                <span>Biaya & Tagihan</span>
              </button>

              <!-- 5. Berkas Persyaratan -->
              <button
                @click="navigateTo('documents')"
                class="inline-flex items-center gap-1.5 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="applicantStore.activeTab === 'documents'
                  ? 'text-[#1E3A8A] font-bold border-b-2 border-[#1E3A8A]'
                  : 'text-slate-700 hover:text-[#1E3A8A]'"
              >
                <FileText class="w-4 h-4 flex-shrink-0" />
                <span>Berkas</span>
              </button>

              <!-- 6. Proses Seleksi -->
              <button
                @click="navigateTo('exam')"
                class="inline-flex items-center gap-1.5 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="applicantStore.activeTab === 'exam'
                  ? 'text-[#1E3A8A] font-bold border-b-2 border-[#1E3A8A]'
                  : 'text-slate-700 hover:text-[#1E3A8A]'"
              >
                <ClipboardCheck class="w-4 h-4 flex-shrink-0" />
                <span>Proses Seleksi</span>
              </button>

              <!-- 7. Kelulusan & Daftar Ulang -->
              <button
                @click="navigateTo('result')"
                class="inline-flex items-center gap-1.5 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="applicantStore.activeTab === 'result'
                  ? 'text-[#1E3A8A] font-bold border-b-2 border-[#1E3A8A]'
                  : 'text-slate-700 hover:text-[#1E3A8A]'"
              >
                <GraduationCap class="w-4 h-4 flex-shrink-0" />
                <span>Daftar Ulang</span>
              </button>
            </div>

            <!-- Mobile Quick Trigger / Indicator (when on mobile screen) -->
            <div class="lg:hidden flex items-center gap-2">
              <button
                @click="toggleMobileNav"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                <LayoutDashboard class="w-3.5 h-3.5 text-slate-500" />
                <span>Menu Navigasi</span>
              </button>
            </div>

            <!-- Right Side: Utilities (Logout Saja - Tanpa Pengaturan) -->
            <div class="flex items-center gap-4 sm:gap-6 flex-shrink-0">
              <button
                @click="handleLogout"
                class="inline-flex items-center gap-1.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-red-600 transition-colors cursor-pointer whitespace-nowrap"
                title="Keluar dari Akun"
              >
                <LogOut class="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Horizontal Swipeable Sub-Bar for Mobile (< lg) -->
        <div class="lg:hidden border-t border-slate-100 py-1.5 -mx-3 px-3 overflow-x-auto no-scrollbar flex items-center gap-1.5 bg-slate-50/80">
          <button
            @click="navigateTo('overview')"
            class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'overview'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <LayoutDashboard class="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>

          <button
            @click="navigateTo('profile')"
            class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'profile'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <BookOpen class="w-3.5 h-3.5" />
            <span>Profil</span>
          </button>

          <button
            @click="navigateTo('admission')"
            class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'admission'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <Compass class="w-3.5 h-3.5" />
            <span>Jalur</span>
          </button>

          <button
            @click="navigateTo('payment')"
            class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'payment'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <CreditCard class="w-3.5 h-3.5" />
            <span>Biaya</span>
          </button>

          <button
            @click="navigateTo('documents')"
            class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'documents'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <FileText class="w-3.5 h-3.5" />
            <span>Berkas</span>
          </button>

          <button
            @click="navigateTo('exam')"
            class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'exam'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <ClipboardCheck class="w-3.5 h-3.5" />
            <span>Seleksi</span>
          </button>

          <button
            @click="navigateTo('result')"
            class="px-2.5 py-1 rounded-full text-[11px] font-sora font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            :class="applicantStore.activeTab === 'result'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'"
          >
            <GraduationCap class="w-3.5 h-3.5" />
            <span>Kelulusan</span>
          </button>
        </div>
      </nav>
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
              <LayoutDashboard class="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span>Beranda</span>
            </button>

            <!-- 2. Profil -->
            <button
              @click="navigateTo('profile')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'profile'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <User class="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span>Profil</span>
            </button>

            <!-- 3. Jalur Pendaftaran -->
            <button
              @click="navigateTo('admission')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'admission'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <Compass class="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span>Jalur Pendaftaran & Kartu</span>
            </button>

            <!-- 4. Biaya & Pembayaran -->
            <button
              @click="navigateTo('payment')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'payment'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <CreditCard class="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span>Biaya & Pembayaran</span>
            </button>

            <!-- 5. Berkas Persyaratan -->
            <button
              @click="navigateTo('documents')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'documents'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <FileText class="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span>Berkas Persyaratan</span>
            </button>

            <!-- 6. Proses Seleksi -->
            <button
              @click="navigateTo('exam')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'exam'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <ClipboardCheck class="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span>Proses Seleksi (CBT & Lisan)</span>
            </button>

            <!-- 7. Kelulusan & Daftar Ulang -->
            <button
              @click="navigateTo('result')"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer"
              :class="applicantStore.activeTab === 'result'
                ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                : 'text-slate-700 hover:bg-slate-50'"
            >
              <GraduationCap class="w-5 h-5 text-slate-500 flex-shrink-0" />
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
              <HelpCircle class="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div class="flex-1 flex items-center justify-between">
                <span>Pusat Bantuan & CS</span>
                <span class="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Online</span>
              </div>
            </button>

            <!-- Portal Panitia (Mobile Link) -->
            <router-link
              to="/admin?demo=true"
              @click="setAllowDemoAdmin"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-[#1E3A8A] bg-blue-50/70 hover:bg-blue-100 transition-colors text-left"
            >
              <Shield class="w-5 h-5 text-[#1E3A8A] flex-shrink-0" />
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
            <LogOut class="w-5 h-5 text-red-500 flex-shrink-0" />
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
              <HelpCircle class="w-5 h-5 text-emerald-600" />
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
            <span class="text-[11px] font-semibold text-emerald-800 bg-white px-3.5 py-1 rounded-full border border-emerald-200 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
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
            class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-colors cursor-pointer font-sora"
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
import {
  LayoutDashboard,
  User,
  Compass,
  CreditCard,
  FileText,
  ClipboardCheck,
  GraduationCap,
  ChevronDown,
  LogOut,
  HelpCircle,
  Bell,
  Shield
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import { useApplicantStore } from '@/stores/applicant';

const router = useRouter();
const authStore = useAuthStore();
const applicantStore = useApplicantStore();

const showNotifications = ref(false);
const showProfileMenu = ref(false);
const showSettingsMenu = ref(false);
const showMobileNav = ref(false);
const showRegistrationDropdown = ref(false);
const mobileRegistrationOpen = ref(true);
const showHelpdeskModal = ref(false);
const readNotificationIndices = ref(new Set());

const toggleMobileNav = () => {
  showMobileNav.value = !showMobileNav.value;
  if (showNotifications.value) showNotifications.value = false;
  if (showProfileMenu.value) showProfileMenu.value = false;
  if (showSettingsMenu.value) showSettingsMenu.value = false;
};

const navigateTo = (tab, section = null) => {
  if (router.currentRoute.value.path !== '/dashboard') {
    router.push('/dashboard');
  }
  applicantStore.setActiveTab(tab, section);
  showMobileNav.value = false;
  showRegistrationDropdown.value = false;
  showSettingsMenu.value = false;
  showProfileMenu.value = false;
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
    desc: 'Selamat datang di Portal PMB Universitas BTH. Lengkapi biodata, unggah berkas, dan ikuti tahapan seleksi.',
    time: 'Pengumuman',
    isRead: readNotificationIndices.value.has('welcome'),
    key: 'welcome',
  });

  list.push({
    title: 'Sekretariat & Pusat Bantuan PMB',
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

const userPhoto = computed(() => {
  return applicantStore.candidatePhoto || authStore.currentUser?.avatar || null;
});

const setAllowDemoAdmin = () => {
  localStorage.setItem('bth_allow_demo_admin', 'true');
};

const handleLogout = async () => {
  localStorage.removeItem('bth_allow_demo_admin');
  await authStore.logout();
  applicantStore.resetAllData();
  router.push('/login');
};
</script>
