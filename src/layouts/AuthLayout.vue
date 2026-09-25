<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between items-center px-4 py-6 sm:py-10 relative selection:bg-[#1E3A8A] selection:text-white">
    <!-- Subtle Background Ambient Glow (Minimalist & Clean) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-blue-100/40 via-slate-100/20 to-transparent rounded-full blur-3xl"></div>
    </div>

    <div class="hidden sm:block"></div>

    <!-- Modern Minimalist Card (Perfect Proportions) -->
    <div class="w-full max-w-[420px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.05)] border border-slate-200/80 p-6 sm:p-8 transition-all my-auto">
      <!-- Logo & Identitas Kampus -->
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

      <!-- Form Slot -->
      <slot />
    </div>

    <!-- Footer Bantuan (Rapi & Tidak Terpotong) -->
    <div class="mt-5 text-center space-y-1 text-xs text-slate-500">
      <a
        href="https://api.whatsapp.com/send?phone=6282117100200&text=Halo%20Panitia%20PMB%20Universitas%20BTH%2C%20saya%20butuh%20bantuan%20pendaftaran."
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center text-slate-600 hover:text-[#1E3A8A] font-medium transition-colors hover:underline"
      >
        <span>Butuh bantuan pendaftaran? <strong>WhatsApp PMB</strong></span>
      </a>
      <div class="text-[11px] text-slate-400">
        &copy; 2026 Penerimaan Mahasiswa Baru • Universitas BTH
      </div>
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
});
</script>
