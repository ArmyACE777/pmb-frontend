<template>
  <div class="min-h-screen text-slate-800 font-sans antialiased flex flex-col justify-between items-center px-4 py-4 sm:py-6 relative selection:bg-[#1E3A8A] selection:text-white overflow-x-hidden">
    <!-- 1. Background Campus Image Layer -->
    <div class="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      <img
        src="/assets/images/bth-campus-bg.jpg"
        alt="Gedung Kampus Universitas BTH"
        class="w-full h-full object-cover object-[center_20%] sm:object-center transform scale-105 filter brightness-[0.88] transition-transform duration-1000"
      />
    </div>

    <!-- 2. Academic Navy/Slate Gradient Overlay -->
    <div class="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-[#060e1d]/94 via-[#0b1c3b]/86 to-[#09152b]/94"></div>

    <!-- 3. Modern High-Tech Dot Matrix Pattern -->
    <div class="fixed inset-0 pointer-events-none -z-10 opacity-30 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:24px_24px]"></div>

    <!-- 4. Ambient Radial Glows (BTH Blue & Warm Amber Accents) -->
    <div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div class="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px]"></div>
      <div class="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px]"></div>
    </div>

    <!-- 5. Universitas BTH Emblem Watermark -->
    <div class="fixed -bottom-12 -right-12 pointer-events-none -z-10 opacity-[0.06] select-none hidden lg:block">
      <img
        src="/assets/icons/bth-emblem.png"
        alt="Watermark BTH"
        class="w-[500px] h-[500px] object-contain rotate-[-10deg]"
      />
    </div>

    <!-- Top Header Bar -->
    <header class="w-full max-w-6xl mx-auto flex items-center justify-between py-1.5 sm:py-2 mb-2 z-10">
      <RouterLink to="/login" class="inline-flex items-center gap-2.5 group">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md p-1.5 border border-white/20 shadow-xs flex items-center justify-center group-hover:bg-white/20 transition-all">
          <img
            src="/assets/icons/bth.png"
            alt="Logo Universitas BTH"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="text-left">
          <div class="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-sora leading-tight">
            Universitas BTH
          </div>
          <div class="text-[10px] sm:text-[11px] text-blue-200/80 leading-tight">
            Portal PMB Online
          </div>
        </div>
      </RouterLink>

      <a
        href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Panitia%20PMB%20Universitas%20BTH%2C%20saya%20butuh%20informasi%20pendaftaran."
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-xs text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md transition-all font-sans"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span class="hidden sm:inline">Sekretariat:</span>
        <span class="font-medium">WhatsApp PMB</span>
      </a>
    </header>

    <!-- Main Container: Split Hero on Desktop, Focused Card on Mobile -->
    <main class="w-full max-w-6xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-14 py-4 sm:py-6 my-auto z-10">
      <!-- Left Campus Hero Showcase (Desktop: lg screens) -->
      <section v-if="showHero" class="hidden lg:flex flex-col flex-1 max-w-xl text-left text-white space-y-6">
        <!-- Live Academic Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md w-fit shadow-xs">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span class="text-xs font-semibold text-blue-100 font-sora tracking-wide">Penerimaan Mahasiswa Baru TA 2026/2027</span>
        </div>

        <!-- Academic Headline -->
        <div class="space-y-3">
          <h2 class="text-3xl xl:text-4xl font-extrabold font-sora leading-tight tracking-tight text-white">
            Wujudkan Masa Depan Cemerlang di <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-300">Universitas BTH</span>
          </h2>
          <p class="text-sm text-blue-100/85 leading-relaxed font-sans pr-2">
            Pusat unggulan pendidikan kesehatan, farmasi, dan teknologi di Priangan Timur dengan akreditasi unggul, laboratorium modern, dan rumah sakit jejaring.
          </p>
        </div>

        <!-- 3 Feature Highlight Cards -->
        <div class="grid grid-cols-1 gap-3 pt-1">
          <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md hover:bg-white/[0.12] transition-all">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-300 shadow-2xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold font-sora text-white">Fakultas Kesehatan & Farmasi Unggulan</h3>
              <p class="text-xs text-blue-100/70 leading-relaxed mt-0.5">Program studi terakreditasi nasional dengan kurikulum aplikatif dan laboratorium canggih.</p>
            </div>
          </div>

          <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md hover:bg-white/[0.12] transition-all">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-300 shadow-2xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold font-sora text-white">Proses Pendaftaran 100% Online</h3>
              <p class="text-xs text-blue-100/70 leading-relaxed mt-0.5">Mulai dari pembuatan akun, verifikasi dokumen, pembayaran VA, hingga hasil seleksi.</p>
            </div>
          </div>

          <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md hover:bg-white/[0.12] transition-all">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0 text-emerald-300 shadow-2xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold font-sora text-white">Jalur Beasiswa & Prestasi Terbuka</h3>
              <p class="text-xs text-blue-100/70 leading-relaxed mt-0.5">Tersedia KIP-Kuliah, Beasiswa Yayasan BTH, Jalur PMDK Nilai Rapor, dan Prestasi Minat Bakat.</p>
            </div>
          </div>
        </div>

        <!-- Campus Credentials & Address -->
        <div class="flex flex-wrap items-center gap-5 pt-2 text-xs text-blue-200/80 font-sans border-t border-white/10">
          <span class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Akreditasi BAN-PT & LAM-PTKes
          </span>
          <span class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            Tasikmalaya, Jawa Barat
          </span>
        </div>
      </section>

      <!-- Right Column: High-Contrast Pure White Card -->
      <section :class="['w-full transition-all flex flex-col items-center justify-center', cardMaxWidth]">
        <div class="w-full bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/60 p-6 sm:p-8 transition-all">
          <!-- Logo & Identitas Kampus Card Header -->
          <div class="flex flex-col items-center text-center mb-5">
            <RouterLink to="/login" class="inline-block hover:opacity-90 transition-opacity mb-2">
              <img
                src="/assets/icons/bth.png"
                alt="Logo Universitas BTH"
                class="w-12 h-12 object-contain mx-auto drop-shadow-xs"
              />
            </RouterLink>

            <span class="text-[10px] font-bold tracking-widest text-[#2563EB] uppercase font-sora block mb-0.5">
              Universitas Bakti Tunas Husada
            </span>

            <h1 class="font-sora text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              {{ headline }}
            </h1>

            <slot name="subheadline">
              <p v-if="subheadline" class="text-xs text-slate-500 mt-1 leading-relaxed font-sans max-w-xs">
                {{ subheadline }}
              </p>
            </slot>
          </div>

          <!-- Form / Content Slot -->
          <slot />
        </div>
      </section>
    </main>

    <!-- Footer Bantuan -->
    <footer class="w-full max-w-6xl mx-auto mt-4 sm:mt-6 text-center space-y-2 text-xs text-blue-200/80 z-10 pb-2">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xs">
        <span class="text-slate-300">Butuh bantuan pendaftaran?</span>
        <a
          href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Panitia%20PMB%20Universitas%20BTH%2C%20saya%20butuh%20bantuan%20pendaftaran."
          target="_blank"
          rel="noopener noreferrer"
          class="text-amber-300 hover:text-amber-200 font-semibold transition-colors hover:underline inline-flex items-center gap-1 font-sora"
        >
          <span>WhatsApp PMB BTH</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
      <div class="text-[11px] text-blue-200/60 font-sans">
        &copy; 2026 Penerimaan Mahasiswa Baru • Universitas Bakti Tunas Husada
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  headline: {
    type: String,
    default: 'Selamat Datang',
  },
  subheadline: {
    type: String,
    default: 'Portal Penerimaan Mahasiswa Baru (PMB)',
  },
  cardMaxWidth: {
    type: String,
    default: 'max-w-[430px]',
  },
  showHero: {
    type: Boolean,
    default: true,
  },
});
</script>
