import axiosInstance from "./axiosInstance";

export const getReminderRules = async () => {
  const response = await axiosInstance.get("/notifications/reminder-rules");
  return response.data;
};

export const updateReminderRules = async (rules) => {
  const response = await axiosInstance.put(
    "/notifications/reminder-rules",
    rules
  );
  return response.data;
};

export const reminderRulesApi = {
  get: getReminderRules,
  update: updateReminderRules,
};

export default reminderRulesApi;
