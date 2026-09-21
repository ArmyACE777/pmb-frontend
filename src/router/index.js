import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore();
        return authStore.isAuthenticated ? '/dashboard' : '/login';
      },
    },
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
      meta: { guestOnly: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue'),
      meta: { requiresAuth: true, adminOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 1. Guard Autentikasi Umum: Jika butuh login tetapi belum login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({
      name: 'login',
      query: to.fullPath !== '/' && to.fullPath !== '/dashboard' ? { redirect: to.fullPath } : {},
    });
  }

  // 2. Guard Halaman Tamu (Login / Register): Jika sudah login, arahkan ke dashboard yang sesuai
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: authStore.isSuperAdmin ? 'admin-dashboard' : 'dashboard' });
  }

  // 3. Guard Khusus Panitia / Superadmin (/admin)
  if (to.meta.adminOnly) {
    const adminRoles = ['superadmin', 'admin', 'panitia', 'verifikator', 'keuangan', 'penguji', 'pimpinan'];
    const hasAdminRole =
      authStore.isSuperAdmin ||
      (authStore.userRoles && authStore.userRoles.some((r) => adminRoles.includes(r)));

    const isDemoModeAllowed =
      localStorage.getItem('bth_allow_demo_admin') === 'true' || to.query.demo === 'true';

    if (!hasAdminRole && !isDemoModeAllowed) {
      return next({ name: 'dashboard', query: { unauthorized: 'admin' } });
    }
  }

  next();
});

export default router;
