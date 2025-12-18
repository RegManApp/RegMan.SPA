import axiosInstance from './axiosInstance';

export const courseCategoryApi = {
  // Get all course categories
  getAll: () => {
    return axiosInstance.get('/coursecategories');
  },

  // Get category by ID
  getById: (id) => {
    return axiosInstance.get(`/coursecategories/${id}`);
  },

  // Create new category (Admin only)
  // Request: { name, description? }
  create: (categoryData) => {
    return axiosInstance.post('/coursecategories', categoryData);
  },

  // Update category (Admin only)
  // Request: { id, name?, description? }
  update: (id, categoryData) => {
    return axiosInstance.put(`/coursecategories/${id}`, { id: Number(id), ...categoryData });
  },

  // Delete category (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/coursecategories/${id}`);
  },
};

export default courseCategoryApi;
