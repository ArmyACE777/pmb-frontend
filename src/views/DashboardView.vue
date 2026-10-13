<template>
  <DashboardLayout>


    <!-- KONDISI 1: BERANDA UTAMA (OVERVIEW) -->
    <div v-if="activeTab === 'overview'" class="space-y-6 animate-fadeIn pb-12">

      <!-- 0. Banner Pengumuman Resmi Kampus dari CMS (Jika Diaktifkan) -->
      <div
        v-if="cmsStore.announcement?.enabled"
        class="p-4 sm:p-5 bg-gradient-to-r from-[#1E3A8A] to-blue-800 text-white rounded-2xl shadow-xs space-y-2 border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="space-y-1.5 max-w-3xl">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/30 font-mono">
              {{ cmsStore.announcement.badge || 'Informasi PMB' }}
            </span>
            <h3 class="font-sora font-bold text-xs sm:text-sm text-white">
              {{ cmsStore.announcement.title }}
            </h3>
          </div>
          <p class="text-xs text-blue-100/90 leading-relaxed font-sans">
            {{ cmsStore.announcement.text }}
          </p>
        </div>
        <div v-if="cmsStore.announcement.actionText && cmsStore.announcement.actionLink" class="flex-shrink-0">
          <a
            :href="cmsStore.announcement.actionLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-blue-50 text-[#1E3A8A] rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>{{ cmsStore.announcement.actionText }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <!-- 1. Hero Card: Identitas Resmi Calon Mahasiswa & Status Seleksi -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-7">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
          <!-- Left: Identitas Calon Mahasiswa -->
          <div class="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-blue-700 text-white font-sora font-bold text-sm sm:text-lg flex items-center justify-center flex-shrink-0 shadow-xs border border-blue-800/20 overflow-hidden">
              <img
                v-if="candidatePhoto"
                :src="candidatePhoto"
                alt="Foto Profil Calon Mahasiswa"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ candidateInitials }}</span>
            </div>

            <div class="space-y-0.5 sm:space-y-1 min-w-0">
              <div>
                <h1 class="text-sm sm:text-lg font-sora font-bold text-slate-900 tracking-tight capitalize truncate">
                  {{ candidateName }}
                </h1>
              </div>

              <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-sans">
                <span class="inline-flex items-center gap-1">
                  <span>No. Reg:</span>
                  <strong class="font-mono text-slate-800 font-semibold">{{ candidateRegNo }}</strong>
                  <button
                    @click="copyRegNumber"
                    class="text-slate-400 hover:text-[#1E3A8A] transition-colors cursor-pointer p-0.5"
                    title="Salin Nomor Registrasi"
                  >
                    <Copy class="w-3.5 h-3.5" />
                  </button>
                </span>
                <span class="text-slate-300 hidden sm:inline">•</span>
                <span class="text-slate-700 font-medium">{{ applicantStore.state?.admission?.track || 'Jalur Reguler Gelombang 1' }}</span>
                <template v-if="applicantStore.state?.admission?.prodi1">
                  <span class="text-slate-300 hidden sm:inline">•</span>
                  <span class="font-semibold text-slate-900">{{ applicantStore.state.admission.prodi1 }}</span>
                  <span class="text-slate-500 text-[11px]">({{ applicantStore.state?.admission?.prodi1Degree || 'S1' }})</span>
                </template>
                <template v-if="applicantStore.state?.referral?.isApplied">
                  <span class="text-slate-300 hidden sm:inline">•</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Mitra Guru BK: {{ applicantStore.state.referral.schoolName }} ({{ applicantStore.state.referral.code }})
                  </span>
                </template>
              </div>
            </div>
          </div>

          <!-- Right: Status Pendaftaran & Riwayat Aktivitas (Sejajar & Rapi) -->
          <div class="flex flex-wrap items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
            <!-- Teks Status Pendaftaran Sejajar Horizontal dengan Badge Status User Terkini -->
            <div class="inline-flex items-center gap-2">
              <span class="text-xs font-sans text-slate-500 font-medium whitespace-nowrap">Status Pendaftaran:</span>
              <div
                class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-2xs"
                :class="statusBadgeClass"
              >
                <span>{{ applicantStore.overallStatus.label }}</span>
              </div>
            </div>

            <!-- Tombol Riwayat Aktivitas -->
            <button
              type="button"
              @click="openAuditHistoryModal"
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#1E3A8A] bg-blue-50/85 hover:bg-blue-100 border border-blue-200/90 transition-all cursor-pointer shadow-2xs hover:shadow-xs whitespace-nowrap"
              title="Buka rekam jejak aktivitas simpan, ubah, berkas, dan transaksi"
            >
              <History class="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Riwayat Aktivitas</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Alur Tahapan Pendaftaran: Connected Milestone Stepper (Terstruktur, Single-Action, Non-AI) -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-7 space-y-4 sm:space-y-5">
        <!-- Header Stepper & Progress Metric -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Tahapan Pendaftaran & Seleksi Masuk
            </h2>
            <p class="text-xs text-slate-500 mt-0.5 font-sans">
              Pantau progres penyelesaian 6 tahapan PMB {{ cmsStore.identity.name || 'Universitas Bakti Tunas Husada' }}.
            </p>
          </div>

          <!-- Progress Bar -->
          <div class="flex items-center gap-3 self-start sm:self-auto">
            <div class="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-[#1E3A8A] rounded-full transition-all duration-500"
                :style="{ width: `${(applicantStore.completedStepsCount / 6) * 100}%` }"
              ></div>
            </div>
            <span class="font-sora font-semibold text-xs text-slate-700 whitespace-nowrap">
              {{ applicantStore.completedStepsCount }} / 6 Selesai
            </span>
          </div>
        </div>

        <!-- 6 Step Connected Bar -->
        <div class="py-1">
          <div class="relative">
            <!-- Connecting Line between step nodes (Visible on lg+) -->
            <div class="hidden lg:block absolute top-4 left-10 right-10 h-0.5 bg-slate-100 -z-0">
              <div
                class="h-full bg-emerald-500 transition-all duration-500"
                :style="{ width: `${Math.min(100, Math.max(0, ((applicantStore.completedStepsCount - 1) / 5) * 100))}%` }"
              ></div>
            </div>

            <!-- 6 Nodes Grid (3 cols on mobile, 6 cols on lg) -->
            <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2 relative z-10">
              <button
                v-for="(step, idx) in steps"
                :key="step.id"
                @click="switchTab(step.id)"
                class="group flex flex-col items-center text-center p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-50 focus:outline-none"
              >
                <!-- Node Circle Icon -->
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center font-sora text-xs font-bold transition-all duration-200 mb-1.5 relative"
                  :class="step.isCompleted
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : step.isCurrent
                      ? 'bg-[#1E3A8A] text-white ring-4 ring-blue-50 shadow-xs'
                      : 'bg-white text-slate-400 border border-slate-200 group-hover:border-slate-300'"
                >
                  <Check v-if="step.isCompleted" class="w-4 h-4 stroke-[2.5]" />
                  <span v-else>{{ idx + 1 }}</span>
                </div>

                <!-- Step Title -->
                <div
                  class="text-[11px] sm:text-xs transition-colors font-sora line-clamp-1"
                  :class="step.isCurrent
                    ? 'font-bold text-[#1E3A8A]'
                    : step.isCompleted
                      ? 'font-semibold text-slate-800'
                      : 'font-normal text-slate-500 group-hover:text-slate-700'"
                >
                  {{ step.title }}
                </div>

                <!-- Subtitle Text -->
                <div
                  class="text-[10px] sm:text-[11px] font-sans mt-0.5 truncate max-w-full"
                  :class="step.isCompleted
                    ? 'text-emerald-700 font-medium'
                    : step.isCurrent
                      ? 'text-blue-700 font-semibold'
                      : 'text-slate-400'"
                >
                  {{ step.statusText }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Integrated Next Action (Ringkas, Terarah, Menyatu) -->
        <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 -mx-5 sm:-mx-7 -mb-5 sm:-mb-7 px-5 sm:px-7 py-3.5 rounded-b-2xl">
          <div class="flex items-center gap-3">
            <span class="text-xs font-sora font-semibold text-slate-700">Langkah Aktif:</span>
            <span class="text-xs font-sora font-bold text-[#1E3A8A]">{{ nextActionInfo.title }}</span>
          </div>

          <button
            @click="handleNextAction(nextActionInfo.tab, nextActionInfo.section)"
            class="rounded-lg px-4 py-2 font-medium text-xs text-white bg-[#1E3A8A] hover:bg-[#172554] transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-2xs"
          >
            <span>{{ nextActionInfo.cta }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- 3. Dua Kolom Informasi Esensial: Jadwal Seleksi PMB & Status Administrasi Cepat -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Kolom Kiri: Agenda & Timeline Resmi PMB BTH (Col 7) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <Calendar class="w-4 h-4 text-[#1E3A8A]" />
                <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                  Jadwal & Agenda Seleksi PMB
                </h3>
              </div>
              <span class="text-[11px] font-mono font-semibold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                T.A. 2026/2027
              </span>
            </div>

            <!-- List Timeline Terstruktur -->
            <div class="space-y-3">
              <div
                v-for="(item, idx) in timelineEvents"
                :key="idx"
                class="p-3.5 rounded-xl border transition-all flex items-start gap-3.5 text-xs font-sans"
                :class="item.isDone
                  ? 'bg-emerald-50/40 border-emerald-200/70'
                  : item.isActive
                    ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100'
                    : 'bg-slate-50/60 border-slate-100'"
              >
                <!-- Indicator Bullet -->
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-bold"
                  :class="item.isDone
                    ? 'bg-emerald-600 text-white'
                    : item.isActive
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-slate-200 text-slate-500'"
                >
                  <Check v-if="item.isDone" class="w-3.5 h-3.5 stroke-[2.5]" />
                  <span v-else>{{ idx + 1 }}</span>
                </div>

                <!-- Event Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 class="font-sora font-semibold text-slate-900 text-xs">
                      {{ item.title }}
                    </h4>
                    <span
                      class="text-[11px] font-medium font-sans whitespace-nowrap"
                      :class="item.isDone ? 'text-emerald-700' : item.isActive ? 'text-[#1E3A8A] font-semibold' : 'text-slate-500'"
                    >
                      {{ item.date }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {{ item.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Ringkasan Administrasi & Kontak Layanan BTH (Col 5) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Card Ringkasan Berkas & Biaya -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <h3 class="font-sora font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Ringkasan Dokumen & Pembayaran
            </h3>

            <!-- Item Berkas -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <FileText class="w-4 h-4 text-slate-500" />
                <div>
                  <div class="font-medium text-slate-800">Berkas Persyaratan</div>
                  <div class="text-[11px] text-slate-500">
                    {{ applicantStore.isWithdrawn ? 'Dinonaktifkan (Mengundurkan Diri)' : `${applicantStore.uploadedDocsCount} dari 5 berkas diunggah` }}
                  </div>
                </div>
              </div>
              <button
                @click="switchTab('documents')"
                :disabled="applicantStore.isWithdrawn"
                class="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                :class="applicantStore.isWithdrawn ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer'"
              >
                {{ applicantStore.isWithdrawn ? 'Terkunci' : 'Buka Berkas' }}
              </button>
            </div>

            <!-- Item Biaya Pendaftaran -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <CreditCard class="w-4 h-4 text-slate-500" />
                <div>
                  <div class="font-medium text-slate-800">Biaya Formulir PMB</div>
                  <div class="text-[11px]" :class="applicantStore.isWithdrawn ? 'text-slate-600 font-medium' : applicantStore.isRegPaymentComplete ? 'text-emerald-700 font-semibold' : 'text-amber-700'">
                    {{ applicantStore.isWithdrawn ? (applicantStore.isFreeTrack ? 'Bebas Biaya (Tidak Ada Refund)' : applicantStore.isRegPaymentComplete ? 'Pengajuan Refund Ditinjau' : 'Tagihan Dibatalkan') : applicantStore.isFreeTrack ? 'Bebas Biaya (Rp 0)' : applicantStore.isRegPaymentComplete ? `Lunas (${dynamicRegFeeFormatted})` : `Menunggu Bayar (${dynamicRegFeeFormatted})` }}
                  </div>
                </div>
              </div>
              <button
                @click="applicantStore.isWithdrawn ? switchTab('admission') : switchTab('payment')"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
              >
                {{ applicantStore.isWithdrawn ? 'Detail Refund' : applicantStore.isRegPaymentComplete ? 'Bukti Bayar' : 'Bayar Sekarang' }}
              </button>
            </div>

            <!-- Item CBT / Seleksi -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2.5">
                <ClipboardCheck class="w-4 h-4 text-slate-500" />
                <div>
                  <div class="font-medium text-slate-800">Ujian Mandiri CBT</div>
                  <div class="text-[11px]" :class="applicantStore.isWithdrawn ? 'text-slate-500' : applicantStore.isExamCompleted ? 'text-emerald-700 font-semibold' : 'text-slate-500'">
                    {{ applicantStore.isWithdrawn ? 'Dinonaktifkan (Mengundurkan Diri)' : applicantStore.isExamCompleted ? `Skor: ${applicantStore.state.exam.score}/100` : applicantStore.isRegPaymentComplete ? 'Sesi CBT Siap Dikerjakan' : 'Menunggu Bayar Formulir' }}
                  </div>
                </div>
              </div>
              <button
                @click="switchTab('exam')"
                :disabled="applicantStore.isWithdrawn"
                class="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                :class="applicantStore.isWithdrawn ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer'"
              >
                {{ applicantStore.isWithdrawn ? 'Terkunci' : 'Buka CBT' }}
              </button>
            </div>
          </div>

          <!-- Card Grup WhatsApp Resmi Informasi PMB (Diatur oleh Admin) -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3 text-xs font-sans">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <MessageSquare class="w-4 h-4 text-emerald-600" />
                <h3 class="font-sora font-bold text-slate-900 text-sm">
                  Grup WhatsApp Calon Mahasiswa
                </h3>
              </div>
              <span class="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Pendaftar
              </span>
            </div>

            <p class="text-[11px] text-slate-600 leading-relaxed">
              Bergabunglah dengan grup komunikasi resmi untuk jalur <strong class="text-slate-800">{{ currentTrackName }}</strong> guna memantau pengumuman jadwal seleksi dan berkas.
            </p>

            <div class="pt-1">
              <a
                v-if="currentTrackWhatsappUrl || cmsStore.links.onboardingWaGroup || cmsStore.links.publicWaGroup || cmsStore.links.officialWaGroup"
                :href="currentTrackWhatsappUrl || cmsStore.links.onboardingWaGroup || cmsStore.links.publicWaGroup || cmsStore.links.officialWaGroup"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-sora font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs text-center"
              >
                <span>Gabung Grup WhatsApp</span>
                <ExternalLink class="w-3.5 h-3.5 opacity-80" />
              </a>
              <div
                v-else
                class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-[11px]"
              >
                Tautan grup WhatsApp akan segera dibagikan oleh panitia seleksi.
              </div>
            </div>
          </div>

          <!-- Card Layanan Bantuan Resmi Universitas BTH -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3 text-xs font-sans">
            <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building class="w-4 h-4 text-[#1E3A8A]" />
              <h3 class="font-sora font-bold text-slate-900 text-sm">
                Pusat Layanan PMB {{ cmsStore.identity.shortName || 'BTH' }}
              </h3>
            </div>

            <div class="space-y-2 text-[11px] text-slate-600 leading-relaxed">
              <div class="flex items-start gap-2">
                <MapPin class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{{ cmsStore.contact.buildingName || 'Gedung Rektorat Lt. 1' }}, {{ cmsStore.identity.name || 'Universitas Bakti Tunas Husada' }}, {{ cmsStore.contact.address || 'Jl. Cilolohan No. 36 Kota Tasikmalaya' }}.</span>
              </div>

              <div class="flex items-center gap-2">
                <Clock class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{{ cmsStore.contact.officeHours || 'Senin - Jumat: 08.00 - 16.00 WIB' }}</span>
              </div>

              <div class="flex items-center gap-2">
                <Phone class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Hotline: {{ cmsStore.contact.phone || '(0265) 345678' }} | WhatsApp: <strong>{{ cmsStore.contact.whatsapp || '0821-1710-0200' }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KONDISI 2: SUB-MODUL AKTIF (Profil, Jalur, Berkas, Pembayaran, CBT/Wawancara, Hasil) -->
    <div v-else class="space-y-4 animate-fadeIn pb-12">
      <!-- 1. Profil (Biodata, Alamat, Orang Tua, Asal Sekolah, Foto Profil) -->
      <ProfileModule v-if="activeTab === 'profile'" @switch-tab="switchTab" />

      <!-- 2. Jalur Pendaftaran (Pemilihan Fakultas, Prodi, Jalur, Detail & Persyaratan, Biaya, Kartu Peserta) -->
      <AdmissionModule v-else-if="activeTab === 'admission'" @switch-tab="switchTab" />

      <!-- 3. Berkas Persyaratan (admission-service) -->
      <DocumentModule v-else-if="activeTab === 'documents'" @switch-tab="switchTab" />

      <!-- 4. Biaya Pendaftaran & Kuliah (finance-service: List Biaya, Bayar Langsung, Cicilan) -->
      <PaymentModule v-else-if="activeTab === 'payment'" @switch-tab="switchTab" />

      <!-- 5. Proses Seleksi (exam-service: CBT Online & Tes Lisan Google Meet / Zoom) -->
      <ExamModule v-else-if="activeTab === 'exam'" @switch-tab="switchTab" />

      <!-- 6. Hasil Kelulusan & Registrasi Ulang (selection-service: LoA & NIM) -->
      <ResultModule v-else-if="activeTab === 'result'" @switch-tab="switchTab" />
    </div>

    <!-- Modal Riwayat Aktivitas & Perubahan Data (Clean & Structured Activity Stream) -->
    <Teleport to="body">
      <div
        v-if="showStatusHistoryModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
        @click.self="showStatusHistoryModal = false"
      >
        <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-scaleUp">
          <!-- 1. Header Modal -->
          <div class="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0 bg-white">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 text-[#1E3A8A] flex items-center justify-center shrink-0 shadow-2xs">
                <History class="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-sora font-bold text-slate-900 tracking-tight">
                  Riwayat Aktivitas & Perubahan Data
                </h3>
                <p class="text-xs text-slate-500 mt-0.5 font-sans">
                  Rekam jejak seluruh aksi penyimpanan data, perubahan pilihan, unggahan berkas, dan transaksi akun Anda.
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="showStatusHistoryModal = false"
              class="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors cursor-pointer"
              title="Tutup Modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- 2. Filter Bar: Filter per Tanggal & Pencarian -->
          <div class="px-5 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-2.5 flex-wrap">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Calendar class="w-4 h-4 text-[#1E3A8A]" />
                <span>Filter Tanggal:</span>
              </div>
              <div class="flex items-center gap-2">
                <input
                  v-model="activityDateFilter"
                  type="date"
                  class="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1E3A8A] font-sans text-slate-800 shadow-2xs cursor-pointer"
                  title="Pilih tanggal aktivitas"
                />
                <button
                  v-if="activityDateFilter"
                  type="button"
                  @click="activityDateFilter = ''"
                  class="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                  title="Tampilkan semua tanggal"
                >
                  Reset Tanggal
                </button>
              </div>
            </div>

            <!-- Search Field -->
            <div class="relative w-full sm:w-52 shrink-0">
              <input
                v-model="activitySearchQuery"
                type="text"
                placeholder="Cari aktivitas..."
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-[#1E3A8A] transition-all font-sans"
              />
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <!-- 4. Activity Timeline List (Pure Structured Activity Stream) -->
          <div class="p-5 sm:p-6 overflow-y-auto space-y-4 font-sans text-xs flex-1">
            <!-- Empty State -->
            <div v-if="filteredActivityLogs.length === 0" class="py-12 text-center space-y-2.5">
              <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <History class="w-6 h-6" />
              </div>
              <p class="font-sora font-semibold text-slate-700 text-sm">Belum Ada Aktivitas Tercatat</p>
              <p class="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                {{ activitySearchQuery ? 'Tidak ada riwayat aktivitas yang cocok dengan kata kunci pencarian Anda.' : 'Setiap aksi simpan biodata, perubahan jalur pilihan, unggahan berkas, atau transaksi akan otomatis tercatat di sini.' }}
              </p>
              <button
                v-if="activitySearchQuery || activityDateFilter"
                type="button"
                @click="activitySearchQuery = ''; activityDateFilter = ''"
                class="inline-block mt-2 px-3 py-1 text-xs font-semibold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>

            <!-- Timeline Items -->
            <div v-else class="space-y-3.5">
              <div
                v-for="(log, idx) in filteredActivityLogs"
                :key="log.id || idx"
                class="relative flex items-start gap-3.5 pb-2 last:pb-0"
              >
                <!-- Vertical Line -->
                <div
                  v-if="idx < filteredActivityLogs.length - 1"
                  class="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-200"
                ></div>

                <!-- Node Icon -->
                <div
                  class="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 shadow-2xs"
                  :class="getActivityNodeClass(log)"
                >
                  <component :is="getActivityIcon(log)" class="w-4 h-4" />
                </div>

                <!-- Card Detail -->
                <div class="flex-1 bg-white border border-slate-200/90 rounded-xl p-3.5 space-y-1.5 hover:border-blue-200 transition-colors shadow-2xs">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold border"
                        :class="getActivityBadgeClass(log)"
                      >
                        {{ log.categoryLabel || log.stage || 'Aktivitas' }}
                      </span>
                      <h4 class="font-sora font-semibold text-slate-900 text-xs">
                        {{ log.action || log.title }}
                      </h4>
                    </div>
                    <span class="text-[11px] text-slate-400 font-mono shrink-0">
                      {{ formatLogDate(log.timestamp) }}
                    </span>
                  </div>

                  <p class="text-[11px] text-slate-600 leading-relaxed font-sans pt-0.5">
                    {{ sanitizeActivityText(log.description) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Footer Modal -->
          <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-2 text-[11px] text-slate-500 font-sans">
              <span>Menampilkan <strong class="text-slate-800">{{ filteredActivityLogs.length }}</strong> dari <strong class="text-slate-800">{{ applicantStore.computedStatusHistory.length }}</strong> aktivitas</span>
              <span>•</span>
              <button
                type="button"
                @click="handleManualSync"
                :disabled="isSyncingModal"
                class="inline-flex items-center gap-1 text-[#1E3A8A] hover:underline font-semibold cursor-pointer disabled:opacity-50"
              >
                <RotateCcw class="w-3 h-3" :class="isSyncingModal ? 'animate-spin' : ''" />
                <span>{{ isSyncingModal ? 'Menyinkronkan...' : 'Sinkronkan Data' }}</span>
              </button>
            </div>
            <button
              type="button"
              @click="showStatusHistoryModal = false"
              class="w-full sm:w-auto px-5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              Tutup Jendela
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import {
  CheckCircle2,
  User,
  Compass,
  FileText,
  CreditCard,
  ClipboardCheck,
  GraduationCap,
  ArrowRight,
  Copy,
  Check,
  LifeBuoy,
  RotateCcw,
  BookOpen,
  Calendar,
  Building,
  MapPin,
  Phone,
  Clock,
  History,
  MessageSquare,
  ExternalLink,
  UserX,
  Lock,
  Search,
  X,
  Bell
} from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useApplicantStore } from '@/stores/applicant';
import { useAuthStore } from '@/stores/auth';
import { useCmsStore } from '@/stores/cms';

// Import 6 Modul Utama PMB
import ProfileModule from '@/components/applicant/ProfileModule.vue';
import AdmissionModule from '@/components/applicant/AdmissionModule.vue';
import DocumentModule from '@/components/applicant/DocumentModule.vue';
import PaymentModule from '@/components/applicant/PaymentModule.vue';
import ExamModule from '@/components/applicant/ExamModule.vue';
import ResultModule from '@/components/applicant/ResultModule.vue';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const applicantStore = useApplicantStore();
const authStore = useAuthStore();
const cmsStore = useCmsStore();
const toast = useToast();

// Format nominal biaya formulir pendaftaran dinamis (dari CMS / store pendaftar)
const dynamicRegFeeAmount = computed(() => {
  if (applicantStore.isFreeTrack || applicantStore.state?.referral?.isApplied) return 0;
  if (applicantStore.state?.payments?.registrationFee?.amount !== undefined) {
    return applicantStore.state.payments.registrationFee.amount;
  }
  return cmsStore.getRegistrationFee(applicantStore.state?.admission?.track) || 250000;
});

const dynamicRegFeeFormatted = computed(() => {
  return `Rp ${dynamicRegFeeAmount.value.toLocaleString('id-ID')}`;
});

const showStatusHistoryModal = ref(false);
const activityDateFilter = ref('');
const activitySearchQuery = ref('');
const isSyncingModal = ref(false);

const sanitizeActivityText = (text) => {
  if (!text) return '';
  return text
    .replace(/\btersimpan di sistem\b\.?/gi, '')
    .replace(/\bdisimpan oleh sistem\b\.?/gi, '')
    .replace(/\bdisimpan ke dalam sistem\b\.?/gi, '')
    .replace(/\bdisimpan ke sistem\b\.?/gi, '')
    .trim();
};

const openAuditHistoryModal = () => {
  showStatusHistoryModal.value = true;
};

// Filtered Activity Logs (Pure Structured Activity Stream dengan filter per tanggal)
const filteredActivityLogs = computed(() => {
  let list = applicantStore.computedStatusHistory || [];

  // Filter per tanggal
  if (activityDateFilter.value) {
    list = list.filter((item) => {
      if (!item.timestamp) return false;
      try {
        const itemDateStr = new Date(item.timestamp).toISOString().split('T')[0];
        return itemDateStr === activityDateFilter.value;
      } catch {
        return false;
      }
    });
  }

  // Filter kata kunci pencarian
  if (activitySearchQuery.value.trim()) {
    const q = activitySearchQuery.value.toLowerCase().trim();
    list = list.filter((item) => {
      const action = (item.action || item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.categoryLabel || item.stage || '').toLowerCase();
      return action.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }

  return list;
});

const getActivityIcon = (log) => {
  const cat = log.category || '';
  if (cat === 'profile') return User;
  if (cat === 'admission') return Compass;
  if (cat === 'document') return FileText;
  if (cat === 'payment') return CreditCard;
  if (cat === 'exam') return ClipboardCheck;
  return History;
};

const getActivityNodeClass = (log) => {
  const color = log.badgeColor || '';
  const cat = log.category || '';
  if (color === 'emerald' || cat === 'profile') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (color === 'blue' || cat === 'admission') return 'bg-blue-50 text-[#1E3A8A] border-blue-200';
  if (color === 'amber' || cat === 'document') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (color === 'purple' || cat === 'payment') return 'bg-purple-50 text-purple-700 border-purple-200';
  if (color === 'indigo' || cat === 'exam') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (color === 'rose') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-blue-50 text-[#1E3A8A] border-blue-200';
};

const getActivityBadgeClass = (log) => {
  const color = log.badgeColor || '';
  const cat = log.category || '';
  if (color === 'emerald' || cat === 'profile') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (color === 'blue' || cat === 'admission') return 'bg-blue-50 text-[#1E3A8A] border-blue-200';
  if (color === 'amber' || cat === 'document') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (color === 'purple' || cat === 'payment') return 'bg-purple-50 text-purple-800 border-purple-200';
  if (color === 'indigo' || cat === 'exam') return 'bg-indigo-50 text-indigo-800 border-indigo-200';
  if (color === 'rose') return 'bg-rose-50 text-rose-800 border-rose-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const handleManualSync = async () => {
  isSyncingModal.value = true;
  try {
    await applicantStore.syncFromBackend();
    toast.success('Data rekam jejak pendaftaran berhasil disinkronkan.');
  } catch (e) {
    toast.error('Gagal menyinkronkan data.');
  } finally {
    isSyncingModal.value = false;
  }
};

const currentTrackName = computed(() => {
  return applicantStore.state?.admission?.track || 'Jalur Reguler Gelombang 1';
});

const currentTrackWhatsappUrl = computed(() => {
  try {
    const raw = localStorage.getItem('bth_pmb_tracks_v1');
    if (raw) {
      const tracks = JSON.parse(raw);
      const activeName = (applicantStore.state?.admission?.track || '').toLowerCase();
      const match = tracks.find((t) => {
        const name = (t.name || '').toLowerCase();
        const code = (t.code || '').toLowerCase();
        return activeName.includes(code) || activeName.includes(name) || name.includes(activeName);
      });
      if (match?.whatsappGroupUrl) return match.whatsappGroupUrl;
    }
  } catch (e) {
    console.warn('Gagal memuat URL grup WhatsApp:', e);
  }
  return cmsStore.links.onboardingWaGroup || cmsStore.links.publicWaGroup || cmsStore.links.officialWaGroup || 'https://chat.whatsapp.com/BTH-Reguler2026';
});

const formatLogDate = (isoStr) => {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';
  } catch (e) {
    return isoStr;
  }
};

onMounted(() => {
  if (route.query.tab) {
    applicantStore.setActiveTab(route.query.tab);
  }
  if (route.query.unauthorized === 'admin') {
    toast.warning('Akses ditolak: Portal Panitia PMB hanya diperuntukkan bagi Panitia Seleksi & Superadmin.');
  }
  if (route.query.unauthorized === 'bk') {
    toast.warning('Akses ditolak: Portal Mitra Guru BK hanya dapat diakses oleh Guru BK terdaftar.');
  }
  // Sinkronisasi data terkini dari microservices backend
  applicantStore.syncFromBackend();
});

// Bind activeTab seamlessly to Pinia store
const activeTab = computed({
  get: () => applicantStore.activeTab,
  set: (val) => applicantStore.setActiveTab(val),
});

const candidateName = computed(() => {
  return applicantStore.state?.candidate?.fullName || authStore.currentUser?.full_name || 'Calon Mahasiswa';
});

const candidateInitials = computed(() => {
  const name = (candidateName.value || '').trim();
  if (!name) return 'CM';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
});

const candidatePhoto = computed(() => {
  return applicantStore.candidatePhoto || authStore.currentUser?.avatar || null;
});

const candidateRegNo = computed(() => {
  return applicantStore.state?.candidate?.registrationNumber || 'BTH-2026-REG-00000';
});

const statusBadgeClass = computed(() => {
  const theme = applicantStore.overallStatus.theme;
  if (theme === 'emerald') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (theme === 'blue') return 'bg-blue-50 text-[#1E3A8A] border-blue-200';
  if (theme === 'indigo') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (theme === 'amber') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (theme === 'rose') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
});

const statusDotColor = computed(() => {
  const theme = applicantStore.overallStatus.theme;
  if (theme === 'emerald') return 'bg-emerald-500';
  if (theme === 'blue') return 'bg-blue-600';
  if (theme === 'indigo') return 'bg-indigo-600';
  if (theme === 'amber') return 'bg-amber-500';
  if (theme === 'rose') return 'bg-rose-500';
  return 'bg-slate-400';
});

const currentStageLabel = computed(() => {
  if (applicantStore.isResultPassed) return 'Dinyatakan Lulus Seleksi';
  if (applicantStore.isExamFailed) return 'Belum Lulus Seleksi (Bisa Tambah Pendaftaran)';
  if (applicantStore.isExamCompleted) return 'Selesai Ujian CBT';
  if (applicantStore.isRegPaymentComplete) return 'Sesi Ujian CBT Aktif';
  if (applicantStore.isDocumentsComplete) return 'Berkas Persyaratan Lengkap';
  if (applicantStore.isProfileComplete && applicantStore.isAdmissionComplete) return 'Formulir & Pilihan Prodi Lengkap';
  if (applicantStore.isProfileComplete) return 'Biodata Profil Lengkap';
  return 'Pengisian Formulir Biodata';
});

// Rekomendasi langkah selanjutnya dinamis
const nextActionInfo = computed(() => {
  if (applicantStore.isWithdrawn) {
    return {
      title: 'Status Pendaftaran: Telah Mengundurkan Diri',
      desc: 'Pendaftaran Anda telah dihentikan secara permanen. Anda dapat meninjau informasi pengunduran diri dan status refund dana.',
      cta: 'Lihat Status & Info Refund',
      tab: 'admission',
      section: null,
      badge: 'Mengundurkan Diri',
      theme: 'rose',
      icon: UserX,
    };
  }
  if (!applicantStore.isProfileComplete) {
    return {
      title: 'Lengkapi Formulir Biodata Pribadi',
      desc: 'Lengkapi biodata diri, data domisili, orang tua/wali, dan asal sekolah Anda di Universitas BTH.',
      cta: 'Lengkapi Biodata Sekarang',
      tab: 'profile',
      section: 'section-pribadi',
      badge: 'Langkah 1: Biodata Mahasiswa',
      theme: 'blue',
      icon: BookOpen,
    };
  }
  if (!applicantStore.isAdmissionComplete) {
    return {
      title: 'Tentukan Jalur Pendaftaran & Program Studi',
      desc: 'Pilih jalur masuk dan program studi prioritas pilihan Anda di Universitas BTH.',
      cta: 'Pilih Jalur & Prodi Sekarang',
      tab: 'admission',
      section: 'section-prodi',
      badge: 'Langkah 2: Jalur Pendaftaran',
      theme: 'blue',
      icon: Compass,
    };
  }
  if (!applicantStore.isRegPaymentComplete && !applicantStore.isFreeTrack && !applicantStore.state?.referral?.isApplied) {
    return {
      title: 'Selesaikan Pembayaran Biaya Pendaftaran',
      desc: `Selesaikan pembayaran biaya registrasi formulir PMB sebesar ${dynamicRegFeeFormatted.value} agar sesi pendaftaran dan Ujian CBT Online aktif.`,
      cta: 'Bayar Biaya Pendaftaran Sekarang',
      tab: 'payment',
      section: null,
      badge: 'Langkah 3: Biaya Pendaftaran',
      theme: 'amber',
      icon: CreditCard,
    };
  }
  if (!applicantStore.isDocumentsComplete) {
    return {
      title: 'Unggah Berkas Persyaratan Pendaftaran',
      desc: `Baru ${applicantStore.uploadedDocsCount} dari 5 berkas diunggah. Silakan lengkapi pindaian KTP, Ijazah/SKL, dan pasfoto Anda.`,
      cta: 'Unggah Berkas Dokumen',
      tab: 'documents',
      section: null,
      badge: 'Langkah 4: Berkas Dokumen',
      theme: 'blue',
      icon: FileText,
    };
  }
  if (!applicantStore.isExamCompleted) {
    return {
      title: 'Sesi Ujian CBT Online Telah Aktif',
      desc: 'Anda telah memenuhi syarat untuk mengikuti Ujian Mandiri Berbasis Komputer (CBT) PMB BTH secara daring.',
      cta: 'Mulai Ujian CBT Sekarang',
      tab: 'exam',
      section: null,
      badge: 'Langkah 5: Ujian Mandiri CBT',
      theme: 'blue',
      icon: ClipboardCheck,
    };
  }
  if (!applicantStore.isResultPassed) {
    if (applicantStore.isExamFailed) {
      return {
        title: 'Hasil Seleksi: Belum Memenuhi Syarat Kelulusan',
        desc: `Nilai CBT Anda (${applicantStore.state?.exam?.score ?? 0}/100) belum mencapai ambang batas 70. Silakan tambah pendaftaran baru untuk memilih jalur atau prodi lain.`,
        cta: 'Tambah Pendaftaran Jalur / Pilihan Lain',
        tab: 'result',
        section: null,
        badge: 'Belum Lulus Seleksi',
        theme: 'rose',
        icon: RotateCcw,
      };
    }
    return {
      title: 'Ujian Selesai - Verifikasi Nilai CBT',
      desc: `Skor CBT Anda (${applicantStore.state?.exam?.score ?? 0}/100) sedang ditinjau panitia PMB. Pengumuman maksimal 1x24 jam.`,
      cta: 'Lihat Status Kelulusan',
      tab: 'result',
      section: null,
      badge: 'Menunggu Pengumuman',
      theme: 'blue',
      icon: GraduationCap,
    };
  }
  if (!applicantStore.isUktPaid) {
    return {
      title: 'Selamat! Anda Dinyatakan Lulus Seleksi PMB',
      desc: `Diterima di ${applicantStore.state?.admission?.prodi1 || 'Program Studi Pilihan'}. Unduh Surat Penerimaan (LoA) & selesaikan registrasi ulang UKT.`,
      cta: 'Daftar Ulang & Pembayaran UKT',
      tab: 'result',
      section: null,
      badge: 'Lulus Seleksi',
      theme: 'emerald',
    };
  }
  return {
    title: 'Daftar Ulang Selesai - Selamat Bergabung di BTH!',
    desc: `NIM Anda: ${applicantStore.state?.onboarding?.nim || '-'}. Silakan persiapkan diri menyambut kegiatan PKKMB 2026.`,
    cta: 'Lihat Berkas & Akun Kampus',
    tab: 'result',
    section: null,
    badge: 'Mahasiswa Baru',
    theme: 'emerald',
  };
});

const handleNextAction = (tab, section = null) => {
  applicantStore.setActiveTab(tab, section);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const steps = computed(() => [
  {
    id: 'profile',
    number: 1,
    title: 'Profil',
    statusText: applicantStore.isProfileComplete ? 'Selesai' : 'Belum Lengkap',
    isCompleted: applicantStore.isProfileComplete,
    isCurrent: !applicantStore.isProfileComplete,
    icon: User,
  },
  {
    id: 'admission',
    number: 2,
    title: 'Jalur Pendaftaran',
    statusText: applicantStore.state?.admission?.prodi1 || 'Pilih Prodi & Jalur',
    isCompleted: applicantStore.isAdmissionComplete,
    isCurrent: applicantStore.isProfileComplete && !applicantStore.isAdmissionComplete,
    icon: Compass,
  },
  {
    id: 'payment',
    number: 3,
    title: 'Biaya Pendaftaran',
    statusText: applicantStore.state?.referral?.isApplied ? 'Lunas (Mitra BK)' : applicantStore.isFreeTrack ? 'Bebas Biaya (Rp 0)' : applicantStore.isRegPaymentComplete ? 'Lunas' : dynamicRegFeeFormatted.value,
    isCompleted: applicantStore.isRegPaymentComplete || applicantStore.isFreeTrack || applicantStore.state?.referral?.isApplied,
    isCurrent: applicantStore.isAdmissionComplete && !applicantStore.isRegPaymentComplete && !applicantStore.isFreeTrack && !applicantStore.state?.referral?.isApplied,
    icon: CreditCard,
  },
  {
    id: 'documents',
    number: 4,
    title: 'Berkas Dokumen',
    statusText: applicantStore.isDocumentsComplete ? 'Lengkap (5/5)' : `${applicantStore.uploadedDocsCount}/5 Diunggah`,
    isCompleted: applicantStore.isDocumentsComplete,
    isCurrent: applicantStore.isRegPaymentComplete && !applicantStore.isDocumentsComplete,
    icon: FileText,
  },
  {
    id: 'exam',
    number: 5,
    title: 'Proses Seleksi',
    statusText: applicantStore.isExamCompleted ? `Skor ${applicantStore.state?.exam?.score ?? 0}/100` : applicantStore.isRegPaymentComplete ? 'CBT & Lisan' : 'Menunggu Bayar',
    isCompleted: applicantStore.isExamCompleted,
    isCurrent: applicantStore.isRegPaymentComplete && !applicantStore.isExamCompleted,
    icon: ClipboardCheck,
  },
  {
    id: 'result',
    number: 6,
    title: 'Daftar Ulang',
    statusText: applicantStore.isResultPassed ? 'Lulus Seleksi' : applicantStore.isExamFailed ? 'Tidak Lulus' : applicantStore.isExamCompleted ? 'Diproses' : 'Menunggu Seleksi',
    isCompleted: applicantStore.isResultPassed,
    isCurrent: applicantStore.isExamCompleted && !applicantStore.isResultPassed,
    icon: GraduationCap,
  },
]);

const timelineEvents = computed(() => [
  {
    title: 'Pengisian Formulir Biodata & Berkas Dokumen',
    date: 'Aktif Berjalan',
    desc: 'Melengkapi profil identitas, pilihan program studi, dan berkas persyaratan.',
    isDone: applicantStore.isProfileComplete && applicantStore.isAdmissionComplete && applicantStore.isDocumentsComplete,
    isActive: !applicantStore.isProfileComplete || !applicantStore.isAdmissionComplete || !applicantStore.isDocumentsComplete,
  },
  {
    title: 'Pembayaran Formulir Pendaftaran',
    date: 'Batas: 3 Hari Kerja',
    desc: `Pembayaran ${dynamicRegFeeFormatted.value} via Virtual Account BSI / Mandiri untuk aktivasi sesi Ujian CBT.`,
    isDone: applicantStore.isRegPaymentComplete || applicantStore.state?.referral?.isApplied || applicantStore.isFreeTrack,
    isActive: applicantStore.isAdmissionComplete && !applicantStore.isRegPaymentComplete && !applicantStore.state?.referral?.isApplied && !applicantStore.isFreeTrack,
  },
  {
    title: 'Ujian Mandiri Berbasis Komputer (CBT) & Wawancara',
    date: applicantStore.state.schedule?.cbt?.date || 'Sesuai Jadwal Sesi',
    desc: 'Pelaksanaan ujian potensi akademik daring dan presensi tes lisan / wawancara.',
    isDone: applicantStore.isExamCompleted,
    isActive: (applicantStore.isRegPaymentComplete || applicantStore.state?.referral?.isApplied || applicantStore.isFreeTrack) && !applicantStore.isExamCompleted,
  },
  {
    title: 'Pengumuman Kelulusan & Surat Penerimaan (LoA)',
    date: applicantStore.state.schedule?.announcementDate || 'Jadwal Pengumuman',
    desc: 'Pengumuman SK Rektor dan penerbitan Letter of Acceptance (LoA).',
    isDone: applicantStore.isResultPassed,
    isActive: applicantStore.isExamCompleted && !applicantStore.isResultPassed,
  },
  {
    title: 'Daftar Ulang & Pembayaran UKT Semester 1',
    date: 'Masa Registrasi Ulang',
    desc: 'Pelunasan UKT semester 1 dan penerbitan Nomor Induk Mahasiswa (NIM) BTH.',
    isDone: applicantStore.isUktPaid,
    isActive: applicantStore.isResultPassed && !applicantStore.isUktPaid,
  },
]);

const copyRegNumber = async () => {
  const regNo = candidateRegNo.value;
  try {
    await navigator.clipboard.writeText(regNo);
    toast.success(`Nomor registrasi (${regNo}) berhasil disalin.`);
  } catch {
    toast.info(`Nomor registrasi: ${regNo}`);
  }
};

const switchTab = (tabId) => {
  if (applicantStore.isWithdrawn && ['documents', 'exam', 'result'].includes(tabId)) {
    toast.warning('Pendaftaran telah berstatus mengundurkan diri. Fitur berkas, seleksi, dan daftar ulang dinonaktifkan.');
    return;
  }
  applicantStore.setActiveTab(tabId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
