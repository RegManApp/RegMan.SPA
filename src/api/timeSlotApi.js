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

  // Get time slots by room
  getByRoom: (roomId) => {
    return axiosInstance.get(`/timeslot/room/${roomId}`);
  },

  // Delete time slot (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/timeslot/${id}`);
  },
};

// No changes needed, API is correct for TimeSlotPage usage

export default timeSlotApi;
