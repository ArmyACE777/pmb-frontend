<template>
  <AuthLayout
    headline="Daftar Akun Calon Mahasiswa"
    subheadline="Lengkapi formulir di bawah ini untuk memulai registrasi PMB Universitas BTH."
  >
    <div class="w-full">
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

      <form @submit.prevent="handleRegister" class="space-y-3.5">
        <!-- Nama Lengkap Input -->
        <div>
          <label for="name" class="block font-sora font-semibold text-slate-800 text-xs sm:text-sm mb-1">
            Nama Lengkap (Sesuai Ijazah/KTP)
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="name"
              v-model="form.full_name"
              type="text"
              placeholder="Contoh: Siti Rahmawati"
              required
              class="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-300 focus:border-bth-blue focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
            />
          </div>
        </div>

        <!-- Grid: Nomor HP & Email -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- WhatsApp / HP -->
          <div>
            <label for="phone" class="block font-sora font-semibold text-slate-800 text-xs sm:text-sm mb-1">
              No. WhatsApp / HP
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="08123456789"
                required
                class="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-300 focus:border-bth-blue focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block font-sora font-semibold text-slate-800 text-xs sm:text-sm mb-1">
              Alamat Email Aktif
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="nama@email.com"
                required
                class="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-300 focus:border-bth-blue focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
              />
            </div>
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block font-sora font-semibold text-slate-800 text-xs sm:text-sm mb-1">
            Kata Sandi Baru
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Minimal 8 karakter"
              required
              class="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-300 focus:border-bth-blue focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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

          <!-- Password Strength Indicator -->
          <div v-if="form.password" class="mt-2 space-y-1.5 animate-fadeIn">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Kekuatan Kata Sandi:</span>
              <span :class="strengthTextColor" class="font-bold font-sora">{{ strengthLabel }}</span>
            </div>
            <div class="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div :class="strengthScore >= 1 ? strengthBgColor : 'bg-transparent'" class="rounded-full transition-all duration-300"></div>
              <div :class="strengthScore >= 2 ? strengthBgColor : 'bg-transparent'" class="rounded-full transition-all duration-300"></div>
              <div :class="strengthScore >= 3 ? strengthBgColor : 'bg-transparent'" class="rounded-full transition-all duration-300"></div>
              <div :class="strengthScore >= 4 ? strengthBgColor : 'bg-transparent'" class="rounded-full transition-all duration-300"></div>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-[11px] pt-0.5">
              <span class="flex items-center gap-1" :class="hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-400'">
                <span>{{ hasMinLength ? '✓' : '○' }}</span> Min. 8 Karakter
              </span>
              <span class="flex items-center gap-1" :class="hasLettersAndDigits ? 'text-emerald-600 font-medium' : 'text-slate-400'">
                <span>{{ hasLettersAndDigits ? '✓' : '○' }}</span> Kombinasi Huruf & Angka
              </span>
            </div>
          </div>
        </div>

        <!-- Password Confirmation Input -->
        <div>
          <label for="password_confirmation" class="block font-sora font-semibold text-slate-800 text-xs sm:text-sm mb-1">
            Ulangi Kata Sandi
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              :type="showPasswordConfirm ? 'text' : 'password'"
              placeholder="Ketik ulang kata sandi yang sama"
              required
              class="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-slate-50/70 border border-slate-300 focus:border-bth-blue focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
            />
            <button
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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
          <p v-if="passwordsMismatch" class="text-[11px] text-red-600 mt-1 font-medium">
            ⚠️ Konfirmasi kata sandi tidak cocok.
          </p>
        </div>

        <!-- Persetujuan Ketentuan -->
        <div class="pt-1">
          <label class="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="termsAgreed"
              required
              class="w-4 h-4 rounded text-bth-navy focus:ring-bth-blue border-gray-300 mt-0.5"
            />
            <span class="text-[11px] sm:text-xs text-slate-600 leading-snug font-sans">
              Saya menyatakan data yang saya masukkan adalah benar dan menyetujui Ketentuan PMB Universitas BTH.
            </span>
          </label>
        </div>

        <!-- Tombol Submit -->
        <div class="pt-1.5">
          <button
            type="submit"
            :disabled="isLoading || isGoogleLoading || !termsAgreed || passwordsMismatch"
            class="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Daftar Akun PMB</span>
            <span v-else class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin text-white" />
              <span>Memproses Pendaftaran...</span>
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

        <!-- Tombol Daftar dengan Google -->
        <div>
          <button
            type="button"
            @click="handleGoogleRegister"
            :disabled="isGoogleLoading || isLoading"
            class="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-xs active:scale-[0.99] transition-all flex justify-center items-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <img
              src="/images/icons/google.svg"
              alt="Logo Google"
              class="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain flex-shrink-0"
            />
            <span v-if="!isGoogleLoading">Daftar dengan Google</span>
            <span v-else class="flex items-center gap-2 text-slate-500">
              <Loader2 class="w-4 h-4 animate-spin text-slate-500" />
              <span>Menghubungkan...</span>
            </span>
          </button>
        </div>

        <!-- Tautan Menuju Login -->
        <div class="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-sans">
          <span>Sudah memiliki akun?</span>
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
import { ref, reactive, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  full_name: '',
  phone: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const termsAgreed = ref(true);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const isLoading = ref(false);
const isGoogleLoading = ref(false);
const errorMessage = ref('');

// Password validation checks
const hasMinLength = computed(() => form.password.length >= 8);
const hasLetters = computed(() => /[a-zA-Z]/.test(form.password));
const hasDigits = computed(() => /[0-9]/.test(form.password));
const hasLettersAndDigits = computed(() => hasLetters.value && hasDigits.value);
const hasSpecialChar = computed(() => /[^a-zA-Z0-9]/.test(form.password));

const strengthScore = computed(() => {
  if (!form.password) return 0;
  let score = 0;
  if (hasMinLength.value) score += 1;
  if (hasLettersAndDigits.value) score += 1;
  if (form.password.length >= 10) score += 1;
  if (hasSpecialChar.value) score += 1;
  return score;
});

const strengthLabel = computed(() => {
  switch (strengthScore.value) {
    case 1: return 'Kurang';
    case 2: return 'Cukup';
    case 3: return 'Kuat';
    case 4: return 'Sangat Kuat';
    default: return 'Terlalu Pendek';
  }
});

const strengthBgColor = computed(() => {
  switch (strengthScore.value) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-amber-500';
    case 3: return 'bg-blue-600';
    case 4: return 'bg-emerald-500';
    default: return 'bg-slate-200';
  }
});

