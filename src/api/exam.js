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

  // === CR-003 CBT Online Endpoints ===
  async getServerTime() {
    return apiClient.get('/exam/time');
  },

  async getMyCBTExams() {
    return apiClient.get('/exam/cbt/me/exams');
  },

  async getCBTExamDetail(examId) {
    return apiClient.get(`/exam/cbt/me/exams/${examId}`);
  },

  async startCBTAttempt(examId) {
    return apiClient.post(`/exam/cbt/me/exams/${examId}/start`);
  },

  async getActiveAttempt(attemptId) {
    return apiClient.get(`/exam/cbt/me/attempts/${attemptId}`);
  },

  async saveCBTAnswer(attemptId, payload) {
    return apiClient.post(`/exam/cbt/me/attempts/${attemptId}/answers`, payload);
  },

  async submitCBTAttempt(attemptId) {
    return apiClient.post(`/exam/cbt/me/attempts/${attemptId}/submit`);
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
