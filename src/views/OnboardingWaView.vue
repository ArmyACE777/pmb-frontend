<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#1E3A8A] selection:text-white">
    <!-- Centered Card Message -->
    <div class="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-sm p-7 sm:p-9 text-center">
      <!-- Logo BTH -->
      <div class="flex justify-center mb-5">
        <img
          :src="cmsStore.identity.logoUrl || '/assets/icons/bth.png'"
          :alt="cmsStore.identity.name || 'Universitas Bakti Tunas Husada'"
          class="h-12 w-auto object-contain drop-shadow-2xs"
        />
      </div>

      <!-- Judul Pesan -->
      <h1 class="text-xl sm:text-2xl font-sora font-bold text-slate-900 leading-snug tracking-tight">
        Grup WhatsApp Calon Mahasiswa
      </h1>

      <!-- Deskripsi Pesan -->
      <p class="mt-3 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
        Selamat datang di Portal PMB {{ cmsStore.identity.shortName || 'Universitas BTH' }}. Silakan bergabung ke grup WhatsApp resmi calon mahasiswa untuk mendapatkan informasi jadwal seleksi, pengumuman kelulusan, dan panduan tahapan pendaftaran.
      </p>

      <!-- Tombol Masuk Grup WhatsApp & Ke Dashboard (Wajib Diklik Bagi Pendaftar Baru) -->
      <button
        id="btn-join-wa"
        type="button"
        @click="handleJoinAndProceed"
        class="mt-6 w-full py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-sora font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all flex items-center justify-center gap-2.5 cursor-pointer"
      >
        <!-- WhatsApp Icon SVG -->
        <svg class="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span>Masuk Grup WhatsApp</span>
      </button>

      <!-- Helpdesk Link -->
      <div class="mt-6 pt-4 border-t border-slate-100">
        <p class="text-[11px] text-slate-400 font-sans">
          Mengalami kendala?
          <a
            :href="cmsStore.contact.whatsappLink || 'https://api.whatsapp.com/send?phone=6282117100200'"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#1E3A8A] font-medium hover:underline ml-0.5"
          >
            Hubungi Helpdesk PMB
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useApplicantStore } from '@/stores/applicant';
import { useCmsStore } from '@/stores/cms';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const applicantStore = useApplicantStore();
const cmsStore = useCmsStore();
const toast = useToast();

const whatsappGroupUrl = computed(() => {
  try {
    const rawTracks = localStorage.getItem('bth_admission_tracks');
    if (rawTracks) {
      const tracks = JSON.parse(rawTracks);
      const activeName = (applicantStore.state?.admission?.track || '').toLowerCase();
      const match = tracks.find((t) => {
        const name = (t.name || '').toLowerCase();
        const code = (t.code || '').toLowerCase();
        return activeName && (activeName.includes(code) || activeName.includes(name) || name.includes(activeName));
      });
      if (match?.whatsappGroupUrl) return match.whatsappGroupUrl;
      if (tracks[0]?.whatsappGroupUrl) return tracks[0].whatsappGroupUrl;
    }
  } catch (e) {
    console.warn('Gagal memuat URL grup WhatsApp:', e);
  }
  return cmsStore.links.onboardingWaGroup || cmsStore.links.officialWaGroup || 'https://chat.whatsapp.com/BTH-MabaOnboarding2026';
});

onMounted(() => {
  const userEmail = authStore.currentUser?.email || localStorage.getItem('bth_auth_user_email') || 'applicant';
  const needsOnboarding = localStorage.getItem(`bth_needs_onboarding_${userEmail}`) === 'true';
  const hasJoined = localStorage.getItem(`bth_wa_group_joined_${userEmail}`) === 'true';

  // Jika bukan pendaftar baru yang butuh onboarding atau sudah pernah bergabung, langsung ke dashboard
  if (!needsOnboarding || hasJoined) {
    router.replace('/dashboard');
  }
});

const handleJoinAndProceed = () => {
  const userEmail = authStore.currentUser?.email || localStorage.getItem('bth_auth_user_email') || 'applicant';
  localStorage.setItem(`bth_wa_group_joined_${userEmail}`, 'true');
  localStorage.removeItem(`bth_needs_onboarding_${userEmail}`);

  // Buka tautan WhatsApp grup di tab baru
  window.open(whatsappGroupUrl.value, '_blank', 'noopener,noreferrer');

  toast.success('Membuka grup WhatsApp... Selamat datang di portal pendaftaran!');

  // Otomatis arahkan ke dashboard pendaftar
  router.push('/dashboard');
};
</script>
