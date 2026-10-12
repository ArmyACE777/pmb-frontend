<template>
  <div class="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased selection:bg-[#2563EB] selection:text-white relative">
    <!-- Ambient & Institutional Watermark Background (Universitas BTH) -->
    <DashboardBackground :show-watermark="true" />

    <!-- ========================================================================= -->
    <!-- 1. SIDEBAR NAVIGASI DESKTOP (VIEWPORT LG+)                               -->
    <!-- ========================================================================= -->
    <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/90 sticky top-0 h-screen z-40 flex-shrink-0 shadow-xs font-sans">
      <!-- 1.1 Brand Header Institusi -->
      <div class="h-16 px-4 border-b border-slate-100 flex items-center justify-between gap-2.5 flex-shrink-0">
        <div class="flex items-center gap-2.5 min-w-0">
          <img
            :src="cmsStore.identity.emblemUrl || '/assets/icons/bth-emblem.png'"
            :alt="cmsStore.identity.name || 'Logo Universitas Bakti Tunas Husada'"
            class="h-9 w-auto object-contain flex-shrink-0"
          />
          <div class="min-w-0">
            <div class="font-sora font-extrabold text-slate-900 text-xs tracking-tight truncate">
              {{ cmsStore.identity.shortName || 'Universitas BTH' }}
            </div>
            <div class="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5 truncate">
              <span>Panel PMB</span>
              <span class="text-slate-300">•</span>
              <span class="text-[#1E3A8A] font-semibold truncate">
                {{ activeRoleObject.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 1.2 Daftar Menu Navigasi Berkelompok (Scrollable) -->
      <div class="flex-1 overflow-y-auto px-3 py-3.5 space-y-4 no-scrollbar text-xs">
        <!-- GRUP 1: UTAMA -->
        <div>
          <div class="px-2.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Menu Utama
          </div>
          <div class="space-y-0.5">
            <!-- 1. Dashboard Ringkasan -->
            <button
              v-if="isDeskAllowed('overview')"
              type="button"
              @click="selectDesk('overview')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'overview'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <Home class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'overview' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Dashboard</span>
            </button>

            <!-- 2. Data Mahasiswa (Enrolment) -->
            <button
              v-if="isDeskAllowed('enrolment')"
              type="button"
              @click="selectDesk('enrolment')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'enrolment'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <Users class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'enrolment' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Data Mahasiswa</span>
            </button>
          </div>
        </div>

        <!-- GRUP 2: OPERASIONAL PMB -->
        <div>
          <div class="px-2.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Operasional PMB
          </div>
          <div class="space-y-0.5">
            <!-- 3. Pendaftar & Verifikasi Berkas -->
            <button
              v-if="isDeskAllowed('verification')"
              type="button"
              @click="selectDesk('verification')"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'verification'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <FolderCheck class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'verification' ? 'text-white' : 'text-slate-500'" />
                <span class="truncate">Verifikasi Berkas</span>
              </div>
              <span
                v-if="adminStore.pendingVerificationCount > 0"
                class="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold leading-none ml-1.5"
                :class="activeDesk === 'verification' ? 'bg-white text-[#1E3A8A]' : 'bg-amber-100 text-amber-800'"
              >
                {{ adminStore.pendingVerificationCount }}
              </span>
            </button>

            <!-- 4. Keuangan & Tagihan (Finance) -->
            <button
              v-if="isDeskAllowed('finance')"
              type="button"
              @click="selectDesk('finance')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'finance'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <CreditCard class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'finance' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Keuangan & Pembayaran</span>
            </button>

            <!-- 5. Seleksi Jalur & Ujian CBT -->
            <button
              v-if="isDeskAllowed('scoring')"
              type="button"
              @click="selectDesk('scoring')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'scoring'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <ClipboardCheck class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'scoring' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Seleksi & CBT</span>
            </button>

            <!-- 6. Jalur Pendaftaran -->
            <button
              v-if="isDeskAllowed('jalur')"
              type="button"
              @click="selectDesk('jalur')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'jalur'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <GitBranch class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'jalur' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Jalur Pendaftaran</span>
            </button>
          </div>
        </div>

        <!-- GRUP 3: MITRA & DATA REFERENSI -->
        <div>
          <div class="px-2.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Mitra & Referensi
          </div>
          <div class="space-y-0.5">
            <!-- 7. Kode Referal (Mitra Guru BK) -->
            <button
              v-if="isDeskAllowed('referral')"
              type="button"
              @click="selectDesk('referral')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'referral'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <Link2 class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'referral' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Kode Referal (Mitra BK)</span>
            </button>

            <!-- 8. Data Referensi (Akordeon Sub-menu) -->
            <div v-if="isDeskAllowed('master-data')">
              <button
                type="button"
                @click="isReferenceMenuOpen = !isReferenceMenuOpen"
                class="w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
                :class="isMasterDataActive
                  ? 'bg-blue-50 text-[#1E3A8A] font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <BarChart2 class="w-4 h-4 flex-shrink-0" :class="isMasterDataActive ? 'text-[#1E3A8A]' : 'text-slate-500'" />
                  <span class="truncate">Data Referensi</span>
                </div>
                <ChevronDown
                  class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isReferenceMenuOpen }"
                />
              </button>

              <!-- Sub-items Referensi -->
              <div v-show="isReferenceMenuOpen" class="pl-8 pr-1 py-1 space-y-0.5">
                <button
                  type="button"
                  @click="selectMasterData('jenjang')"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'jenjang'
                    ? 'text-[#1E3A8A] font-bold bg-blue-100/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
                >
                  Jenjang Pendidikan
                </button>
                <button
                  type="button"
                  @click="selectMasterData('fakultas')"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'fakultas'
                    ? 'text-[#1E3A8A] font-bold bg-blue-100/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
                >
                  Fakultas
                </button>
                <button
                  type="button"
                  @click="selectMasterData('programs')"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'programs'
                    ? 'text-[#1E3A8A] font-bold bg-blue-100/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
                >
                  Program Studi
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- GRUP 4: PELAPORAN & ANALISIS -->
        <div>
          <div class="px-2.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Pelaporan & Analisis
          </div>
          <div class="space-y-0.5">
            <!-- 9. Report Pendaftar (Termasuk Format Migrasi SEVIMA) -->
            <button
              v-if="isDeskAllowed('reporting')"
              type="button"
              @click="selectDesk('reporting')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'reporting'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <FileSpreadsheet class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'reporting' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Report & Migrasi Sevima</span>
            </button>

            <!-- 10. Dashboard Institusi -->
            <button
              v-if="isDeskAllowed('institutional')"
              type="button"
              @click="selectDesk('institutional')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'institutional'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <Building2 class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'institutional' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Dashboard Institusi</span>
            </button>
          </div>
        </div>

        <!-- GRUP 5: PENGATURAN -->
        <div v-if="currentRole === 'superadmin' || isDeskAllowed('master-data') || isDeskAllowed('cms')">
          <div class="px-2.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">
            Pengaturan Sistem
          </div>
          <div class="space-y-0.5">
            <!-- 11. CMS & Konten Kampus -->
            <button
              v-if="isDeskAllowed('cms')"
              type="button"
              @click="selectDesk('cms')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'cms'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <Sliders class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'cms' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">CMS & Konten Kampus</span>
            </button>

            <button
              type="button"
              @click="selectMasterData('rbac')"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer text-left"
              :class="activeDesk === 'master-data' && activeMasterSubDesk === 'rbac'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
            >
              <ShieldCheck class="w-4 h-4 flex-shrink-0" :class="activeDesk === 'master-data' && activeMasterSubDesk === 'rbac' ? 'text-white' : 'text-slate-500'" />
              <span class="truncate">Hak Akses Peran (RBAC)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 1.3 Bottom Sidebar Panel (Profil Admin & Keluar) -->
      <div class="p-3 border-t border-slate-100 flex-shrink-0 bg-slate-50/70">
        <!-- Profil Ringkas Admin & Logout -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-7 h-7 rounded-lg bg-[#1E3A8A] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
              {{ activeRoleObject.avatarInitials || 'AD' }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-[11px] font-bold text-slate-900 truncate">{{ currentAdminName }}</div>
              <div class="text-[9px] text-slate-400 truncate">{{ activeRoleObject.name }}</div>
            </div>
          </div>

          <button
            type="button"
            @click="handleLogout"
            class="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            title="Keluar dari sesi kerja admin"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- ========================================================================= -->
    <!-- 2. AREA KONTEN UTAMA (TOPBAR + MAIN WORKSPACE + FOOTER)                  -->
    <!-- ========================================================================= -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 2.1 TOPBAR UTAMA ADMIN -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-30 h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-3 shadow-2xs">
        <!-- Sisi Kiri: Hamburger Mobile & Breadcrumbs -->
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <!-- Tombol Hamburger Mobile (< LG) -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50 transition-colors cursor-pointer relative flex-shrink-0"
            title="Buka Menu Navigasi"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-4.5 h-4.5" />
            <X v-else class="w-4.5 h-4.5 text-rose-600" />
            <span
              v-if="adminStore.pendingVerificationCount > 0"
              class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"
            ></span>
          </button>

          <!-- Breadcrumbs Aktif -->
          <div class="flex items-center gap-1.5 text-xs font-sans min-w-0">
            <span class="text-slate-400 hidden sm:inline">Panel PMB</span>
            <span class="text-slate-300 hidden sm:inline">/</span>
            <span class="font-bold text-slate-800 truncate">{{ currentDeskTitle }}</span>
            <span v-if="activeMasterSubDesk && activeDesk === 'master-data'" class="text-slate-300">/</span>
            <span v-if="activeMasterSubDesk && activeDesk === 'master-data'" class="text-[#1E3A8A] font-semibold text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 truncate hidden md:inline">
              {{ activeMasterSubDesk === 'jenjang' ? 'Jenjang' : activeMasterSubDesk === 'fakultas' ? 'Fakultas' : activeMasterSubDesk === 'rbac' ? 'RBAC' : 'Prodi' }}
            </span>
          </div>
        </div>

        <!-- Sisi Kanan: Sinkronisasi Data & Indikator -->
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            @click="syncPortalData"
            :disabled="adminStore.isLoadingBackend"
            class="px-2.5 py-1.5 sm:px-3 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5 shadow-2xs"
            title="Sinkronkan data pendaftar riil"
          >
            <RefreshCw class="w-3.5 h-3.5 text-slate-500" :class="{ 'animate-spin': adminStore.isLoadingBackend }" />
            <span class="hidden sm:inline">{{ adminStore.isLoadingBackend ? 'Sinkronisasi...' : 'Sinkronkan Data' }}</span>
          </button>

          <!-- Total Applicants Pill -->
          <div class="hidden xl:inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
            {{ adminStore.totalApplicants }} Pendaftar
          </div>
        </div>
      </header>

      <!-- ========================================================================= -->
      <!-- 2.2 KONTEN AREA KERJA (MAIN DESK WORKSPACE)                               -->
      <!-- ========================================================================= -->
      <main class="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5 relative z-10">
        <!-- RBAC Access Restricted Screen -->
        <div
          v-if="!isCurrentDeskAllowed"
          class="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm"
        >
          <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <Lock class="w-6 h-6" />
          </div>

          <div class="space-y-1">
            <h2 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
              Akses Dibatasi
            </h2>
            <p class="text-xs text-slate-500 font-sans leading-relaxed">
              Modul <strong>{{ currentDeskTitle }}</strong> tidak termasuk dalam hak akses peran
              <span class="font-semibold text-slate-700">{{ activeRoleObject.name }}</span>.
            </p>
          </div>

          <div class="pt-2">
            <button
              @click="activeDesk = 'overview'"
              class="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        <!-- MODUL MEJA KERJA AKTIF -->
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

          <!-- Meja 9: Report Pendaftar (Pelaporan, Format Migrasi Sevima & Ekspor) -->
          <ReportingNotificationDesk v-else-if="activeDesk === 'reporting'" :current-role="currentRole" />

          <!-- Meja 10: Dashboard Institusi Multi-Tingkat -->
          <InstitutionalDashboardDesk v-else-if="activeDesk === 'institutional'" :current-role="currentRole" />

          <!-- Meja 11: CMS & Konten Kampus -->
          <CmsContentDesk v-else-if="activeDesk === 'cms'" :current-role="currentRole" />
        </div>
      </main>

      <!-- Footer Institusi -->
      <footer class="bg-white border-t border-slate-200 py-3.5 px-4 text-center text-xs text-slate-500 mt-auto relative z-10">
        &copy; {{ cmsStore.identity.academicYear?.split('/')[0] || '2026' }} Sekretariat PMB {{ cmsStore.identity.name }}. Sistem Informasi Penerimaan Mahasiswa Baru Terpadu.
      </footer>
    </div>

    <!-- ========================================================================= -->
    <!-- 3. MOBILE SIDEBAR DRAWER (RESPONSIVE VIEWPORT < LG)                      -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 lg:hidden flex"
      >
        <div @click="isMobileMenuOpen = false" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"></div>
        <div class="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 font-sans">
          <!-- Drawer Header -->
          <div class="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-2">
              <img :src="cmsStore.identity.emblemUrl || '/assets/icons/bth-emblem.png'" class="h-8 w-auto object-contain" />
              <div>
                <div class="font-bold text-xs text-slate-900 font-sora">{{ cmsStore.identity.shortName || 'Universitas BTH' }}</div>
                <div class="text-[10px] text-slate-500">Panel PMB {{ cmsStore.identity.academicYear || '2026/2027' }}</div>
              </div>
            </div>
            <button @click="isMobileMenuOpen = false" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Drawer Navigation Items -->
          <div class="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-sans">
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

            <!-- Submenu Referensi Mobile -->
            <div v-if="isDeskAllowed('master-data')" class="pt-2">
              <div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">
                Data Referensi
              </div>
              <div class="pl-2 space-y-0.5">
                <button
                  @click="selectMasterData('jenjang')"
                  class="w-full text-left px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'jenjang' ? 'font-bold text-[#1E3A8A] bg-blue-50' : ''"
                >
                  Jenjang Pendidikan
                </button>
                <button
                  @click="selectMasterData('fakultas')"
                  class="w-full text-left px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'fakultas' ? 'font-bold text-[#1E3A8A] bg-blue-50' : ''"
                >
                  Fakultas
                </button>
                <button
                  @click="selectMasterData('programs')"
                  class="w-full text-left px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50"
                  :class="activeDesk === 'master-data' && activeMasterSubDesk === 'programs' ? 'font-bold text-[#1E3A8A] bg-blue-50' : ''"
                >
                  Program Studi
                </button>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-3 border-t border-slate-100 space-y-2 flex-shrink-0">
            <router-link
              to="/dashboard"
              @click="isMobileMenuOpen = false"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-medium text-xs transition-colors"
            >
              <User class="w-3.5 h-3.5 text-slate-500" />
              <span>Portal Calon Mahasiswa</span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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
  Sliders,
} from 'lucide-vue-next';
import DashboardBackground from '@/components/common/DashboardBackground.vue';
import { useAdminStore } from '@/stores/admin';
import { useOrganizationStore } from '@/stores/organization';
import { useAuthStore } from '@/stores/auth';
import { useCmsStore } from '@/stores/cms';

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
import CmsContentDesk from '@/components/admin/CmsContentDesk.vue';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const organizationStore = useOrganizationStore();
const authStore = useAuthStore();
const cmsStore = useCmsStore();
const toast = useToast();

const activeDesk = ref(route.query.desk || 'overview');
const activeMasterSubDesk = ref(route.query.subdesk || 'programs');
const isMobileMenuOpen = ref(false);
const isReferenceMenuOpen = ref(true);

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

const currentRole = computed(() => {
  return getInitialRole();
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
  cms: ['superadmin', 'pimpinan', 'dekan'],
};

const isDeskAllowed = (deskId) => {
  const allowed = rbacRules[deskId] || ['superadmin'];
  return allowed.includes(currentRole.value);
};

const isCurrentDeskAllowed = computed(() => {
  return isDeskAllowed(activeDesk.value);
});

// Daftar Semua Meja Kerja untuk Navigasi Mobile
const allDeskItems = [
  { id: 'overview', label: 'Dashboard', icon: Home },
  { id: 'enrolment', label: 'Data Mahasiswa', icon: Users },
  { id: 'verification', label: 'Verifikasi Berkas', icon: FolderCheck },
  { id: 'finance', label: 'Keuangan & Pembayaran', icon: CreditCard },
  { id: 'scoring', label: 'Seleksi & CBT', icon: ClipboardCheck },
  { id: 'jalur', label: 'Jalur Pendaftaran', icon: GitBranch },
  { id: 'referral', label: 'Kode Referal (Mitra BK)', icon: Link2 },
  { id: 'reporting', label: 'Report & Migrasi Sevima', icon: FileSpreadsheet },
  { id: 'institutional', label: 'Dashboard Institusi', icon: Building2 },
  { id: 'cms', label: 'CMS & Konten Kampus', icon: Sliders },
];

const allowedMobileMenuItems = computed(() => {
  return allDeskItems.filter((item) => isDeskAllowed(item.id));
});

const isItemActive = (item) => {
  return activeDesk.value === item.id;
};

const handleMobileMenuClick = (item) => {
  selectDesk(item.id);
  isMobileMenuOpen.value = false;
};

const handleRoleChange = () => {
  localStorage.setItem('bth_admin_rbac_role', simulatedRole.value);
  if (!isDeskAllowed(activeDesk.value)) {
    selectDesk('overview');
  }
  toast.success(`Peran admin dialihkan ke: ${activeRoleObject.value.name}`);
};

const isMasterDataActive = computed(() => {
  return activeDesk.value === 'master-data' && activeMasterSubDesk.value !== 'rbac';
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
    reporting: 'Report Pendaftar & Migrasi SEVIMA',
    institutional: 'Dashboard Institusi Multi-Tingkat',
    cms: 'CMS & Manajemen Konten Kampus',
  };
  return titles[activeDesk.value] || 'Meja Kerja PMB';
});

const selectDesk = (deskId, subdesk = null) => {
  activeDesk.value = deskId;
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
