import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) return '/login';
        if (authStore.isAdmin) return '/admin';
        if (authStore.isMarketing) return '/marketing';
        if (authStore.isBkPartner) return '/bk';
        return '/dashboard';
      },
    },
    // Satu Pintu Masuk Tunggal untuk Seluruh Pengguna
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: () => import('@/views/VerifyOtpView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    // Redirect /bk/login ke Satu Pintu /login
    {
      path: '/bk/login',
      redirect: '/login',
    },
    // 1. Dashboard Calon Mahasiswa (Akses Terisolasi: Calon Mahasiswa)
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, applicantOnly: true },
    },
    {
      path: '/onboarding-wa',
      name: 'onboarding-wa',
      component: () => import('@/views/OnboardingWaView.vue'),
      meta: { requiresAuth: true, applicantOnly: true },
    },
    // 2. Dashboard Mitra Guru BK (Akses Terisolasi: Guru BK & Mitra Sekolah)
    {
      path: '/bk',
      name: 'bk-dashboard',
      component: () => import('@/views/BkDashboardView.vue'),
      meta: { requiresAuth: true, bkOnly: true },
    },
    // 2b. Dashboard Tim Marketing Lapangan (Akses Terisolasi: Tim Marketing PMB)
    {
      path: '/marketing',
      name: 'marketing-dashboard',
      component: () => import('@/views/MarketingDashboardView.vue'),
      meta: { requiresAuth: true, marketingOnly: true },
    },
    // 3. Dashboard Admin PMB (Akses Terisolasi: Panitia, Keuangan, & Superadmin)
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    // 4. Rancangan CMS Terpisah / Content Studio (Arsitektur Mandiri)
    {
      path: '/cms',
      name: 'cms-portal',
      component: () => import('@/views/CmsPortalView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 1. Guard Autentikasi Umum: Jika route butuh login dan pengguna belum login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({
      name: 'login',
      query: to.fullPath !== '/' && to.fullPath !== '/dashboard' ? { redirect: to.fullPath } : {},
    });
  }

  // 2. Guard Halaman Tamu (/login, /register): Jika SUDAH login, arahkan ke dashboard masing-masing secara otomatis
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    if (authStore.isAdmin) return next({ name: 'admin-dashboard' });
    if (authStore.isMarketing) return next({ name: 'marketing-dashboard' });
    if (authStore.isBkPartner) return next({ name: 'bk-dashboard' });
    return next({ name: 'dashboard' });
  }

  // 3. Guard Isolasi Keamanan Dashboard Admin (/admin)
  // Calon Mahasiswa, Marketing, & Guru BK DILARANG KERAS mengakses meja kerja admin
  if (to.meta.adminOnly) {
    const hasAdminRole = authStore.isAdmin;
    if (!hasAdminRole) {
      if (authStore.isMarketing) {
        return next({ name: 'marketing-dashboard', query: { unauthorized: 'admin' } });
      }
      if (authStore.isBkPartner) {
        return next({ name: 'bk-dashboard', query: { unauthorized: 'admin' } });
      }
      return next({ name: 'dashboard', query: { unauthorized: 'admin' } });
    }
  }

  // 4. Guard Isolasi Keamanan Dashboard Mitra Guru BK (/bk)
  if (to.meta.bkOnly) {
    const canAccessBk = authStore.isBkPartner || authStore.isAdmin;
    if (!canAccessBk) {
      return next({ name: 'dashboard', query: { unauthorized: 'bk' } });
    }
  }

  // 4b. Guard Isolasi Keamanan Dashboard Tim Marketing (/marketing)
  if (to.meta.marketingOnly) {
    const canAccessMarketing = authStore.isMarketing || authStore.isAdmin;
    if (!canAccessMarketing) {
      return next({ name: 'dashboard', query: { unauthorized: 'marketing' } });
    }
  }

  // 5. Guard Isolasi Keamanan Dashboard Calon Mahasiswa (/dashboard)
  if (to.meta.applicantOnly) {
    if ((authStore.isBkPartner || authStore.isMarketing) && !authStore.isAdmin) {
      if (authStore.isMarketing) {
        return next({ name: 'marketing-dashboard', query: { unauthorized: 'applicant' } });
      }
      return next({ name: 'bk-dashboard', query: { unauthorized: 'applicant' } });
    }
  }

  // 6. Guard Onboarding WhatsApp (Khusus Pengguna Baru Terdaftar Mahasiswa)
  const userEmail = authStore.currentUser?.email || localStorage.getItem('bth_auth_user_email') || 'applicant';
  const needsOnboarding = localStorage.getItem(`bth_needs_onboarding_${userEmail}`) === 'true';
  const hasJoinedWa = localStorage.getItem(`bth_wa_group_joined_${userEmail}`) === 'true';

  if (to.name === 'dashboard' && !authStore.isAdmin && !authStore.isBkPartner && !authStore.isMarketing) {
    if (needsOnboarding && !hasJoinedWa && !to.query.skip_wa) {
      return next({ name: 'onboarding-wa' });
    }
  }

  if (to.name === 'onboarding-wa') {
    if (!needsOnboarding || hasJoinedWa) {
      return next({ name: 'dashboard' });
    }
  }

  next();
});

export default router;
