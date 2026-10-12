<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
    <!-- Top Bar Navigasi Sederhana -->
    <header class="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white font-sora font-extrabold text-sm shadow-sm group-hover:bg-[#172554] transition-colors">
          BTH
        </div>
        <div>
          <div class="font-sora font-bold text-slate-900 text-sm tracking-tight leading-none">
            Universitas Bakti Tunas Husada
          </div>
          <div class="text-[11px] text-slate-500 font-medium mt-0.5">
            Penerimaan Mahasiswa Baru TA 2026/2027
          </div>
        </div>
      </router-link>

      </div>
    </header>

    <!-- Main Container Card -->
    <main class="w-full max-w-md mx-auto my-auto py-8">
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
        <!-- Top Accent Strip -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-indigo-600"></div>

        <div class="p-6 sm:p-8 space-y-6">
          <!-- Header Judul -->
          <div class="text-center space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-semibold">
              <GraduationCap class="w-3.5 h-3.5" />
              <span>Portal Khusus Mitra Guru BK</span>
            </div>
            <h1 class="font-sora font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tight">
              Masuk Dashboard Guru BK
            </h1>
            <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Monitoring pendaftaran siswa, verifikasi kode referal sekolah, dan rekapitulasi komisi kemitraan PMB BTH.
            </p>
          </div>

          <!-- Alert Error -->
          <div
            v-if="errorMessage"
            class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn"
          >
            <AlertCircle class="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div class="leading-relaxed">{{ errorMessage }}</div>
          </div>

          <!-- Form Login -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Identifier Field -->
            <div class="space-y-1.5">
              <label for="bk-identifier" class="block text-xs font-semibold text-slate-700">
                Kode Referal, Username, atau Email Sekolah
              </label>
              <div class="relative">
                <input
                  id="bk-identifier"
                  v-model="identifier"
                  type="text"
                  required
                  autocomplete="username"
                  placeholder="Contoh: SMKCONTOH01 atau nurjanah.bk"
                  class="w-full pl-3.5 pr-10 py-2.5 bg-slate-50/60 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-900 font-sans outline-none transition-all"
                />
                <User class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p class="text-[11px] text-slate-400">
                Gunakan kredensial yang telah diterbitkan oleh Administrator PMB.
              </p>
            </div>

            <!-- Password Field -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="bk-password" class="block text-xs font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  @click="showForgotPasswordNotice"
                  class="text-[11px] font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  Lupa Sandi?
                </button>
              </div>
              <div class="relative">
                <input
                  id="bk-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="current-password"
                  placeholder="Masukkan kata sandi akun Guru BK"
                  class="w-full pl-3.5 pr-10 py-2.5 bg-slate-50/60 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-900 font-sans outline-none transition-all"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                  :title="showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'"
                >
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Tombol Submit -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-2.5 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <LogIn v-else class="w-4 h-4" />
              <span>{{ isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard Guru BK' }}</span>
            </button>
          </form>

          <!-- Kotak Bantuan Kemitraan -->
          <div class="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <div class="flex items-center gap-1.5 font-semibold text-slate-800">
              <ShieldCheck class="w-4 h-4 text-[#1E3A8A]" />
              <span>Akses Terkendali Panitia PMB</span>
            </div>
            <p class="text-[11px] text-slate-500">
              Akun Guru BK diterbitkan khusus oleh Administrator PMB Universitas BTH untuk mitra sekolah binaan. Hubungi sekretariat PMB jika memerlukan akun baru.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Institusional -->
    <footer class="w-full max-w-5xl mx-auto text-center py-3 text-xs text-slate-400">
      &copy; 2026 Universitas Bakti Tunas Husada. Biro Administrasi Akademik & Kemahasiswaan.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useReferralStore } from '@/stores/referral';
import { useToast } from '@/composables/useToast';
import {
  GraduationCap,
  User,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-vue-next';

const router = useRouter();
const referralStore = useReferralStore();
const toast = useToast();

const identifier = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  if (!identifier.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Silakan isi identitas akun dan kata sandi Anda.';
    return;
  }

  isLoading.value = true;
  try {
    // Simulasi delay autentikasi
    await new Promise((r) => setTimeout(r, 400));
    
    const result = referralStore.loginBk(identifier.value, password.value);
    if (result.success) {
      toast.success(result.message);
      router.push('/bk');
    } else {
      errorMessage.value = result.message;
      toast.error(result.message);
    }
  } catch (err) {
    errorMessage.value = 'Terjadi kesalahan sistem saat memproses login. Silakan coba kembali.';
  } finally {
    isLoading.value = false;
  }
};

const showForgotPasswordNotice = () => {
  toast.info(
    'Pengaturan ulang kata sandi Guru BK dikelola terpusat oleh Biro Kerjasama & PMB Universitas BTH di nomor WhatsApp 0821-1710-0200.'
  );
};
</script>
