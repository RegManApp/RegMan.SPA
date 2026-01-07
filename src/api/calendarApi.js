import axiosInstance from "./axiosInstance";

// Helper to format time from ISO string
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper to transform backend events to frontend format
const transformEvents = (backendEvents) => {
  if (!Array.isArray(backendEvents)) return [];

  return backendEvents.map((event) => ({
    ...event,
    // Add date property from start for calendar grid matching
    date: event.start
      ? new Date(event.start).toISOString().split("T")[0]
      : null,
    // Format times for display
    startTime: formatTime(event.start),
    endTime: formatTime(event.end),
    // Map backend properties to frontend expected properties
    location: event.extendedProps?.room || null,
    instructorName: event.extendedProps?.instructorName || null,
    description:
      event.extendedProps?.purpose || event.extendedProps?.courseCode || null,
  }));
};

const toIsoDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
};

const transformViewEvents = (backendEvents) => {
  if (!Array.isArray(backendEvents)) return [];

  return backendEvents.map((event) => {
    const start = event.startUtc || event.start || event.StartUtc || null;
    const end = event.endUtc || event.end || event.EndUtc || null;

    return {
      ...event,
      start,
      end,
      date: toIsoDate(start),
      startTime: formatTime(start),
      endTime: formatTime(end),
      location: event.extendedProps?.room || event.extendedProps?.Room || null,
      instructorName:
        event.extendedProps?.instructorName ||
        event.extendedProps?.InstructorName ||
        null,
      description:
        event.extendedProps?.purpose ||
        event.extendedProps?.courseCode ||
        event.extendedProps?.CourseCode ||
        null,
    };
  });
};

// Get all calendar events for the current user
export const getCalendarEvents = async (params = {}) => {
  const response = await axiosInstance.get("/calendar/events", { params });
  // Backend returns { events: [], dateRange: {} }
  const events = response.data?.events || response.data || [];
  return transformEvents(events);
};

// Get today's events
export const getTodayEvents = async () => {
  const response = await axiosInstance.get("/calendar/today");
  const events = response.data?.events || response.data || [];
  return transformEvents(events);
};

// Get upcoming events (next 7 days)
export const getUpcomingEvents = async () => {
  const response = await axiosInstance.get("/calendar/upcoming");
  const events = response.data?.events || response.data || [];
  return transformEvents(events);
};

export const calendarApi = {
  getCalendarEvents,
  getTodayEvents,
  getUpcomingEvents,
  getCalendarView: async (params = {}) => {
    const response = await axiosInstance.get("/calendar/view", { params });
    const view = response.data;
    return {
      viewRole: view?.viewRole,
      dateRange: view?.dateRange,
      conflicts: Array.isArray(view?.conflicts) ? view.conflicts : [],
      events: transformViewEvents(
        Array.isArray(view?.events) ? view.events : []
      ),
    };
  },
  getTimeline: async () => {
    const response = await axiosInstance.get("/calendar/timeline");
    return response.data;
  },
};

export default calendarApi;
