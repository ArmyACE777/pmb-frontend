import { apiClient } from './client';

/**
 * Selection Service API Client (selection-service)
 * Mengelola rekomendasi kelulusan prodi, persetujuan pimpinan, dan pengumuman SK / Surat Penerimaan (LoA)
 */
export const selectionApi = {
  // === Calon Mahasiswa Endpoints ===
  async getMyResult() {
    return apiClient.get('/selection/me/result');
  },

  // === Admin & Panitia Seleksi Endpoints ===
  async getResults(params = {}) {
    return apiClient.get('/selection/admin/results', { params });
  },

  async publishResults(payload) {
    return apiClient.post('/selection/admin/publish', payload);
  },

  async getProgramRecommendations(params = {}) {
    return apiClient.get('/selection/program/recommendations', { params });
  },

  async submitProgramRecommendations(payload) {
    return apiClient.post('/selection/program/recommendations', payload);
  },

  async decideApproval(payload) {
    return apiClient.post('/selection/approval/decide', payload);
  },
};
