import axiosInstance from './axiosInstance';

export const userApi = {
  // Get all users with pagination and filtering (Admin only)
  // Query: email?, role?, pageNumber=1, pageSize=10
  getAll: (params = {}) => {
    return axiosInstance.get('/users', { params });
  },

  // Get user by ID (Admin only)
  getById: (id) => {
    return axiosInstance.get(`/users/${id}`);
  },

  // Update user (Admin only)
  // Request: { firstName?, lastName?, phoneNumber?, isActive? }
  update: (id, userData) => {
    return axiosInstance.put(`/users/${id}`, userData);
  },

  // Delete user (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/users/${id}`);
  },

  // Update user role (Admin only)
  // Request: { newRole: "Admin" | "Student" | "Instructor" }
  updateRole: (id, newRole) => {
    return axiosInstance.put(`/users/${id}/role`, { newRole });
  },
};

export default userApi;
