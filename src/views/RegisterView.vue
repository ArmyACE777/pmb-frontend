<template>
  <AuthLayout
    headline="Daftar Akun Baru"
    subheadline="Lengkapi formulir di bawah ini untuk membuat akun pendaftaran Anda."
    cardMaxWidth="max-w-[450px]"
  >
    <div class="w-full">
      <form @submit.prevent="handleRegister" class="space-y-3">
        <!-- Nama Lengkap Input -->
        <div>
          <label for="name" class="block font-sora font-semibold text-slate-800 text-xs mb-1">
            Nama Lengkap (Sesuai Ijazah/KTP) <span class="text-rose-500 font-semibold">*</span>
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
              placeholder="Nama lengkap sesuai ijazah / KTP"
              required
              class="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-50/70 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
            />
          </div>
        </div>

        <!-- Grid: Nomor HP & Email -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <!-- WhatsApp / HP -->
          <div>
            <label for="phone" class="block font-sora font-semibold text-slate-800 text-xs mb-1">
              No. WhatsApp / HP <span class="text-rose-500 font-semibold">*</span>
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
                placeholder="Contoh: 081234567890"
                required
                class="w-full pl-10 pr-3.5 py-2 sm:py-2.5 bg-slate-50/70 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block font-sora font-semibold text-slate-800 text-xs mb-1">
              Alamat Email Aktif <span class="text-rose-500 font-semibold">*</span>
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
                placeholder="nama.aktif@gmail.com"
                required
                class="w-full pl-10 pr-3.5 py-2 sm:py-2.5 bg-slate-50/70 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
              />
            </div>
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block font-sora font-semibold text-slate-800 text-xs mb-1">
            Kata Sandi Baru <span class="text-rose-500 font-semibold">*</span>
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
              placeholder="Minimal 8 karakter kombinasi"
              required
              class="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-slate-50/70 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              tabindex="-1"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
              :title="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
              :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
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
          <div v-if="form.password" class="mt-1.5 space-y-1 animate-fadeIn">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Kekuatan Sandi:</span>
              <span :class="strengthTextColor" class="font-bold font-sora">{{ strengthLabel }}</span>
            </div>
            <div class="grid grid-cols-4 gap-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div :class="strengthScore >= 1 ? strengthBgColor : 'bg-transparent'" class="rounded-full transition-all duration-300"></div>
              <div :class="strengthScore >= 2 ? strengthBgColor : 'bg-transparent'" class="rounded-full transition-all duration-300"></div>
              <div :class="strengthScore >= 3 ? strengthBgColor : 'bg-transparent'" class="rounded-full transition-all duration-300"></div>
              <div :class="strengthScore >= 4 ? strengthBgColor : 'bg-transparent'" class="rounded-full transition-all duration-300"></div>
            </div>
          </div>
        </div>

        <!-- Password Confirmation Input -->
        <div>
          <label for="password_confirmation" class="block font-sora font-semibold text-slate-800 text-xs mb-1">
            Ulangi Kata Sandi <span class="text-rose-500 font-semibold">*</span>
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
              placeholder="Ketik ulang kata sandi Anda"
              required
              class="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-slate-50/70 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans"
            />
            <button
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
              tabindex="-1"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
              :title="showPasswordConfirm ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
              :aria-label="showPasswordConfirm ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
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
            Konfirmasi kata sandi tidak cocok.
          </p>
        </div>

        <!-- Persetujuan Ketentuan -->
        <div class="pt-0.5">
          <label class="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="termsAgreed"
              required
              class="w-4 h-4 rounded text-[#1E3A8A] focus:ring-[#1E3A8A] border-gray-300 mt-0.5 cursor-pointer"
            />
            <span class="text-[11px] text-slate-600 leading-snug font-sans">
              Saya menyatakan data adalah benar dan menyetujui Ketentuan PMB Universitas BTH.
            </span>
          </label>
        </div>

        <!-- Tombol Submit -->
        <div class="pt-1.5">
          <button
            type="submit"
            :disabled="isLoading || !termsAgreed || passwordsMismatch"
            class="w-full py-3 sm:py-3.5 px-4 min-h-[46px] sm:min-h-[48px] bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-sm rounded-xl shadow-xs hover:shadow-sm active:scale-[0.99] transition-all flex justify-center items-center gap-2.5 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Daftar Akun PMB</span>
            <span v-else class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin text-white" />
              <span>Memproses Pendaftaran...</span>
            </span>
          </button>
        </div>

        <!-- Tombol Daftar dengan Google & Divider (Disembunyikan sementara, kode tetap dipertahankan) -->
        <template v-if="showGoogleAuth">
          <!-- Pembatas / Divider (Rapi & Tepat di Tengah) -->
          <div class="flex items-center my-2 sm:my-2.5">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="px-3 text-[11px] font-sans font-medium text-slate-400">
              atau
            </span>
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <!-- Tombol Daftar dengan Google (Clean & Resmi) -->
          <div>
            <button
              type="button"
              @click="handleGoogleAuth"
              :disabled="isLoading"
              class="w-full py-2.5 sm:py-3 px-4 min-h-[44px] sm:min-h-[46px] bg-white hover:bg-slate-100/80 active:bg-slate-200/60 text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 font-sora font-semibold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-xs active:scale-[0.99] transition-all flex justify-center items-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Daftar dengan Google</span>
            </button>
          </div>
        </template>

        <!-- Tautan Menuju Login -->
        <div class="pt-2 border-t border-slate-100 text-center text-xs text-slate-500 font-sans">
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
import { useToast } from '@/composables/useToast';
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

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
// Toggle visibilitas tombol autentikasi Google (di-hide sementara, ubah ke true untuk mengaktifkan kembali)
const showGoogleAuth = ref(false);

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
    toast.error('Konfirmasi kata sandi tidak cocok.');
    return;
  }

  if (form.password.length < 8) {
    toast.error('Kata sandi minimal 8 karakter.');
    return;
  }

  if (!hasLetters.value || !hasDigits.value) {
    toast.error('Kata sandi harus mengandung kombinasi huruf dan angka.');
    return;
  }

  isLoading.value = true;

  try {
    await authStore.register({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      password_confirmation: form.password_confirmation,
    });

    try {
      localStorage.setItem('bth_pending_verification_email', form.email.trim());
    } catch (e) {}

    toast.success('Pendaftaran akun berhasil. Silakan verifikasi email Anda.');
    router.push({
      path: '/verify-otp',
      query: { email: form.email, sent: 'true' },
    });
  } catch (err) {
    if (err.code === 'ERR_NETWORK' || !err.response) {
      toast.error('Tidak dapat terhubung ke server autentikasi. Pastikan koneksi internet aktif.');
      return;
    }
    const data = err.response?.data;
    if (data?.error_code === 'EMAIL_TAKEN' || data?.error_code === 'EMAIL_ALREADY_EXISTS') {
      toast.error('Alamat email sudah terdaftar di sistem. Silakan gunakan email lain atau masuk ke akun Anda.');
      return;
    }
    if (data?.error_code === 'VALIDATION_ERROR' && data?.errors) {
      const errList = Object.entries(data.errors).map(([field, msgs]) => {
        const fieldName = field === 'full_name' ? 'Nama' : field === 'phone' ? 'Nomor HP' : field === 'password' ? 'Kata Sandi' : field;
        return `${fieldName}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`;
      });
      toast.error(errList.length > 0 ? errList.join(' | ') : (data.message || 'Data pendaftaran belum memenuhi syarat validasi server.'));
      return;
    }
    toast.error(data?.message || 'Pendaftaran belum dapat diproses. Mohon periksa kembali formulir Anda.');
  } finally {
    isLoading.value = false;
  }
};

// Handler Pendaftaran Google (Siap dihubungkan ke Google Identity Client & Backend)
const handleGoogleAuth = () => {
  toast.info(
    'Integrasi Pendaftaran dengan Google sedang dipersiapkan untuk rilis berikutnya. Silakan lengkapi formulir pendaftaran email Anda terlebih dahulu.',
    'Google Sign-Up'
  );
};
</script>
