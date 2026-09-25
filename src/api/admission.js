import { apiClient } from './client';

/**
 * Admission Service API Client (admission-service)
 * Mengelola periode pendaftaran, jalur masuk, formulir pendaftaran, dokumen pendaftaran MinIO, dan submit
 */
export const admissionApi = {
  // === Public Endpoints ===
  async getActivePeriods() {
    return apiClient.get('/admission/periods/active');
  },

  async getPaths() {
    return apiClient.get('/admission/paths');
  },

  // === Calon Mahasiswa Endpoints ===
  async getMyApplications() {
    return apiClient.get('/admission/applications/me');
  },

  async getApplicationById(id) {
    return apiClient.get(`/admission/applications/${id}`);
  },

  async createApplication(data) {
    return apiClient.post('/admission/applications', data);
  },

  async updateChoices(applicationId, data) {
    return apiClient.put(`/admission/applications/${applicationId}/choices`, data);
  },

  async uploadDocument(formData) {
    return apiClient.post('/admission/applications/me/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteDocument(code) {
    return apiClient.delete(`/admission/applications/me/documents/${code}`);
  },

  async getDocumentUrl(code) {
    return apiClient.get(`/admission/applications/me/documents/${code}/url`);
  },

  async submitApplication() {
    return apiClient.post('/admission/applications/me/submit');
  },

  // === Admin Endpoints ===
  async getApplications(params = {}) {
    return apiClient.get('/admission/admin/applications', { params });
  },

  async getApplicationDetail(id) {
    return apiClient.get(`/admission/admin/applications/${id}`);
  },

  async verifyDocument(applicationId, payload) {
    return apiClient.post(`/admission/admin/applications/${applicationId}/verify`, payload);
  },
};
