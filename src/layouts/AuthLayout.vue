<template>
  <div class="min-h-screen bg-slate-100 flex flex-col selection:bg-[#1E3A8A] selection:text-white font-sans antialiased">
    <div class="min-h-screen flex flex-col lg:flex-row w-full flex-1">
      
      <!-- SISI KIRI: Visual Kampus & Identitas Utama (Desktop Only) -->
      <aside class="relative hidden lg:flex lg:w-1/2 xl:w-7/12 bg-slate-900 overflow-hidden flex-col justify-between p-10 xl:p-14 sticky top-0 h-screen">
        <!-- Foto Asli Gedung Kampus Universitas BTH -->
        <img
          src="/assets/images/bth-campus-bg.jpg"
          alt="Gedung Kampus Universitas Bakti Tunas Husada"
          class="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
        />

        <!-- Soft Natural Vignette -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/40 pointer-events-none"></div>

        <!-- Identitas Resmi Kampus (Tampil 1 kali dengan jelas dan wibawa) -->
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
            <img
              src="/assets/icons/bth.png"
              alt="Logo Universitas BTH"
              class="w-full h-full object-contain"
            />
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-white font-sora block leading-tight">
              Universitas Bakti Tunas Husada
            </span>
            <span class="text-[11px] text-blue-200/90 block leading-tight">
              Portal Penerimaan Mahasiswa Baru
            </span>
          </div>
        </div>

        <!-- Teks Pengantar Kampus (Ringkas & Berwibawa) -->
        <div class="relative z-10 text-white space-y-2 max-w-md">
          <div class="inline-block px-2.5 py-0.5 rounded-md bg-white/10 border border-white/20 text-[11px] font-medium text-blue-100 backdrop-blur-xs">
            Tahun Akademik 2026/2027
          </div>
          <h2 class="text-2xl xl:text-3xl font-bold font-sora leading-tight text-white">
            Selamat Datang Calon Mahasiswa Baru
          </h2>
          <p class="text-xs xl:text-sm text-slate-200/85 leading-relaxed font-sans">
            Sistem informasi pendaftaran, seleksi berkas, dan registrasi mahasiswa baru secara terpadu.
          </p>
          <div class="pt-2 text-[11px] text-slate-300/75 flex items-center gap-2 border-t border-white/10">
            <span>📍 Tasikmalaya, Jawa Barat</span>
            <span>•</span>
            <span>Terakreditasi BAN-PT & LAM-PTKes</span>
          </div>
        </div>
      </aside>

      <!-- SISI KANAN: Formulir Aksi (Clean, Focused, & Minimalist) -->
      <main class="flex-1 flex flex-col justify-between items-center p-4 sm:p-8 lg:p-10 xl:p-12 bg-slate-50 min-h-screen lg:min-h-screen overflow-y-auto">
        
        <!-- Header Ringkas Mobile (Hanya tampil di layar HP/Tablet, 1 identitas rapi) -->
        <div class="w-full max-w-[440px] lg:hidden flex items-center justify-between pt-2 mb-4">
          <RouterLink to="/login" class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-white p-1 shadow-xs border border-slate-200 flex items-center justify-center">
              <img src="/assets/icons/bth.png" alt="Logo Universitas BTH" class="w-full h-full object-contain" />
            </div>
            <div>
              <div class="text-xs font-bold font-sora text-slate-900 uppercase tracking-wide">Universitas BTH</div>
              <div class="text-[10px] text-slate-500">Portal PMB 2026/2027</div>
            </div>
          </RouterLink>

          <a
            href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Panitia%20PMB%20Universitas%20BTH%2C%20saya%20butuh%20bantuan%20pendaftaran."
            target="_blank"
            rel="noopener noreferrer"
            class="text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Bantuan
          </a>
        </div>

        <div class="hidden lg:block"></div>

        <!-- Card Form (Action Box - Bersih tanpa duplikasi logo & teks) -->
        <div :class="['w-full bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-slate-200/80 p-6 sm:p-8 my-auto transition-all', cardMaxWidth]">
          <!-- Header Card: Langsung ke Judul Form -->
          <div class="text-left sm:text-center mb-5 sm:mb-6">
            <h1 class="font-sora text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {{ headline }}
            </h1>

            <slot name="subheadline">
              <p v-if="subheadline" class="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-sans">
                {{ subheadline }}
              </p>
            </slot>
          </div>

          <!-- Form Content Slot -->
          <slot />
        </div>

        <!-- Footer Bantuan (Rapi & Minimalis) -->
        <footer class="w-full max-w-[440px] mt-6 text-center space-y-1 text-xs text-slate-500 pb-2 font-sans">
          <div>
            Butuh bantuan?
            <a
              href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Panitia%20PMB%20Universitas%20BTH%2C%20saya%20butuh%20bantuan%20pendaftaran."
              target="_blank"
              rel="noopener noreferrer"
              class="text-[#1E3A8A] hover:underline font-semibold ml-1"
            >
              WhatsApp PMB
            </a>
          </div>
          <div class="text-[11px] text-slate-400">
            &copy; 2026 Universitas Bakti Tunas Husada
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
    default: 'max-w-[430px]',
  },
});
</script>
