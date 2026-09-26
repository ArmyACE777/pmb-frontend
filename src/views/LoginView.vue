<template>
  <AuthLayout
    headline="Masuk ke Akun"
    subheadline="Gunakan email dan kata sandi yang telah Anda daftarkan di PMB Universitas BTH."
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

      <form @submit.prevent="handleLogin" class="space-y-3.5">
        <!-- Email Input -->
        <div>
          <label for="email" class="block font-sans font-medium text-slate-700 text-xs mb-1">
            Alamat Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            required
            class="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans placeholder:text-slate-400"
          />
        </div>

        <!-- Password Input -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label for="password" class="block font-sans font-medium text-slate-700 text-xs">
              Kata Sandi
            </label>
            <RouterLink
              to="/forgot-password"
              class="text-[11px] text-[#2563EB] hover:text-[#1E3A8A] hover:underline font-sans"
            >
              Lupa sandi?
            </RouterLink>
          </div>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan kata sandi"
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

        <!-- Ingat Saya Checkbox -->
        <div class="pt-0.5">
          <label class="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="w-3.5 h-3.5 rounded text-[#1E3A8A] focus:ring-[#1E3A8A] border-slate-300"
            />
            <span class="text-xs text-slate-600 font-sans">Ingat perangkat ini</span>
          </label>
        </div>

        <!-- Submit Button (High-Contrast Solid BTH Navy with Explicit Hex) -->
        <div class="pt-1.5">
          <button
            type="submit"
            :disabled="isLoading || isGoogleLoading"
            class="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Masuk ke Akun</span>
            <span v-else class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin text-white" />
              <span>Memverifikasi...</span>
            </span>
          </button>
        </div>

        <!-- Divider Atau -->
        <div class="relative my-3.5 flex items-center justify-center">
          <div class="w-full border-t border-slate-200/80"></div>
          <span class="absolute bg-white px-3 text-[11px] font-sans text-slate-400">
            atau
          </span>
        </div>

        <!-- Google Login Button -->
        <div>
          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="isGoogleLoading || isLoading"
            class="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-xs active:scale-[0.99] transition-all flex justify-center items-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <img
              src="/images/icons/google.svg"
              alt="Logo Google"
              class="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain flex-shrink-0"
            />
            <span v-if="!isGoogleLoading">Masuk dengan Google</span>
            <span v-else class="flex items-center gap-2 text-slate-500">
              <Loader2 class="w-4 h-4 animate-spin text-slate-500" />
              <span>Menghubungkan...</span>
            </span>
          </button>
        </div>

        <!-- Tautan Registrasi Akun Baru -->
        <div class="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-sans">
          <span>Belum memiliki akun?</span>
          <RouterLink
            to="/register"
            class="font-semibold text-[#1E3A8A] hover:text-[#2563EB] hover:underline ml-1 font-sora"
          >
            Daftar PMB Baru
          </RouterLink>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const isGoogleLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(() => {
  if (route.query.registered === 'true') {
    successMessage.value = 'Akun Anda berhasil diverifikasi! Silakan masuk ke portal.';
  }
  if (route.query.reset === 'true') {
    successMessage.value = 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru.';
  }
  if (route.query.session === 'revoked') {
    errorMessage.value = 'Sesi Anda telah berakhir. Silakan masuk kembali.';
  }
});

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(email.value, password.value);
    const redirectUrl = route.query.redirect;
    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (authStore.isSuperAdmin) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (err) {
    if (err.code === 'ERR_NETWORK' || !err.response) {
      errorMessage.value = 'Tidak dapat terhubung ke server backend. Pastikan layanan backend berjalan.';
      return;
    }
    const data = err.response?.data;
    if (data?.error_code === 'EMAIL_NOT_VERIFIED') {
      router.push({
        path: '/verify-otp',
        query: { email: email.value, unverified: 'true' },
      });
      return;
    }
    if (data?.error_code === 'TOO_MANY_ATTEMPTS') {
      errorMessage.value = 'Terlalu banyak percobaan gagal. Akun dikunci sementara selama 15 menit demi keamanan.';
      return;
    }
    if (data?.error_code === 'ACCOUNT_INACTIVE') {
      errorMessage.value = 'Akun Anda dinonaktifkan oleh administrator. Silakan hubungi sekretariat PMB.';
      return;
    }
    errorMessage.value = data?.message || 'Email atau kata sandi tidak sesuai.';
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  isGoogleLoading.value = true;
  errorMessage.value = '';
  setTimeout(() => {
    isGoogleLoading.value = false;
    errorMessage.value = 'Fitur Masuk dengan Akun Google (SSO) sedang dalam tahap sinkronisasi domain kampus @bth.ac.id. Silakan masuk menggunakan email dan kata sandi terdaftar.';
  }, 500);
};
</script>
