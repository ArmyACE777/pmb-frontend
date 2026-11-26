import { apiClient } from './client';

/**
 * NIM Service API Client (nim-service)
 * Mengelola algoritma penomoran NIM otomatis, format sequence aman konkurensi, dan penerbitan NIM
 */
export const nimApi = {
  async getFormats() {
    return apiClient.get('/nim/admin/formats');
  },

  async getIssuances(params = {}) {
    return apiClient.get('/nim/admin/issuances', { params });
  },

  async previewNim(payload) {
    return apiClient.post('/nim/admin/preview', payload);
  },

  async generateNim(payload) {
    return apiClient.post('/nim/admin/generate', payload);
  },
};
