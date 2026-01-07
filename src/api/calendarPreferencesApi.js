import axiosInstance from "./axiosInstance";

export const getCalendarPreferences = async () => {
  const response = await axiosInstance.get("/calendar/preferences");
  return response.data;
};

export const updateCalendarPreferences = async (payload) => {
  const response = await axiosInstance.put("/calendar/preferences", payload);
  return response.data;
};

export const calendarPreferencesApi = {
  get: getCalendarPreferences,
  update: updateCalendarPreferences,
};

export default calendarPreferencesApi;
