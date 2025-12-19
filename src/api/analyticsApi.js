import axiosInstance from "./axiosInstance";

export const analyticsApi = {
  // Get dashboard overview stats (Admin only)
  getDashboard: () => {
    return axiosInstance.get("/analytics/dashboard");
  },

  // Get enrollment trends (last 30 days)
  getEnrollmentTrends: () => {
    return axiosInstance.get("/analytics/enrollment-trends");
  },

  // Get course statistics
  getCourseStats: () => {
    return axiosInstance.get("/analytics/course-stats");
  },

  // Get GPA distribution
  getGPADistribution: () => {
    return axiosInstance.get("/analytics/gpa-distribution");
  },

  // Get credits distribution
  getCreditsDistribution: () => {
    return axiosInstance.get("/analytics/credits-distribution");
  },

  // Get instructor statistics
  getInstructorStats: () => {
    return axiosInstance.get("/analytics/instructor-stats");
  },

  // Get recent activity
  getRecentActivity: (limit = 20) => {
    return axiosInstance.get("/analytics/recent-activity", {
      params: { limit },
    });
  },

  // Get section capacity stats
  getSectionCapacity: () => {
    return axiosInstance.get("/analytics/section-capacity");
  },

  // Get system summary for admin dashboard
  getSystemSummary: () => {
    return axiosInstance.get("/analytics/system-summary");
  },
};

export default analyticsApi;
