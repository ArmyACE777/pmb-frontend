<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#2563EB] selection:text-white relative">
    <!-- Ambient & Institutional Watermark Background (Universitas BTH) -->
    <DashboardBackground :show-watermark="true" />

    <!-- ========================================================================= -->
    <!-- 1. HEADER UTAMA INSTITUSI & STATUS SESI                                   -->
    <!-- ========================================================================= -->
    <!-- ========================================================================= -->
    <!-- 1. HEADER UTAMA INSTITUSI & STATUS SESI                                   -->
    <!-- ========================================================================= -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        <!-- Logo & Nama Institusi -->
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src="/assets/icons/bth-emblem.png"
            alt="Logo Universitas Bakti Tunas Husada"
            class="h-8 sm:h-9 w-auto object-contain flex-shrink-0"
          />
          <div class="min-w-0">
            <div class="font-sora font-extrabold text-slate-900 text-xs sm:text-sm leading-tight truncate">
              <span class="sm:hidden">Universitas BTH</span>
              <span class="hidden sm:inline">Universitas Bakti Tunas Husada</span>
            </div>
            <div class="text-[10px] sm:text-[11px] text-slate-500 font-medium font-sans flex items-center gap-1.5 mt-0.5 truncate">
              <span>Panel PMB</span>
              <span class="text-slate-300">•</span>
              <span class="text-[#1E3A8A] font-semibold text-[10px] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/60 truncate max-w-[130px] sm:max-w-none">
                {{ activeRoleObject.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tombol Aksi Kanan (Sinkronisasi Data, Portal Mahasiswa, & Hamburger Mobile) -->
        <div class="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <router-link
            to="/dashboard"
            class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-lg border border-slate-200 transition-colors"
            title="Buka tampilan Portal Calon Mahasiswa"
          >
            <User class="w-3.5 h-3.5 text-slate-400" />
            <span>Portal Mahasiswa</span>
            <ExternalLink class="w-3 h-3 text-slate-400 ml-0.5" />
          </router-link>

          <button
            @click="syncPortalData"
            :disabled="adminStore.isLoadingBackend"
            class="p-2 sm:px-3 sm:py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5 shadow-2xs"
            title="Sinkronkan data pendaftar riil"
          >
            <RefreshCw class="w-3.5 h-3.5 text-slate-500" :class="{ 'animate-spin': adminStore.isLoadingBackend }" />
            <span class="hidden sm:inline">{{ adminStore.isLoadingBackend ? 'Sinkronisasi...' : 'Sinkronkan Data' }}</span>
          </button>

          <!-- Hamburger Button on Mobile / Tablet -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50 transition-colors cursor-pointer relative"
            title="Buka Menu Navigasi"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-4.5 h-4.5" />
            <X v-else class="w-4.5 h-4.5 text-rose-600" />
            <span
              v-if="adminStore.pendingVerificationCount > 0"
              class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"
            ></span>
          </button>
        </div>
      </div>
    </header>

    <!-- ========================================================================= -->
    <!-- 2. BILAH MENU NAVIGASI HORIZONTAL DASHBOARD (DESKTOP VIEWPORT LG+)        -->
    <!-- ========================================================================= -->
    <nav class="hidden lg:block sticky top-[57px] z-30 bg-slate-50/90 backdrop-blur-md pt-2.5 pb-2 transition-all">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <!-- Card Container Menu Horizontal (Pill / Floating Card) -->
        <div class="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs px-2.5 sm:px-3 py-1 flex items-center justify-between gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar relative min-h-[42px]">
          <!-- SISI KIRI: DAFTAR MENU UTAMA -->
          <div class="flex items-center gap-1 flex-nowrap py-0.5 flex-shrink-0">
            <!-- 1. Menu: Dashboard -->
            <button
              type="button"
              @click="selectDesk('overview')"
              class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
              :class="activeDesk === 'overview'
                ? 'bg-[#1E3A8A] text-white shadow-2xs'
                : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
            >
              <Home class="w-3.5 h-3.5 flex-shrink-0" :class="activeDesk === 'overview' ? 'text-white' : 'text-slate-500'" />
              <span>Dashboard</span>
            </button>

            <!-- 2. Menu: Data Mahasiswa -->
            <button
              type="button"
              @click="selectDesk('enrolment')"
              class="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
              :class="activeDesk === 'enrolment'
                ? 'bg-[#1E3A8A] text-white shadow-2xs'
                : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
            >
              <Users class="w-3.5 h-3.5 flex-shrink-0" :class="activeDesk === 'enrolment' ? 'text-white' : 'text-slate-500'" />
              <span>Data Mahasiswa</span>
            </button>

            <!-- 3. Menu: Data Referensi ˅ (Dropdown: Jenjang, Fakultas, Prodi) -->
            <div
              class="relative"
              @mouseenter="handleMouseEnterDropdown('referensi')"
              @mouseleave="closeDropdownWithDelay('referensi')"
            >
              <button
                type="button"
                @click="toggleDropdown('referensi')"
                class="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
                :class="isMasterDataActive
                  ? 'bg-[#1E3A8A] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
              >
                <BarChart2 class="w-3.5 h-3.5 flex-shrink-0" :class="isMasterDataActive ? 'text-white' : 'text-slate-500'" />
                <span>Data Referensi</span>
                <ChevronDown class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': openDropdownName === 'referensi' }" />
              </button>

              <!-- Dropdown Menu Box: Data Referensi (Zero-gap padding wrapper) -->
              <div
                v-if="openDropdownName === 'referensi'"
                @mouseenter="clearDropdownTimer"
                @mouseleave="closeDropdownWithDelay('referensi')"
                class="absolute left-0 top-full pt-1.5 z-50 animate-fadeIn font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2"
              >
                <div class="w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5">
                  <button
                    type="button"
                    @click="selectMasterData('jenjang')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors"
                    :class="activeDesk === 'master-data' && activeMasterSubDesk === 'jenjang' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : 'text-slate-700 font-medium'"
                  >
                    <span>Jenjang Pendidikan</span>
                    <span class="text-[10px] text-slate-400 font-mono">D3/S1/Prof</span>
                  </button>
                  <button
                    type="button"
                    @click="selectMasterData('fakultas')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors"
                    :class="activeDesk === 'master-data' && activeMasterSubDesk === 'fakultas' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : 'text-slate-700 font-medium'"
                  >
                    <span>Fakultas</span>
                    <span class="text-[10px] text-slate-400 font-mono">3 Unit</span>
                  </button>
                  <button
                    type="button"
                    @click="selectMasterData('programs')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors"
                    :class="activeDesk === 'master-data' && activeMasterSubDesk === 'programs' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : 'text-slate-700 font-medium'"
                  >
                    <span>Program Studi (Prodi)</span>
                    <span class="text-[10px] text-slate-400 font-mono">Katalog</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 4. Menu: Jalur Pendaftaran ˅ (Dropdown: Jalur Pendaftaran, Seleksi Jalur) -->
            <div
              class="relative"
              @mouseenter="handleMouseEnterDropdown('jalur')"
              @mouseleave="closeDropdownWithDelay('jalur')"
            >
              <button
                type="button"
                @click="toggleDropdown('jalur')"
                class="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
                :class="isJalurActive
                  ? 'bg-[#1E3A8A] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
              >
                <span>Jalur Pendaftaran</span>
                <ChevronDown class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': openDropdownName === 'jalur' }" />
              </button>

              <!-- Dropdown Menu Box: Jalur Pendaftaran -->
              <div
                v-if="openDropdownName === 'jalur'"
                @mouseenter="clearDropdownTimer"
                @mouseleave="closeDropdownWithDelay('jalur')"
                class="absolute left-0 top-full pt-1.5 z-50 animate-fadeIn font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2"
              >
                <div class="w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5">
                  <button
                    type="button"
                    @click="selectDesk('jalur')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors"
                    :class="activeDesk === 'jalur' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : 'text-slate-700 font-medium'"
                  >
                    <span>Jalur Pendaftaran</span>
                    <span class="text-[10px] text-slate-400">Kuota & Jadwal</span>
                  </button>
                  <button
                    type="button"
                    @click="selectDesk('scoring')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors"
                    :class="activeDesk === 'scoring' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : 'text-slate-700 font-medium'"
                  >
                    <span>Seleksi Jalur</span>
                    <span class="text-[10px] text-slate-400">CBT & Nilai</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 5. Menu: Pendaftar -->
            <button
              type="button"
              @click="selectDesk('verification')"
              class="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
              :class="activeDesk === 'verification'
                ? 'bg-[#1E3A8A] text-white shadow-2xs'
                : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
            >
              <FolderCheck class="w-3.5 h-3.5 flex-shrink-0" :class="activeDesk === 'verification' ? 'text-white' : 'text-slate-500'" />
              <span>Pendaftar</span>
              <span
                v-if="adminStore.pendingVerificationCount > 0"
                class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold leading-none flex items-center justify-center min-w-[16px] h-3.5"
                :class="activeDesk === 'verification' ? 'bg-white text-[#1E3A8A]' : 'bg-amber-100 text-amber-800'"
              >
                {{ adminStore.pendingVerificationCount }}
              </span>
            </button>

            <!-- 6. Menu: Pembayaran ˅ (Dropdown: Rekonsiliasi, Verifikasi Pembayaran, Permohonan Cicilan) -->
            <div
              class="relative"
              @mouseenter="handleMouseEnterDropdown('pembayaran')"
              @mouseleave="closeDropdownWithDelay('pembayaran')"
            >
              <button
                type="button"
                @click="toggleDropdown('pembayaran')"
                class="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
                :class="activeDesk === 'finance'
                  ? 'bg-[#1E3A8A] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
              >
                <span>Pembayaran</span>
                <ChevronDown class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': openDropdownName === 'pembayaran' }" />
              </button>

              <!-- Dropdown Menu Box: Pembayaran -->
              <div
                v-if="openDropdownName === 'pembayaran'"
                @mouseenter="clearDropdownTimer"
                @mouseleave="closeDropdownWithDelay('pembayaran')"
                class="absolute left-0 top-full pt-1.5 z-50 animate-fadeIn font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2"
              >
                <div class="w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5">
                  <button
                    type="button"
                    @click="selectDesk('finance')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors"
                    :class="activeDesk === 'finance' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : 'text-slate-700 font-medium'"
                  >
                    <span>Rekonsiliasi Transaksi</span>
                    <span class="text-[10px] text-slate-400">VA & QRIS</span>
                  </button>
                  <button
                    type="button"
                    @click="selectDesk('finance')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors text-slate-700 font-medium"
                  >
                    <span>Verifikasi Tagihan</span>
                    <span class="text-[10px] text-slate-400">Formulir / UKT</span>
                  </button>
                  <button
                    type="button"
                    @click="selectDesk('finance')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors text-slate-700 font-medium"
                  >
                    <span>Permohonan Cicilan</span>
                    <span class="text-[10px] text-slate-400">UKT Maba</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 7. Menu: Code Referal -->
            <button
              type="button"
              @click="selectDesk('referral')"
              class="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
              :class="activeDesk === 'referral'
                ? 'bg-[#1E3A8A] text-white shadow-2xs'
                : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
            >
              <Link2 class="w-3.5 h-3.5 flex-shrink-0" :class="activeDesk === 'referral' ? 'text-white' : 'text-slate-500'" />
              <span>Code Referal</span>
            </button>

            <!-- 8. Menu: Report Pendaftar -->
            <button
              type="button"
              @click="selectDesk('reporting')"
              class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
              :class="activeDesk === 'reporting'
                ? 'bg-[#1E3A8A] text-white shadow-2xs'
                : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
            >
              <FileSpreadsheet class="w-3.5 h-3.5 flex-shrink-0" :class="activeDesk === 'reporting' ? 'text-white' : 'text-slate-500'" />
              <span>Report Pendaftar</span>
            </button>
          </div>

          <!-- SISI KANAN: PENGATURAN & KELUAR -->
          <div class="ml-auto flex items-center gap-1 sm:gap-1.5 flex-shrink-0 pl-2">
            <!-- 9. Menu: Pengaturan ˅ (Dropdown) -->
            <div
              class="relative"
              @mouseenter="handleMouseEnterDropdown('pengaturan')"
              @mouseleave="closeDropdownWithDelay('pengaturan')"
            >
              <button
                type="button"
                @click="toggleDropdown('pengaturan')"
                class="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
                :class="activeDesk === 'master-data' && activeMasterSubDesk === 'rbac'
                  ? 'bg-[#1E3A8A] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50'"
              >
                <span>Pengaturan</span>
                <ChevronDown class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': openDropdownName === 'pengaturan' }" />
              </button>

              <!-- Dropdown Menu Box: Pengaturan -->
              <div
                v-if="openDropdownName === 'pengaturan'"
                @mouseenter="clearDropdownTimer"
                @mouseleave="closeDropdownWithDelay('pengaturan')"
                class="absolute right-0 top-full pt-1.5 z-50 animate-fadeIn font-sans before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2"
              >
                <div class="w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5">
                  <div class="px-3.5 py-1.5 border-b border-slate-100">
                    <div class="text-[11px] font-bold text-slate-900 truncate">{{ currentAdminName }}</div>
                    <div class="text-[10px] text-slate-400 truncate">{{ activeRoleObject.name }}</div>
                  </div>

                  <!-- Role Switcher (Simulasi Peran) -->
                  <div class="px-3.5 py-2 border-b border-slate-100 bg-slate-50/70">
                    <label class="block text-[10px] font-semibold text-slate-500 mb-1">Simulasi Peran Admin:</label>
                    <select
                      v-model="simulatedRole"
                      @change="handleRoleChange"
                      class="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-800 outline-none focus:border-[#1E3A8A]"
                    >
                      <option v-for="r in rolesList" :key="r.id" :value="r.id">
                        {{ r.name }}
                      </option>
                    </select>
                  </div>

                  <button
                    type="button"
                    @click="selectMasterData('rbac')"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors"
                    :class="activeDesk === 'master-data' && activeMasterSubDesk === 'rbac' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : 'text-slate-700 font-medium'"
                  >
                    <span>Hak Akses Peran (RBAC)</span>
                    <ShieldCheck class="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <router-link
                    to="/dashboard"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 hover:text-[#1E3A8A] flex items-center justify-between cursor-pointer transition-colors text-slate-700 font-medium"
                  >
                    <span>Portal Mahasiswa</span>
                    <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
                  </router-link>
                </div>
              </div>
            </div>

            <!-- 10. Menu: Keluar (Merah Elegan Sesuai Gambar Contoh) -->
            <button
              type="button"
              @click="handleLogout"
              class="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
              title="Keluar dari sesi kerja admin"
            >
              <LogOut class="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- ========================================================================= -->
    <!-- 2.1 BILAH MENU RINGKAS MOBILE (RESPONSIVE VIEWPORT < LG)                  -->
    <!-- HANYA MENAMPILKAN MODUL SESUAI HAK AKSES PERAN AKTIF                      -->
    <!-- ========================================================================= -->
    <nav class="lg:hidden sticky top-[53px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 py-2 shadow-2xs">
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          v-for="item in allowedMobileMenuItems"
          :key="item.id"
          type="button"
          @click="handleMobileMenuClick(item)"
          class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex-shrink-0 whitespace-nowrap h-7.5"
          :class="isItemActive(item)
            ? 'bg-[#1E3A8A] text-white shadow-2xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
        >
          <component :is="item.icon" class="w-3.5 h-3.5 flex-shrink-0" :class="isItemActive(item) ? 'text-white' : 'text-slate-500'" />
          <span>{{ item.label }}</span>
          <ChevronDown
            v-if="item.hasSubmenu"
            class="w-3 h-3 opacity-60 ml-0.5 flex-shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': mobileSubmenuItem?.id === item.id }"
          />
          <span
            v-if="item.id === 'verification' && adminStore.pendingVerificationCount > 0"
            class="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold leading-none min-w-[15px] h-3.5 flex items-center justify-center"
            :class="isItemActive(item) ? 'bg-white text-[#1E3A8A]' : 'bg-amber-200 text-amber-900'"
          >
            {{ adminStore.pendingVerificationCount }}
          </span>
        </button>
      </div>
    </nav>

    <!-- ========================================================================= -->
    <!-- 2.2 ACTION SHEET DROPDOWN SUBMENU MOBILE (TELEPORTED TO BODY)             -->
    <!-- MENGATASI ISU OVERFLOW DAN MEMUDAHKAN PILIH SUB-MODUL DI HP              -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div
        v-if="mobileSubmenuItem"
        class="fixed inset-0 z-50 lg:hidden flex flex-col justify-end"
      >
        <!-- Backdrop -->
        <div
          @click="mobileSubmenuItem = null"
          class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        ></div>

        <!-- Action Sheet Panel -->
        <div class="relative bg-white rounded-t-2xl shadow-2xl p-4 max-h-[80vh] overflow-y-auto z-10 font-sans border-t border-slate-200 animate-slideUp">
          <!-- Grab handle -->
          <div class="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3"></div>

          <!-- Header Sheet -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <component :is="mobileSubmenuItem.icon" class="w-4 h-4 text-[#1E3A8A]" />
              <div>
                <h3 class="font-sora font-bold text-sm text-slate-900">
                  {{ mobileSubmenuItem.label }}
                </h3>
                <p class="text-[10px] text-slate-500 font-sans">
                  Pilih sub-menu operasional yang ingin dibuka:
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="mobileSubmenuItem = null"
              class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X class="w-4.5 h-4.5" />
            </button>
          </div>

          <!-- Sub-items List (Thumb-friendly cards) -->
          <div class="py-2.5 space-y-2">
            <button
              v-for="sub in mobileSubmenuItem.subItems"
              :key="sub.id"
              type="button"
              @click="selectMobileSubItem(mobileSubmenuItem, sub)"
              class="w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer"
              :class="isSubItemActive(mobileSubmenuItem, sub)
                ? 'bg-blue-50/80 border-blue-200 text-[#1E3A8A] font-bold shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'"
            >
              <div>
                <div class="text-xs">{{ sub.label }}</div>
                <div class="text-[10px] text-slate-400 mt-0.5 font-normal">{{ sub.hint }}</div>
              </div>

              <div class="flex items-center gap-1.5">
                <span
                  v-if="isSubItemActive(mobileSubmenuItem, sub)"
                  class="text-[10px] font-bold text-[#1E3A8A] bg-white border border-blue-200 px-2 py-0.5 rounded-full"
                >
                  Aktif
                </span>
                <ChevronRight v-else class="w-4 h-4 text-slate-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- 3. MOBILE DRAWER (RESPONSIVE SCREEN < LG DENGAN RBAC ROLE SWITCHER)       -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 lg:hidden flex"
      >
        <div @click="isMobileMenuOpen = false" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"></div>
        <div class="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 font-sans">
          <!-- Drawer Header: Kampus & Profil Admin -->
          <div class="p-4 border-b border-slate-100 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <img src="/assets/icons/bth-emblem.png" class="h-7 w-auto object-contain" />
                <div>
                  <div class="font-bold text-xs text-slate-900 font-sora">Universitas BTH</div>
                  <div class="text-[10px] text-slate-500">Panel PMB 2026/2027</div>
                </div>
              </div>
              <button @click="isMobileMenuOpen = false" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Kartu Identitas Profil Admin & Pemilih Peran RBAC -->
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-blue-100 text-[#1E3A8A] font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">
                  {{ activeRoleObject.avatarInitials || 'AD' }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-bold text-slate-900 truncate">{{ currentAdminName }}</div>
                  <div class="text-[10px] text-slate-500 truncate">{{ activeRoleObject.name }}</div>
                </div>
              </div>

              <!-- Role Switcher Cepat (Simulasi Semua Peran) -->
              <div class="pt-1.5 border-t border-slate-200/60">
                <label class="block text-[10px] font-semibold text-slate-500 mb-1">Simulasi Peran Admin:</label>
                <select
                  v-model="simulatedRole"
                  @change="handleRoleChange"
                  class="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#1E3A8A]"
                >
                  <option v-for="r in rolesList" :key="r.id" :value="r.id">
                    {{ r.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Drawer Body: Daftar Menu Berdasarkan Hak Akses Peran Aktif -->
          <div class="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-sans">
            <div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">
              Meja Kerja Berwenang ({{ allowedMobileMenuItems.length }} Modul)
            </div>

            <button
              v-for="item in allowedMobileMenuItems"
              :key="item.id"
              type="button"
              @click="handleMobileMenuClick(item)"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer"
              :class="isItemActive(item)
                ? 'bg-[#1E3A8A] text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'"
            >
              <div class="flex items-center gap-2.5">
                <component :is="item.icon" class="w-4 h-4 flex-shrink-0" :class="isItemActive(item) ? 'text-white' : 'text-slate-500'" />
                <span>{{ item.label }}</span>
              </div>

              <span
                v-if="item.id === 'verification' && adminStore.pendingVerificationCount > 0"
                class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                :class="isItemActive(item) ? 'bg-white text-[#1E3A8A]' : 'bg-amber-100 text-amber-800'"
              >
                {{ adminStore.pendingVerificationCount }}
              </span>
            </button>

            <!-- Sub-menu Master Data jika diizinkan -->
            <div v-if="isDeskAllowed('master-data')" class="pt-2">
              <div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">
                Master Data & Pengaturan
              </div>
              <div class="pl-2 space-y-0.5">
                <button
                  @click="selectMasterData('jenjang')"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-left cursor-pointer"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'jenjang' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : ''"
                >
                  <span>Jenjang Pendidikan</span>
                </button>
                <button
                  @click="selectMasterData('fakultas')"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-left cursor-pointer"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'fakultas' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : ''"
                >
                  <span>Fakultas</span>
                </button>
                <button
                  @click="selectMasterData('programs')"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-left cursor-pointer"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'programs' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : ''"
                >
                  <span>Program Studi</span>
                </button>
                <button
                  v-if="currentRole === 'superadmin'"
                  @click="selectMasterData('rbac')"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-left cursor-pointer"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'rbac' ? 'font-bold text-[#1E3A8A] bg-blue-50/60' : ''"
                >
                  <span>Hak Akses Peran (RBAC)</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-3 border-t border-slate-100 space-y-2">
            <router-link
              to="/dashboard"
              @click="isMobileMenuOpen = false"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-medium text-xs transition-colors"
            >
              <User class="w-3.5 h-3.5 text-slate-500" />
              <span>Buka Portal Mahasiswa</span>
            </router-link>

            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              <LogOut class="w-3.5 h-3.5" />
              <span>Keluar Sesi Kerja</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ========================================================================= -->
    <!-- 4. KONTEN AREA KERJA (WORKSPACE FULL WIDTH 100%)                          -->
    <!-- ========================================================================= -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-5 relative z-10">
      <!-- Breadcrumb Navigasi Meja Kerja -->
      <div class="flex items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div class="flex items-center gap-2 text-xs font-sans text-slate-500">
          <span>Panel PMB</span>
          <span class="text-slate-300">/</span>
          <span class="font-medium text-slate-700">{{ currentDeskTitle }}</span>
          <span v-if="activeMasterSubDesk && activeDesk === 'master-data'" class="text-slate-300">/</span>
          <span v-if="activeMasterSubDesk && activeDesk === 'master-data'" class="font-bold text-[#1E3A8A]">
            {{ activeMasterSubDesk === 'jenjang' ? 'Jenjang Pendidikan' : activeMasterSubDesk === 'fakultas' ? 'Fakultas' : activeMasterSubDesk === 'rbac' ? 'Hak Akses RBAC' : 'Program Studi' }}
          </span>
        </div>

        <div class="text-[11px] text-slate-400 font-sans hidden sm:block">
          Sistem Informasi Penerimaan Mahasiswa Baru Universitas BTH
        </div>
      </div>

      <!-- RBAC Access Restricted Screen -->
      <div
        v-if="!isCurrentDeskAllowed"
        class="bg-white rounded-xl p-8 sm:p-10 border border-slate-200 text-center max-w-md mx-auto my-12 space-y-4 shadow-xs"
      >
        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200">
          <Lock class="w-6 h-6" />
        </div>

        <div class="space-y-1">
          <h2 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
            Akses Terbatas
          </h2>
          <p class="text-xs text-slate-500 font-sans leading-relaxed">
            Modul <strong>{{ currentDeskTitle }}</strong> tidak termasuk dalam kewenangan peran
            <span class="font-semibold text-slate-700">{{ activeRoleObject.name }}</span>.
          </p>
        </div>

        <div class="pt-2">
          <button
            @click="activeDesk = 'overview'"
            class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Kembali ke Ringkasan
          </button>
        </div>
      </div>

      <!-- DESK MODUL AKTIF -->
      <div v-else>
        <!-- Meja 1: Dashboard Ringkasan & KPI -->
        <AdminOverviewDesk v-if="activeDesk === 'overview'" :current-role="currentRole" @switch-desk="selectDesk" />

        <!-- Meja 2: Data Mahasiswa (Penetapan NIM & Onboarding) -->
        <StudentEnrolmentDesk v-else-if="activeDesk === 'enrolment'" :current-role="currentRole" />

        <!-- Meja 3: Data Referensi (Jenjang, Fakultas, Prodi, RBAC) -->
        <MasterDataOrganizationDesk
          v-else-if="activeDesk === 'master-data'"
          :current-role="currentRole"
          :initial-sub-desk="activeMasterSubDesk"
        />

        <!-- Meja 4: Jalur Pendaftaran (Manajemen Jalur, Kuota, Biaya Formulir) -->
        <AdmissionTracksDesk v-else-if="activeDesk === 'jalur'" :current-role="currentRole" />

        <!-- Meja 5: Seleksi Jalur (CBT, Wawancara, Penilaian Kelulusan) -->
        <SelectionScoringDesk v-else-if="activeDesk === 'scoring'" :current-role="currentRole" />

        <!-- Meja 6: Pendaftar (Verifikasi Berkas, Mutasi Jalur, Pengunduran Diri) -->
        <DocumentVerificationDesk v-else-if="activeDesk === 'verification'" :current-role="currentRole" />

        <!-- Meja 7: Pembayaran (Rekonsiliasi Keuangan, Duitku, Cicilan) -->
        <PaymentReconciliationDesk v-else-if="activeDesk === 'finance'" :current-role="currentRole" />

        <!-- Meja 8: Code Referal (Guru BK, Mitra Sekolah, Komisi & Setoran) -->
        <ReferralManagementDesk v-else-if="activeDesk === 'referral'" :current-role="currentRole" />

        <!-- Meja 9: Report Pendaftar (Pelaporan, Demografi & Ekspor) -->
        <ReportingNotificationDesk v-else-if="activeDesk === 'reporting'" :current-role="currentRole" />

        <!-- Meja 10: Dashboard Institusi Multi-Tingkat -->
        <InstitutionalDashboardDesk v-else-if="activeDesk === 'institutional'" :current-role="currentRole" />
      </div>
    </main>

    <!-- Institutional Footer -->
    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto relative z-10">
      <div class="max-w-7xl mx-auto px-4">
        &copy; 2026 Sekretariat PMB Universitas Bakti Tunas Husada. Sistem Informasi Penerimaan Mahasiswa Baru Terpadu.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Home,
  Users,
  BarChart2,
  ChevronDown,
  FolderCheck,
  CreditCard,
  Link2,
  FileSpreadsheet,
  LogOut,
  RefreshCw,
  ExternalLink,
  User,
  ShieldCheck,
  Menu,
  X,
  Lock,
  Building2,
  GitBranch,
  ClipboardCheck,
  ChevronRight,
} from 'lucide-vue-next';
import DashboardBackground from '@/components/common/DashboardBackground.vue';
import { useAdminStore } from '@/stores/admin';
import { useOrganizationStore } from '@/stores/organization';
import { useAuthStore } from '@/stores/auth';

import AdminOverviewDesk from '@/components/admin/AdminOverviewDesk.vue';
import DocumentVerificationDesk from '@/components/admin/DocumentVerificationDesk.vue';
import PaymentReconciliationDesk from '@/components/admin/PaymentReconciliationDesk.vue';
import SelectionScoringDesk from '@/components/admin/SelectionScoringDesk.vue';
import StudentEnrolmentDesk from '@/components/admin/StudentEnrolmentDesk.vue';
import InstitutionalDashboardDesk from '@/components/admin/InstitutionalDashboardDesk.vue';
import ReportingNotificationDesk from '@/components/admin/ReportingNotificationDesk.vue';
import MasterDataOrganizationDesk from '@/components/admin/MasterDataOrganizationDesk.vue';
import AdmissionTracksDesk from '@/components/admin/AdmissionTracksDesk.vue';
import ReferralManagementDesk from '@/components/admin/ReferralManagementDesk.vue';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const organizationStore = useOrganizationStore();
const authStore = useAuthStore();
const toast = useToast();

const activeDesk = ref(route.query.desk || 'overview');
const activeMasterSubDesk = ref(route.query.subdesk || 'programs');
const isMobileMenuOpen = ref(false);
const openDropdownName = ref(null); // 'referensi' | 'jalur' | 'pembayaran' | 'pengaturan' | null
const mobileSubmenuItem = ref(null);

let dropdownTimer = null;

const clearDropdownTimer = () => {
  if (dropdownTimer) {
    clearTimeout(dropdownTimer);
    dropdownTimer = null;
  }
};

const handleMouseEnterDropdown = (name) => {
  clearDropdownTimer();
  openDropdownName.value = name;
};

const toggleDropdown = (name) => {
  clearDropdownTimer();
  openDropdownName.value = openDropdownName.value === name ? null : name;
};

const closeDropdownWithDelay = (name) => {
  clearDropdownTimer();
  dropdownTimer = setTimeout(() => {
    if (openDropdownName.value === name) {
      openDropdownName.value = null;
    }
  }, 350);
};

// =========================================================================
// RBAC: DAFTAR PERAN (ROLES) & HAK AKSES
// =========================================================================
const rolesList = [
  {
    id: 'superadmin',
    name: 'Super Administrator',
    avatarInitials: 'SA',
    defaultUserName: 'Super Administrator PMB',
  },
  {
    id: 'keuangan',
    name: 'Bagian Keuangan PMB',
    avatarInitials: 'KU',
    defaultUserName: 'Bendahara Penerimaan PMB',
  },
  {
    id: 'prodi',
    name: 'Ketua Program Studi (Kaprodi)',
    avatarInitials: 'KP',
    defaultUserName: 'Kaprodi S1 Farmasi BTH',
  },
  {
    id: 'verifikator',
    name: 'Verifikator Berkas PMB',
    avatarInitials: 'VB',
    defaultUserName: 'Tim Verifikasi Dokumen',
  },
  {
    id: 'penguji',
    name: 'Dosen Penguji CBT & Wawancara',
    avatarInitials: 'DP',
    defaultUserName: 'Tim Penguji PMB BTH',
  },
  {
    id: 'pimpinan',
    name: 'Pimpinan Rektorat / Dekanat',
    avatarInitials: 'WR',
    defaultUserName: 'Wakil Rektor Bidang Akademik',
  },
  {
    id: 'dekan',
    name: 'Dekan Fakultas',
    avatarInitials: 'DK',
    defaultUserName: 'Dekan Fakultas Farmasi BTH',
  },
];

const getInitialRole = () => {
  const saved = localStorage.getItem('bth_admin_rbac_role');
  if (saved && rolesList.some((r) => r.id === saved)) return saved;
  const roles = authStore.userRoles || [];
  if (roles.length > 0) {
    const matched = rolesList.find((r) => roles.includes(r.id));
    if (matched) return matched.id;
    if (roles.includes('superadmin') || roles.includes('admin') || roles.includes('admin_pmb') || roles.includes('panitia')) return 'superadmin';
    if (roles.includes('keuangan')) return 'keuangan';
    if (roles.includes('verifikator')) return 'verifikator';
    if (roles.includes('penguji')) return 'penguji';
    if (roles.includes('prodi') || roles.includes('kaprodi') || roles.includes('dosen')) return 'prodi';
    if (roles.includes('pimpinan') || roles.includes('warek') || roles.includes('rektor')) return 'pimpinan';
    if (roles.includes('dekan')) return 'dekan';
  }
  if (authStore.currentUser?.role) {
    const matched = rolesList.find((r) => r.id === authStore.currentUser.role);
    if (matched) return matched.id;
  }
  return 'superadmin';
};

const simulatedRole = ref(getInitialRole());

const currentRole = computed(() => {
  return simulatedRole.value || 'superadmin';
});

const activeRoleObject = computed(() => {
  return rolesList.find((r) => r.id === currentRole.value) || rolesList[0];
});

const currentAdminName = computed(() => {
  return authStore.currentUser?.full_name || activeRoleObject.value.defaultUserName;
});

// Matriks RBAC per meja kerja
const rbacRules = {
  overview: ['superadmin', 'keuangan', 'prodi', 'verifikator', 'penguji', 'pimpinan', 'dekan'],
  enrolment: ['superadmin', 'prodi'],
  'master-data': ['superadmin', 'dekan'],
  jalur: ['superadmin', 'dekan', 'prodi'],
  scoring: ['superadmin', 'prodi', 'penguji', 'dekan'],
  verification: ['superadmin', 'verifikator', 'dekan'],
  finance: ['superadmin', 'keuangan'],
  referral: ['superadmin', 'keuangan', 'pimpinan'],
  reporting: ['superadmin', 'keuangan', 'pimpinan', 'dekan'],
  institutional: ['superadmin', 'prodi', 'pimpinan', 'dekan'],
};

const isDeskAllowed = (deskId) => {
  const allowed = rbacRules[deskId] || ['superadmin'];
  return allowed.includes(currentRole.value);
};

const isCurrentDeskAllowed = computed(() => {
  return isDeskAllowed(activeDesk.value);
});

// Daftar Semua Meja Kerja untuk Navigasi Mobile (Lengkap dengan Sub-Menu)
const allDeskItems = [
  { id: 'overview', label: 'Dashboard', icon: Home },
  { id: 'enrolment', label: 'Data Mahasiswa', icon: Users },
  {
    id: 'master-data',
    label: 'Data Referensi',
    icon: BarChart2,
    hasSubmenu: true,
    subdesk: 'programs',
    subItems: [
      { id: 'jenjang', label: 'Jenjang Pendidikan', hint: 'Klasifikasi D3 / S1 / Profesi', subdesk: 'jenjang' },
      { id: 'fakultas', label: 'Fakultas Akademik', hint: '3 Unit Fakultas Universitas BTH', subdesk: 'fakultas' },
      { id: 'programs', label: 'Program Studi (Prodi)', hint: 'Katalog Prodi & Daya Tampung', subdesk: 'programs' },
    ],
  },
  {
    id: 'jalur',
    label: 'Jalur Pendaftaran',
    icon: GitBranch,
    hasSubmenu: true,
    subItems: [
      { id: 'jalur', label: 'Jalur Pendaftaran', hint: 'Kuota & Jadwal Gelombang PMB', desk: 'jalur' },
      { id: 'scoring', label: 'Seleksi Jalur', hint: 'Ujian Mandiri CBT & Skor Kelulusan', desk: 'scoring' },
    ],
  },
  { id: 'verification', label: 'Pendaftar', icon: FolderCheck },
  {
    id: 'finance',
    label: 'Pembayaran',
    icon: CreditCard,
    hasSubmenu: true,
    subItems: [
      { id: 'reconciliation', label: 'Rekonsiliasi Transaksi', hint: 'Sinkronisasi VA & QRIS Duitku', desk: 'finance' },
      { id: 'refund', label: 'Review Refund Pengunduran Diri', hint: 'Verifikasi Pengembalian Biaya', desk: 'finance' },
      { id: 'installments', label: 'Permohonan Cicilan UKT', hint: 'Keringanan Biaya Registrasi', desk: 'finance' },
    ],
  },
  { id: 'referral', label: 'Code Referal', icon: Link2 },
  { id: 'reporting', label: 'Report Pendaftar', icon: FileSpreadsheet },
  { id: 'institutional', label: 'Institusi', icon: Building2 },
];

// Chip Navigasi Mobile Dinamis Berdasarkan Hak Akses Peran Aktif
const allowedMobileMenuItems = computed(() => {
  return allDeskItems.filter((item) => isDeskAllowed(item.id));
});

const isItemActive = (item) => {
  if (item.id === 'master-data') {
    return activeDesk.value === 'master-data' && activeMasterSubDesk.value !== 'rbac';
  }
  if (item.id === 'jalur') {
    return activeDesk.value === 'jalur' || activeDesk.value === 'scoring';
  }
  return activeDesk.value === item.id;
};

const handleMobileMenuClick = (item) => {
  if (item.hasSubmenu) {
    mobileSubmenuItem.value = item;
  } else {
    selectDesk(item.id);
  }
};

const selectMobileSubItem = (parentItem, sub) => {
  if (parentItem.id === 'master-data') {
    selectMasterData(sub.subdesk);
  } else if (sub.desk) {
    selectDesk(sub.desk);
  }
  mobileSubmenuItem.value = null;
};

const isSubItemActive = (parentItem, sub) => {
  if (parentItem.id === 'master-data') {
    return activeDesk.value === 'master-data' && activeMasterSubDesk.value === sub.subdesk;
  }
  return activeDesk.value === sub.desk || activeDesk.value === sub.id;
};

const handleRoleChange = () => {
  localStorage.setItem('bth_admin_rbac_role', simulatedRole.value);
  if (!isDeskAllowed(activeDesk.value)) {
    selectDesk('overview');
  }
  toast.success(`Peran admin dialihkan ke: ${activeRoleObject.value.name}`);
};

// Penentuan Status Aktif Menu Desktop
const isMasterDataActive = computed(() => {
  return activeDesk.value === 'master-data' && activeMasterSubDesk.value !== 'rbac';
});

const isJalurActive = computed(() => {
  return activeDesk.value === 'jalur' || activeDesk.value === 'scoring';
});

const currentDeskTitle = computed(() => {
  const titles = {
    overview: 'Dashboard & Ringkasan KPI',
    enrolment: 'Data Mahasiswa & Penetapan NIM',
    'master-data': 'Data Referensi & Master Data',
    jalur: 'Manajemen Jalur Pendaftaran',
    scoring: 'Seleksi Jalur & Ujian CBT',
    verification: 'Pendaftar & Verifikasi Berkas',
    finance: 'Pembayaran & Rekonsiliasi Keuangan',
    referral: 'Kode Referal Guru BK & Mitra',
    reporting: 'Report Pendaftar & Ekspor',
    institutional: 'Dashboard Institusi',
  };
  return titles[activeDesk.value] || 'Meja Kerja PMB';
});

const selectDesk = (deskId, subdesk = null) => {
  activeDesk.value = deskId;
  openDropdownName.value = null;
  isMobileMenuOpen.value = false;
  if (subdesk) {
    activeMasterSubDesk.value = subdesk;
  }
  const query = { ...route.query, desk: deskId };
  if (subdesk) query.subdesk = subdesk;
  else delete query.subdesk;
  router.replace({ query });
};

const selectMasterData = (subdesk) => {
  activeDesk.value = 'master-data';
  activeMasterSubDesk.value = subdesk;
  openDropdownName.value = null;
  isMobileMenuOpen.value = false;
  router.replace({ query: { ...route.query, desk: 'master-data', subdesk } });
};

const syncPortalData = async () => {
  toast.info('Memulai sinkronisasi data pendaftar & referensi...');
  try {
    await Promise.all([
      adminStore.fetchBackendApplicants(),
      organizationStore.fetchFaculties(),
      organizationStore.fetchStudyPrograms(),
    ]);
    toast.success('Data pendaftar dan master organisasi berhasil disinkronkan.');
  } catch (err) {
    toast.info('Data telah diselaraskan dengan basis data lokal.');
  }
};

const handleLogout = () => {
  authStore.clearAuth();
  localStorage.removeItem('bth_admin_rbac_role');
  router.push({ path: '/login', query: { logout: 'true' } });
};

// Global click listener to close dropdown when clicked outside
const handleDocumentClick = (e) => {
  if (!e.target.closest('nav')) {
    openDropdownName.value = null;
  }
};

watch(
  () => route.query.desk,
  (newDesk) => {
    if (newDesk) {
      activeDesk.value = newDesk;
    } else {
      activeDesk.value = 'overview';
    }
  }
);

watch(
  () => route.query.subdesk,
  (newSub) => {
    if (newSub) {
      activeMasterSubDesk.value = newSub;
    }
  }
);

onMounted(async () => {
  document.addEventListener('click', handleDocumentClick);
  if (route.query.desk) {
    activeDesk.value = route.query.desk;
  }
  if (route.query.subdesk) {
    activeMasterSubDesk.value = route.query.subdesk;
  }
  adminStore.syncAllLocalApplicants();
  await Promise.all([
    adminStore.fetchBackendApplicants(),
    organizationStore.fetchFaculties(),
    organizationStore.fetchStudyPrograms(),
  ]);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
  if (dropdownTimer) clearTimeout(dropdownTimer);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
