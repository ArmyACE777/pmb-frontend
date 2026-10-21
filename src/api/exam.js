import { apiClient } from './client';

/**
 * Exam Service API Client (exam-service)
 * Mengelola sesi CBT dan wawancara, bank soal CMS, kartu ujian digital, dan presensi ujian
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

  // === CR-003 CBT Online Calon Mahasiswa ===
  async getServerTime() {
    return apiClient.get('/exam/time');
  },

  async getMyCBTExams() {
    return apiClient.get('/exam/cbt/me/exams');
  },

  async getCBTExamDetail(examId) {
    return apiClient.get(`/exam/cbt/me/exams/${examId}`);
  },

  async startCBTAttempt(examId, accessToken = '') {
    return apiClient.post(`/exam/cbt/me/exams/${examId}/start`, {
      access_token: accessToken,
    });
  },

  async getActiveAttempt(attemptId) {
    return apiClient.get(`/exam/cbt/me/attempts/${attemptId}`);
  },

  async saveCBTAnswer(attemptId, questionId, payload) {
    return apiClient.put(`/exam/cbt/me/attempts/${attemptId}/answers/${questionId}`, payload);
  },

  async recordCBTEvent(attemptId, eventType, metadata = '') {
    return apiClient.post(`/exam/cbt/me/attempts/${attemptId}/events`, {
      type: eventType,
      metadata,
    });
  },

  async submitCBTAttempt(attemptId) {
    return apiClient.post(`/exam/cbt/me/attempts/${attemptId}/submit`);
  },

  async getAttemptResult(attemptId) {
    return apiClient.get(`/exam/cbt/me/attempts/${attemptId}/result`);
  },

  // === Admin & CMS CBT Endpoints ===
  async getQuestionBanks() {
    return apiClient.get('/exam/admin/cbt/banks');
  },

  async getQuestionBank(bankId) {
    return apiClient.get(`/exam/admin/cbt/banks/${bankId}`);
  },

  async createQuestionBank(data) {
    return apiClient.post('/exam/admin/cbt/banks', data);
  },

  async updateQuestionBank(bankId, data) {
    return apiClient.put(`/exam/admin/cbt/banks/${bankId}`, data);
  },

  async deleteQuestionBank(bankId) {
    return apiClient.delete(`/exam/admin/cbt/banks/${bankId}`);
  },

  async getQuestions(bankId) {
    return apiClient.get('/exam/admin/cbt/questions', { params: { bank_id: bankId } });
  },

  async getQuestion(questionId) {
    return apiClient.get(`/exam/admin/cbt/questions/${questionId}`);
  },

  async createQuestion(data) {
    return apiClient.post('/exam/admin/cbt/questions', data);
  },

  async updateQuestion(questionId, data) {
    return apiClient.put(`/exam/admin/cbt/questions/${questionId}`, data);
  },

  async deleteQuestion(questionId) {
    return apiClient.delete(`/exam/admin/cbt/questions/${questionId}`);
  },

  async getCBTExams() {
    return apiClient.get('/exam/admin/cbt/exams');
  },

  async getCBTExam(examId) {
    return apiClient.get(`/exam/admin/cbt/exams/${examId}`);
  },

  async createCBTExam(data) {
    return apiClient.post('/exam/admin/cbt/exams', data);
  },

  async updateCBTExam(examId, data) {
    return apiClient.put(`/exam/admin/cbt/exams/${examId}`, data);
  },

  async publishCBTExam(examId) {
    return apiClient.post(`/exam/admin/cbt/exams/${examId}/publish`);
  },

  async getExamAttempts(examId) {
    return apiClient.get(`/exam/admin/cbt/exams/${examId}/attempts`);
  },

  async resetAttempt(attemptId, reason) {
    return apiClient.post(`/exam/admin/cbt/attempts/${attemptId}/reset`, { reason });
  },

  async extendAttempt(attemptId, minutes, reason) {
    return apiClient.post(`/exam/admin/cbt/attempts/${attemptId}/extend`, { minutes, reason });
  },

  // === Sesi & Presensi ===
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

