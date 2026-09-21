<template>
  <div class="space-y-6">
    <!-- Header Meja Kerja Institusional -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div>
        <h2 class="font-sora font-bold text-base sm:text-lg text-slate-900">
          Dashboard Institusional & Analitik Eksekutif
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Pemantauan performa penerimaan mahasiswa baru berjenjang: Rektorat Universitas, Dekan Fakultas, dan Ketua Program Studi.
        </p>
      </div>

      <!-- Level Selector Switcher Tabs -->
      <div class="flex overflow-x-auto no-scrollbar max-w-full p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-sora font-semibold">
        <button
          @click="currentLevel = 'university'"
          class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0"
          :class="currentLevel === 'university' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Universitas (Rektorat)</span>
        </button>

        <button
          @click="currentLevel = 'faculty'"
          class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0"
          :class="currentLevel === 'faculty' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
          <span>Fakultas (Dekanat)</span>
        </button>

        <button
          @click="currentLevel = 'prodi'"
          class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0"
          :class="currentLevel === 'prodi' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Program Studi (Kaprodi)</span>
        </button>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- LEVEL 1: UNIVERSITAS (REKTORAT & DEWAN EKSEKUTIF)                 -->
    <!-- ================================================================= -->
    <div v-if="currentLevel === 'university'" class="space-y-6 animate-fadeIn">
      <!-- 4 Macro KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Target vs Realisasi Kuota PMB -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kapasitas Kursi Total</span>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#1E3A8A] rounded-full border border-blue-200 font-mono">
                TA 2026/2027
              </span>
            </div>
            <div class="font-sora font-extrabold text-2xl text-slate-900 mt-2">
              {{ totalEnrolledUniversitas }} <span class="text-sm font-normal text-slate-400">/ 500 Target</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Keterisian kuota universitas: <strong class="text-emerald-600">{{ Math.round((totalEnrolledUniversitas / 500) * 100) }}%</strong>
            </p>
          </div>
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              class="bg-[#1E3A8A] h-full rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(100, Math.round((totalEnrolledUniversitas / 500) * 100))}%` }"
            ></div>
          </div>
        </div>

        <!-- Rasio Kelulusan CBT -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Kelulusan CBT</span>
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
            </div>
            <div class="font-sora font-extrabold text-2xl text-slate-900 mt-2">
              {{ passRate }}%
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Passing grade minimal standar BTH: <strong>70.0</strong>
            </p>
          </div>
          <div class="text-[11px] text-emerald-600 font-medium mt-3 flex items-center gap-1">
            <span>{{ adminStore.passedStudentsCount }} dari {{ adminStore.totalApplicants }} pelamar memenuhi syarat</span>
          </div>
        </div>

        <!-- Yield Rate Pelunasan UKT -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Yield Rate UKT (Daftar Ulang)</span>
              <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="font-sora font-extrabold text-2xl text-[#1E3A8A] mt-2">
              {{ yieldRate }}%
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Konversi dari calon mahasiswa lulus menjadi mahasiswa aktif
            </p>
          </div>
          <div class="text-[11px] text-indigo-700 font-medium mt-3">
            {{ totalPaidUktCount }} Mahasiswa Baru Terdaftar
          </div>
        </div>

        <!-- Akumulasi Kas Masuk PMB -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan Kas PMB</span>
              <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-mono font-bold text-xs">
                Rp
              </div>
            </div>
            <div class="font-sora font-extrabold text-xl text-slate-900 mt-2">
              {{ formattedTotalRevenue }}
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Formulir Pendaftaran & Registrasi UKT
            </p>
          </div>
          <div class="text-[11px] text-emerald-600 font-medium mt-3 flex items-center gap-1">
            <span>Rekonsiliasi Host-to-Host BSI & Mandiri</span>
          </div>
        </div>
      </div>

      <!-- Charts Visualisasi Institusional -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Kinerja Antar Fakultas -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Komparasi Pendaftar & Kuota Fakultas
              </h3>
              <p class="text-xs text-slate-500">Perbandingan kuota vs pendaftar vs kelulusan per fakultas.</p>
            </div>
            <span class="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-[#1E3A8A] rounded-full border border-blue-200 font-mono">
              Fakultas BTH
            </span>
          </div>
          <div class="h-64 my-3">
            <BarChart :chart-data="facultyBarChartData" />
          </div>
          <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
            Daya Tampung: Farmasi 240, FTB 140, FIKes 120
          </div>
        </div>

        <!-- Chart 2: Sebaran Rata-rata Skor Seleksi per Prodi -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Rata-rata Skor CBT & Rapor per Program Studi
              </h3>
              <p class="text-xs text-slate-500">Evaluasi mutu akademik calon mahasiswa per peminatan.</p>
            </div>
            <span class="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-mono">
              Akademik
            </span>
          </div>
          <div class="h-64 my-3">
            <BarChart :chart-data="scoresBarChartData" />
          </div>
          <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
            Passing grade minimal standar BTH: 70.0
          </div>
        </div>
      </div>

      <!-- Komparasi Performa 3 Fakultas Universitas BTH -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Kinerja Penerimaan Antar Fakultas
            </h3>
            <p class="text-xs text-slate-500">Perbandingan kuota, pendaftar, dan kelulusan pada masing-masing fakultas naungan BTH.</p>
          </div>
          <span class="text-xs font-mono font-semibold text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            3 Fakultas Aktif
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="fac in facultySummaries"
            :key="fac.name"
            class="p-5 rounded-2xl border transition-all space-y-3 bg-slate-50/60 border-slate-200 hover:border-blue-300"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora block">FAKULTAS</span>
                <h4 class="font-sora font-bold text-slate-900 text-sm mt-0.5">{{ fac.name }}</h4>
              </div>
              <span class="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-bold rounded border border-slate-200">
                {{ fac.prodis.length }} Prodi
              </span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between text-slate-600">
                <span>Daya Tampung Kursi:</span>
                <strong class="text-slate-900">{{ fac.quota }} Kursi</strong>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Pendaftar Masuk:</span>
                <strong class="text-[#1E3A8A]">{{ fac.totalApplicants }} Orang</strong>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Lulus Seleksi:</span>
                <strong class="text-emerald-700">{{ fac.passedCount }} Mahasiswa</strong>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Keterisian Kuota:</span>
                <strong class="text-slate-900">{{ fac.fillPercent }}%</strong>
              </div>
            </div>

            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="fac.color"
                :style="{ width: `${Math.min(100, fac.fillPercent)}%` }"
              ></div>
            </div>

            <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Program Studi:</span>
              <span class="font-medium text-slate-700">{{ fac.prodis.join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- LEVEL 2: FAKULTAS (DEKANAT)                                       -->
    <!-- ================================================================= -->
    <div v-else-if="currentLevel === 'faculty'" class="space-y-6 animate-fadeIn">
      <!-- Selector Dropdown Fakultas -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">PILIH FAKULTAS</span>
            <div class="font-sora font-bold text-sm text-slate-900">{{ selectedFaculty }}</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-500">Ganti Fakultas:</label>
          <select
            v-model="selectedFaculty"
            class="px-3.5 py-2 bg-slate-50 border border-slate-300 focus:border-[#1E3A8A] rounded-xl text-xs font-semibold text-slate-800 outline-none"
          >
            <option value="Fakultas Farmasi">Fakultas Farmasi</option>
            <option value="Fakultas Teknologi & Bisnis">Fakultas Teknologi & Bisnis</option>
            <option value="Fakultas Ilmu Kesehatan">Fakultas Ilmu Kesehatan</option>
          </select>
        </div>
      </div>

      <!-- Detail Kinerja Fakultas Terpilih -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Card 1: Profil Dekanat & Akreditasi -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm">Profil Dekanat</h3>
            <span class="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              AKREDITASI UNGGUL
            </span>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span class="text-slate-500 block text-[11px]">Dekan Fakultas:</span>
              <strong class="text-slate-900 font-sora text-xs mt-0.5 block">{{ facultyDeanName }}</strong>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span class="text-slate-500">Kapasitas Kursi Gelombang 1:</span>
              <strong class="font-mono text-slate-900">{{ activeFacultyDetails.quota }} Kursi</strong>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span class="text-slate-500">Peminat Prioritas 1:</span>
              <strong class="font-mono text-[#1E3A8A]">{{ activeFacultyDetails.pilihan1Count }} Pelamar</strong>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span class="text-slate-500">Peminat Prioritas 2:</span>
              <strong class="font-mono text-slate-700">{{ activeFacultyDetails.pilihan2Count }} Pelamar</strong>
            </div>
          </div>
        </div>

        <!-- Card 2: Keterisian Prodi di Bawah Fakultas -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Keterisian Kuota Program Studi
            </h3>
            <span class="text-xs text-slate-400 font-mono">{{ activeFacultyDetails.prodis.length }} Program Studi</span>
          </div>

          <div class="space-y-4 text-xs">
            <div
              v-for="prodi in activeFacultyProdis"
              :key="prodi.name"
              class="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-sora font-bold text-slate-900 text-sm">{{ prodi.name }}</h4>
                  <span class="text-[11px] text-slate-500">{{ prodi.degree }} • Akreditasi: {{ prodi.accreditation }}</span>
                </div>
                <div class="text-right font-mono">
                  <span class="text-sm font-bold text-[#1E3A8A]">{{ prodi.applicantsCount }}</span>
                  <span class="text-slate-400"> / {{ prodi.quota }} Kursi</span>
                </div>
              </div>

              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  class="bg-blue-600 h-full rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min(100, Math.round((prodi.applicantsCount / prodi.quota) * 100))}%` }"
                ></div>
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Rata-rata Skor CBT: <strong class="text-slate-800">{{ prodi.avgCbtScore }}</strong></span>
                <span>Lulus Seleksi: <strong class="text-emerald-700">{{ prodi.passedCount }} Mahasiswa</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- LEVEL 3: PROGRAM STUDI (KAPRODI)                                  -->
    <!-- ================================================================= -->
    <div v-else-if="currentLevel === 'prodi'" class="space-y-6 animate-fadeIn">
      <!-- Selector Dropdown Program Studi -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">PILIH PROGRAM STUDI</span>
            <div class="font-sora font-bold text-sm text-slate-900">{{ selectedProdi }}</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-500">Ganti Prodi:</label>
          <select
            v-model="selectedProdi"
            class="px-3.5 py-2 bg-slate-50 border border-slate-300 focus:border-[#1E3A8A] rounded-xl text-xs font-semibold text-slate-800 outline-none"
          >
            <option v-for="p in prodiNames" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
      </div>

      <!-- Key Metrics Kaprodi -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kapasitas Kursi Prodi</div>
          <div class="font-sora font-extrabold text-2xl text-[#1E3A8A] mt-1">
            {{ activeProdiInfo.enrolled }} <span class="text-sm font-normal text-slate-400">/ {{ activeProdiInfo.quota }} Kursi</span>
          </div>
          <div class="text-xs text-emerald-600 font-medium mt-1">
            Tersisa {{ activeProdiInfo.quota - activeProdiInfo.enrolled }} Kursi Tersedia
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Skor CBT Pelamar</div>
          <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
            {{ activeProdiInfo.avgCbtScore }} <span class="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div class="text-xs text-slate-500 mt-1">
            Rata-rata Nilai Rapor: {{ activeProdiInfo.avgRaporScore }}
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tarif UKT Resmi</div>
          <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
            Rp {{ (activeProdiInfo.uktFee || 4500000).toLocaleString('id-ID') }}
          </div>
          <div class="text-xs text-slate-500 mt-1">
            Per Semester • Jenjang {{ activeProdiInfo.degree }}
          </div>
        </div>
      </div>

      <!-- Analitik Demografi Peminat & Daftar Kandidat -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Demografi Asal Sekolah & Wilayah -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 class="font-sora font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Sebaran Demografi Pelamar
          </h3>

          <!-- Tipe Sekolah -->
          <div class="space-y-2 text-xs">
            <span class="text-slate-500 font-medium block">Distribusi Jenis Sekolah Asal:</span>
            <div class="space-y-1.5">
              <div class="flex justify-between text-[11px]">
                <span class="text-slate-700">SMA (Sekolah Menengah Atas)</span>
                <span class="font-bold font-mono">62%</span>
              </div>
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-[#1E3A8A] h-full rounded-full" style="width: 62%"></div>
              </div>

              <div class="flex justify-between text-[11px] pt-1">
                <span class="text-slate-700">SMK (Kesehatan / TI / Kejuruan)</span>
                <span class="font-bold font-mono">28%</span>
              </div>
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-indigo-600 h-full rounded-full" style="width: 28%"></div>
              </div>

              <div class="flex justify-between text-[11px] pt-1">
                <span class="text-slate-700">MA (Madrasah Aliyah)</span>
                <span class="font-bold font-mono">10%</span>
              </div>
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full" style="width: 10%"></div>
              </div>
            </div>
          </div>

          <!-- Sebaran Geografis -->
          <div class="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <span class="text-slate-500 font-medium block">Sebaran Geografis Domisili:</span>
            <div class="space-y-1 text-slate-700 text-[11px]">
              <div class="flex justify-between py-1 border-b border-slate-50">
                <span>Kota & Kab. Tasikmalaya</span>
                <strong class="font-mono">54%</strong>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-50">
                <span>Kab. Ciamis & Banjar</span>
                <strong class="font-mono">22%</strong>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-50">
                <span>Kab. Garut & Pangandaran</span>
                <strong class="font-mono">14%</strong>
              </div>
              <div class="flex justify-between py-1">
                <span>Luar Priangan Timur (Bandung, Jakarta, dll.)</span>
                <strong class="font-mono">10%</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Daftar Pendaftar Terkini Program Studi -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Daftar Calon Mahasiswa Terdaftar di {{ selectedProdi }}
            </h3>
            <span class="text-xs text-slate-400">{{ activeProdiApplicants.length }} Pelamar Aktif</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-left text-xs text-slate-700">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px]">
                <tr>
                  <th class="py-2.5 px-3 font-bold">No. Registrasi</th>
                  <th class="py-2.5 px-3 font-bold">Nama Mahasiswa</th>
                  <th class="py-2.5 px-3 font-bold">Asal Sekolah</th>
                  <th class="py-2.5 px-3 font-bold text-center">Skor CBT</th>
                  <th class="py-2.5 px-3 font-bold">Status Seleksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="app in activeProdiApplicants" :key="app.id" class="hover:bg-slate-50">
                  <td class="py-2.5 px-3 font-mono font-bold text-[#1E3A8A]">{{ app.id }}</td>
                  <td class="py-2.5 px-3 font-medium text-slate-900">{{ app.fullName }}</td>
                  <td class="py-2.5 px-3 text-slate-500">{{ app.schoolName }}</td>
                  <td class="py-2.5 px-3 text-center font-bold" :class="app.selection.cbtScore >= 70 ? 'text-[#1E3A8A]' : 'text-rose-600'">
                    {{ app.selection.cbtScore }}
                  </td>
                  <td class="py-2.5 px-3">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="app.selection.passedStatus === 'passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                    >
                      {{ app.selection.passedStatus === 'passed' ? 'Lulus Seleksi' : 'Evaluasi' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!activeProdiApplicants.length">
                  <td colspan="5" class="py-6 text-center text-slate-400 italic">
                    Belum ada calon mahasiswa terdaftar pada program studi ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { PRODI_METADATA } from '@/stores/applicant';
import BarChart from '@/components/charts/BarChart.vue';

const adminStore = useAdminStore();
const currentLevel = ref('university');
const selectedFaculty = ref('Fakultas Farmasi');
const selectedProdi = ref('S1 Farmasi');

const prodiNames = Object.keys(PRODI_METADATA);

// Level 1 Computed - 100% Dinamis dari Pendaftar Riil
const totalEnrolledUniversitas = computed(() => {
  return adminStore.applicants.filter((a) => a.onboarding?.isEnrolled || a.payments?.uktFee?.status === 'paid').length;
});

const passRate = computed(() => {
  if (!adminStore.applicants.length) return '0.0';
  return ((adminStore.passedStudentsCount / adminStore.applicants.length) * 100).toFixed(1);
});

const totalPaidUktCount = computed(() => {
  return adminStore.applicants.filter((a) => a.payments?.uktFee?.status === 'paid').length;
});

const yieldRate = computed(() => {
  if (!adminStore.passedStudentsCount) return '0.0';
  return ((totalPaidUktCount.value / adminStore.passedStudentsCount) * 100).toFixed(1);
});

const formattedTotalRevenue = computed(() => {
  const rev = adminStore.totalPaidRevenue;
  if (rev >= 1000000) {
    return `Rp ${(rev / 1000000).toFixed(1)} Juta`;
  }
  return `Rp ${rev.toLocaleString('id-ID')}`;
});

// Ringkasan 3 Fakultas - Dinamis murni
const facultySummaries = computed(() => {
  const fac1Applicants = adminStore.applicants.filter((a) => a.faculty?.includes('Farmasi') || a.prodi1?.includes('Farmasi'));
  const fac2Applicants = adminStore.applicants.filter((a) => a.faculty?.includes('Teknologi') || a.prodi1?.includes('Teknologi') || a.prodi1?.includes('Bisnis'));
  const fac3Applicants = adminStore.applicants.filter((a) => a.faculty?.includes('Kesehatan') || a.prodi1?.includes('Kesehatan') || a.prodi1?.includes('Analis') || a.prodi1?.includes('Administrasi'));

  const fac1Passed = fac1Applicants.filter((a) => a.selection?.passedStatus === 'passed').length;
  const fac2Passed = fac2Applicants.filter((a) => a.selection?.passedStatus === 'passed').length;
  const fac3Passed = fac3Applicants.filter((a) => a.selection?.passedStatus === 'passed').length;

  return [
    {
      name: 'Fakultas Farmasi',
      quota: 240,
      prodis: ['S1 Farmasi', 'D3 Farmasi'],
      totalApplicants: fac1Applicants.length,
      passedCount: fac1Passed,
      fillPercent: fac1Applicants.length ? Math.round((fac1Applicants.length / 240) * 100) : 0,
      color: 'bg-[#1E3A8A]',
    },
    {
      name: 'Fakultas Teknologi & Bisnis',
      quota: 140,
      prodis: ['S1 Teknologi Informasi', 'S1 Manajemen Bisnis Informasi'],
      totalApplicants: fac2Applicants.length,
      passedCount: fac2Passed,
      fillPercent: fac2Applicants.length ? Math.round((fac2Applicants.length / 140) * 100) : 0,
      color: 'bg-[#2563EB]',
    },
    {
      name: 'Fakultas Ilmu Kesehatan',
      quota: 120,
      prodis: ['S1 Administrasi RS', 'D3 Analis Kesehatan (TLM)'],
      totalApplicants: fac3Applicants.length,
      passedCount: fac3Passed,
      fillPercent: fac3Applicants.length ? Math.round((fac3Applicants.length / 120) * 100) : 0,
      color: 'bg-emerald-600',
    },
  ];
});

// Chart 1: Komparasi Pendaftar & Kuota Fakultas
const facultyBarChartData = computed(() => {
  const facs = facultySummaries.value;
  return {
    labels: facs.map((f) => f.name),
    datasets: [
      {
        label: 'Pendaftar Masuk',
        data: facs.map((f) => f.totalApplicants),
        backgroundColor: '#2563EB',
        borderRadius: 6,
      },
      {
        label: 'Lulus Seleksi',
        data: facs.map((f) => f.passedCount),
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
      {
        label: 'Kapasitas Kuota',
        data: facs.map((f) => f.quota),
        backgroundColor: '#94A3B8',
        borderRadius: 6,
      },
    ],
  };
});

// Chart 2: Rata-Rata Nilai CBT & Rapor per Program Studi
const scoresBarChartData = computed(() => {
  const prodiLabels = [
    'S1 Farmasi',
    'S1 TI',
    'D3 Farmasi',
    'D3 TLM',
    'S1 ARS',
    'S1 MBI',
  ];

  const cbtAverages = prodiLabels.map((shortName) => {
    const list = adminStore.applicants.filter((a) => {
      const p = a.prodi1 || '';
      if (shortName === 'S1 TI') return p.includes('Teknologi');
      if (shortName === 'D3 TLM') return p.includes('Analis') || p.includes('TLM');
      if (shortName === 'S1 ARS') return p.includes('Administrasi');
      if (shortName === 'S1 MBI') return p.includes('Bisnis') || p.includes('MBI');
      if (shortName === 'D3 Farmasi') return p.includes('D3 Farmasi');
      return p.includes('S1 Farmasi');
    });

    if (!list.length) return 0;
    const sum = list.reduce((acc, a) => acc + (a.selection?.cbtScore || 0), 0);
    return Math.round(sum / list.length);
  });

  const raporAverages = prodiLabels.map((shortName) => {
    const list = adminStore.applicants.filter((a) => {
      const p = a.prodi1 || '';
      if (shortName === 'S1 TI') return p.includes('Teknologi');
      if (shortName === 'D3 TLM') return p.includes('Analis') || p.includes('TLM');
      if (shortName === 'S1 ARS') return p.includes('Administrasi');
      if (shortName === 'S1 MBI') return p.includes('Bisnis') || p.includes('MBI');
      if (shortName === 'D3 Farmasi') return p.includes('D3 Farmasi');
      return p.includes('S1 Farmasi');
    });

    if (!list.length) return 0;
    const sum = list.reduce((acc, a) => acc + (parseFloat(a.averageScore) || 80), 0);
    return Math.round(sum / list.length);
  });

  return {
    labels: prodiLabels,
    datasets: [
      {
        label: 'Rata-rata Skor CBT',
        data: cbtAverages,
        backgroundColor: '#1E3A8A',
        borderRadius: 6,
      },
      {
        label: 'Rata-rata Rapor',
        data: raporAverages,
        backgroundColor: '#F59E0B',
        borderRadius: 6,
      },
    ],
  };
});

// Level 2 Computed
const facultyDeanName = computed(() => {
  if (selectedFaculty.value === 'Fakultas Farmasi') return 'apt. Dr. Nining Suryani, M.Si.';
  if (selectedFaculty.value === 'Fakultas Teknologi & Bisnis') return 'Ir. Hendra Gunawan, M.T., Ph.D.';
  return 'drg. Hj. Rina Marlina, M.Kes.';
});

const activeFacultyDetails = computed(() => {
  const item = facultySummaries.value.find((f) => f.name === selectedFaculty.value);
  return (
    item || {
      quota: 150,
      pilihan1Count: 0,
      pilihan2Count: 0,
      prodis: ['S1 Farmasi'],
    }
  );
});

const activeFacultyProdis = computed(() => {
  const fac = selectedFaculty.value;
  return Object.entries(PRODI_METADATA)
    .filter(([_, meta]) => meta.faculty === fac)
    .map(([name, meta]) => {
      const applicants = adminStore.applicants.filter((a) => a.prodi1 === name);
      const passedCount = applicants.filter((a) => a.selection?.passedStatus === 'passed').length;
      const avgCbt = applicants.length
        ? (applicants.reduce((acc, a) => acc + (a.selection?.cbtScore || 0), 0) / applicants.length).toFixed(1)
        : '0.0';

      return {
        name,
        degree: meta.degree,
        accreditation: name.includes('Farmasi') ? 'Unggul' : 'Baik Sekali',
        quota: name.includes('S1 Farmasi') ? 150 : 70,
        applicantsCount: applicants.length,
        avgCbtScore: avgCbt,
        passedCount,
      };
    });
});

// Level 3 Computed
const activeProdiInfo = computed(() => {
  const meta = PRODI_METADATA[selectedProdi.value] || {};
  const applicants = adminStore.applicants.filter((a) => a.prodi1 === selectedProdi.value);
  const quota = selectedProdi.value === 'S1 Farmasi' ? 150 : selectedProdi.value.includes('Teknologi') ? 80 : 60;

  const avgCbt = applicants.length
    ? (applicants.reduce((acc, a) => acc + (a.selection?.cbtScore || 0), 0) / applicants.length).toFixed(1)
    : '0.0';
  const avgRapor = applicants.length
    ? (applicants.reduce((acc, a) => acc + (parseFloat(a.averageScore) || 0), 0) / applicants.length).toFixed(1)
    : '0.0';

  return {
    name: selectedProdi.value,
    degree: meta.degree || 'Sarjana',
    quota,
    enrolled: applicants.length,
    uktFee: meta.uktFee || 4500000,
    avgCbtScore: avgCbt,
    avgRaporScore: avgRapor,
  };
});

const activeProdiApplicants = computed(() => {
  return adminStore.applicants.filter((a) => a.prodi1 === selectedProdi.value);
});
</script>
