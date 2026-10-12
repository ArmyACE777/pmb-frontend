<template>
  <div class="min-h-screen bg-white flex flex-col selection:bg-[#1E3A8A] selection:text-white font-sans antialiased overflow-x-hidden">
    <div class="min-h-screen lg:h-screen flex flex-col lg:flex-row w-full flex-1 overflow-x-hidden">
      
      <!-- SISI KIRI: Visual Arsitektural Kampus & Identitas Utama (Desktop) -->
      <aside class="relative hidden lg:flex lg:w-1/2 xl:w-7/12 bg-slate-950 overflow-hidden flex-col justify-between p-10 xl:p-14 sticky top-0 h-screen flex-shrink-0">
        <!-- Foto Asli Gedung Kampus Universitas BTH (Fokus Seimbang) -->
        <img
          :src="cmsStore.identity.heroCampusBgUrl || '/assets/images/bth-campus-bg.jpg'"
          :alt="cmsStore.identity.name || 'Gedung Kampus Universitas Bakti Tunas Husada'"
          class="absolute inset-0 w-full h-full object-cover object-[22%_center] xl:object-[26%_center] filter brightness-[0.92]"
        />

        <!-- Natural Gradient Vignette (Menjaga kontras teks atas & bawah, bagian tengah tetap jernih) -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/70 pointer-events-none"></div>

        <!-- Identitas Resmi Kampus (Elegan, Alami, Tanpa Kotak Tempelan) -->
        <div class="relative z-10 flex items-center gap-3.5">
          <img
            :src="cmsStore.identity.logoUrl || '/assets/icons/bth.png'"
            :alt="cmsStore.identity.name || 'Logo Universitas BTH'"
            class="h-11 xl:h-12 w-auto object-contain drop-shadow-md"
          />
          <div>
            <h1 class="text-sm xl:text-base font-bold uppercase tracking-wider text-white font-sora leading-tight">
              {{ cmsStore.identity.name || 'Universitas Bakti Tunas Husada' }}
            </h1>
            <p class="text-xs text-blue-200/90 font-medium leading-tight mt-0.5 font-sans">
              Portal Penerimaan Mahasiswa Baru
            </p>
          </div>
        </div>

        <!-- Tipografi Institusional Bawah (Otentik, Bersih, Tanpa Emoji & Bebas Kesan AI) -->
        <div class="relative z-10 text-white space-y-2.5 max-w-lg">
          <div class="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300 font-sora">
            PMB Tahun Akademik {{ cmsStore.identity.academicYear || '2026/2027' }}
          </div>
          <h2 class="text-2xl xl:text-3xl font-extrabold text-white font-sora tracking-tight leading-tight">
            {{ cmsStore.identity.tagline || 'Transforming New Generation' }}
          </h2>
          <p class="text-xs xl:text-sm text-slate-300/85 font-sans leading-relaxed">
            Fakultas Farmasi &bull; Fakultas Ilmu Kesehatan &bull; Fakultas Teknologi & Bisnis
          </p>
          <div class="pt-3 text-[11px] text-slate-400 font-sans flex flex-wrap items-center gap-2.5 border-t border-white/10">
            <span>{{ cmsStore.identity.accreditation || 'Terakreditasi BAN-PT & LAM-PTKes' }}</span>
            <span class="text-slate-600">&bull;</span>
            <span>{{ cmsStore.contact.city || 'Tasikmalaya' }}, {{ cmsStore.contact.province || 'Jawa Barat' }}</span>
          </div>
        </div>
      </aside>

      <!-- SISI KANAN: Kanvas Formulir (Scrollable & Bebas Terpotong) -->
      <main class="flex-1 bg-slate-50 lg:h-screen overflow-x-hidden overflow-y-auto relative flex flex-col">
        <div class="min-h-full w-full flex flex-col justify-start sm:justify-between items-center px-5 py-4 sm:px-10 sm:py-5 lg:px-12 xl:px-16 flex-1">
          <!-- Header Ringkas Khusus Mobile (Tampil di Layar HP/Tablet) -->
          <div class="w-full max-w-[440px] lg:hidden flex items-center justify-between pb-3 mb-4 sm:mb-2 border-b border-slate-100 flex-shrink-0">
            <RouterLink to="/login" class="flex items-center gap-2.5">
              <img :src="cmsStore.identity.logoUrl || '/assets/icons/bth.png'" :alt="cmsStore.identity.name" class="h-8 w-auto object-contain" />
              <div>
                <div class="text-xs font-bold font-sora text-slate-900 uppercase tracking-wide">{{ cmsStore.identity.shortName || 'Universitas BTH' }}</div>
                <div class="text-[10px] text-slate-500 font-sans">Portal PMB {{ cmsStore.identity.academicYear || '2026/2027' }}</div>
              </div>
            </RouterLink>

            <a
              :href="cmsStore.contact.whatsappLink || 'https://api.whatsapp.com/send?phone=6282117100200'"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs font-semibold text-[#1E3A8A] hover:underline font-sans"
            >
              Bantuan PMB
            </a>
          </div>

          <div class="hidden lg:block flex-shrink-0"></div>

          <!-- Kontainer Formulir Terpusat -->
          <div :class="['w-full my-2 sm:my-auto py-1 sm:py-1.5', cardMaxWidth]">
            <!-- Header Judul Formulir -->
            <div class="text-left mb-3.5 sm:mb-4">
              <h2 class="font-sora text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
                {{ headline }}
              </h2>

              <slot name="subheadline">
                <p v-if="subheadline" class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-sans">
                  {{ subheadline }}
                </p>
              </slot>
            </div>

            <!-- Form Content Slot -->
            <slot />
          </div>

          <!-- Footer Bersih & Kompak -->
          <footer class="w-full max-w-[480px] pt-2 pb-1.5 text-center text-[11px] text-slate-400 font-sans border-t border-slate-100 mt-2 sm:mt-2.5 flex-shrink-0">
            <div class="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
              <span>&copy; {{ cmsStore.identity.academicYear?.split('/')[0] || '2026' }} {{ cmsStore.identity.shortName || 'Universitas BTH' }}</span>
              <span>•</span>
              <a
                :href="cmsStore.contact.whatsappLink || 'https://api.whatsapp.com/send?phone=6282117100200'"
                target="_blank"
                rel="noopener noreferrer"
                class="text-slate-600 hover:text-[#1E3A8A] hover:underline font-medium"
              >
                Helpdesk PMB
              </a>
              <span v-if="cmsStore.links.publicWaGroup">•</span>
              <a
                v-if="cmsStore.links.publicWaGroup"
                :href="cmsStore.links.publicWaGroup"
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold inline-flex items-center gap-1"
                title="Grup WhatsApp Terbuka Calon Pendaftar"
              >
                <svg class="w-3 h-3 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Komunitas PMB (Umum)</span>
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useCmsStore } from '@/stores/cms';

const cmsStore = useCmsStore();

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
