import { apiClient } from './client';

/**
 * Exam Service API Client (exam-service)
 * Mengelola sesi CBT dan wawancara, kartu peserta ujian digital, dan presensi ujian
 */
export const examApi = {
  // === Calon Mahasiswa Endpoints ===
  async getMySchedule() {
    return apiClient.get('/exam/me/schedule');
  },

  async getMySessions() {
    return apiClient.get('/exam/me/schedule');
  },

  async getMyExamCard() {
    return apiClient.get('/exam/me/card');
  },

  // === Admin & Penguji Endpoints ===
  async getSessions(params = {}) {
    return apiClient.get('/exam/admin/sessions', { params });
  },

  async createSession(data) {
    return apiClient.post('/exam/admin/sessions', data);
  },

  async recordAttendance(sessionId, data) {
    return apiClient.post(`/exam/admin/sessions/${sessionId}/attendance`, data);
  },
};
