<template>
  <AuthLayout
    headline="Atur Ulang Kata Sandi"
    subheadline="Masukkan alamat email akun Anda untuk menerima tautan dan kode token/OTP reset kata sandi."
  >
    <div class="w-full">
      <form @submit.prevent="handleForgotPassword" class="space-y-3.5">
        <div>
          <label for="email" class="block font-sans font-medium text-slate-700 text-xs mb-1">
            Alamat Email Akun
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Masukkan email terdaftar Anda (contoh: nama@gmail.com)"
            required
            class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans placeholder:text-slate-400"
          />
          <p class="text-[11px] text-slate-500 mt-1">
            Tautan dan kode token reset akan dikirimkan jika email terdaftar di sistem.
          </p>
        </div>

        <div class="pt-1.5">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Kirim Kode Reset Sandi</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Mengirimkan...
            </span>
          </button>
        </div>

        <div class="pt-3 border-t border-slate-100 space-y-2 text-center text-xs text-slate-500 font-sans">
          <div>
            <span>Sudah memiliki kode token / OTP?</span>
            <RouterLink
              :to="{ path: '/reset-password', query: email ? { email } : {} }"
              class="font-semibold text-[#1E3A8A] hover:text-[#2563EB] hover:underline ml-1 font-sora"
            >
              Masukkan Kode Disini
            </RouterLink>
          </div>
          <div>
            <span>Ingat kata sandi Anda?</span>
            <RouterLink
              to="/login"
              class="font-semibold text-[#1E3A8A] hover:text-[#2563EB] hover:underline ml-1 font-sora"
            >
              Masuk Disini
            </RouterLink>
          </div>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();
const email = ref('');
const isLoading = ref(false);

onMounted(() => {
  // Bersihkan sisa token basi/kedaluwarsa di storage agar tidak memicu auto-kick ke login
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    if (authStore.accessToken) authStore.accessToken = null;
    if (authStore.user) authStore.user = null;
  } catch (e) {}

  if (route.query.email) {
    email.value = String(route.query.email).trim();
  }
});

const handleForgotPassword = async () => {
  const targetEmail = email.value.trim();
  if (!targetEmail) return;

  isLoading.value = true;
  try {
    const res = await authStore.forgotPassword(targetEmail);
    toast.success(res?.message || 'Kode dan tautan reset kata sandi telah dikirim ke email Anda.');
    // Arahkan otomatis ke halaman input token/OTP reset password
    router.push({
      path: '/reset-password',
      query: { email: targetEmail },
    });
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal memproses permintaan reset kata sandi.');
  } finally {
    isLoading.value = false;
  }
};
</script>
