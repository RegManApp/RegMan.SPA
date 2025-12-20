import axiosInstance from "./axiosInstance";

export const enrollmentApi = {
  // =========================
  // ADMIN ENDPOINTS
  // =========================

  // Get all enrollments with pagination and filtering (Admin)
  // Query: search?, status?, page=1, pageSize=10
  // Route: GET /admin/enrollments
  getAll: (params = {}) => {
    return axiosInstance.get("/admin/enrollments", { params });
  },

  // Get enrollments by student user ID (Admin)
  // Route: GET /admin/students/{studentUserId}/enrollments
  // Note: studentId should be the user's ID (string), not the StudentProfile ID
  getByStudent: (studentUserId) => {
    return axiosInstance.get(`/admin/students/${studentUserId}/enrollments`);
  },

  // Force enroll student in a section (Admin)
  // Route: POST /admin/students/{studentUserId}/force-enroll
  // Request: { sectionId }
  // Can be called with either:
  //   create(studentUserId, sectionId) OR
  //   create({ studentUserId, sectionId })
  create: (studentUserIdOrData, sectionId) => {
    // Support both calling conventions
    if (typeof studentUserIdOrData === "object") {
      const { studentUserId, sectionId: secId } = studentUserIdOrData;
      return axiosInstance.post(
        `/admin/students/${studentUserId}/force-enroll`,
        {
          sectionId: secId,
        }
      );
    }
    return axiosInstance.post(
      `/admin/students/${studentUserIdOrData}/force-enroll`,
      {
        sectionId,
      }
    );
  },

  // =========================
  // ENROLLMENT CRUD (Admin/Instructor)
  // =========================

  // Get enrollment by ID
  // Route: GET /enrollment/{id}
  getById: (id) => {
    return axiosInstance.get(`/enrollment/${id}`);
  },

  // Update enrollment (grade, status)
  // Route: PUT /enrollment/{id}
  // Request: { grade?, status?, declineReason? }
  update: (id, enrollmentData) => {
    return axiosInstance.put(`/enrollment/${id}`, enrollmentData);
  },

  // Update grade for an enrollment
  // Route: PUT /gpa/enrollment/{enrollmentId}/grade
  // Request: { grade }
  updateGrade: (enrollmentId, grade) => {
    return axiosInstance.put(`/gpa/enrollment/${enrollmentId}/grade`, {
      grade,
    });
  },

  // Delete enrollment (Admin only)
  // Route: DELETE /enrollment/{id}
  delete: (id) => {
    return axiosInstance.delete(`/enrollment/${id}`);
  },

  // Drop enrollment
  // Route: POST /enrollment/{id}/drop
  drop: (id) => {
    return axiosInstance.post(`/enrollment/${id}/drop`);
  },

  // Approve enrollment (Admin only)
  // Route: POST /enrollment/{id}/approve
  approve: (id) => {
    return axiosInstance.post(`/enrollment/${id}/approve`);
  },

  // Decline enrollment (Admin only)
  // Route: POST /enrollment/{id}/decline
  // Request: { reason? }
  decline: (id, reason = null) => {
    return axiosInstance.post(`/enrollment/${id}/decline`, { reason });
  },

  // =========================
  // STUDENT CART ENDPOINTS
  // =========================

  // Get current student's enrollments
  // Route: GET /cart/my-enrollments
  getMyEnrollments: () => {
    return axiosInstance.get("/cart/my-enrollments");
  },

  // Add section to cart by scheduleSlotId (Student)
  // Route: POST /cart?scheduleSlotId={scheduleSlotId}
  addToCartByScheduleSlot: (scheduleSlotId) => {
    return axiosInstance.post(`/cart?scheduleSlotId=${scheduleSlotId}`);
  },

  // Add to cart by courseId - finds first available section (Student)
  // Route: POST /cart/by-course/{courseId}
  enrollInCourse: (courseId) => {
    return axiosInstance.post(`/cart/by-course/${courseId}`);
  },

  // Get cart contents (Student)
  // Route: GET /cart
  getCart: () => {
    return axiosInstance.get("/cart");
  },

  // Checkout cart - enroll in all cart items (Student)
  // Route: POST /cart/checkout (or /cart/enroll)
  checkout: () => {
    return axiosInstance.post("/cart/checkout");
  },

  // Remove item from cart (Student)
  // Route: DELETE /cart/{cartItemId}
  removeFromCart: (cartItemId) => {
    return axiosInstance.delete(`/cart/${cartItemId}`);
  },
};

export default enrollmentApi;
