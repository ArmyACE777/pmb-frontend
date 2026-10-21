<template>
  <AuthLayout
    headline="Masuk ke Portal PMB"
    subheadline="Satu pintu akses untuk Calon Mahasiswa, Mitra Guru BK, dan Administrator PMB."
  >
    <div class="w-full space-y-4">
      <form @submit.prevent="handleLogin" class="space-y-3">
        <!-- Input Identitas Akun (Satu Pintu: Email / Kode BK / Username) -->
        <div>
          <label for="email" class="block font-sans font-medium text-slate-700 text-xs mb-1">
            Email atau Username
          </label>
          <input
            id="email"
            v-model="email"
            type="text"
            placeholder="Masukkan alamat email atau username Anda"
            required
            class="w-full px-3.5 py-2 h-10 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans placeholder:text-slate-400"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block font-sans font-medium text-slate-700 text-xs mb-1">
            Kata Sandi
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Masukkan kata sandi akun Anda"
              required
              class="w-full px-3.5 pr-10 py-2 h-10 bg-white border border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 rounded-xl outline-none text-xs sm:text-sm text-slate-900 transition-all font-sans placeholder:text-slate-400"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              tabindex="-1"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer"
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
        </div>

        <!-- Ingat Saya & Lupa Sandi Row -->
        <div class="flex items-center justify-between pt-0.5">
          <label class="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="w-3.5 h-3.5 rounded text-[#1E3A8A] focus:ring-[#1E3A8A] border-slate-300"
            />
            <span class="text-xs text-slate-600 font-sans">Ingat perangkat ini</span>
          </label>
          <RouterLink
            :to="{ path: '/forgot-password', query: email ? { email } : {} }"
            class="text-xs text-[#2563EB] hover:text-[#1E3A8A] hover:underline font-sans"
          >
            Lupa sandi?
          </RouterLink>
        </div>

        <!-- Submit Button -->
        <div class="pt-1.5">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 sm:py-3.5 px-4 min-h-[46px] sm:min-h-[48px] bg-[#1E3A8A] hover:bg-[#172554] text-white font-sora font-semibold text-sm rounded-xl shadow-xs hover:shadow-sm active:scale-[0.99] transition-all flex justify-center items-center gap-2.5 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!isLoading">Masuk ke Portal</span>
            <span v-else class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin text-white" />
              <span>Memverifikasi Akses...</span>
            </span>
          </button>
        </div>

        <!-- Tombol Masuk dengan Google & Divider (Disembunyikan sementara, kode tetap dipertahankan) -->
        <template v-if="showGoogleAuth">
          <!-- Pembatas / Divider (Rapi & Tepat di Tengah) -->
          <div class="flex items-center my-2 sm:my-2.5">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="px-3 text-[11px] font-sans font-medium text-slate-400">
              atau
            </span>
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <!-- Tombol Masuk dengan Google (Clean & Resmi) -->
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
              <span>Masuk dengan Google</span>
            </button>
          </div>
        </template>

        <!-- Tautan Registrasi Akun Calon Mahasiswa Baru -->
        <div class="pt-2 border-t border-slate-100 text-center text-xs text-slate-500 font-sans">
          <span>Calon mahasiswa baru belum memiliki akun?</span>
          <RouterLink
            to="/register"
            class="font-semibold text-[#1E3A8A] hover:text-[#2563EB] hover:underline ml-1 font-sora"
          >
            Daftar Akun Baru
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
import { useReferralStore } from '@/stores/referral';
import { useToast } from '@/composables/useToast';
import { admissionApi } from '@/api/admission';
import { referralApi } from '@/api/referral';
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const referralStore = useReferralStore();
const toast = useToast();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
// Toggle visibilitas tombol autentikasi Google (di-hide sementara, ubah ke true untuk mengaktifkan kembali)
const showGoogleAuth = ref(false);


onMounted(() => {
  if (route.query.registered === 'true') {
    toast.success('Akun Anda berhasil diverifikasi. Silakan masuk ke portal.');
  }
  if (route.query.reset === 'true') {
    toast.success('Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru.');
  }
  if (route.query.session === 'revoked') {
    toast.warning('Sesi Anda telah berakhir. Silakan masuk kembali.');
  }
  if (route.query.logout === 'true') {
    toast.info('Anda telah keluar dari akun.');
  }
  if (route.query.unauthorized === 'admin') {
    toast.error('Akses ditolak: Anda tidak memiliki izin untuk membuka Meja Kerja Administrator.');
  }
  if (route.query.unauthorized === 'bk') {
    toast.error('Akses ditolak: Halaman khusus mitra Guru BK.');
  }
  if (route.query.unauthorized === 'marketing') {
    toast.error('Akses ditolak: Halaman khusus Tim Marketing Lapangan.');
  }
});

const handleLogin = async () => {
  isLoading.value = true;
  const inputIdent = String(email.value).trim();
  const inputPass = String(password.value).trim();

  try {
    // 0. Sinkronisasikan data referal terbaru dari server / shared sync
    try {
      await referralStore.syncFromSharedServer();
    } catch (e) {}

    // 1. Cek terlebih dahulu apakah kredensial cocok dengan akun Tim Marketing Lapangan
    const knownMarketing = referralStore.findMarketingByIdentifier(inputIdent);
    if (knownMarketing) {
      const mktResult = referralStore.loginMarketing(inputIdent, inputPass);
      if (mktResult.success) {
        authStore.setMarketingUser(mktResult.partner);
        toast.success(mktResult.message);
        router.push('/marketing');
        return;
      } else {
        toast.error(mktResult.message);
        return;
      }
    }

    // 2. Cek apakah kredensial cocok dengan akun Mitra Guru BK
    let knownBkPartner = referralStore.findPartnerByIdentifier(inputIdent);
    if (!knownBkPartner) {
      referralStore.reloadFromStorage();
      knownBkPartner = referralStore.findPartnerByIdentifier(inputIdent);
    }

    if (knownBkPartner) {
      const bkResult = referralStore.loginBk(inputIdent, inputPass);
      if (bkResult.success) {
        authStore.setBkUser(bkResult.partner);
        toast.success(bkResult.message);
        router.push('/bk');
        return;
      } else {
        toast.error(bkResult.message);
        return;
      }
    }

    // 2.2 Cek apakah inputIdent merupakan Kode Referal atau Username yang terdaftar di database backend
    if (!knownMarketing && !knownBkPartner) {
      const cleanCode = inputIdent.replace(/^(bk_|mkt_)/i, '').toUpperCase().trim();
      try {
        const checkRes = await referralApi.checkCode(cleanCode);
        const codeData = checkRes.data?.data || checkRes.data;
        if (codeData?.valid) {
          const isMkt = cleanCode.startsWith('MKT-') || inputIdent.toLowerCase().startsWith('mkt');
          const instName = codeData.institution_name || (isMkt ? 'Tim Marketing Lapangan' : 'Sekolah Mitra PMB');
          const partner = referralStore.addReferral({
            code: cleanCode,
            institution: instName,
            schoolName: instName,
            category: isMkt ? 'marketing' : 'guru_bk',
            username: isMkt ? `mkt_${cleanCode.toLowerCase()}` : `bk_${cleanCode.toLowerCase()}`,
            email: isMkt ? `marketing_${cleanCode.toLowerCase()}@bth.ac.id` : `${cleanCode.toLowerCase()}@sekolah.sch.id`,
            password: inputPass,
            status: 'active',
          });
          if (isMkt) {
            const mktResult = referralStore.loginMarketing(cleanCode, inputPass);
            if (mktResult.success) {
              authStore.setMarketingUser(mktResult.partner);
              toast.success(mktResult.message);
              router.push('/marketing');
              return;
            }
          } else {
            const bkResult = referralStore.loginBk(cleanCode, inputPass);
            if (bkResult.success) {
              authStore.setBkUser(bkResult.partner);
              toast.success(bkResult.message);
              router.push('/bk');
              return;
            }
          }
        }
      } catch (e) {}
    }

    // 2.5 Kredensial Akun Dummy Standar untuk Pengujian Lokal & Meja Kerja (Offline Resilient)
    const cleanLowerIdent = inputIdent.toLowerCase();

    // Akun Administrator PMB / Superadmin:
    if (
      cleanLowerIdent === 'admin@bth.ac.id' ||
      cleanLowerIdent === 'admin' ||
      cleanLowerIdent === 'superadmin' ||
      cleanLowerIdent === 'admin_pmb'
    ) {
      if (inputPass === 'admin123' || inputPass === 'password123' || inputPass === 'admin') {
        const adminUser = {
          id: '00000000-0000-0000-0000-000000000001',
          full_name: 'Administrator PMB BTH',
          name: 'Administrator PMB BTH',
          email: 'admin@bth.ac.id',
          roles: ['superadmin', 'admin_pmb', 'panitia', 'keuangan', 'verifikator'],
          role: 'superadmin',
          status: 'active',
        };
        authStore.setAuth({
          access_token: 'mock_verified_admin_token',
          refresh_token: 'mock_verified_admin_refresh_token',
          user: adminUser,
        });
        localStorage.setItem('bth_allow_demo_admin', 'true');
        toast.success(`Selamat datang, ${adminUser.full_name}! Masuk ke Meja Kerja PMB.`);
        router.push('/admin');
        return;
      }
    }

    // Akun Calon Mahasiswa (Portal PMB):
    if (
      cleanLowerIdent === 'camaba@gmail.com' ||
      cleanLowerIdent === 'calon.maba@gmail.com' ||
      cleanLowerIdent === 'camaba' ||
      cleanLowerIdent === 'ujang@gmail.com' ||
      cleanLowerIdent === 'dinda@gmail.com'
    ) {
      if (inputPass === 'camaba123' || inputPass === 'password123' || inputPass === '123456' || inputPass === 'camaba') {
        const applicantUser = {
          id: '32d44743-7a7a-4d22-9e65-56f63f6d91e0',
          full_name: 'Dinda Ayu Lestari',
          name: 'Dinda Ayu Lestari',
          email: 'camaba@gmail.com',
          roles: ['calon_mahasiswa'],
          role: 'calon_mahasiswa',
          status: 'active',
        };
        authStore.setAuth({
          access_token: 'mock_verified_applicant_token',
          refresh_token: 'mock_verified_applicant_refresh_token',
          user: applicantUser,
        });

        // Inisialisasi initial state pendaftar jika belum ada di localStorage
        const appKey = `bth_applicant_v3_${applicantUser.id}`;
        if (!localStorage.getItem(appKey)) {
          const initData = {
            candidate: {
              fullName: 'Dinda Ayu Lestari',
              nik: '3278011204040008',
              nisn: '0061284918',
              email: 'camaba@gmail.com',
              phone: '081234567890',
              birthPlace: 'Tasikmalaya',
              birthDate: '2004-05-12',
              gender: 'Perempuan',
              religion: 'Islam',
              schoolName: 'SMK MARHAS MARGAHAYU',
              registrationNumber: 'BTH-2026-REG-09182',
            },
            admission: {
              track: 'Reguler Tes CBT',
              prodi1: 'S1 Farmasi',
              prodi2: 'S1 Administrasi Rumah Sakit',
              prodi1Degree: 'S1',
              prodi1Faculty: 'Fakultas Farmasi',
              status: 'Pendaftaran Selesai (Dapat Diubah)',
              backendStatus: 'submitted',
            },
            payments: {
              registrationFee: {
                amount: 250000,
                status: 'unpaid',
                isFree: false,
                statusLabel: 'Menunggu Pembayaran',
                vaNumber: '9881234567890123',
              },
            },
          };
          localStorage.setItem(appKey, JSON.stringify(initData));
        }

        toast.success('Selamat datang di Portal PMB Universitas BTH!');
        router.push('/dashboard');
        return;
      }
    }

    // 3. Autentikasi ke backend API (Admin PMB / Calon Mahasiswa / Guru BK di DB)
    let loginEmail = inputIdent;
    const resolvedPartner = referralStore.findPartnerByIdentifier(inputIdent);
    if (resolvedPartner && resolvedPartner.email) {
      loginEmail = resolvedPartner.email;
    }

    if (!loginEmail.includes('@')) {
      toast.error('Akun atau Kode Referal tidak ditemukan. Pastikan email atau kode yang Anda masukkan sudah benar.');
      isLoading.value = false;
      return;
    }

    await authStore.login(loginEmail, inputPass);

    const userEmail = authStore.currentUser?.email || inputIdent;
    const needsOnboarding = localStorage.getItem(`bth_needs_onboarding_${userEmail}`) === 'true';
    const hasJoinedWa = localStorage.getItem(`bth_wa_group_joined_${userEmail}`) === 'true';

    const redirectUrl = route.query.redirect;
    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (authStore.isAdmin) {
      toast.success(`Selamat datang, ${authStore.currentUser?.full_name || 'Administrator'}! Masuk ke Meja Kerja PMB.`);
      router.push('/admin');
    } else if (authStore.isMarketing) {
      toast.success(`Selamat datang di Dashboard Tim Marketing PMB.`);
      router.push('/marketing');
    } else if (authStore.isBkPartner) {
      let partner = referralStore.findPartnerByIdentifier(userEmail);
      if (!partner) {
        partner = referralStore.createOrEnsureBkPartner({
          email: userEmail,
          full_name: authStore.currentUser?.full_name || authStore.currentUser?.name,
          phone: authStore.currentUser?.phone,
        });
      }
      referralStore.setSessionPartner(partner);
      authStore.setBkUser(partner);
      toast.success(`Selamat datang di Dashboard Mitra Guru BK.`);
      router.push('/bk');
    } else {
      // Pendaftar Calon Mahasiswa: Periksa status onboarding WhatsApp di backend (CR-011)
      let mustOnboard = needsOnboarding && !hasJoinedWa;
      try {
        const onbRes = await admissionApi.getOnboarding();
        if (onbRes?.data?.data?.next === 'wa_group_camaba') {
          mustOnboard = true;
        }
      } catch (e) {
        // Abaikan jika service offline
      }

      if (mustOnboard) {
        toast.info('Selamat datang di Portal PMB! Silakan selesaikan orientasi WhatsApp pendaftar baru.');
        router.push('/onboarding-wa');
      } else {
        toast.success('Selamat datang di Portal PMB Universitas BTH!');
        router.push('/dashboard');
      }
    }
  } catch (err) {
    // Coba fallback cek ke referralStore sekali lagi jika backend mengembalikan error
    try {
      await referralStore.syncFromSharedServer();
      const fallbackBk = referralStore.findPartnerByIdentifier(inputIdent);
      if (fallbackBk) {
        const bkResult = referralStore.loginBk(inputIdent, inputPass);
        if (bkResult.success) {
          authStore.setBkUser(bkResult.partner);
          toast.success(bkResult.message);
          router.push('/bk');
          return;
        }
      }
    } catch {}

    if (err.code === 'ERR_NETWORK' || !err.response) {
      toast.error('Tidak dapat terhubung ke server backend. Pastikan layanan backend aktif.');
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
      toast.error('Terlalu banyak percobaan gagal. Akun dikunci sementara selama 15 menit.');
      return;
    }
    if (data?.error_code === 'ACCOUNT_INACTIVE') {
      toast.error('Akun Anda dinonaktifkan oleh administrator. Silakan hubungi sekretariat PMB.');
      return;
    }
    toast.error(data?.message || 'Email, Kode Referal, atau kata sandi tidak sesuai.');
  } finally {
    isLoading.value = false;
  }
};

// Handler Autentikasi Google (Siap dihubungkan ke Google Identity Client & Backend)
const handleGoogleAuth = () => {
  toast.info(
    'Integrasi Masuk dengan Google sedang dipersiapkan untuk rilis berikutnya. Silakan masuk menggunakan email dan kata sandi Anda terlebih dahulu.',
    'Google Sign-In'
  );
};
</script>
