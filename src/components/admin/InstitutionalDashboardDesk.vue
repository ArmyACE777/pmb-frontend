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
      <div class="flex items-center gap-2.5 self-start sm:self-auto w-full sm:w-auto overflow-x-auto no-scrollbar">
        <span class="text-xs text-slate-500 font-medium hidden sm:inline font-sans whitespace-nowrap">Cakupan Data:</span>
        <div class="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium font-sans shrink-0">
          <button
            @click="currentLevel = 'university'"
            class="px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap"
            :class="currentLevel === 'university' ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Tingkat Universitas
          </button>

          <button
            @click="currentLevel = 'faculty'"
            class="px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap"
            :class="currentLevel === 'faculty' ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Tingkat Fakultas
          </button>

          <button
            @click="currentLevel = 'prodi'"
            class="px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap"
            :class="currentLevel === 'prodi' ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Tingkat Program Studi
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- LEVEL 1: UNIVERSITAS (REKTORAT & DEWAN EKSEKUTIF)                 -->
    <!-- ================================================================= -->
    <div v-if="currentLevel === 'university'" class="space-y-6">
      <!-- 4 Macro KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Target vs Realisasi Kuota PMB -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="text-xs font-medium text-slate-500 font-sans">Kapasitas Kursi Total</div>
            <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2">
              {{ totalEnrolledUniversitas }} <span class="text-sm font-normal text-slate-500 font-sans">/ 500 Target</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-1 font-sans">
              Keterisian kuota: {{ Math.round((totalEnrolledUniversitas / 500) * 100) }}%
            </div>
          </div>
          <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              class="bg-[#1E3A8A] h-full rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(100, Math.round((totalEnrolledUniversitas / 500) * 100))}%` }"
            ></div>
          </div>
        </div>

        <!-- Rasio Kelulusan CBT -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="text-xs font-medium text-slate-500 font-sans">Tingkat Kelulusan CBT</div>
            <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2">
              {{ passRate }}%
            </div>
            <div class="text-[11px] text-slate-500 mt-1 font-sans">
              {{ adminStore.passedStudentsCount }} dari {{ adminStore.totalApplicants }} pelamar lulus
            </div>
          </div>
          <div class="text-[11px] text-slate-400 mt-3 font-sans">
            Ambang batas kelulusan: 70.0
          </div>
        </div>

        <!-- Yield Rate Pelunasan UKT -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="text-xs font-medium text-slate-500 font-sans">Yield Rate UKT (Daftar Ulang)</div>
            <div class="font-sora font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2">
              {{ yieldRate }}%
            </div>
            <div class="text-[11px] text-slate-500 mt-1 font-sans">
              Konversi calon mahasiswa ke aktif
            </div>
          </div>
          <div class="text-[11px] text-slate-400 mt-3 font-sans">
            {{ totalPaidUktCount }} Mahasiswa Baru Terdaftar
          </div>
        </div>

        <!-- Akumulasi Kas Masuk PMB -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="text-xs font-medium text-slate-500 font-sans">Total Pendapatan Kas PMB</div>
            <div class="font-sora font-extrabold text-xl sm:text-2xl text-slate-900 mt-2">
              {{ formattedTotalRevenue }}
            </div>
            <div class="text-[11px] text-slate-500 mt-1 font-sans">
              Formulir Pendaftaran & Registrasi UKT
            </div>
          </div>
          <div class="text-[11px] text-slate-400 mt-3 font-sans">
            Host-to-Host BSI & Mandiri
          </div>
        </div>
      </div>

      <!-- Charts Visualisasi Institusional -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Kinerja Antar Fakultas -->
        <div class="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Komparasi Pendaftar & Kuota Fakultas
              </h3>
              <p class="text-xs text-slate-500 font-sans mt-0.5">Perbandingan kuota vs pendaftar vs kelulusan per fakultas.</p>
            </div>
            <span class="text-xs text-slate-400 font-sans">
              TA 2026/2027
            </span>
          </div>
          <div class="h-64 my-3">
            <BarChart :chart-data="facultyBarChartData" />
          </div>
          <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 font-sans">
            Daya Tampung: Farmasi 240, FTB 140, FIKes 120
          </div>
        </div>

        <!-- Chart 2: Sebaran Rata-rata Skor Seleksi per Prodi -->
        <div class="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
                Rata-rata Skor CBT & Rapor per Program Studi
              </h3>
              <p class="text-xs text-slate-500 font-sans mt-0.5">Evaluasi mutu akademik calon mahasiswa per peminatan.</p>
            </div>
            <span class="text-xs text-slate-400 font-sans">
              Standar: 70.0
            </span>
          </div>
          <div class="h-64 my-3">
            <BarChart :chart-data="scoresBarChartData" />
          </div>
          <div class="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 font-sans">
            Nilai ambang batas minimal standar BTH: 70.0
          </div>
        </div>
      </div>

      <!-- Komparasi Performa 3 Fakultas Universitas BTH -->
      <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Kinerja Penerimaan Antar Fakultas
            </h3>
            <p class="text-xs text-slate-500 font-sans mt-0.5">Perbandingan kuota, pendaftar, dan kelulusan pada masing-masing fakultas naungan BTH.</p>
          </div>
          <span class="text-xs text-slate-500 font-sans">
            3 Fakultas Aktif
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="fac in facultySummaries"
            :key="fac.name"
            class="p-5 rounded-xl border transition-colors space-y-3 bg-slate-50 border-slate-200 hover:border-slate-300"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sora block">FAKULTAS</span>
                <h4 class="font-sora font-bold text-slate-900 text-sm mt-0.5">{{ fac.name }}</h4>
              </div>
              <span class="text-xs text-slate-500 font-sans">
                {{ fac.prodis.length }} Prodi
              </span>
            </div>

            <div class="space-y-2 text-xs font-sans">
              <div class="flex justify-between text-slate-600">
                <span>Daya Tampung Kursi:</span>
                <strong class="text-slate-900 font-semibold">{{ fac.quota }} Kursi</strong>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Pendaftar Masuk:</span>
                <strong class="text-slate-900 font-semibold">{{ fac.totalApplicants }} Orang</strong>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Lulus Seleksi:</span>
                <strong class="text-slate-900 font-semibold">{{ fac.passedCount }} Mahasiswa</strong>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Keterisian Kuota:</span>
                <strong class="text-slate-900 font-semibold">{{ fac.fillPercent }}%</strong>
              </div>
            </div>

            <div class="w-full bg-slate-200/80 h-1.5 rounded-sm overflow-hidden">
              <div
                v-if="fac.totalApplicants > 0"
                class="bg-[#1E3A8A] h-full rounded-sm transition-all duration-500"
                :style="{ width: `${Math.max(2, Math.min(100, fac.fillPercent))}%` }"
              ></div>
            </div>

            <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-sans">
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
    <div v-else-if="currentLevel === 'faculty'" class="space-y-6">
      <!-- Selector Dropdown Fakultas -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
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
            class="px-3.5 py-2 bg-slate-50 border border-slate-300 focus:border-[#1E3A8A] rounded-lg text-xs font-semibold text-slate-800 outline-none"
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
        <div class="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm">Profil Dekanat</h3>
            <span class="text-xs text-slate-500 font-sans">
              Akreditasi: <strong class="text-slate-700 font-medium">Unggul</strong>
            </span>
          </div>

          <div class="space-y-2.5 text-xs font-sans">
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span class="text-slate-500 text-[11px] block">Dekan Fakultas</span>
              <strong class="text-slate-900 font-sora text-xs mt-0.5 block">{{ facultyDeanName }}</strong>
            </div>

            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <span class="text-slate-600">Kapasitas Kursi</span>
              <strong class="text-slate-900 font-semibold">{{ activeFacultyDetails.quota }} Kursi</strong>
            </div>

            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <span class="text-slate-600">Peminat Prioritas 1</span>
              <strong class="text-slate-900 font-semibold">{{ activeFacultyDetails.pilihan1Count }} Pendaftar</strong>
            </div>

            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <span class="text-slate-600">Peminat Prioritas 2</span>
              <strong class="text-slate-900 font-semibold">{{ activeFacultyDetails.pilihan2Count }} Pendaftar</strong>
            </div>
          </div>
        </div>

        <!-- Card 2: Keterisian Prodi di Bawah Fakultas -->
        <div class="lg:col-span-2 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Keterisian Kuota Program Studi
            </h3>
            <span class="text-xs text-slate-500 font-sans">{{ activeFacultyDetails.prodis.length }} Program Studi</span>
          </div>

          <div class="space-y-4 text-xs font-sans">
            <div
              v-for="prodi in activeFacultyProdis"
              :key="prodi.name"
              class="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-sora font-bold text-slate-900 text-sm">{{ prodi.name }}</h4>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="text-[11px] text-slate-500 font-medium">{{ prodi.degree }}</span>
                    <span class="text-slate-300">•</span>
                    <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap bg-blue-50 text-[#1E3A8A] border border-blue-200/60 shadow-2xs">
                      Akreditasi {{ prodi.accreditation }}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-slate-900">{{ prodi.applicantsCount }}</span>
                  <span class="text-slate-500 text-xs"> / {{ prodi.quota }} Kursi</span>
                </div>
              </div>

              <div class="w-full bg-slate-200/80 h-1.5 rounded-sm overflow-hidden">
                <div
                  v-if="prodi.applicantsCount > 0"
                  class="bg-[#1E3A8A] h-full rounded-sm transition-all duration-500"
                  :style="{ width: `${Math.max(2, Math.min(100, Math.round((prodi.applicantsCount / prodi.quota) * 100)))}%` }"
                ></div>
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>Rata-rata Skor CBT: <strong class="text-slate-700 font-medium">{{ prodi.avgCbtScore }}</strong></span>
                <span>Lulus Seleksi: <strong class="text-slate-800 font-medium">{{ prodi.passedCount }} Mahasiswa</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- LEVEL 3: PROGRAM STUDI (KAPRODI)                                  -->
    <!-- ================================================================= -->
    <div v-else-if="currentLevel === 'prodi'" class="space-y-6">
      <!-- Selector Dropdown Program Studi -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
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
            class="px-3.5 py-2 bg-slate-50 border border-slate-300 focus:border-[#1E3A8A] rounded-lg text-xs font-semibold text-slate-800 outline-none"
          >
            <option v-for="p in prodiNames" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
      </div>

      <!-- Key Metrics Kaprodi -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">Kapasitas Kursi Prodi</div>
          <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
            {{ activeProdiInfo.enrolled }} <span class="text-sm font-normal text-slate-500">/ {{ activeProdiInfo.quota }} Kursi</span>
          </div>
          <div class="text-xs text-slate-500 font-medium mt-1">
            Tersisa {{ activeProdiInfo.quota - activeProdiInfo.enrolled }} Kursi Tersedia
          </div>
        </div>

        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">Rata-rata Skor CBT Pelamar</div>
          <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
            {{ activeProdiInfo.avgCbtScore }} <span class="text-xs font-normal text-slate-500">/ 100</span>
          </div>
          <div class="text-xs text-slate-500 mt-1">
            Rata-rata Nilai Rapor: {{ activeProdiInfo.avgRaporScore }}
          </div>
        </div>

        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sora">Tarif UKT Resmi</div>
          <div class="font-sora font-extrabold text-2xl text-slate-900 mt-1">
            Rp {{ (activeProdiInfo.uktFee || 4500000).toLocaleString('id-ID') }}
          </div>
          <div class="text-xs text-slate-500 mt-1">
            Per Semester &bull; Jenjang {{ activeProdiInfo.degree }}
          </div>
        </div>
      </div>

      <!-- Analitik Demografi Peminat & Daftar Kandidat -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Demografi Asal Sekolah & Wilayah -->
        <div class="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 class="font-sora font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Sebaran Demografi Pelamar
          </h3>

          <!-- Tipe Sekolah -->
          <div class="space-y-2 text-xs">
            <span class="text-slate-500 font-medium block">Distribusi Jenis Sekolah Asal:</span>
            <div class="space-y-1.5">
              <div class="flex justify-between text-[11px]">
                <span class="text-slate-700">SMA (Sekolah Menengah Atas)</span>
                <span class="font-bold font-mono">{{ schoolDemographics.smaPercent }}% ({{ schoolDemographics.smaCount }})</span>
              </div>
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-[#1E3A8A] h-full rounded-full transition-all duration-300" :style="{ width: `${schoolDemographics.smaPercent}%` }"></div>
              </div>

              <div class="flex justify-between text-[11px] pt-1">
                <span class="text-slate-700">SMK (Kesehatan / TI / Kejuruan)</span>
                <span class="font-bold font-mono">{{ schoolDemographics.smkPercent }}% ({{ schoolDemographics.smkCount }})</span>
              </div>
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" :style="{ width: `${schoolDemographics.smkPercent}%` }"></div>
              </div>

              <div class="flex justify-between text-[11px] pt-1">
                <span class="text-slate-700">MA (Madrasah Aliyah)</span>
                <span class="font-bold font-mono">{{ schoolDemographics.maPercent }}% ({{ schoolDemographics.maCount }})</span>
              </div>
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full transition-all duration-300" :style="{ width: `${schoolDemographics.maPercent}%` }"></div>
              </div>
            </div>
          </div>

          <!-- Sebaran Geografis -->
          <div class="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <span class="text-slate-500 font-medium block">Sebaran Geografis Domisili:</span>
            <div class="space-y-1 text-slate-700 text-[11px]">
              <div
                v-for="(geo, gIdx) in geoDemographics"
                :key="geo.label"
                class="flex justify-between py-1"
                :class="gIdx < geoDemographics.length - 1 ? 'border-b border-slate-50' : ''"
              >
                <span>{{ geo.label }}</span>
                <strong class="font-mono">{{ geo.percent }}%</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Daftar Pendaftar Terkini Program Studi -->
        <div class="lg:col-span-2 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 class="font-sora font-bold text-slate-900 text-sm">
              Daftar Calon Mahasiswa Terdaftar di {{ selectedProdi }}
            </h3>
            <span class="text-xs text-slate-400">{{ activeProdiApplicants.length }} Pelamar Aktif</span>
          </div>

          <!-- Mobile Cards (< md) -->
          <div class="block md:hidden divide-y divide-slate-100">
            <div
              v-for="app in activeProdiApplicants"
              :key="app.id"
              class="p-3.5 space-y-2 bg-white hover:bg-slate-50/50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {{ app.id }}
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="app.selection.passedStatus === 'passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                >
                  {{ app.selection.passedStatus === 'passed' ? 'Lulus Seleksi' : 'Evaluasi' }}
                </span>
              </div>
              <div>
                <h4 class="font-sora font-bold text-slate-900 text-xs">{{ app.fullName }}</h4>
                <p class="text-[11px] text-slate-500 mt-0.5">{{ app.schoolName }}</p>
              </div>
              <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span class="text-slate-500 text-[11px]">Skor CBT</span>
                <span class="font-mono font-bold text-slate-800 text-xs">{{ app.selection.cbtScore }}</span>
              </div>
            </div>

            <div v-if="!activeProdiApplicants.length" class="p-6 text-center text-slate-400 text-xs italic">
              Belum ada calon mahasiswa terdaftar pada program studi ini.
            </div>
          </div>

          <!-- Desktop Table (>= md) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full min-w-[680px] text-left text-xs text-slate-700">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-sora uppercase text-[10px] whitespace-nowrap">
                <tr>
                  <th class="py-2.5 px-3 font-bold whitespace-nowrap min-w-[130px]">No. Registrasi</th>
                  <th class="py-2.5 px-3 font-bold whitespace-nowrap min-w-[180px]">Nama Mahasiswa</th>
                  <th class="py-2.5 px-3 font-bold min-w-[160px]">Asal Sekolah</th>
                  <th class="py-2.5 px-3 font-bold text-center whitespace-nowrap min-w-[90px]">Skor CBT</th>
                  <th class="py-2.5 px-3 font-bold whitespace-nowrap min-w-[120px]">Status Seleksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans">
                <tr v-for="app in activeProdiApplicants" :key="app.id" class="hover:bg-slate-50">
                  <td class="py-2.5 px-3 font-mono font-semibold text-slate-900 whitespace-nowrap">{{ app.id }}</td>
                  <td class="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">{{ app.fullName }}</td>
                  <td class="py-2.5 px-3 text-slate-500 min-w-[160px]">{{ app.schoolName }}</td>
                  <td class="py-2.5 px-3 text-center font-medium text-slate-900 whitespace-nowrap">
                    {{ app.selection.cbtScore }}
                  </td>
                  <td class="py-2.5 px-3 whitespace-nowrap">
                    <span class="text-xs font-medium text-slate-800 whitespace-nowrap">
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
import { ref, computed, watch } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { PRODI_METADATA } from '@/stores/applicant';
import BarChart from '@/components/charts/BarChart.vue';

const props = defineProps({
  currentRole: {
    type: String,
    default: () => localStorage.getItem('bth_admin_rbac_role') || 'superadmin',
  },
});

const adminStore = useAdminStore();
const currentLevel = ref(props.currentRole === 'prodi' ? 'prodi' : 'university');
const selectedFaculty = ref('Fakultas Farmasi');
const selectedProdi = ref('S1 Farmasi');

watch(() => props.currentRole, (newRole) => {
  if (newRole === 'prodi') {
    currentLevel.value = 'prodi';
  } else if (newRole === 'pimpinan') {
    currentLevel.value = 'university';
  }
});

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
  const fac1Prodis = ['S1 Farmasi', 'D3 Farmasi'];
  const fac2Prodis = ['S1 Teknologi Informasi', 'S1 Manajemen Bisnis Informasi'];
  const fac3Prodis = ['S1 Administrasi RS', 'D3 Analis Kesehatan (TLM)'];

  const fac1Applicants = adminStore.applicants.filter((a) => fac1Prodis.includes(a.prodi1) || (a.faculty && a.faculty.includes('Farmasi')));
  const fac2Applicants = adminStore.applicants.filter((a) => fac2Prodis.includes(a.prodi1) || (a.faculty && (a.faculty.includes('Teknologi') || a.faculty.includes('Bisnis'))));
  const fac3Applicants = adminStore.applicants.filter((a) => fac3Prodis.includes(a.prodi1) || (a.faculty && (a.faculty.includes('Kesehatan') || a.faculty.includes('Analis') || a.faculty.includes('Administrasi'))));

  const fac1P1 = adminStore.applicants.filter((a) => fac1Prodis.includes(a.prodi1)).length;
  const fac1P2 = adminStore.applicants.filter((a) => fac1Prodis.includes(a.prodi2)).length;
  const fac2P1 = adminStore.applicants.filter((a) => fac2Prodis.includes(a.prodi1)).length;
  const fac2P2 = adminStore.applicants.filter((a) => fac2Prodis.includes(a.prodi2)).length;
  const fac3P1 = adminStore.applicants.filter((a) => fac3Prodis.includes(a.prodi1)).length;
  const fac3P2 = adminStore.applicants.filter((a) => fac3Prodis.includes(a.prodi2)).length;

  const fac1Passed = fac1Applicants.filter((a) => a.selection?.passedStatus === 'passed').length;
  const fac2Passed = fac2Applicants.filter((a) => a.selection?.passedStatus === 'passed').length;
  const fac3Passed = fac3Applicants.filter((a) => a.selection?.passedStatus === 'passed').length;

  return [
    {
      name: 'Fakultas Farmasi',
      quota: 240,
      prodis: fac1Prodis,
      totalApplicants: fac1Applicants.length,
      pilihan1Count: fac1P1,
      pilihan2Count: fac1P2,
      passedCount: fac1Passed,
      fillPercent: fac1Applicants.length ? Math.round((fac1Applicants.length / 240) * 100) : 0,
      color: 'bg-[#1E3A8A]',
    },
    {
      name: 'Fakultas Teknologi & Bisnis',
      quota: 140,
      prodis: fac2Prodis,
      totalApplicants: fac2Applicants.length,
      pilihan1Count: fac2P1,
      pilihan2Count: fac2P2,
      passedCount: fac2Passed,
      fillPercent: fac2Applicants.length ? Math.round((fac2Applicants.length / 140) * 100) : 0,
      color: 'bg-[#1E3A8A]',
    },
    {
      name: 'Fakultas Ilmu Kesehatan',
      quota: 120,
      prodis: fac3Prodis,
      totalApplicants: fac3Applicants.length,
      pilihan1Count: fac3P1,
      pilihan2Count: fac3P2,
      passedCount: fac3Passed,
      fillPercent: fac3Applicants.length ? Math.round((fac3Applicants.length / 120) * 100) : 0,
      color: 'bg-[#1E3A8A]',
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

// Demografi Asal Sekolah & Wilayah Dinamis
const poolForDemographics = computed(() => {
  if (activeProdiApplicants.value.length > 0) return activeProdiApplicants.value;
  return adminStore.applicants;
});

const schoolDemographics = computed(() => {
  const list = poolForDemographics.value;
  const total = list.length || 1;
  let sma = 0;
  let smk = 0;
  let ma = 0;

  list.forEach((a) => {
    const s = (a.schoolName || '').toUpperCase();
    if (s.includes('SMA')) {
      sma++;
    } else if (s.includes('SMK')) {
      smk++;
    } else if (s.startsWith('MA ') || s.includes(' MA ') || s.includes('MADRASAH') || s.includes('MAN ')) {
      ma++;
    } else {
      sma++;
    }
  });

  const smaPct = Math.round((sma / total) * 100);
  const smkPct = Math.round((smk / total) * 100);
  const maPct = Math.max(0, 100 - smaPct - smkPct);

  return {
    smaCount: sma,
    smaPercent: smaPct,
    smkCount: smk,
    smkPercent: smkPct,
    maCount: ma,
    maPercent: maPct,
  };
});

const geoDemographics = computed(() => {
  const list = poolForDemographics.value;
  const total = list.length || 1;
  let tasik = 0;
  let ciamisBanjar = 0;
  let garutPangandaran = 0;
  let luar = 0;

  list.forEach((a) => {
    const c = (a.city || a.schoolName || '').toLowerCase();
    if (c.includes('tasikmalaya') || c.includes('singaparna')) {
      tasik++;
    } else if (c.includes('ciamis') || c.includes('banjar')) {
      ciamisBanjar++;
    } else if (c.includes('garut') || c.includes('pangandaran')) {
      garutPangandaran++;
    } else {
      luar++;
    }
  });

  const tasikPct = Math.round((tasik / total) * 100);
  const ciamisPct = Math.round((ciamisBanjar / total) * 100);
  const garutPct = Math.round((garutPangandaran / total) * 100);
  const luarPct = Math.max(0, 100 - tasikPct - ciamisPct - garutPct);

  return [
    { label: 'Kota & Kab. Tasikmalaya', count: tasik, percent: tasikPct },
    { label: 'Kab. Ciamis & Kota Banjar', count: ciamisBanjar, percent: ciamisPct },
    { label: 'Kab. Garut & Pangandaran', count: garutPangandaran, percent: garutPct },
    { label: 'Luar Priangan Timur', count: luar, percent: luarPct },
  ];
});
</script>
