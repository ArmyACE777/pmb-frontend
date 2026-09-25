import { apiClient } from './client';

/**
 * Student Service API Client (student-service)
 * Mengelola pendaftaran ulang (daftar ulang fisik & KTM), ukuran almamater, dan status onboarding mahasiswa
 */
export const studentApi = {
  // === Calon Mahasiswa Endpoints ===
  async getMyReregistration() {
    return apiClient.get('/student/me/reregistration');
  },

  async getMyStatus() {
    return apiClient.get('/student/me/reregistration');
  },

  async updateReregistration(payload) {
    return apiClient.put('/student/me/reregistration', payload);
  },

  async completeReregistration() {
    return apiClient.post('/student/me/reregistration/complete');
  },

  async submitReregistration(payload) {
    return apiClient.put('/student/me/reregistration', payload);
  },

  // === Admin Endpoints ===
  async getStudents(params = {}) {
    return apiClient.get('/student/admin/students', { params });
  },

  async verifyReregistration(id, payload) {
    return apiClient.post(`/student/admin/students/${id}/verify`, payload);
  },
};