const strengthTextColor = computed(() => {
  switch (strengthScore.value) {
    case 1: return 'text-red-500';
    case 2: return 'text-amber-600';
    case 3: return 'text-blue-600';
    case 4: return 'text-emerald-600';
    default: return 'text-slate-400';
  }
});

const passwordsMismatch = computed(() => {
  return form.password_confirmation && form.password !== form.password_confirmation;
});

const handleRegister = async () => {
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Konfirmasi kata sandi tidak cocok.';
    return;
  }

  if (form.password.length < 8) {
    errorMessage.value = 'Kata sandi minimal 8 karakter.';
    return;
  }

  if (!hasLetters.value || !hasDigits.value) {
    errorMessage.value = 'Kata sandi harus mengandung kombinasi huruf dan angka.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await authStore.register({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      password_confirmation: form.password_confirmation,
    });

    router.push({
      path: '/verify-otp',
      query: { email: form.email, sent: 'true' },
    });
  } catch (err) {
    if (err.code === 'ERR_NETWORK' || !err.response) {
      errorMessage.value = 'Tidak dapat terhubung ke server autentikasi. Pastikan sistem backend sedang berjalan.';
      return;
    }
    const data = err.response?.data;
    if (data?.error_code === 'EMAIL_TAKEN' || data?.error_code === 'EMAIL_ALREADY_EXISTS') {
      errorMessage.value = 'Alamat email ini sudah terdaftar di sistem PMB. Silakan gunakan email lain atau langsung masuk.';
      return;
    }
    if (data?.error_code === 'VALIDATION_ERROR' && data?.errors) {
      const errList = Object.entries(data.errors).map(([field, msgs]) => {
        const fieldName = field === 'full_name' ? 'Nama' : field === 'phone' ? 'No HP' : field === 'password' ? 'Kata Sandi' : field;
        return `${fieldName}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`;
      });
      errorMessage.value = errList.length > 0 
        ? errList.join(' | ') 
        : (data.message || 'Data pendaftaran belum memenuhi syarat validasi server.');
      return;
    }
    errorMessage.value = data?.message || 'Registrasi gagal diproses. Silakan periksa kembali formulir Anda.';
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleRegister = () => {
  isGoogleLoading.value = true;
  errorMessage.value = '';
  setTimeout(() => {
    isGoogleLoading.value = false;
    errorMessage.value = 'Fitur Daftar dengan Akun Google (SSO) sedang dalam tahap sinkronisasi domain kampus @bth.ac.id. Silakan mendaftar menggunakan formulir registrasi di atas.';
  }, 500);
};
</script>
