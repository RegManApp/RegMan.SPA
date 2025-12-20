import axiosInstance from "./axiosInstance";

export const courseApi = {
  // Get all courses with filtering and pagination
  // Query: page?, pageSize?, search?, courseName?, creditHours?, courseCode?, courseCategoryId?
  getAll: (params = {}) => {
    return axiosInstance.get("/course", { params });
  },

  // Get available courses (alias for getAll)
  getAvailable: (params = {}) => {
    return axiosInstance.get("/course", { params });
  },

  // Get course by ID (detailed)
  getById: (id) => {
    return axiosInstance.get(`/course/${id}`);
  },

  // Create new course (Admin only)
  // Request: { courseName, courseCode, creditHours, courseCategory (enum string or int), description? }
  create: (courseData) => {
    return axiosInstance.post("/course", courseData);
  },

  // Update course (Admin only)
  // Request: { courseId, courseName?, courseCode?, creditHours?, courseCategory?, description? }
  update: (id, courseData) => {
    return axiosInstance.put("/course", {
      courseId: Number(id),
      ...courseData,
    });
  },

  // Delete course (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/course/${id}`);
  },
};

export default courseApi;
