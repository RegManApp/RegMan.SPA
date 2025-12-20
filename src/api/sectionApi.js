import axiosInstance from "./axiosInstance";

export const sectionApi = {
  // Get all sections with optional filters
  getAll: (params = {}) => {
    return axiosInstance.get("/section", { params });
  },

  // Get section by ID
  getById: (id) => {
    return axiosInstance.get(`/section/${id}`);
  },

  // Create section (Admin only)
  create: (sectionData) => {
    return axiosInstance.post("/section", sectionData);
  },

  // Update section (Admin only)
  update: (sectionData) => {
    return axiosInstance.put("/section", sectionData);
  },

  // Delete section (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/section/${id}`);
  },
};

export default sectionApi;
