<template>
  <div class="mt-4 pt-4 border-t border-dashed border-slate-200 space-y-2.5">
    <div class="flex items-center justify-between gap-2 text-[11px]">
      <span class="font-sora font-semibold text-slate-600">
        Akun Uji Sementara (Dev Only)
      </span>
      <button
        type="button"
        @click="handleReset"
        class="text-slate-400 hover:text-rose-600 hover:underline cursor-pointer"
        title="Reset state localStorage akun uji"
      >
        Reset State
      </button>
    </div>

    <div class="grid grid-cols-2 gap-1.5">
      <button
        v-for="preset in DEV_PRESETS"
        :key="preset.key"
        type="button"
        :disabled="busyKey !== null"
        @click="handleQuickLogin(preset)"
        class="text-left px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50/70 hover:border-[#1E3A8A]/40 transition-colors cursor-pointer disabled:opacity-50"
      >
        <div class="font-sora font-semibold text-[11px] text-slate-800 truncate">
          {{ busyKey === preset.key ? 'Memproses...' : preset.label }}
        </div>
        <div class="text-[10px] text-slate-500 truncate">
          {{ preset.sublabel }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useReferralStore } from '@/stores/referral';
import { useToast } from '@/composables/useToast';
import { DEV_PRESETS, loginDevPreset, resetDevLocalTestState } from '@/dev/devTestAccounts';

const router = useRouter();
const authStore = useAuthStore();
const referralStore = useReferralStore();
const toast = useToast();

const busyKey = ref(null);

const handleQuickLogin = async (preset) => {
  busyKey.value = preset.key;
  try {
    await loginDevPreset(preset, { authStore, referralStore, router, toast });
  } finally {
    busyKey.value = null;
  }
};

const handleReset = () => {
  resetDevLocalTestState(toast);
};
</script>
