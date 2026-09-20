<template>
  <DashboardLayout>
    <!-- Floating Interactive Toast Feedback -->
    <transition name="toast-slide">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border backdrop-blur-md"
        :class="toastType === 'success' ? 'bg-emerald-900/95 text-white border-emerald-500' : 'bg-red-900/95 text-white border-red-500'"
      >
        <span class="text-xl">{{ toastType === 'success' ? '✅' : '⚠️' }}</span>
        <div class="text-xs sm:text-sm font-sans flex-1">{{ toastMessage }}</div>
        <button @click="toastMessage = ''" class="text-white/70 hover:text-white text-lg font-bold px-1">&times;</button>
      </div>
    </transition>

    <!-- Top Academic Welcome Banner (BTH Almamater Style) -->
    <div class="bg-gradient-to-r from-bth-navy via-[#1b3478] to-[#12285a] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-bth relative overflow-hidden border border-blue-900/40">
      <!-- Watermark Lambang BTH -->
      <img
        src="/assets/icons/bth-logo.svg"
        alt="BTH Motif"
        class="absolute -right-16 -bottom-16 w-80 opacity-10 pointer-events-none select-none filter invert"
      />

      <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="max-w-2xl">
          <!-- Gelombang & Akreditasi Badge -->
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/30 text-amber-300 rounded-full text-xs font-semibold font-sora">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Jalur Reguler • Gelombang 1
            </span>
            <span class="px-2.5 py-1 bg-white/10 text-blue-100 rounded-full text-xs font-mono">
              TA 2026/2027
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-sora font-extrabold text-white tracking-tight leading-tight mb-2">
            Selamat Datang, {{ authStore.currentUser?.full_name || 'Calon Mahasiswa' }}! 🎓
          </h1>
          <p class="text-blue-150 text-xs sm:text-sm text-blue-100/90 leading-relaxed mb-4">
            Portal resmi pendaftaran mahasiswa baru <strong>Universitas Bakti Tunas Husada</strong>. Pantau tahapan seleksi, lengkapi berkas, dan cetak kartu pendaftaran Anda.
          </p>

          <!-- Nomor Registrasi Pill with Copy Action -->
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <div class="inline-flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 font-mono">
              <span class="text-blue-300">No. Reg:</span>
              <span class="font-bold text-white tracking-wider">{{ registrationNumber }}</span>
              <button
                @click="copyRegistrationNumber"
                class="text-amber-300 hover:text-amber-200 transition-colors ml-1"
                title="Salin Nomor Registrasi"
              >
                📋
              </button>
            </div>
            <span class="bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-blue-200 font-mono">
              {{ authStore.currentUser?.email }}
            </span>
            <span class="bg-emerald-500/90 text-white font-semibold px-3 py-1.5 rounded-xl uppercase tracking-wider text-[11px] shadow-xs">
              {{ currentAdmissionStatus }}
            </span>
          </div>
        </div>

        <!-- Dynamic Circular Progress Gauge Card -->
        <div class="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl flex items-center gap-4 flex-shrink-0">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                class="text-white/20"
                stroke-width="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="text-amber-400"
                stroke-width="3.5"
                stroke-dasharray="68, 100"
                stroke-linecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span class="absolute font-sora font-bold text-sm text-white">68%</span>
          </div>
          <div>
            <span class="text-xs font-sora font-bold text-white block">Progres Pendaftaran</span>
            <span class="text-[11px] text-blue-200 block mt-0.5">Tahap 4 dari 6 Selesai</span>
            <button
              @click="activeTab = 'berkas'"
              class="text-[11px] font-semibold text-amber-300 hover:text-amber-200 underline mt-1.5 inline-block"
            >
              Lengkapi Berkas &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Stepper: 6 Tahap PMB BTH (Clickable) -->
    <div class="bg-white rounded-2xl shadow-bth-card border border-slate-200/80 p-5 sm:p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
            Alur Tahapan Penerimaan Mahasiswa Baru
          </h2>
          <p class="text-xs text-slate-500">
            Klik pada salah satu tahapan untuk langsung membuka rincian panduan dan dokumennya.
          </p>
        </div>
        <span class="px-3 py-1 bg-blue-50 text-bth-navy font-semibold text-xs rounded-full border border-blue-200/60 font-sora">
          Tahap Aktif: Seleksi Berkas & CBT
        </span>
      </div>

      <!-- Steps Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          v-for="(step, idx) in admissionSteps"
          :key="idx"
          @click="handleStepClick(step)"
          class="p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between group hover:-translate-y-0.5 text-left"
          :class="{
            'bg-emerald-50/80 border-emerald-300 text-emerald-950 hover:bg-emerald-100/60': step.status === 'completed',
            'bg-blue-50/90 border-bth-blue text-bth-navy font-semibold ring-2 ring-blue-200': step.status === 'active',
            'bg-slate-50/60 border-slate-200 text-slate-400 hover:bg-slate-100/70': step.status === 'pending'
          }"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 shadow-xs"
            :class="{
              'bg-emerald-600 text-white': step.status === 'completed',
              'bg-bth-blue text-white animate-pulse': step.status === 'active',
              'bg-slate-200 text-slate-500': step.status === 'pending'
            }"
          >
            <span v-if="step.status === 'completed'">✓</span>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <div class="text-xs font-sora font-bold leading-tight mb-1 text-slate-800 group-hover:text-bth-navy">
            {{ step.title }}
          </div>
          <div
            class="text-[10px] font-medium"
            :class="step.status === 'completed' ? 'text-emerald-700' : step.status === 'active' ? 'text-bth-blue font-bold' : 'text-slate-400'"
          >
            {{ step.subtitle }}
          </div>
        </button>
      </div>
    </div>

    <!-- Interactive Navigation Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200 no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2.5 rounded-xl font-sora text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2"
        :class="activeTab === tab.id
          ? 'bg-bth-navy text-white shadow-md'
          : 'bg-white text-slate-600 hover:text-bth-navy hover:bg-slate-100 border border-slate-200/80'"
      >
        <span>{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.badge"
          class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
          :class="activeTab === tab.id ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>

    <!-- ==================== TAB 1: RINGKASAN & KARTU PENDAFTARAN ==================== -->
    <div v-if="activeTab === 'overview'" class="space-y-6 animate-fadeIn">
      <!-- Quick Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Jalur PMB -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Jalur Pendaftaran</div>
          <div class="font-sora font-extrabold text-slate-900 text-base mt-1">Reguler Gelombang 1</div>
          <div class="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <span>●</span> Pendaftaran Masih Dibuka
          </div>
        </div>

        <!-- Card 2: Pilihan Prodi 1 -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pilihan Program Studi 1</div>
          <div class="font-sora font-extrabold text-bth-navy text-base mt-1">S1 Farmasi</div>
          <div class="text-xs text-slate-500 mt-2">Fakultas Farmasi (Akreditasi Unggul)</div>
        </div>

        <!-- Card 3: Biaya Formulir -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Biaya Formulir Pendaftaran</div>
          <div class="font-sora font-extrabold text-slate-900 text-base mt-1">Rp 250.000</div>
          <div class="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <span>✓</span> Terbayar Lunas (BSI VA)
          </div>
        </div>

        <!-- Card 4: Jadwal CBT -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Jadwal Ujian CBT Online</div>
          <div class="font-sora font-extrabold text-slate-900 text-base mt-1">18 Oktober 2026</div>
          <div class="text-xs text-bth-blue font-semibold mt-2">08:30 - 10:30 WIB</div>
        </div>
      </div>

      <!-- Action Banner: Cetak Kartu Registrasi & Virtual Account -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Cetak Kartu Card -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-bth-navy text-xs font-bold font-sora">
                Dokumen Resmi
              </span>
              <span class="text-xs text-slate-400">No. Dokumen: PMB/BTH/2026/08492</span>
            </div>
            <h3 class="font-sora font-bold text-slate-900 text-lg mb-2">
              Bukti Pendaftaran Sementara Calon Mahasiswa
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Kartu ini berisi QR Code identitas pendaftar, rincian program studi pilihan, dan jadwal tahapan seleksi. Simpan atau cetak kartu ini sebagai bukti resmi pendaftaran PMB Universitas BTH.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <button
              @click="openCardModal"
              class="px-5 py-2.5 bg-bth-navy hover:bg-bth-navy-dark text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>🖨️</span>
              <span>Pratinjau & Cetak Bukti Pendaftaran</span>
            </button>
            <button
              @click="activeTab = 'ujian'"
              class="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-sora font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>💻</span>
              <span>Jadwal & Try Out CBT</span>
            </button>
          </div>
        </div>

        <!-- Virtual Account Payment Status Card -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs text-amber-300 font-sora font-bold">Virtual Account Pembayaran</span>
              <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-md uppercase">Lunas</span>
            </div>
            <div class="text-xs text-slate-400 font-sans">Bank Syariah Indonesia (BSI)</div>
            <div class="font-mono text-xl font-bold tracking-wider text-white mt-1">
              900 1208 4920 0128
            </div>
            <div class="text-xs text-slate-300 mt-2">
              Atas Nama: <strong>PMB BTH - {{ authStore.currentUser?.full_name }}</strong>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-700 mt-6">
            <button
              @click="copyVaNumber"
              class="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-sora text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>📋</span>
              <span>Salin Nomor Rekening VA</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pengumuman Panitia PMB Terbaru -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 class="font-sora font-bold text-slate-900 text-base flex items-center gap-2">
            <span>📢</span>
            <span>Papan Pengumuman Panitia PMB BTH</span>
          </h3>
          <span class="text-xs text-bth-blue font-medium">Diperbarui Hari Ini</span>
        </div>
        <div class="space-y-3">
          <div class="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-start gap-3">
            <span class="text-amber-600 text-lg flex-shrink-0">⚠️</span>
            <div class="text-xs text-slate-700 leading-relaxed">
              <strong>Batas Waktu Upload Pas Foto:</strong> Harap mengunggah pas foto resmi terbaru berlatar belakang warna merah sebelum tanggal <strong>10 Oktober 2026</strong> untuk penerbitan Kartu Ujian CBT.
            </div>
          </div>
          <div class="p-3.5 bg-blue-50/60 border border-blue-200/60 rounded-xl flex items-start gap-3">
            <span class="text-bth-blue text-lg flex-shrink-0">ℹ️</span>
            <div class="text-xs text-slate-700 leading-relaxed">
              <strong>Simulasi Ujian CBT:</strong> Peserta dapat mencoba simulasi pengerjaan soal ujian CBT pada menu <em>"Jadwal Ujian & Try Out"</em> untuk membiasakan diri dengan format soal PMB Universitas BTH.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== TAB 2: PILIHAN PRODI & BIODATA ==================== -->
    <div v-if="activeTab === 'prodi'" class="space-y-6 animate-fadeIn">
      <!-- Prodi Pilihan Calon Mahasiswa -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-base">
              Program Studi yang Anda Pilih
            </h3>
            <p class="text-xs text-slate-500">Pilihan program studi pada saat pendaftaran awal.</p>
          </div>
          <span class="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-sora">
            Terkunci & Terverifikasi
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Pilihan 1 -->
          <div class="p-5 rounded-2xl border-2 border-bth-navy/20 bg-blue-50/30 relative">
            <span class="absolute top-4 right-4 px-2.5 py-0.5 bg-bth-navy text-white text-[11px] font-sora font-bold rounded-md">
              Pilihan Utama (1)
            </span>
            <div class="text-xs text-slate-500 mb-1">Fakultas Farmasi</div>
            <div class="font-sora font-extrabold text-slate-900 text-lg">S1 Farmasi</div>
            <div class="mt-3 space-y-1 text-xs text-slate-600">
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span> Akreditasi: <strong>Unggul (LAM-PTKes)</strong>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-bth-blue font-bold">●</span> Gelar Lulusan: <strong>S.Farm.</strong>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-amber-600 font-bold">★</span> Kuota Gelombang 1: <strong>120 Mahasiswa</strong>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-200/60">
              <button
                @click="openProdiDetail('farmasi')"
                class="text-xs font-semibold text-bth-navy hover:underline flex items-center gap-1"
              >
                <span>Lihat Kurikulum & Prospek Karir</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

          <!-- Pilihan 2 -->
          <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 relative">
            <span class="absolute top-4 right-4 px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[11px] font-sora font-bold rounded-md">
              Pilihan Cadangan (2)
            </span>
            <div class="text-xs text-slate-500 mb-1">Fakultas Teknologi & Bisnis</div>
            <div class="font-sora font-extrabold text-slate-900 text-lg">S1 Teknologi Informasi</div>
            <div class="mt-3 space-y-1 text-xs text-slate-600">
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span> Akreditasi: <strong>Baik Sekali</strong>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-bth-blue font-bold">●</span> Gelar Lulusan: <strong>S.Kom.</strong>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-amber-600 font-bold">★</span> Konsentrasi: <strong>Health Tech & AI</strong>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-200/60">
              <button
                @click="openProdiDetail('ti')"
                class="text-xs font-semibold text-bth-navy hover:underline flex items-center gap-1"
              >
                <span>Lihat Kurikulum & Prospek Karir</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ringkasan Biodata Diri -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-base">
              Biodata Calon Mahasiswa
            </h3>
            <p class="text-xs text-slate-500">Data identitas kependudukan terdaftar.</p>
          </div>
          <button
            @click="openProfileModal"
            class="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-sora font-semibold text-xs rounded-xl transition-colors"
          >
            ✏️ Ubah Data Kontak
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="text-slate-400 block mb-0.5">Nama Lengkap</span>
            <span class="font-bold text-slate-800 text-sm font-sora">{{ authStore.currentUser?.full_name || '-' }}</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="text-slate-400 block mb-0.5">Alamat Email</span>
            <span class="font-semibold text-slate-800 text-sm font-mono">{{ authStore.currentUser?.email || '-' }}</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="text-slate-400 block mb-0.5">Nomor Telepon / WhatsApp</span>
            <span class="font-semibold text-slate-800 text-sm font-mono">{{ authStore.currentUser?.phone || '081234567890' }}</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="text-slate-400 block mb-0.5">Asal Sekolah</span>
            <span class="font-semibold text-slate-800 text-sm">SMA Negeri 1 Tasikmalaya</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="text-slate-400 block mb-0.5">Jurusan Sekolah</span>
            <span class="font-semibold text-slate-800 text-sm">MIPA (Ilmu Alam)</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="text-slate-400 block mb-0.5">Tahun Kelulusan</span>
            <span class="font-semibold text-slate-800 text-sm">2026</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== TAB 3: UPLOAD & VERIFIKASI BERKAS (INTERAKTIF) ==================== -->
    <div v-if="activeTab === 'berkas'" class="space-y-6 animate-fadeIn">
      <!-- Header Info Berkas -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
              Unggah & Verifikasi Berkas Persyaratan
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Format yang didukung: PDF, JPG, PNG (Maksimal 2 MB per berkas).
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-sora font-bold text-xs rounded-full">
              3 dari 4 Berkas Lengkap
            </span>
          </div>
        </div>

        <!-- Berkas List Items -->
        <div class="space-y-3.5">
          <div
            v-for="(doc, idx) in documents"
            :key="idx"
            class="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            :class="doc.status === 'verified' ? 'bg-slate-50/50 border-slate-200' : doc.status === 'pending' ? 'bg-blue-50/40 border-blue-200' : 'bg-amber-50/40 border-amber-200'"
          >
            <div class="flex items-start gap-3.5">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs"
                :class="doc.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : doc.status === 'pending' ? 'bg-blue-100 text-bth-navy' : 'bg-amber-100 text-amber-700'"
              >
                {{ doc.icon }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-sora font-bold text-slate-800 text-sm">{{ doc.title }}</span>
                  <span v-if="doc.required" class="text-[10px] text-red-500 font-semibold">*Wajib</span>
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ doc.description }}
                </div>
                <div v-if="doc.filename" class="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-2">
                  <span>📄 {{ doc.filename }}</span>
                  <span>•</span>
                  <span>{{ doc.filesize }}</span>
                  <span>•</span>
                  <span class="text-emerald-600 font-sans font-medium">{{ doc.updatedAt }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons per Item -->
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <!-- Status Pill -->
              <span
                class="px-2.5 py-1 rounded-lg text-xs font-semibold font-sora"
                :class="{
                  'bg-emerald-100 text-emerald-800': doc.status === 'verified',
                  'bg-blue-100 text-bth-navy': doc.status === 'pending',
                  'bg-amber-100 text-amber-800': doc.status === 'missing'
                }"
              >
                {{ doc.statusLabel }}
              </span>

              <!-- Pratinjau Button -->
              <button
                v-if="doc.filename"
                @click="previewDocument(doc)"
                class="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors font-sora"
              >
                👁️ Pratinjau
              </button>

              <!-- Upload / Ganti Button -->
              <label class="px-3 py-1.5 bg-bth-navy hover:bg-bth-navy-dark text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer font-sora flex items-center gap-1">
                <span>{{ doc.filename ? 'Ganti' : 'Unggah' }}</span>
                <input
                  type="file"
                  class="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="handleFileUpload(doc, $event)"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Simulation Progress Bar Box -->
      <div v-if="isUploadingDoc" class="bg-blue-50 border border-blue-200 rounded-2xl p-5 animate-fadeIn">
        <div class="flex items-center justify-between text-xs font-sora font-semibold text-bth-navy mb-2">
          <span>Mengunggah {{ currentUploadingDocTitle }}...</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
          <div
            class="bg-bth-navy h-2 rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- ==================== TAB 4: JADWAL UJIAN & TRY OUT CBT ==================== -->
    <div v-if="activeTab === 'ujian'" class="space-y-6 animate-fadeIn">
      <!-- Live Countdown Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-bth-navy to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-900/50">
        <div class="text-center max-w-xl mx-auto">
          <span class="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-sora font-bold uppercase tracking-wider inline-block mb-3">
            Ujian Seleksi Online PMB BTH
          </span>
          <h3 class="font-sora font-extrabold text-xl sm:text-2xl mb-1">
            Hitung Mundur Pelaksanaan Ujian CBT
          </h3>
          <p class="text-xs sm:text-sm text-blue-200 mb-6">
            Jadwal: <strong>Sabtu, 18 Oktober 2026 • 08:30 WIB</strong>
          </p>

          <!-- Ticking Countdown Digits -->
          <div class="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
              <span class="font-sora font-extrabold text-xl sm:text-3xl text-amber-300 block font-mono">{{ countdownDays }}</span>
              <span class="text-[10px] text-blue-200 uppercase tracking-wider">Hari</span>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
              <span class="font-sora font-extrabold text-xl sm:text-3xl text-white block font-mono">{{ countdownHours }}</span>
              <span class="text-[10px] text-blue-200 uppercase tracking-wider">Jam</span>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
              <span class="font-sora font-extrabold text-xl sm:text-3xl text-white block font-mono">{{ countdownMinutes }}</span>
              <span class="text-[10px] text-blue-200 uppercase tracking-wider">Menit</span>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
              <span class="font-sora font-extrabold text-xl sm:text-3xl text-amber-400 block font-mono">{{ countdownSeconds }}</span>
              <span class="text-[10px] text-blue-200 uppercase tracking-wider">Detik</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini Try Out CBT Interaktif Card -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">🎯</span>
              <h3 class="font-sora font-bold text-slate-900 text-base sm:text-lg">
                Simulasi Latihan Soal (Try Out Mini CBT)
              </h3>
            </div>
            <p class="text-xs text-slate-500">
              Coba latihan 3 contoh soal ujian seleksi PMB Universitas BTH untuk menguji kesiapan Anda.
            </p>
          </div>
          <button
            @click="startTryOutModal"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>🚀</span>
            <span>Mulai Simulasi Ujian (3 Soal)</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span class="font-sora font-bold text-slate-800 text-sm block mb-1">1. Potensi Akademik (TPA)</span>
            <p class="text-slate-500 leading-relaxed">Penalaran logika, deret angka kuantitatif, dan penalaran verbal.</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span class="font-sora font-bold text-slate-800 text-sm block mb-1">2. Kemampuan Sains Dasar</span>
            <p class="text-slate-500 leading-relaxed">Biologi, Kimia, dan dasar-dasar ilmu kefarmasian & kesehatan.</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span class="font-sora font-bold text-slate-800 text-sm block mb-1">3. Bahasa Inggris Akademik</span>
            <p class="text-slate-500 leading-relaxed">Pemahaman bacaan teks ilmiah populer dan struktur kalimat.</p>
          </div>
        </div>
      </div>

      <!-- Kartu Peserta Ujian CBT -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 text-bth-navy flex items-center justify-center text-xl flex-shrink-0">
            🪪
          </div>
          <div>
            <h4 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Kartu Tanda Peserta Ujian CBT PMB
            </h4>
            <p class="text-xs text-slate-500">
              Wajib dicetak dan ditunjukkan pada saat mengikuti sesi ujian daring / luring.
            </p>
          </div>
        </div>
        <button
          @click="openCardModal"
          class="px-4 py-2.5 bg-bth-navy hover:bg-bth-navy-dark text-white font-sora font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <span>📥</span>
          <span>Unduh / Cetak Kartu Ujian</span>
        </button>
      </div>
    </div>

    <!-- ==================== TAB 5: AKUN, KEAMANAN & TOKEN RS256 ==================== -->
    <div v-if="activeTab === 'security'" class="space-y-6 animate-fadeIn">
      <!-- Pengaturan Akun & Password -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Card Ganti Kata Sandi -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 class="font-sora font-bold text-slate-900 text-base mb-1">Keamanan Kata Sandi</h3>
          <p class="text-xs text-slate-500 mb-5">Perbarui kata sandi akun PMB Anda secara berkala.</p>

          <form @submit.prevent="handleChangePassword" class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Lama</label>
              <input
                v-model="passwordForm.current_password"
                type="password"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-bth-navy focus:bg-white"
                placeholder="Masukkan kata sandi saat ini"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
              <input
                v-model="passwordForm.new_password"
                type="password"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-bth-navy focus:bg-white"
                placeholder="Minimal 8 karakter kombinasi"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
              <input
                v-model="passwordForm.new_password_confirmation"
                type="password"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-bth-navy focus:bg-white"
                placeholder="Ulangi kata sandi baru"
              />
            </div>
            <button
              type="submit"
              :disabled="passwordLoading"
              class="w-full py-2.5 bg-bth-navy hover:bg-bth-navy-dark text-white font-sora font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>{{ passwordLoading ? 'Menyimpan...' : 'Perbarui Kata Sandi' }}</span>
            </button>
          </form>
        </div>

        <!-- Card Sesi & Info Token RS256 -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-base mb-1">Sesi & Kriptografi RS256</h3>
            <p class="text-xs text-slate-500 mb-4">Informasi token otentikasi asymmetric signature.</p>

            <div class="space-y-2 text-xs font-mono">
              <div class="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <span class="text-slate-400">Algoritma:</span>
                <span class="font-bold text-bth-navy">RS256 (RSA-SHA256)</span>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <span class="text-slate-400">Key ID (kid):</span>
                <span class="font-bold text-slate-700">{{ decodedToken?.kid || 'pmb-auth-1' }}</span>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <span class="text-slate-400">Kadaluarsa Sesi:</span>
                <span class="font-bold text-emerald-600">{{ tokenTimeRemaining }}</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 mt-6 space-y-2">
            <button
              @click="handleLogoutAll"
              class="w-full py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-sora font-semibold text-xs rounded-xl transition-colors"
            >
              Keluar Dari Semua Perangkat
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL 1: CETAK KARTU PENDAFTARAN BTH ==================== -->
    <div
      v-if="showCardModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        <!-- Close Button -->
        <button
          @click="showCardModal = false"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
        >
          &times;
        </button>

        <!-- Official Header Kartu PMB BTH -->
        <div class="flex items-center gap-3.5 pb-4 border-b-2 border-slate-800 mb-6">
          <img src="/assets/icons/bth.png" alt="Logo BTH" class="w-12 h-12 object-contain" />
          <div>
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Universitas Bakti Tunas Husada</span>
            <h3 class="font-sora font-extrabold text-base sm:text-lg text-slate-900 uppercase">
              Kartu Tanda Pendaftaran Mahasiswa Baru
            </h3>
            <span class="text-[11px] text-bth-navy font-semibold block">Tahun Akademik 2026/2027 • Jalur Reguler</span>
          </div>
        </div>

        <!-- Badan Kartu: Detail Pendaftar & Pas Foto Mockup -->
        <div class="flex flex-col sm:flex-row gap-6 mb-6">
          <!-- Pas Foto Box -->
          <div class="w-28 h-36 bg-red-700 rounded-xl flex flex-col items-center justify-center text-white text-center p-2 shadow-xs flex-shrink-0 relative overflow-hidden">
            <span class="text-3xl">👤</span>
            <span class="text-[10px] font-sora font-bold mt-1 uppercase">Pas Foto 4x6</span>
            <span class="text-[9px] text-red-200">Latar Merah</span>
          </div>

          <!-- Data Singkat -->
          <div class="flex-1 space-y-2 text-xs">
            <div class="flex justify-between border-b border-slate-100 pb-1">
              <span class="text-slate-400">Nomor Registrasi:</span>
              <span class="font-mono font-bold text-slate-900">{{ registrationNumber }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-100 pb-1">
              <span class="text-slate-400">Nama Lengkap:</span>
              <span class="font-sora font-bold text-slate-900">{{ authStore.currentUser?.full_name }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-100 pb-1">
              <span class="text-slate-400">Pilihan Prodi 1:</span>
              <span class="font-bold text-bth-navy">S1 Farmasi</span>
            </div>
            <div class="flex justify-between border-b border-slate-100 pb-1">
              <span class="text-slate-400">Pilihan Prodi 2:</span>
              <span class="font-medium text-slate-700">S1 Teknologi Informasi</span>
            </div>
            <div class="flex justify-between border-b border-slate-100 pb-1">
              <span class="text-slate-400">Status Bayar:</span>
              <span class="text-emerald-700 font-bold">Lunas (Rp 250.000)</span>
            </div>
          </div>
        </div>

        <!-- Barcode & QR Stamp -->
        <div class="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200 mb-6">
          <div class="text-left">
            <span class="text-[10px] text-slate-400 block font-mono">DIGITAL SIGNATURE VALID</span>
            <span class="text-xs font-mono font-bold text-slate-700">SHA256-PMB-BTH-2026-OK</span>
          </div>
          <div class="text-2xl tracking-widest font-mono select-none">
            ||||| | |||| ||| ||
          </div>
        </div>

        <!-- Action Print & Tutup -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            @click="showCardModal = false"
            class="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 font-sora"
          >
            Tutup
          </button>
          <button
            @click="triggerPrint"
            class="px-5 py-2 bg-bth-navy text-white rounded-xl text-xs font-semibold hover:bg-bth-navy-dark shadow-md font-sora flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL 2: TRY OUT MINI CBT (3 SOAL) ==================== -->
    <div
      v-if="showTryOutModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          @click="showTryOutModal = false"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
        >
          &times;
        </button>

        <div class="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
          <span class="text-2xl">📝</span>
          <div>
            <h3 class="font-sora font-extrabold text-base sm:text-lg text-slate-900">
              Simulasi Try Out CBT Online PMB BTH
            </h3>
            <span class="text-xs text-slate-500">Latihan 3 Soal • Tanpa Batas Waktu</span>
          </div>
        </div>

        <!-- Hasil Skor Jika Sudah Selesai -->
        <div v-if="tryOutFinished" class="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center mb-6 animate-fadeIn">
          <span class="text-4xl block mb-2">🎉</span>
          <h4 class="font-sora font-extrabold text-lg text-emerald-900">
            Skor Anda: {{ tryOutScore }} / 100
          </h4>
          <p class="text-xs text-emerald-700 mt-1">
            {{ tryOutScore >= 70 ? 'Luar biasa! Pemahaman Anda sangat baik untuk menghadapi tes PMB BTH.' : 'Bagus! Pelajari kembali materi dasar sains & logika untuk hasil maksimal.' }}
          </p>
          <button
            @click="resetTryOut"
            class="mt-4 px-4 py-2 bg-emerald-700 text-white font-sora font-semibold text-xs rounded-xl shadow-xs hover:bg-emerald-800"
          >
            Ulangi Simulasi Soal
          </button>
        </div>

        <!-- Daftar Pertanyaan -->
        <div v-else class="space-y-6">
          <div
            v-for="(q, qIdx) in tryOutQuestions"
            :key="qIdx"
            class="p-4 bg-slate-50 rounded-2xl border border-slate-200"
          >
            <div class="font-sora font-bold text-xs sm:text-sm text-slate-900 mb-3">
              Soal {{ qIdx + 1 }}: {{ q.text }}
            </div>
            <div class="space-y-2">
              <label
                v-for="(opt, optIdx) in q.options"
                :key="optIdx"
                class="flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors"
                :class="q.selectedAnswer === optIdx ? 'bg-blue-100/70 border-bth-blue font-semibold text-bth-navy' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'"
              >
                <input
                  type="radio"
                  :name="'soal-' + qIdx"
                  :value="optIdx"
                  v-model="q.selectedAnswer"
                  class="text-bth-navy focus:ring-bth-blue"
                />
                <span>{{ opt }}</span>
              </label>
            </div>
          </div>

          <!-- Submit Answers Button -->
          <div class="pt-2 flex justify-end">
            <button
              @click="submitTryOut"
              class="px-6 py-2.5 bg-bth-navy hover:bg-bth-navy-dark text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              Kirim Jawaban & Lihat Skor
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL 3: DETAIL PRODI KURIKULUM & KARIR ==================== -->
    <div
      v-if="showProdiModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          @click="showProdiModal = false"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
        >
          &times;
        </button>

        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">{{ activeProdiDetail.icon }}</span>
          <div>
            <h3 class="font-sora font-extrabold text-lg text-slate-900">{{ activeProdiDetail.name }}</h3>
            <span class="text-xs text-bth-blue font-semibold">{{ activeProdiDetail.faculty }}</span>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed mb-4">
          {{ activeProdiDetail.desc }}
        </p>

        <div class="space-y-3 text-xs mb-6">
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="font-sora font-bold text-slate-800 block mb-1">Mata Kuliah Unggulan:</span>
            <p class="text-slate-600">{{ activeProdiDetail.courses }}</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <span class="font-sora font-bold text-slate-800 block mb-1">Peluang Karir Lulusan:</span>
            <p class="text-slate-600">{{ activeProdiDetail.career }}</p>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="showProdiModal = false"
            class="px-5 py-2 bg-bth-navy text-white rounded-xl text-xs font-semibold font-sora"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL 4: EDIT PROFILE MODAL ==================== -->
    <div
      v-if="showProfileModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          @click="showProfileModal = false"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
        >
          &times;
        </button>
        <h3 class="font-sora font-bold text-slate-900 text-base mb-4">Perbarui Biodata Kontak</h3>
        <form @submit.prevent="handleUpdateProfile" class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              v-model="profileForm.full_name"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-bth-navy focus:bg-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
            <input
              v-model="profileForm.phone"
              type="tel"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-bth-navy focus:bg-white"
            />
          </div>
          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="showProfileModal = false"
              class="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-sora"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="profileLoading"
              class="px-5 py-2 bg-bth-navy text-white rounded-xl text-xs font-sora font-semibold shadow-xs"
            >
              {{ profileLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { jwtDecode } from 'jwt-decode';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

const router = useRouter();
const authStore = useAuthStore();

// Tabs state
const activeTab = ref('overview');
const tabs = [
  { id: 'overview', label: 'Ringkasan Pendaftaran', icon: '📋' },
  { id: 'prodi', label: 'Pilihan Prodi & Biodata', icon: '🎓' },
  { id: 'berkas', label: 'Unggah Dokumen Berkas', icon: '📁', badge: '3/4' },
  { id: 'ujian', label: 'Jadwal Ujian & Try Out', icon: '💻', badge: 'CBT' },
  { id: 'security', label: 'Keamanan Akun', icon: '🛡️' },
];

// Feedback Toast
const toastMessage = ref('');
const toastType = ref('success');
const showToast = (msg, type = 'success') => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = '';
  }, 4000);
};

// Static & Synced Candidate Details
const registrationNumber = 'BTH-2026-REG-08492';
const currentAdmissionStatus = 'Tahap Seleksi Berkas & CBT';

const copyRegistrationNumber = () => {
  navigator.clipboard?.writeText(registrationNumber);
  showToast('Nomor Registrasi berhasil disalin!', 'success');
};

const copyVaNumber = () => {
  navigator.clipboard?.writeText('900120849200128');
  showToast('Nomor Rekening Virtual Account (BSI) berhasil disalin!', 'success');
};

// 6 Admission Steps
const admissionSteps = [
  { title: 'Registrasi Akun', subtitle: 'Selesai & Terverifikasi', status: 'completed', tab: 'overview' },
  { title: 'Pilihan Program Studi', subtitle: 'S1 Farmasi & S1 TI', status: 'completed', tab: 'prodi' },
  { title: 'Pembayaran Formulir', subtitle: 'Lunas Rp 250.000', status: 'completed', tab: 'overview' },
  { title: 'Unggah Berkas', subtitle: '3/4 Berkas Lengkap', status: 'active', tab: 'berkas' },
  { title: 'Ujian Seleksi CBT', subtitle: '18 Okt 2026', status: 'pending', tab: 'ujian' },
  { title: 'Pengumuman Kelulusan', subtitle: '24 Okt 2026', status: 'pending', tab: 'overview' },
];

const handleStepClick = (step) => {
  activeTab.value = step.tab;
};

// Documents list
const documents = ref([
  {
    icon: '📜',
    title: 'Ijazah / Surat Keterangan Lulus (SKL)',
    description: 'Dokumen legalisir kelulusan SMA/SMK/MA sederajat.',
    required: true,
    filename: 'SKL_Siti_Rahmawati_SMAN1.pdf',
    filesize: '1.2 MB',
    updatedAt: '12 Sep 2026',
    status: 'verified',
    statusLabel: 'Terverifikasi Panitia',
  },
  {
    icon: '🪪',
    title: 'Kartu Tanda Penduduk (KTP) / Kartu Pelajar',
    description: 'Kartu identitas resmi berkewarganegaraan Indonesia.',
    required: true,
    filename: 'KTP_Siti_Rahmawati.jpg',
    filesize: '840 KB',
    updatedAt: '12 Sep 2026',
    status: 'verified',
    statusLabel: 'Terverifikasi Panitia',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Kartu Keluarga (KK)',
    description: 'Scan lembar asli Kartu Keluarga terbaru.',
    required: true,
    filename: 'Kartu_Keluarga_Terbaru.pdf',
    filesize: '1.4 MB',
    updatedAt: '13 Sep 2026',
    status: 'verified',
    statusLabel: 'Terverifikasi Panitia',
  },
  {
    icon: '📷',
    title: 'Pas Foto Resmi 4x6 Latar Merah',
    description: 'Foto formal pakaian berkerah latar belakang merah.',
    required: true,
    filename: '',
    filesize: '',
    updatedAt: '',
    status: 'missing',
    statusLabel: 'Belum Diunggah',
  },
]);

// Upload Simulation
const isUploadingDoc = ref(false);
const uploadProgress = ref(0);
const currentUploadingDocTitle = ref('');

const handleFileUpload = (doc, event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  isUploadingDoc.value = true;
  currentUploadingDocTitle.value = doc.title;
  uploadProgress.value = 0;

  const interval = setInterval(() => {
    uploadProgress.value += 25;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        isUploadingDoc.value = false;
        doc.filename = file.name;
        doc.filesize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        doc.updatedAt = 'Baru saja';
        doc.status = 'pending';
        doc.statusLabel = 'Sedang Ditinjau Panitia';
        showToast(`Berkas "${doc.title}" berhasil diunggah! Sedang diverifikasi panitia.`, 'success');
      }, 400);
    }
  }, 200);
};

