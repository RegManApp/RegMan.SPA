import axiosInstance from "./axiosInstance";

const gpaApi = {
  // Get current student's GPA and enrollments
  getMyGPA: () => {
    return axiosInstance.get("/gpa/my");
  },

  // Get student's GPA (Admin only)
  getStudentGPA: (studentId) => {
    return axiosInstance.get(`/gpa/student/${studentId}`);
  },

  // Update a grade for an enrollment
  updateGrade: (enrollmentId, grade) => {
    return axiosInstance.put(`/gpa/enrollment/${enrollmentId}/grade`, {
      grade,
    });
  },

  // Simulate GPA
  simulate: (simulatedCourses, studentId = null) => {
    return axiosInstance.post("/gpa/simulate", {
      simulatedCourses,
      studentId,
    });
  },
};

export default gpaApi;
