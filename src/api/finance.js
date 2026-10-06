import { apiClient } from './client';

/**
 * Finance Service API Client (finance-service & CR-001 Duitku)
 * Mengelola tagihan (formulir & UKT), pembayaran VA/QRIS Duitku, cicilan (installments), dan kuitansi resmi
 */
export const financeApi = {
  // === Calon Mahasiswa Endpoints ===
  async getMyInvoices() {
    return apiClient.get('/invoices/me');
  },

  async getInvoiceDetail(invoiceId) {
    return apiClient.get(`/invoices/me/${invoiceId}`);
  },

  async payInvoice(invoiceId, payload = {}) {
    return apiClient.post(`/invoices/me/${invoiceId}/pay`, payload);
  },

  async payWithManualTransfer(invoiceId, formData) {
    return apiClient.post(`/invoices/me/${invoiceId}/manual-transfer`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getPaymentDetail(invoiceId, paymentId) {
    return apiClient.get(`/invoices/me/${invoiceId}/payments/${paymentId}`);
  },

  // CR-004: Polling status instan pembayaran Duitku POP
  async getPaymentStatus(invoiceId, paymentId) {
    return apiClient.get(`/invoices/me/${invoiceId}/payments/${paymentId}/status`);
  },

  // CR-011: Konfigurasi & Kanal Pembayaran Duitku POP
  async getPaymentConfig() {
    return apiClient.get('/finance/payment-config').catch(() => apiClient.get('/payment-config'));
  },

  async getPaymentMethods(amount = 250000) {
    return apiClient.get(`/finance/payment-methods?amount=${amount}`).catch(() => apiClient.get(`/payment-methods?amount=${amount}`));
  },

  // CR-002: Pembatalan tagihan sebelum pembayaran
  async cancelInvoice(invoiceId) {
    return apiClient.post(`/invoices/me/${invoiceId}/cancel`);
  },

  async requestInstallment(invoiceId, payload) {
    return apiClient.post(`/invoices/me/${invoiceId}/installment-request`, payload);
  },

  async getInstallments(invoiceId) {
    return apiClient.get(`/invoices/me/${invoiceId}/installments`);
  },

  async getReceipt(paymentId) {
    return apiClient.get(`/receipts/me/${paymentId}`);
  },

  // CR-010: Tampilan kuitansi resmi formulir / pendaftaran
  async getReceiptView(invoiceId) {
    return apiClient
      .get(`/invoices/me/${invoiceId}/receipt-view`)
      .catch(() => apiClient.get(`/finance/me/invoices/${invoiceId}/receipt-view`));
  },

  // CR-010: Perbarui tagihan kedaluwarsa (jatuh tempo 3 hari kerja)
  async renewInvoice(invoiceId) {
    return apiClient
      .post(`/invoices/me/${invoiceId}/renew`)
      .catch(() => apiClient.post(`/finance/me/invoices/${invoiceId}/renew`));
  },

  async simulatePaymentPaid(paymentId) {
    return apiClient.post(`/dev/payments/${paymentId}/simulate-paid`);
  },

  // Fallback alias
  async simulatePaymentSuccess(id) {
    return apiClient.post(`/dev/payments/${id}/simulate-paid`);
  },

  // === Admin Keuangan Endpoints ===
  async getFinancialReportsSummary(params = {}) {
    return apiClient.get('/finance/admin/reports/summary', { params });
  },

  // CR-009: Rekonsiliasi Keuangan & Virtual Account
  async getReconciliation(params = {}) {
    return apiClient.get('/finance/admin/reconciliation', { params });
  },

  async manualConfirmPayment(invoiceId, payload = {}) {
    return apiClient.post(`/finance/admin/invoices/${invoiceId}/manual-confirm`, payload);
  },

  // CR-009: Buku Besar Kas Masuk
  async getLedger(params = {}) {
    return apiClient.get('/finance/admin/ledger', { params });
  },

  async getFeeSchemes() {
    return apiClient.get('/finance/admin/fee-schemes');
  },

  async reconcilePayments(payload = {}) {
    return apiClient.post('/finance/admin/reconcile', payload);
  },

  // CR-010: Permohonan Cicilan UKT
  async getInstallmentRequests(params = {}) {
    return apiClient.get('/finance/admin/installment-requests', { params });
  },

  async reviewInstallmentRequest(id, payload) {
    return apiClient.post(`/finance/admin/installment-requests/${id}/review`, payload);
  },

  async verifyManualPayment(id, payload) {
    return apiClient.post(`/finance/admin/payments/${id}/verify`, payload);
  },

  // CR-007: Review Pengembalian Dana (Refund) Mahasiswa Mengundurkan Diri
  async getRefundReviews(params = {}) {
    return apiClient.get('/finance/admin/refund-reviews', { params });
  },

  async updateRefundReview(id, payload) {
    return apiClient.patch(`/finance/admin/refund-reviews/${id}`, payload);
  },
};

