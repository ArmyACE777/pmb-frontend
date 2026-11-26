<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Top Header Bersih -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 print:static">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2.5 min-w-0">
          <img
            :src="cmsStore.identity.logoUrl || '/assets/icons/bth.png'"
            :alt="cmsStore.identity.name || 'Universitas BTH'"
            class="w-7 h-7 object-contain shrink-0"
          />
          <div class="min-w-0">
            <h1 class="font-sora font-bold text-slate-900 text-xs sm:text-sm truncate">
              Panduan Pendaftaran PMB • TA {{ cmsStore.identity.academicYear || '2026/2027' }}
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0 print:hidden text-xs">
          <button
            type="button"
            @click="triggerPrint"
            class="font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cetak / PDF
          </button>

          <RouterLink
            :to="backRoute"
            class="px-3.5 py-1.5 rounded-lg font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>{{ authStore.isAuthenticated ? 'Dashboard' : 'Masuk' }}</span>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <ApplicantGuideContent mode="page" />
    </main>

    <!-- Footer Ringkas -->
    <footer class="py-5 text-center text-[11px] text-slate-500 font-sans print:hidden">
      <span>{{ cmsStore.identity.name || 'Universitas Bakti Tunas Husada' }}</span>
      <span class="mx-2">•</span>
      <a
        :href="helpdeskWaUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-[#1E3A8A] hover:underline"
      >
        Hubungi Helpdesk WA ({{ cmsStore.contact.whatsapp || '0821-1710-0200' }})
      </a>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { useCmsStore } from '@/stores/cms';
import { useAuthStore } from '@/stores/auth';
import ApplicantGuideContent from '@/components/guides/ApplicantGuideContent.vue';

const route = useRoute();
const cmsStore = useCmsStore();
const authStore = useAuthStore();

const helpdeskWaUrl = computed(
  () => cmsStore.contact?.whatsappLink || 'https://api.whatsapp.com/send?phone=6282117100200'
);

const backRoute = computed(() => {
  if (!authStore.isAuthenticated) return '/login';
  if (authStore.isAdmin) return '/admin';
  if (authStore.isMarketing) return '/marketing';
  if (authStore.isBkPartner) return '/bk';
  return '/dashboard';
});

const triggerPrint = () => {
  window.print();
};

onMounted(async () => {
  if (route.query.print === '1') {
    await nextTick();
    setTimeout(() => window.print(), 250);
  }
});
</script>
