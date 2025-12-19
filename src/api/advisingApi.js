import axiosInstance from "./axiosInstance";

export const advisingApi = {
  // Get pending enrollments (Instructor/Admin only)
  getPendingEnrollments: (params = {}) => {
    return axiosInstance.get("/advising/pending", { params });
  },

  // Approve enrollment (Instructor/Admin only)
  approveEnrollment: (enrollmentId) => {
    return axiosInstance.post(`/advising/${enrollmentId}/approve`);
  },

  // Decline enrollment with reason (Instructor/Admin only)
  declineEnrollment: (enrollmentId, reason) => {
    return axiosInstance.post(`/advising/${enrollmentId}/decline`, { reason });
  },

  // Get all enrollments for advisors
  getAllEnrollments: (params = {}) => {
    return axiosInstance.get("/advising/enrollments", { params });
  },

  // Get advising stats
  getStats: () => {
    return axiosInstance.get("/advising/stats");
  },
};

export default advisingApi;
