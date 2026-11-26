<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Top Bar Ringkas Studio CMS -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3.5">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0">
            <Layers class="w-4 h-4" />
          </div>
          <div>
            <h1 class="font-sora font-bold text-sm sm:text-base text-slate-900 tracking-tight">
              Content Studio & CMS PMB
            </h1>
            <p class="text-[11px] text-slate-500">
              Pusat pengelolaan identitas kampus, pengumuman, kontak layanan, jalur masuk, dan FAQ
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5 text-xs">
          <RouterLink
            to="/panduan"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
          >
            Lihat Panduan Publik
          </RouterLink>
          <RouterLink
            to="/admin"
            class="px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>Kembali ke Admin PMB</span>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Single Source of Truth CMS Editor -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
      <CmsContentDesk />
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { Layers, ArrowLeft } from 'lucide-vue-next';
import CmsContentDesk from '@/components/admin/CmsContentDesk.vue';
</script>
