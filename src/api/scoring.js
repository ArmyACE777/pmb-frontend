import { apiClient } from './client';

/**
 * Scoring Service API Client (scoring-service)
 * Mengelola penilaian ujian CBT, nilai wawancara dosen penguji, dan perankingan seleksi
 */
export const scoringApi = {
  async getComponents(params = {}) {
    return apiClient.get('/scoring/admin/components', { params });
  },

  async createComponent(payload) {
    return apiClient.post('/scoring/admin/components', payload);
  },

  async getParticipantScores(applicationId) {
    return apiClient.get(`/scoring/examiner/scores/${applicationId}`);
  },

  async getRecap(params = {}) {
    return apiClient.get('/scoring/program/recap', { params });
  },

  async submitExaminerScore(applicationId, payload) {
    if (typeof applicationId === 'object' && applicationId !== null) {
      const id = applicationId.application_id || applicationId.applicant_id || applicationId.id;
      return apiClient.put(`/scoring/examiner/scores/${id}`, applicationId);
    }
    return apiClient.put(`/scoring/examiner/scores/${applicationId}`, payload);
  },
};
