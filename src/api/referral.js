import { apiClient } from './client';

export const referralApi = {
  // Public check
  async checkCode(code) {
    return apiClient.get(`/referral/codes/${code}/check`);
  },

  // Camaba
  async getMyReferral() {
    return apiClient.get('/referral/me');
  },
  async attachCode(code) {
    return apiClient.put('/referral/me', { code });
  },

  // Partner (Guru BK)
  async getPartnerDashboard() {
    return apiClient.get('/referral/partner/dashboard');
  },
  async getPartnerCodes() {
    return apiClient.get('/referral/partner/codes');
  },

  // Admin
  async getAdminCodes(params = {}) {
    return apiClient.get('/referral/admin/codes', { params });
  },
  async createAdminCode(data) {
    return apiClient.post('/referral/admin/codes', data);
  },
  async getSettings() {
    return apiClient.get('/referral/admin/settings');
  },
};
