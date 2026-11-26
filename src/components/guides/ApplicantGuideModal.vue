<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/55 backdrop-blur-xs animate-fadeIn"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl max-w-3xl w-full shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-scaleUp">
        <!-- Header Bersih -->
        <div class="px-5 py-4 sm:px-6 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div class="min-w-0">
            <h2 class="font-sora font-bold text-slate-900 text-sm sm:text-base">
              Panduan Pendaftaran PMB
            </h2>
            <p class="text-xs text-slate-500 mt-0.5 truncate">
              {{ cmsStore.identity.name || 'Universitas Bakti Tunas Husada' }} • TA {{ cmsStore.identity.academicYear || '2026/2027' }}
            </p>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Tutup"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="px-5 py-4 sm:px-6 overflow-y-auto min-h-0 flex-1">
          <ApplicantGuideContent mode="modal" />
        </div>

        <!-- Footer Ringkas -->
        <div class="px-5 py-3 sm:px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 text-xs">
          <div class="flex items-center gap-4">
            <button
              type="button"
              @click="openFullPage"
              class="font-medium text-[#1E3A8A] hover:underline cursor-pointer"
            >
              Buka Halaman Penuh
            </button>
            <a
              :href="helpdeskWaUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-slate-600 hover:text-slate-900 hover:underline"
            >
              Helpdesk WA
            </a>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="px-4 py-1.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { X } from 'lucide-vue-next';
import { useCmsStore } from '@/stores/cms';
import ApplicantGuideContent from '@/components/guides/ApplicantGuideContent.vue';

defineProps({
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const router = useRouter();
const cmsStore = useCmsStore();

const helpdeskWaUrl = computed(
  () => cmsStore.contact?.whatsappLink || 'https://api.whatsapp.com/send?phone=6282117100200'
);

const closeModal = () => {
  emit('update:modelValue', false);
};

const openFullPage = () => {
  closeModal();
  router.push({ name: 'applicant-guide' });
};
</script>
