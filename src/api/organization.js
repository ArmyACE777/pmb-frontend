import { apiClient } from './client';

/**
 * Organization Service API Client
 * Mengakses master data Fakultas & Program Studi sesuai spesifikasi PRD Fase 2 (service: organization-service)
 */

export const organizationApi = {
  // === PUBLIC ENDPOINTS ===

  /**
   * Mengambil daftar fakultas (opsional filter ?is_active=true)
   */
  async getFaculties(params = {}) {
    return apiClient.get('/organization/faculties', { params });
  },

  /**
   * Mengambil daftar program studi (opsional filter ?faculty_code=FT&is_active=true)
   */
  async getStudyPrograms(params = {}) {
    return apiClient.get('/organization/study-programs', { params });
  },

  /**
   * Mengambil detail program studi berdasarkan kode unik (misal: 'TI', 'FARM')
   */
  async getStudyProgramByCode(code) {
    return apiClient.get(`/organization/study-programs/${encodeURIComponent(code)}`);
  },

  // === ADMIN ENDPOINTS (Role: superadmin / admin_pmb) ===

  /**
   * Menambahkan fakultas baru
   */
  async createFaculty(data) {
    return apiClient.post('/organization/admin/faculties', data);
  },

  /**
   * Memperbarui data fakultas
   */
  async updateFaculty(id, data) {
    return apiClient.put(`/organization/admin/faculties/${id}`, data);
  },

  /**
   * Toggle status aktif/non-aktif fakultas
   */
  async toggleFaculty(id) {
    return apiClient.patch(`/organization/admin/faculties/${id}/toggle`);
  },

  /**
   * Menambahkan program studi baru
   */
  async createStudyProgram(data) {
    return apiClient.post('/organization/admin/study-programs', data);
  },

  /**
   * Memperbarui data program studi
   */
  async updateStudyProgram(id, data) {
    return apiClient.put(`/organization/admin/study-programs/${id}`, data);
  },

  /**
   * Toggle status aktif/non-aktif program studi
   */
  async toggleStudyProgram(id) {
    return apiClient.patch(`/organization/admin/study-programs/${id}/toggle`);
  },
};
