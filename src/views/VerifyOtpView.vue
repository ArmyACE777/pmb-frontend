<template>
  <AuthLayout
    headline="Verifikasi Akun Pendaftaran"
    subheadline="Masukkan 6 digit kode OTP verifikasi resmi yang telah dikirimkan ke email Anda."
  >
    <div class="w-full">
      <!-- Target Email Card -->
      <div class="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl mb-6 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-bth-navy text-white flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="overflow-hidden">
          <span class="text-[11px] text-slate-500 block font-sans">Kode verifikasi dikirim ke:</span>
          <span class="text-xs sm:text-sm font-semibold text-bth-navy font-sora truncate block">{{ email || 'Alamat email Anda' }}</span>
        </div>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="bg-red-50/90 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm mb-5 flex items-start gap-2.5 animate-fadeIn shadow-xs"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div class="leading-relaxed">{{ errorMessage }}</div>
      </div>

      <!-- Success Alert -->
      <div
        v-if="successMessage"
        class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs sm:text-sm mb-5 flex items-start gap-2.5 animate-fadeIn shadow-xs"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <div class="leading-relaxed">{{ successMessage }}</div>
      </div>

      <!-- 6 Box OTP Inputs -->
      <form @submit.prevent="handleVerifyOtp" class="space-y-6">
        <div>
          <label class="block text-xs sm:text-sm font-sora font-semibold text-slate-800 mb-3 text-center">
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
              class="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-sora border-2 border-slate-200 bg-slate-50 focus:border-bth-navy focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none transition-all duration-150 text-slate-900"
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
            class="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Verifikasi & Masuk Portal</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Memvalidasi Kode...
            </span>
          </button>
        </div>

        <!-- Cooldown & Kirim Ulang -->
        <div class="text-center pt-1 border-t border-slate-100">
          <p class="text-xs text-slate-500 mb-2 font-sans">Tidak menerima email verifikasi?</p>
          <button
            type="button"
            :disabled="resendCooldown > 0 || isResending"
            @click="handleResendOtp"
            class="font-sora text-xs sm:text-sm text-bth-blue font-semibold hover:text-bth-navy hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5"
          >
            <span v-if="resendCooldown > 0" class="inline-flex items-center gap-1.5">
              <span>⏳</span>
              <span>Kirim Ulang Kode ({{ resendCooldown }}s)</span>
            </span>
            <span v-else-if="isResending">Mengirimkan kode baru...</span>
            <span v-else>Kirim Ulang Kode OTP</span>
          </button>
        </div>

        <!-- Dev Helper Autofill (Khusus Localhost Testing) -->
        <div v-if="isLocalhost" class="text-center pt-2">
          <button
            type="button"
            @click="autoFetchLocalOtp"
            :disabled="isFetchingOtp"
            class="text-[11px] text-slate-400 hover:text-bth-blue transition-colors inline-flex items-center gap-1 hover:underline"
            title="Mengambil kode OTP otomatis dari Mailpit server lokal"
          >
            <span>📥</span>
            <span>{{ isFetchingOtp ? 'Mengambil OTP...' : 'Ambil & Tempel OTP Otomatis (Uji Coba Lokal)' }}</span>
          </button>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
const successMessage = ref('');
const resendCooldown = ref(60);
let cooldownTimer = null;

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isFetchingOtp = ref(false);

const autoFetchLocalOtp = async () => {
  isFetchingOtp.value = true;
  errorMessage.value = '';
  try {
    const res = await fetch('http://localhost:8025/api/v1/messages');
    if (!res.ok) throw new Error('Tidak dapat menghubungi Mailpit');
    const data = await res.json();
    const targetEmail = email.value.toLowerCase().trim();
    const msg = data.messages?.find(
      (m) =>
        m.Subject?.toLowerCase().includes('kode verifikasi') &&
        (!targetEmail || m.To?.some((t) => t.Address.toLowerCase().includes(targetEmail)))
    );
    if (msg) {
      const match = msg.Snippet.match(/\b\d{6}\b/);
      if (match) {
        match[0].split('').forEach((digit, idx) => {
          otpDigits.value[idx] = digit;
        });
        successMessage.value = `Kode OTP (${match[0]}) berhasil diambil dari inbox lokal!`;
        handleVerifyOtp();
        return;
      }
    }
    errorMessage.value = 'Belum ada email OTP untuk alamat ini di Mailpit lokal.';
  } catch (e) {
    errorMessage.value = 'Gagal mengambil OTP otomatis. Pastikan container Mailpit berjalan.';
  } finally {
    isFetchingOtp.value = false;
  }
};

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
  if (route.query.sent === 'true') {
    successMessage.value = 'Registrasi berhasil! Kode verifikasi telah dikirim ke email Anda.';
  } else if (route.query.unverified === 'true') {
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
  successMessage.value = '';

  try {
    await authStore.verifyOtp(email.value, otpCode);
    router.push({ path: '/login', query: { registered: 'true' } });
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
  successMessage.value = '';

  try {
    await authStore.resendOtp(email.value);
    successMessage.value = 'Kode OTP baru telah berhasil dikirim ke email Anda!';
    startCooldown();
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal mengirim ulang kode OTP.';
  } finally {
    isResending.value = false;
  }
};
</script>
