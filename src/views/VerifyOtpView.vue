<template>
  <AuthLayout headline="Verifikasi Akun Pendaftaran">
    <template #subheadline>
      <div class="mt-2 space-y-1.5">
        <p class="text-xs text-slate-500 font-sans leading-relaxed">
          Kode 6 digit telah dikirimkan ke:
        </p>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/90 rounded-lg text-xs font-mono font-medium text-slate-800 border border-slate-200/70 max-w-full">
          <Mail class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span class="truncate">{{ email || 'Alamat email Anda' }}</span>
        </div>
      </div>
    </template>

    <div class="w-full">
      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="bg-rose-50 border border-rose-200/80 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs mb-4 flex items-center justify-between gap-2 animate-fadeIn shadow-2xs"
      >
        <div class="flex items-center gap-2">
          <AlertCircle class="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span class="leading-relaxed">{{ errorMessage }}</span>
        </div>
        <button
          type="button"
          @click="errorMessage = ''"
          class="text-rose-400 hover:text-rose-700 text-sm font-bold leading-none cursor-pointer"
        >&times;</button>
      </div>

      <!-- Success Notification (e.g. after resending OTP) -->
      <div
        v-if="successToast"
        class="bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs mb-4 flex items-center justify-between gap-2 animate-fadeIn shadow-2xs"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span class="leading-relaxed">{{ successToast }}</span>
        </div>
        <button
          type="button"
          @click="successToast = ''"
          class="text-emerald-500 hover:text-emerald-800 text-sm font-bold leading-none cursor-pointer"
        >&times;</button>
      </div>

      <!-- 6 Box OTP Inputs -->
      <form @submit.prevent="handleVerifyOtp" class="space-y-5">
        <div>
          <label class="block text-xs font-sora font-semibold text-slate-700 mb-2.5 text-center">
            Masukkan 6 Digit Kode OTP
          </label>
          <div class="flex justify-center gap-2 sm:gap-2.5" @paste="handlePaste">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              ref="otpInputs"
              v-model="otpDigits[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold font-mono border rounded-xl outline-none transition-all text-slate-900 shadow-2xs"
              :class="otpDigits[index]
                ? 'border-[#1E3A8A] bg-blue-50/20 ring-1 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300 focus:border-[#1E3A8A] focus:ring-3 focus:ring-blue-100'"
              @input="onInput(index, $event)"
              @keydown="onKeyDown(index, $event)"
              required
            />
          </div>
        </div>

        <!-- Tombol Verifikasi -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || !isComplete"
            class="w-full py-2.5 sm:py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Verifikasi & Masuk Portal</span>
            <span v-else class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin text-white" />
              <span>Memvalidasi Kode...</span>
            </span>
          </button>
        </div>

        <!-- Cooldown & Kirim Ulang -->
        <div class="text-center pt-3 border-t border-slate-100 space-y-2">
          <p class="text-xs text-slate-500 font-sans">
            Tidak menerima email verifikasi?
          </p>
          <div>
            <span v-if="resendCooldown > 0" class="text-xs text-slate-400 font-medium">
              Kirim ulang kode dalam <strong class="text-slate-600 font-mono">{{ resendCooldown }} detik</strong>
            </span>
            <button
              v-else
              type="button"
              :disabled="isResending"
              @click="handleResendOtp"
              class="font-sora text-xs text-[#1E3A8A] font-semibold hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:text-slate-400"
            >
              <RotateCw v-if="isResending" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isResending ? 'Mengirimkan kode baru...' : 'Kirim Ulang Kode OTP' }}</span>
            </button>
          </div>

          <div class="pt-1">
            <RouterLink
              to="/register"
              class="text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
            >
              Salah alamat email? Ubah pendaftaran
            </RouterLink>
          </div>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { Mail, AlertCircle, CheckCircle2, RotateCw, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref(route.query.email || '');
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const isLoading = ref(false);
const isResending = ref(false);
const errorMessage = ref('');
const successToast = ref('');
const resendCooldown = ref(60);
let cooldownTimer = null;

const isComplete = computed(() => otpDigits.value.every((d) => d !== ''));

const startCooldown = () => {
  resendCooldown.value = 60;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      clearInterval(cooldownTimer);
    }
  }, 1000);
};

onMounted(() => {
  if (route.query.unverified === 'true') {
    errorMessage.value = 'Akun Anda belum aktif. Masukkan kode verifikasi yang telah dikirim ke email.';
  }
  startCooldown();
  setTimeout(() => {
    if (otpInputs.value && otpInputs.value[0]) {
      otpInputs.value[0].focus();
    }
  }, 300);
});

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});

const onInput = (index, event) => {
  const val = event.target.value.replace(/\D/g, '');
  otpDigits.value[index] = val ? val.slice(-1) : '';

  if (val && index < 5) {
    otpInputs.value[index + 1]?.focus();
  }

  if (isComplete.value) {
    handleVerifyOtp();
  }
};

const onKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus();
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const paste = (event.clipboardData || window.clipboardData).getData('text');
  const digits = paste.replace(/\D/g, '').slice(0, 6).split('');
  digits.forEach((d, i) => {
    if (i < 6) otpDigits.value[i] = d;
  });
  const nextEmpty = otpDigits.value.findIndex((d) => d === '');
  const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
  otpInputs.value[focusIndex]?.focus();

  if (isComplete.value) {
    handleVerifyOtp();
  }
};

const handleVerifyOtp = async () => {
  const otpCode = otpDigits.value.join('');
  if (otpCode.length !== 6) return;

  isLoading.value = true;
  errorMessage.value = '';
  successToast.value = '';

  try {
    await authStore.verifyOtp(email.value, otpCode);
    router.push('/dashboard');
  } catch (err) {
    const data = err.response?.data;
    if (data?.error_code === 'OTP_LOCKED') {
      errorMessage.value = 'Kode OTP telah terkunci karena salah 5 kali berturut-turut. Silakan klik "Kirim Ulang Kode OTP".';
      return;
    }
    if (data?.error_code === 'OTP_EXPIRED') {
      errorMessage.value = 'Masa berlaku kode OTP telah habis (10 menit). Silakan minta kode baru.';
      return;
    }
    if (data?.error_code === 'OTP_INVALID') {
      errorMessage.value = data?.message || 'Kode OTP tidak cocok. Periksa 6 digit kode pada email Anda.';
      otpDigits.value = ['', '', '', '', '', ''];
      otpInputs.value[0]?.focus();
      return;
    }
    errorMessage.value = data?.message || 'Kode OTP salah. Silakan periksa kembali.';
    otpDigits.value = ['', '', '', '', '', ''];
    otpInputs.value[0]?.focus();
  } finally {
    isLoading.value = false;
  }
};

const handleResendOtp = async () => {
  if (resendCooldown.value > 0) return;
  isResending.value = true;
  errorMessage.value = '';
  successToast.value = '';

  try {
    await authStore.resendOtp(email.value);
    successToast.value = 'Kode OTP baru telah berhasil dikirim ke email Anda!';
    startCooldown();
  } catch (err) {
    const data = err.response?.data;
    if (data?.error_code === 'OTP_RESEND_COOLDOWN') {
      errorMessage.value = 'Mohon tunggu beberapa detik sebelum meminta kode OTP baru lagi.';
    } else {
      errorMessage.value = data?.message || err.response?.data?.message || 'Gagal mengirim ulang kode OTP.';
    }
  } finally {
    isResending.value = false;
  }
};
</script>
