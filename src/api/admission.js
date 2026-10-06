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

  // CR-004 / CR-010: Stepper Progres & Dashboard Terpadu
  async getMyProgress() {
    return apiClient.get('/admission/applications/me/progress');
  },

  async getMyDashboard() {
    return apiClient.get('/admission/applications/me/dashboard');
  },

  // CR-002: Riwayat Multi-Pendaftaran, Eligibility, & Pembatalan
  async getMyHistory() {
    return apiClient.get('/admission/applications/me/history');
  },

  async getEligibility() {
    return apiClient.get('/admission/applications/me/eligibility');
  },

  async cancelApplication(reason = '') {
    return apiClient.post('/admission/applications/me/cancel', { reason });
  },

  // CR-006: Pindah Jalur / Pilihan Prodi
  async requestPathChange(payload) {
    const formatChoiceUUID = (id) => {
      if (!id) return null;
      if (typeof id === 'string' && id.includes('-') && id.length === 36) return id;
      const num = parseInt(id) || 1;
      return `00000000-0000-0000-0000-${String(num).padStart(12, '0')}`;
    };

    const pathId = parseInt(payload.path_id || payload.target_path_id || payload.new_path_id || payload.newPathId) || 1;
    const body = {
      path_id: pathId,
      target_path_id: pathId,
      new_path_id: pathId,
      first_choice_program: formatChoiceUUID(payload.first_choice_program || payload.choice1_id || payload.choice1Id),
      choice1_id: formatChoiceUUID(payload.first_choice_program || payload.choice1_id || payload.choice1Id),
      second_choice_program: formatChoiceUUID(payload.second_choice_program || payload.choice2_id || payload.choice2Id),
      choice2_id: formatChoiceUUID(payload.second_choice_program || payload.choice2_id || payload.choice2Id),
      reason: payload.reason || 'Permohonan pindah jalur pendaftaran',
    };
    return apiClient.post('/admission/applications/me/path-change', body);
  },

  async getMyChanges(params = {}) {
    return apiClient.get('/admission/applications/me/changes', { params });
  },

  async cancelPendingPathChange() {
    return apiClient.delete('/admission/applications/me/path-change/pending');
  },

  async getMyPendingPathChange() {
    return apiClient.get('/admission/applications/me/path-change/pending');
  },

  // CR-007: Pengunduran Diri Resmi Mahasiswa
  async withdrawApplication(payload) {
    const body = {
      reason_category: payload.reasonCategory || payload.reason_category || 'other',
      reason_text: payload.reasonText || payload.reason || payload.reason_text || 'Pengunduran diri calon mahasiswa',
      reason: payload.reason || payload.reasonText || '',
      agree_statement: true,
      password: payload.password || '',
      bank_name: payload.bankName || payload.bank_name || '',
      bank_account_number: payload.bankAccountNumber || payload.bank_account_number || '',
      bank_account_holder: payload.bankAccountHolder || payload.bank_account_holder || '',
    };
    return apiClient.post('/admission/applications/me/withdrawal', body);
  },

  async getMyWithdrawal() {
    return apiClient.get('/admission/applications/me/withdrawal');
  },

  async cancelPendingWithdrawal() {
    return apiClient.delete('/admission/applications/me/withdrawal/pending');
  },

  async getWithdrawalLetterPDF() {
    return apiClient.get('/admission/applications/me/withdrawal/letter', { responseType: 'blob' });
  },

  async getWithdrawalVerification(code) {
    return apiClient.get(`/admission/withdrawals/verify/${code}`);
  },

  // === Admin Endpoints ===
  async getApplications(params = {}) {
    return apiClient.get('/admission/admin/applications', { params });
  },

  async getApplicationDetail(id) {
    return apiClient.get(`/admission/admin/applications/${id}`);
  },

  async verifyDocument(applicationId, payload) {
    const statusMap = {
      verified: 'valid',
      valid: 'valid',
      invalid: 'invalid',
      rejected: 'invalid',
      revision: 'revision',
    };
    const backendStatus = statusMap[payload.status] || payload.status || 'valid';
    const note = payload.notes || payload.note || '';
    const docId = payload.document_id || payload.documentId || applicationId;
    const body = {
      reviews: payload.reviews || [
        {
          document_id: docId,
          status: backendStatus,
          notes: note,
        },
      ],
      status: backendStatus,
      notes: note,
    };
    return apiClient.post(`/admission/admin/applications/${applicationId}/verify`, body);
  },

  // CR-006: Review Permohonan Pindah Jalur
  async getPathChanges(params = {}) {
    return apiClient.get('/admission/admin/path-change-requests', { params });
  },

  async reviewPathChange(id, payload) {
    const note = payload.notes || payload.note || (payload.status === 'approved' ? 'Disetujui' : 'Ditolak');
    if (payload.status === 'approved') {
      return apiClient.post(`/admission/admin/path-change-requests/${id}/approve`, { note });
    }
    return apiClient.post(`/admission/admin/path-change-requests/${id}/reject`, { note });
  },

  // CR-007: Review Permohonan Pengunduran Diri
  async getWithdrawals(params = {}) {
    return apiClient.get('/admission/admin/withdrawals', { params });
  },

  async reviewWithdrawal(id, payload) {
    const note = payload.notes || payload.note || (payload.status === 'approved' ? 'Disetujui' : 'Ditolak');
    if (payload.status === 'approved') {
      return apiClient.post(`/admission/admin/withdrawals/${id}/approve`, { note });
    }
    return apiClient.post(`/admission/admin/withdrawals/${id}/reject`, { note });
  },

  // CR-009: Antrean Dokumen, Overview, & Dashboard Institusional
  async getDocumentQueue(params = {}) {
    return apiClient.get('/admission/admin/document-queue', { params });
  },

  async getOverview(params = {}) {
    return apiClient.get('/admission/admin/overview', { params });
  },

  async getInstitutionDashboard(params = {}) {
    return apiClient.get('/admission/admin/institution-dashboard', { params });
  },
};
