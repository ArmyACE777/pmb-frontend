import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '@/api/client';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token') || null);
  const refreshToken = ref(localStorage.getItem('refresh_token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const isLoading = ref(false);
  const error = ref(null);
  const errorCode = ref(null);
  const fieldErrors = ref({});

  const token = computed(() => accessToken.value);
  const isAuthenticated = computed(() => !!accessToken.value);
  const currentUser = computed(() => user.value);
  const userRoles = computed(() => user.value?.roles || []);
  const userScopes = computed(() => user.value?.scopes || []);
  const isSuperAdmin = computed(() => userRoles.value.includes('superadmin'));

  const decodedToken = computed(() => {
    if (!accessToken.value) return null;
    try {
      return jwtDecode(accessToken.value);
    } catch {
      return null;
    }
  });

  const clearApiError = () => {
    error.value = null;
    errorCode.value = null;
    fieldErrors.value = {};
  };

  const setApiError = (err, defaultMsg) => {
    error.value = err.response?.data?.message || defaultMsg;
    errorCode.value = err.response?.data?.error_code || null;
    fieldErrors.value = err.response?.data?.errors || {};
  };

  const setAuth = (data) => {
    if (data.access_token) {
      accessToken.value = data.access_token;
      localStorage.setItem('access_token', data.access_token);
    }
    if (data.refresh_token) {
      refreshToken.value = data.refresh_token;
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    if (data.user) {
      user.value = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const clearAuth = () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const register = async (form) => {
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.post('/auth/register', form);
      return res.data;
    } catch (err) {
      setApiError(err, 'Pendaftaran gagal');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const verifyOtp = async (email, otp) => {
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.post('/auth/verify', { email, otp });
      if (res.data?.data) {
        setAuth(res.data.data);
      }
      return res.data;
    } catch (err) {
      setApiError(err, 'Verifikasi OTP gagal');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resendOtp = async (email) => {
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.post('/auth/resend-otp', { email });
      return res.data;
    } catch (err) {
      setApiError(err, 'Gagal mengirim ulang OTP');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email, password) => {
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.data) {
        setAuth(res.data.data);
      }
      return res.data;
    } catch (err) {
      setApiError(err, 'Login gagal');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const refreshSession = async () => {
    if (!refreshToken.value) throw new Error('No refresh token available');
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken.value,
      });
      if (res.data?.data) {
        setAuth(res.data.data);
      }
      return res.data;
    } catch (err) {
      setApiError(err, 'Sesi berakhir');
      clearAuth();
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const forgotPassword = async (email) => {
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      setApiError(err, 'Gagal mengirim email reset password');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (payloadOrToken, password, passwordConfirmation) => {
    isLoading.value = true;
    clearApiError();
    let data;
    if (typeof payloadOrToken === 'object' && payloadOrToken !== null) {
      data = payloadOrToken;
    } else {
      data = {
        token: payloadOrToken,
        password: password,
        password_confirmation: passwordConfirmation,
      };
    }
    try {
      const res = await apiClient.post('/auth/reset-password', data);
      return res.data;
    } catch (err) {
      setApiError(err, 'Gagal mereset kata sandi');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProfile = async () => {
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.get('/auth/me');
      if (res.data?.data) {
        user.value = res.data.data;
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
      return res.data;
    } catch (err) {
      setApiError(err, 'Gagal mengambil profil');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfile = async (payload) => {
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.put('/auth/profile', payload);
      if (res.data?.data) {
        user.value = { ...user.value, ...res.data.data };
        localStorage.setItem('user', JSON.stringify(user.value));
      }
      return res.data;
    } catch (err) {
      setApiError(err, 'Gagal memperbarui profil');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const changePassword = async (payload) => {
    isLoading.value = true;
    clearApiError();
    try {
      const res = await apiClient.put('/auth/password', payload);
      return res.data;
    } catch (err) {
      setApiError(err, 'Gagal mengganti kata sandi');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {
        refresh_token: refreshToken.value || '',
      });
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      clearAuth();
    }
  };

  const logoutAll = async () => {
    try {
      await apiClient.post('/auth/logout-all');
    } catch (e) {
      console.warn('Logout All API error:', e);
    } finally {
      clearAuth();
    }
  };

  // JWKS Public Key Inspector
  const fetchJwks = async () => {
    const res = await apiClient.get('/auth/.well-known/jwks.json');
    return res.data;
  };

  // Admin Endpoints (Role: superadmin)
  const getAdminRoles = async () => {
    const res = await apiClient.get('/auth/admin/roles');
    return res.data;
  };

  const listAdminUsers = async (params = {}) => {
    const res = await apiClient.get('/auth/admin/users', { params });
    return res.data;
  };

  const createAdminUser = async (payload) => {
    const res = await apiClient.post('/auth/admin/users', payload);
    return res.data;
  };

  const updateAdminUser = async (id, payload) => {
    const res = await apiClient.put(`/auth/admin/users/${id}`, payload);
    return res.data;
  };

  const updateAdminUserRoles = async (id, roles) => {
    const res = await apiClient.put(`/auth/admin/users/${id}/roles`, { roles });
    return res.data;
  };

  const updateAdminUserStatus = async (id, status) => {
    const res = await apiClient.patch(`/auth/admin/users/${id}/status`, { status });
    return res.data;
  };

  return {
    accessToken,
    refreshToken,
    token,
    user,
    isLoading,
    error,
    errorCode,
    fieldErrors,
    isAuthenticated,
    currentUser,
    userRoles,
    userScopes,
    isSuperAdmin,
    decodedToken,
    clearApiError,
    setAuth,
    clearAuth,
    register,
    verifyOtp,
    resendOtp,
    login,
    refreshSession,
    forgotPassword,
    resetPassword,
    fetchProfile,
    updateProfile,
    changePassword,
    logout,
    logoutAll,
    fetchJwks,
    getAdminRoles,
    listAdminUsers,
    createAdminUser,
    updateAdminUser,
    updateAdminUserRoles,
    updateAdminUserStatus,
  };
});
