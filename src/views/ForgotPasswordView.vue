<template>
  <AuthLayout
    headline="Atur Ulang Kata Sandi"
    subheadline="Masukkan alamat email Anda untuk menerima tautan instruksi reset kata sandi."
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

      <!-- Success Alert -->
      <div
        v-if="successMessage"
        class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs mb-4 flex items-start gap-2 animate-fadeIn"
      >
        <span class="text-sm">✓</span>
        <div class="leading-relaxed flex-1">{{ successMessage }}</div>
      </div>

      <form @submit.prevent="handleForgotPassword" class="space-y-3.5">
        <div>
          <label for="email" class="block font-sans font-medium text-slate-700 text-xs mb-1">
            Alamat Email Akun
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            required
            class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans placeholder:text-slate-400"
          />
          <p class="text-[11px] text-slate-500 mt-1">
            Tautan reset sandi akan dikirimkan jika email terdaftar di sistem.
          </p>
        </div>

        <div class="pt-1.5">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Kirim Tautan Reset</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Mengirimkan...
            </span>
          </button>
        </div>

        <div class="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-sans">
          <span>Ingat kata sandi Anda?</span>
          <RouterLink
            to="/login"
            class="font-semibold text-[#1E3A8A] hover:text-[#2563EB] hover:underline ml-1 font-sora"
          >
            Masuk Disini
          </RouterLink>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';

const authStore = useAuthStore();
const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleForgotPassword = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const res = await authStore.forgotPassword(email.value.trim());
    successMessage.value = res.message || 'Instruksi reset kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau spam.';
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal memproses permintaan lupa password.';
  } finally {
    isLoading.value = false;
  }
};
</script>
