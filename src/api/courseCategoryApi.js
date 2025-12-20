import axiosInstance from "./axiosInstance";

export const courseCategoryApi = {
  // Get all course categories (from CourseCategory enum)
  getAll: () => {
    return axiosInstance.get("/coursecategories");
  },

  // Get category by ID
  getById: (id) => {
    return axiosInstance.get(`/coursecategories/${id}`);
  },
};

export default courseCategoryApi;
