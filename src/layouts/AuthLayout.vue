<template>
  <div class="min-h-screen bg-slate-100 flex flex-col selection:bg-[#1E3A8A] selection:text-white font-sans antialiased">
    <div class="min-h-screen flex flex-col lg:flex-row w-full flex-1">
      
      <!-- SISI KIRI: Visual Resmi Gedung Kampus Universitas BTH (Desktop) -->
      <aside class="relative hidden lg:flex lg:w-1/2 xl:w-7/12 bg-slate-900 overflow-hidden flex-col justify-between p-8 xl:p-12 sticky top-0 h-screen">
        <!-- Foto Asli Gedung Kampus Universitas BTH (Tampil Jernih & Alami) -->
        <img
          src="/assets/images/bth-campus-bg.jpg"
          alt="Gedung Kampus Universitas Bakti Tunas Husada"
          class="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
        />

        <!-- Vignette Alami Bertingkat (Foto tetap tampak jelas, kontras teks terjaga) -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/40 pointer-events-none"></div>

        <!-- Identitas Resmi Kampus di Pojok Kiri Atas -->
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
            <img
              src="/assets/icons/bth.png"
              alt="Logo Universitas BTH"
              class="w-full h-full object-contain"
            />
          </div>
          <div>
            <span class="text-[11px] font-bold uppercase tracking-widest text-blue-200 block font-sora leading-tight">
              Universitas BTH
            </span>
            <span class="text-xs font-semibold text-white block leading-tight">
              Bakti Tunas Husada
            </span>
          </div>
        </div>

        <!-- Keterangan Institusional di Bawah Foto (Formal, Informatif, & Berwibawa) -->
        <div class="relative z-10 text-white space-y-2.5 max-w-lg">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-900/70 border border-blue-400/30 text-xs font-medium text-blue-200 backdrop-blur-xs">
            <span>Penerimaan Mahasiswa Baru TA 2026/2027</span>
          </div>
          <h2 class="text-2xl xl:text-3xl font-bold font-sora leading-snug text-white">
            Selamat Datang di Portal PMB Online Universitas BTH
          </h2>
          <p class="text-xs xl:text-sm text-slate-200/90 leading-relaxed font-sans">
            Gedung Rektorat & Perkuliahan Terpadu Universitas Bakti Tunas Husada. Pusat pendidikan unggulan kesehatan, farmasi, dan teknologi di Priangan Timur.
          </p>
          <div class="pt-2 text-[11px] text-slate-300/80 flex flex-wrap items-center gap-3 border-t border-white/15">
            <span>📍 Jl. Cilolohan No. 36, Tasikmalaya</span>
            <span>•</span>
            <span>Terakreditasi BAN-PT & LAM-PTKes</span>
          </div>
        </div>
      </aside>

      <!-- SISI KANAN: Area Formulir Otentikasi (Clean, Focused, & Readable) -->
      <main class="flex-1 flex flex-col justify-between items-center p-4 sm:p-8 lg:p-10 xl:p-12 bg-slate-50 min-h-screen lg:min-h-screen overflow-y-auto">
        
        <!-- Header Banner Khusus Tampilan Layar HP/Tablet -->
        <div class="w-full max-w-[440px] lg:hidden mb-4 pt-1">
          <div class="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden shadow-xs mb-3">
            <img
              src="/assets/images/bth-campus-bg.jpg"
              alt="Kampus Universitas BTH"
              class="w-full h-full object-cover object-center"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent"></div>
            <div class="absolute bottom-2.5 left-3 right-3 text-white flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-white p-1 flex-shrink-0 shadow-xs">
                <img src="/assets/icons/bth.png" alt="BTH" class="w-full h-full object-contain" />
              </div>
              <div class="leading-tight">
                <div class="text-[10px] font-bold uppercase tracking-wider text-blue-300 font-sora">Universitas BTH</div>
                <div class="text-xs font-semibold text-white">Portal PMB TA 2026/2027</div>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden lg:block"></div>

        <!-- Card Form Otentikasi (Desain Paper Card Institusional Bersih) -->
        <div :class="['w-full bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-slate-200/80 p-6 sm:p-8 my-auto transition-all', cardMaxWidth]">
          <!-- Logo & Header Card -->
          <div class="flex flex-col items-center text-center mb-5">
            <RouterLink to="/login" class="inline-block hover:opacity-90 transition-opacity mb-2">
              <img
                src="/assets/icons/bth.png"
                alt="Logo Universitas BTH"
                class="w-12 h-12 object-contain mx-auto"
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

        <!-- Footer Bantuan & Hak Cipta -->
        <div class="w-full max-w-[440px] mt-6 text-center space-y-1.5 text-xs text-slate-500 pb-2">
          <a
            href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Panitia%20PMB%20Universitas%20BTH%2C%20saya%20butuh%20bantuan%20pendaftaran."
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#1E3A8A] font-medium transition-colors hover:underline"
          >
            <span>Butuh bantuan pendaftaran?</span>
            <strong class="text-[#1E3A8A]">WhatsApp PMB BTH</strong>
          </a>
          <div class="text-[11px] text-slate-400">
            &copy; 2026 Penerimaan Mahasiswa Baru • Universitas Bakti Tunas Husada
          </div>
        </div>
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
    default: 'Portal Penerimaan Mahasiswa Baru (PMB)',
  },
  cardMaxWidth: {
    type: String,
    default: 'max-w-[430px]',
  },
});
</script>
