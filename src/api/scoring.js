import { apiClient } from './client';

/**
 * Scoring Service API Client (scoring-service)
 * Mengelola penilaian ujian CBT, nilai wawancara dosen penguji, dan perankingan seleksi
 */
export const scoringApi = {
  async getScores(params = {}) {
    return apiClient.get('/scoring/admin/scores', { params });
  },

  async submitScore(payload) {
    return apiClient.post('/scoring/admin/scores', payload);
  },

  async getComponents(params = {}) {
    return apiClient.get('/scoring/admin/components', { params });
  },

  async createComponent(payload) {
    return apiClient.post('/scoring/admin/components', payload);
  },

  async getExaminerScores() {
    return apiClient.get('/scoring/examiner/scores');
  },

  async submitExaminerScore(applicationId, payload) {
    return apiClient.put(`/scoring/examiner/scores/${applicationId}`, payload);
  },
};
