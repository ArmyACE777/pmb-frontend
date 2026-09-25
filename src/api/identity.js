import { apiClient } from './client';

/**
 * Identity Service API Client (identity-service & ocr-service)
 * Mengelola profil biodata calon mahasiswa, alamat, data orang tua, riwayat pendidikan, serta OCR KTP
 */
export const identityApi = {
  // === Calon Mahasiswa Endpoints ===
  async getProfile() {
    return apiClient.get('/identity/me/profile');
  },

  async updateProfile(data) {
    return apiClient.put('/identity/me/profile', data);
  },

  async getAddresses() {
    return apiClient.get('/identity/me/addresses');
  },

  async updateAddress(data) {
    return apiClient.put('/identity/me/addresses', data);
  },

  async getGuardians() {
    return apiClient.get('/identity/me/guardians');
  },

  async updateGuardian(data) {
    return apiClient.put('/identity/me/guardians', data);
  },

  async getEducation() {
    return apiClient.get('/identity/me/education');
  },

  async updateEducation(data) {
    return apiClient.put('/identity/me/education', data);
  },

  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    return apiClient.put('/identity/me/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getCompleteness() {
    return apiClient.get('/identity/me/completeness');
  },

  // === OCR KTP Pipeline ===
  async scanKtp(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/identity/me/ktp-scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getKtpScanStatus(scanId) {
    return apiClient.get(`/identity/me/ktp-scan/${scanId}`);
  },

  async confirmKtpScan(scanId, data) {
    return apiClient.post(`/identity/me/ktp-scan/${scanId}/confirm`, data);
  },

  // === Admin Endpoints ===
  async getPersonDetail(userId) {
    return apiClient.get(`/identity/admin/persons/${userId}`);
  },
};
