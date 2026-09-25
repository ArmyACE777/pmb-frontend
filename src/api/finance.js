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

  async requestInstallment(invoiceId, payload) {
    return apiClient.post(`/invoices/me/${invoiceId}/installment-request`, payload);
  },

  async getInstallments(invoiceId) {
    return apiClient.get(`/invoices/me/${invoiceId}/installments`);
  },

  async getReceipt(paymentId) {
    return apiClient.get(`/receipts/me/${paymentId}`);
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

  async getInstallmentRequests(params = {}) {
    return apiClient.get('/finance/admin/installment-requests', { params });
  },

  async reviewInstallmentRequest(id, payload) {
    return apiClient.post(`/finance/admin/installment-requests/${id}/review`, payload);
  },

  async verifyManualPayment(id, payload) {
    return apiClient.post(`/finance/admin/payments/${id}/verify`, payload);
  },
};

