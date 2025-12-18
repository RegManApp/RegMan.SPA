import axiosInstance from './axiosInstance';

export const instructorApi = {
  // Get all instructors with pagination and filtering
  // Query: firstName?, lastName?, email?, departmentId?, pageNumber=1, pageSize=10
  getAll: (params = {}) => {
    return axiosInstance.get('/instructors', { params });
  },

  // Get instructor by ID
  getById: (id) => {
    return axiosInstance.get(`/instructors/${id}`);
  },

  // Create new instructor (Admin only)
  // Request: { email, password, firstName, lastName, phoneNumber?, dateOfBirth, address?, city?, hireDate, departmentId? }
  create: (instructorData) => {
    return axiosInstance.post('/instructors', instructorData);
  },

  // Update instructor (Admin only)
  // Request: { id, firstName?, lastName?, phoneNumber?, dateOfBirth?, address?, city?, hireDate?, departmentId? }
  update: (id, instructorData) => {
    return axiosInstance.put(`/instructors/${id}`, { id: Number(id), ...instructorData });
  },

  // Delete instructor (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/instructors/${id}`);
  },
};

export default instructorApi;
