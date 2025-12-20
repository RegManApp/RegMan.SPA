import axiosInstance from "./axiosInstance";

export const timeSlotApi = {
  // Get all time slots
  getAll: () => {
    return axiosInstance.get("/timeslot");
  },

  // Create time slot (Admin only)
  create: (timeSlotData) => {
    return axiosInstance.post("/timeslot", timeSlotData);
  },

  // Delete time slot (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/timeslot/${id}`);
  },
};

export default timeSlotApi;
