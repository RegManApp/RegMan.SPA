import axiosInstance from "./axiosInstance";

export const scheduleSlotApi = {
  getAll: () => axiosInstance.get("/scheduleslot"),
  getByRoom: (roomId) => axiosInstance.get(`/scheduleslot/room/${roomId}`),
};

export default scheduleSlotApi;