const previewDocument = (doc) => {
  showToast(`Membuka pratinjau dokumen: ${doc.filename}`, 'success');
};

// Live Exam Countdown (Days, Hours, Minutes, Seconds)
const countdownDays = ref('00');
const countdownHours = ref('00');
const countdownMinutes = ref('00');
const countdownSeconds = ref('00');
let countdownInterval = null;

const targetExamDate = new Date();
targetExamDate.setDate(targetExamDate.getDate() + 14); // 14 hari lagi

const updateCountdown = () => {
  const now = new Date();
  const diff = targetExamDate - now;
  if (diff <= 0) {
    countdownDays.value = '00';
    countdownHours.value = '00';
    countdownMinutes.value = '00';
    countdownSeconds.value = '00';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  countdownDays.value = String(days).padStart(2, '0');
  countdownHours.value = String(hours).padStart(2, '0');
  countdownMinutes.value = String(minutes).padStart(2, '0');
  countdownSeconds.value = String(seconds).padStart(2, '0');
};

// Mini Try Out Modal
const showTryOutModal = ref(false);
const tryOutFinished = ref(false);
const tryOutScore = ref(0);

const tryOutQuestions = ref([
  {
    text: 'Zat aktif yang sering digunakan sebagai antipiretik dan analgesik ringan pada obat flu umum adalah...',
    options: ['Parasetamol', 'Amoksisilin', 'Omeprazol', 'Deksametason'],
    correctAnswer: 0,
    selectedAnswer: null,
  },
  {
    text: 'Jika 3 orang apoteker dapat meracik 15 resep dalam 30 menit, berapa banyak resep yang dapat diselesaikan oleh 6 apoteker dalam waktu yang sama?',
    options: ['20 Resep', '25 Resep', '30 Resep', '45 Resep'],
    correctAnswer: 2,
    selectedAnswer: null,
  },
  {
    text: 'Choose the sentence with correct English grammar:',
    options: [
      'The university offers various medical programs.',
      'The university offer various medical programs.',
      'The university are offering various medical program.',
      'The university offering various medical programs.',
    ],
    correctAnswer: 0,
    selectedAnswer: null,
  },
]);

const startTryOutModal = () => {
  tryOutFinished.value = false;
  showTryOutModal.value = true;
};

const submitTryOut = () => {
  let correct = 0;
  tryOutQuestions.value.forEach((q) => {
    if (q.selectedAnswer === q.correctAnswer) correct++;
  });
  tryOutScore.value = Math.round((correct / tryOutQuestions.value.length) * 100);
  tryOutFinished.value = true;
};

const resetTryOut = () => {
  tryOutQuestions.value.forEach((q) => (q.selectedAnswer = null));
  tryOutFinished.value = false;
};

// Card Print Modal
const showCardModal = ref(false);
const openCardModal = () => {
  showCardModal.value = true;
};
const triggerPrint = () => {
  window.print();
};

// Prodi Details Modal
const showProdiModal = ref(false);
const activeProdiDetail = ref({});
const prodiDetails = {
  farmasi: {
    icon: '💊',
    name: 'S1 Farmasi',
    faculty: 'Fakultas Farmasi Universitas BTH',
    desc: 'Program studi unggulan Universitas BTH yang berfokus pada ilmu kimia farmasi, formulasi obat bahan alam, dan pelayanan klinis farmasi.',
    courses: 'Kimia Farmasi Dasar, Farmakoterapi, Bioteknologi Obat, Farmasi Rumah Sakit, Teknologi Sediaan Herbal.',
    career: 'Apoteker Rumah Sakit / Apotek, Formulator Industri Farmasi (BPOM/Kimia Farma), Peneliti Obat Bahan Alam, Clinical Research Associate.',
  },
  ti: {
    icon: '💻',
    name: 'S1 Teknologi Informasi',
    faculty: 'Fakultas Teknologi & Bisnis Universitas BTH',
    desc: 'Menyiapkan lulusan ahli rekayasa perangkat lunak, sistem informasi kesehatan (Health Tech), keamanan siber, dan kecerdasan buatan (AI).',
    courses: 'Algoritma & Pemrograman, Database Sistem RS, Rekayasa Web Modern, Kecerdasan Buatan (AI), Cloud & Cyber Security.',
    career: 'Fullstack Software Engineer, Health Data Analyst, IT Consultant Rumah Sakit, Cybersecurity Specialist.',
  },
};

const openProdiDetail = (key) => {
  activeProdiDetail.value = prodiDetails[key];
  showProdiModal.value = true;
};

// Profile & Password Backend Integrations
const showProfileModal = ref(false);
const profileLoading = ref(false);
const profileForm = reactive({ full_name: '', phone: '' });

const openProfileModal = () => {
  profileForm.full_name = authStore.currentUser?.full_name || '';
  profileForm.phone = authStore.currentUser?.phone || '';
  showProfileModal.value = true;
};

const handleUpdateProfile = async () => {
  profileLoading.value = true;
  try {
    await authStore.updateProfile(profileForm);
    showProfileModal.value = false;
    showToast('Biodata kontak Anda berhasil diperbarui!', 'success');
  } catch (err) {
    showToast(err.response?.data?.message || 'Gagal mengubah profil.', 'error');
  } finally {
    profileLoading.value = false;
  }
};

const passwordLoading = ref(false);
const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

const handleChangePassword = async () => {
  if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
    showToast('Konfirmasi kata sandi baru tidak sesuai.', 'error');
    return;
  }
  passwordLoading.value = true;
  try {
    await authStore.changePassword(passwordForm);
    passwordForm.current_password = '';
    passwordForm.new_password = '';
    passwordForm.new_password_confirmation = '';
    showToast('Kata sandi akun Anda berhasil diperbarui!', 'success');
  } catch (err) {
    showToast(err.response?.data?.message || 'Gagal memperbarui kata sandi.', 'error');
  } finally {
    passwordLoading.value = false;
  }
};

const handleLogoutAll = async () => {
  if (confirm('Apakah Anda yakin ingin keluar dari seluruh perangkat aktif?')) {
    await authStore.logoutAll();
    router.push('/login');
  }
};

// RS256 Token Info
const tokenTimeRemaining = ref('15 Menit');
const decodedToken = computed(() => {
  if (!authStore.accessToken) return null;
  try {
    return jwtDecode(authStore.accessToken);
  } catch {
    return null;
  }
});

onMounted(async () => {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
  try {
    await authStore.fetchProfile();
  } catch (e) {
    console.warn('Initial profile sync warning:', e);
  }
});

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
