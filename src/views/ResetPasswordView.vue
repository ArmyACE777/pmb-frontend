<template>
  <AuthLayout
    headline="Buat Kata Sandi Baru"
    subheadline="Masukkan token reset yang Anda terima di email dan tentukan kata sandi baru akun Anda."
  >
    <div class="w-full">
      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs mb-4 flex items-start gap-2 animate-fadeIn"
      >
        <span class="text-sm">⚠️</span>
        <div class="leading-relaxed flex-1">{{ errorMessage }}</div>
      </div>

      <form @submit.prevent="handleResetPassword" class="space-y-3.5">
        <!-- Token Input -->
        <div>
          <label for="token" class="block font-sans font-medium text-slate-700 text-xs mb-1">
            Token Reset Kata Sandi
          </label>
          <input
            id="token"
            v-model="token"
            type="text"
            placeholder="Tempelkan token dari email"
            required
            class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 font-mono transition-all placeholder:text-slate-400 placeholder:font-sans"
          />
        </div>

        <!-- New Password Input -->
        <div>
          <label for="password" class="block font-sans font-medium text-slate-700 text-xs mb-1">
            Kata Sandi Baru
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Minimal 8 karakter"
              required
              class="w-full px-3.5 pr-10 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans placeholder:text-slate-400"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
              :title="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.164-3.356m3.304-2.382A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.966 9.966 0 01-4.293 5.318M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Password Confirmation Input -->
        <div>
          <label for="password_confirmation" class="block font-sans font-medium text-slate-700 text-xs mb-1">
            Ulangi Kata Sandi Baru
          </label>
          <div class="relative">
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              :type="showPasswordConfirm ? 'text' : 'password'"
              placeholder="Konfirmasi kata sandi baru"
              required
              class="w-full px-3.5 pr-10 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans placeholder:text-slate-400"
            />
            <button
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
              :title="showPasswordConfirm ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
            >
              <svg v-if="!showPasswordConfirm" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.164-3.356m3.304-2.382A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.966 9.966 0 01-4.293 5.318M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        <div class="pt-1.5">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Simpan Kata Sandi Baru</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Menyimpan...
            </span>
          </button>
        </div>

        <div class="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-sans">
          <span>Sudah selesai?</span>
          <RouterLink
            to="/login"
            class="font-semibold text-[#1E3A8A] hover:text-[#2563EB] hover:underline ml-1 font-sora"
          >
            Kembali ke Login
          </RouterLink>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const token = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

onMounted(() => {
  if (route.query.token) {
    token.value = String(route.query.token).trim();
  }
});

const handleResetPassword = async () => {
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Konfirmasi kata sandi tidak cocok.';
    return;
  }
  if (password.value.length < 8) {
    errorMessage.value = 'Kata sandi minimal 8 karakter.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Send exact DTO payload matching backend ResetPasswordRequest
    await authStore.resetPassword({
      token: token.value.trim(),
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    router.push({ path: '/login', query: { reset: 'true' } });
  } catch (err) {
    const data = err.response?.data;
    if (data?.error_code === 'TOKEN_INVALID' || data?.error_code === 'RESET_TOKEN_INVALID') {
      errorMessage.value = 'Token reset tidak valid atau sudah pernah digunakan.';
      return;
    }
    if (data?.error_code === 'TOKEN_EXPIRED' || data?.error_code === 'RESET_TOKEN_EXPIRED') {
      errorMessage.value = 'Token reset sudah kedaluwarsa (berlaku 30 menit). Silakan minta tautan baru.';
      return;
    }
    errorMessage.value = data?.message || 'Gagal mengatur ulang kata sandi. Pastikan token dan data yang diisi valid.';
  } finally {
    isLoading.value = false;
  }
};
</script>
