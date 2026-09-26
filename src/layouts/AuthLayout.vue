<template>
  <div class="min-h-screen bg-slate-100 flex flex-col selection:bg-[#1E3A8A] selection:text-white font-sans antialiased">
    <div class="min-h-screen flex flex-col lg:flex-row w-full flex-1">
      
      <!-- SISI KIRI: Visual Kampus & Identitas Utama (Desktop Only) -->
      <aside class="relative hidden lg:flex lg:w-1/2 xl:w-7/12 bg-slate-900 overflow-hidden flex-col justify-between p-8 xl:p-12 sticky top-0 h-screen">
        <!-- Foto Asli Gedung Kampus Universitas BTH (Fokus seimbang) -->
        <img
          src="/assets/images/bth-campus-bg.jpg"
          alt="Gedung Kampus Universitas Bakti Tunas Husada"
          class="absolute inset-0 w-full h-full object-cover object-[25%_center] xl:object-[30%_center] filter brightness-[0.92]"
        />

        <!-- Natural Dual Vignette (Kontras sempurna untuk atas dan bawah, tengah tetap terang) -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-transparent to-slate-950/85 pointer-events-none"></div>

        <!-- Identitas Resmi Kampus (Kapsul Glassmorphism Rapi) -->
        <div class="relative z-10">
          <div class="inline-flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/15 shadow-xl">
            <div class="w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-xs flex-shrink-0">
              <img
                src="/assets/icons/bth.png"
                alt="Logo Universitas BTH"
                class="w-full h-full object-contain"
              />
            </div>
            <div class="pr-1 text-left">
              <div class="text-xs font-bold uppercase tracking-wider text-white font-sora leading-tight">
                Universitas Bakti Tunas Husada
              </div>
              <div class="text-[11px] text-blue-300 font-medium leading-tight mt-0.5 font-sans">
                Portal Penerimaan Mahasiswa Baru
              </div>
            </div>
          </div>
        </div>

        <!-- Kartu Informasi Institusional Bawah (Terstruktur, Rapi, & Berwibawa) -->
        <div class="relative z-10 max-w-xl">
          <div class="rounded-3xl bg-slate-950/75 backdrop-blur-md border border-white/15 p-6 xl:p-7 shadow-2xl text-white space-y-4">
            <!-- Academic Session Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium font-sora">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Tahun Akademik 2026/2027</span>
            </div>

            <!-- Balanced Heading & Subheading -->
            <div class="space-y-2">
              <h2 class="text-2xl xl:text-3xl font-extrabold font-sora leading-snug text-white tracking-tight">
                Mulai Perjalanan Akademik Anda di Universitas BTH
              </h2>
              <p class="text-xs xl:text-sm text-slate-300/90 leading-relaxed font-sans">
                Layanan terpadu pendaftaran mandiri, verifikasi berkas, dan seleksi mahasiswa baru secara transparan.
              </p>
            </div>

            <!-- Credential Badges -->
            <div class="pt-3 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300/90 font-sans">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="truncate">Akreditasi BAN-PT & LAM-PTKes</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-sky-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <span class="truncate">Tasikmalaya, Jawa Barat</span>
              </div>
            </div>
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
