<template>
  <div class="min-h-screen bg-white flex flex-col selection:bg-[#1E3A8A] selection:text-white font-sans antialiased">
    <div class="min-h-screen flex flex-col lg:flex-row w-full flex-1">
      
      <!-- SISI KIRI: Visual Arsitektural Kampus & Identitas Utama (Desktop) -->
      <aside class="relative hidden lg:flex lg:w-1/2 xl:w-7/12 bg-slate-950 overflow-hidden flex-col justify-between p-10 xl:p-14 sticky top-0 h-screen">
        <!-- Foto Asli Gedung Kampus Universitas BTH (Fokus Seimbang) -->
        <img
          src="/assets/images/bth-campus-bg.jpg"
          alt="Gedung Kampus Universitas Bakti Tunas Husada"
          class="absolute inset-0 w-full h-full object-cover object-[22%_center] xl:object-[26%_center] filter brightness-[0.92]"
        />

        <!-- Natural Gradient Vignette (Menjaga kontras teks atas & bawah, bagian tengah tetap jernih) -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/70 pointer-events-none"></div>

        <!-- Identitas Resmi Kampus (Elegan, Alami, Tanpa Kotak Tempelan) -->
        <div class="relative z-10 flex items-center gap-3.5">
          <img
            src="/assets/icons/bth.png"
            alt="Logo Universitas BTH"
            class="h-11 xl:h-12 w-auto object-contain drop-shadow-md"
          />
          <div>
            <h1 class="text-sm xl:text-base font-bold uppercase tracking-wider text-white font-sora leading-tight">
              Universitas Bakti Tunas Husada
            </h1>
            <p class="text-xs text-blue-200/90 font-medium leading-tight mt-0.5 font-sans">
              Portal Penerimaan Mahasiswa Baru
            </p>
          </div>
        </div>

        <!-- Tipografi Institusional Bawah (Otentik, Bersih, Tanpa Emoji & Bebas Kesan AI) -->
        <div class="relative z-10 text-white space-y-2.5 max-w-lg">
          <div class="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300 font-sora">
            PMB Tahun Akademik 2026/2027
          </div>
          <h2 class="text-2xl xl:text-3xl font-extrabold text-white font-sora tracking-tight leading-tight">
            Transforming New Generation
          </h2>
          <p class="text-xs xl:text-sm text-slate-300/85 font-sans leading-relaxed">
            Fakultas Farmasi &bull; Fakultas Ilmu Kesehatan &bull; Fakultas Teknologi & Bisnis
          </p>
          <div class="pt-3 text-[11px] text-slate-400 font-sans flex flex-wrap items-center gap-2.5 border-t border-white/10">
            <span>Akreditasi Institusi BAN-PT & LAM-PTKes</span>
            <span class="text-slate-600">&bull;</span>
            <span>Tasikmalaya, Jawa Barat</span>
          </div>
        </div>
      </aside>

      <!-- SISI KANAN: Kanvas Formulir (Clean, Airy, Enterprise-Grade) -->
      <main class="flex-1 flex flex-col justify-between items-center px-6 py-8 sm:px-12 sm:py-10 lg:px-14 xl:px-20 bg-white min-h-screen overflow-y-auto">
        
        <!-- Header Ringkas Khusus Mobile (Tampil di Layar HP/Tablet) -->
        <div class="w-full max-w-[420px] lg:hidden flex items-center justify-between pb-5 mb-2 border-b border-slate-100">
          <RouterLink to="/login" class="flex items-center gap-2.5">
            <img src="/assets/icons/bth.png" alt="Logo Universitas BTH" class="h-8 w-auto object-contain" />
            <div>
              <div class="text-xs font-bold font-sora text-slate-900 uppercase tracking-wide">Universitas BTH</div>
              <div class="text-[10px] text-slate-500 font-sans">Portal PMB 2026/2027</div>
            </div>
          </RouterLink>

          <a
            href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Panitia%20PMB%20Universitas%20BTH%2C%20saya%20butuh%20bantuan%20pendaftaran."
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-semibold text-[#1E3A8A] hover:underline font-sans"
          >
            Bantuan PMB
          </a>
        </div>

        <div class="hidden lg:block"></div>

        <!-- Kontainer Formulir Terpusat -->
        <div :class="['w-full my-auto py-4', cardMaxWidth]">
          <!-- Header Judul Formulir -->
          <div class="text-left mb-6 sm:mb-8">
            <h2 class="font-sora text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {{ headline }}
            </h2>

            <slot name="subheadline">
              <p v-if="subheadline" class="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-sans">
                {{ subheadline }}
              </p>
            </slot>
          </div>

          <!-- Form Content Slot -->
          <slot />
        </div>

        <!-- Footer Bersih & Minimalis -->
        <footer class="w-full max-w-[420px] pt-6 pb-2 text-center text-xs text-slate-400 font-sans border-t border-slate-100 mt-8">
          <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>&copy; 2026 Universitas BTH</span>
            <span>•</span>
            <a
              href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Panitia%20PMB%20Universitas%20BTH%2C%20saya%20butuh%20bantuan%20pendaftaran."
              target="_blank"
              rel="noopener noreferrer"
              class="text-slate-600 hover:text-[#1E3A8A] hover:underline font-medium"
            >
              WhatsApp PMB (0821-1710-0200)
            </a>
          </div>
        </footer>
      </main>
    </div>
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
    default: '',
  },
  cardMaxWidth: {
    type: String,
    default: 'max-w-[400px]',
  },
});
</script>
