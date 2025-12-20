import axiosInstance from "./axiosInstance";

export const roomApi = {
  // Get all rooms
  getAll: () => {
    return axiosInstance.get("/room");
  },

  // Get room by ID
  getById: (id) => {
    return axiosInstance.get(`/room/${id}`);
  },

  // Create room (Admin only)
  create: (roomData) => {
    return axiosInstance.post("/room", roomData);
  },

  // Update room (Admin only)
  update: (roomData) => {
    return axiosInstance.put("/room", roomData);
  },

  // Delete room (Admin only)
  delete: (id) => {
    return axiosInstance.delete(`/room/${id}`);
  },
};

export default roomApi;
