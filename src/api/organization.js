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
   * Toggle status aktif/non-aktif fakultas (PATCH /organization/admin/faculties/:id)
   */
  async toggleFaculty(id, isActive) {
    return apiClient.patch(`/organization/admin/faculties/${id}`, { is_active: isActive });
  },

  /**
   * Nonaktifkan fakultas melalui PATCH /organization/admin/faculties/:id
   */
  async deleteFaculty(id) {
    return apiClient.patch(`/organization/admin/faculties/${id}`, { is_active: false });
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
   * Toggle status aktif/non-aktif program studi (PATCH /organization/admin/study-programs/:id)
   */
  async toggleStudyProgram(id, isActive) {
    return apiClient.patch(`/organization/admin/study-programs/${id}`, { is_active: isActive });
  },

  /**
   * Nonaktifkan program studi melalui PATCH /organization/admin/study-programs/:id
   */
  async deleteStudyProgram(id) {
    return apiClient.patch(`/organization/admin/study-programs/${id}`, { is_active: false });
  },
};
