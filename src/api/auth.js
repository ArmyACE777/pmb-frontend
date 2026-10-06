import { apiClient } from './client';

export const authApi = {
  // === Current User Permissions (CR-009) ===
  async getMyPermissions() {
    return apiClient.get('/auth/me/permissions');
  },

  // === RBAC Admin Endpoints (CR-009) ===
  async getRoles() {
    return apiClient.get('/auth/admin/roles');
  },

  async getPermissions() {
    return apiClient.get('/auth/admin/permissions');
  },

  async getRolePermissions(roleCode) {
    return apiClient.get(`/auth/admin/roles/${roleCode}/permissions`);
  },

  async updateRolePermissions(roleCode, permissions) {
    return apiClient.put(`/auth/admin/roles/${roleCode}/permissions`, { permissions });
  },

  async getAdminUsers(params = {}) {
    return apiClient.get('/auth/admin/users', { params });
  },

  async createAdminUser(data) {
    return apiClient.post('/auth/admin/users', data);
  },

  async updateUserRoles(userId, roles) {
    return apiClient.put(`/auth/admin/users/${userId}/roles`, { roles });
  },
};
