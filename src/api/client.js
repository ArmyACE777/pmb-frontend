/**
 * Mendeteksi URL dasar API secara dinamis:
 * 1. Jika VITE_API_BASE_URL disetel ke URL produksi non-localhost, gunakan itu.
 * 2. Jika diakses di domain publik (misal pelita.pkm.asia, vercel.app, dll.),
 *    secara dinamis mengikat ke origin domain aktif saat ini (`${origin}/api/v1`).
 * 3. Jika di localhost / dev, gunakan VITE_API_BASE_URL atau 'http://localhost:8000/api/v1'.
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin } = window.location;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';

    if (!isLocalhost) {
      // Jika disetel ke URL produksi publik eksplisit (bukan localhost), gunakan envUrl
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        return envUrl;
      }
      // Otomatis ikuti domain yang sedang aktif saat ini (misal https://pelita.pkm.asia/api/v1)
      return `${origin}/api/v1`;
    }
  }

  return envUrl || 'http://localhost:8000/api/v1';
};

export const baseURL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export let lastRequestId = null;

// Request Interceptor: Attach Access Token & Ensure Dynamic BaseURL
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && window.location) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isLocal && config.baseURL && (config.baseURL.includes('localhost') || config.baseURL.includes('127.0.0.1'))) {
        config.baseURL = getApiBaseUrl();
      }
    }
    const token = localStorage.getItem('access_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh on TOKEN_EXPIRED
apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.request_id) {
      lastRequestId = response.data.request_id;
    }
    return response;
  },
  async (error) => {
    if (error.response?.data?.request_id) {
      lastRequestId = error.response.data.request_id;
    }
    const originalRequest = error.config;
    const errorCode = error.response?.data?.error_code;

    // Handle 401 TOKEN_EXPIRED
    if (error.response?.status === 401 && errorCode === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${getApiBaseUrl()}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken, user } = response.data.data;
        localStorage.setItem('access_token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 401 TOKEN_REVOKED, TOKEN_INVALID, or invalid session on authenticated endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register');
    const isAdminEndpoint = originalRequest.url?.includes('/auth/admin');
    const isRevokedToken = ['TOKEN_REVOKED', 'TOKEN_INVALID', 'TOKEN_MISSING'].includes(errorCode);

    if (error.response?.status === 401 && !isAuthEndpoint && !isAdminEndpoint && isRevokedToken && errorCode !== 'GATEWAY_SIGNATURE_INVALID') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session=revoked';
      }
    }

    return Promise.reject(error);
  }
);
