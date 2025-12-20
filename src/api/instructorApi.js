import axiosInstance from "./axiosInstance";

export const instructorApi = {
  // Get all instructors
  getAll: (params = {}) => {
    return axiosInstance.get("/instructor", { params });
  },

  // Get instructor by ID
  getById: (id) => {
    return axiosInstance.get(`/instructor/${id}`);
  },

  // Get instructor schedule
  getSchedule: (id) => {
    return axiosInstance.get(`/instructor/${id}/schedule`);
  },

  // Get my schedule (for logged-in instructor)
  getMySchedule: () => {
    return axiosInstance.get("/instructor/my-schedule");
  },

  // Create new instructor (Admin only)
  // Request: { email, password, fullName, title, degree?, department? }
  create: (instructorData) => {
    const { firstName, lastName, ...rest } = instructorData;
    return axiosInstance.post("/instructor", {
      ...rest,
      fullName:
        firstName && lastName
          ? `${firstName} ${lastName}`.trim()
          : rest.fullName,
    });
  },

  // Update instructor (Admin only)
  // Request: { fullName?, email?, title?, degree?, department?, address? }
  update: (id, instructorData) => {
    const { firstName, lastName, ...rest } = instructorData;
    return axiosInstance.put(`/instructor/${id}`, {
      ...rest,
      fullName:
        firstName && lastName
          ? `${firstName} ${lastName}`.trim()
          : rest.fullName,
    });
  },

  // Delete instructor (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/instructor/${id}`);
  },
};

export default instructorApi;
