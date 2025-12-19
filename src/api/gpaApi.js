import axiosInstance from "./axiosInstance";

const gpaApi = {
  simulate: (simulatedCourses) => {
    return axiosInstance.post("/gpa/simulate", { simulatedCourses });
  },
};

export default gpaApi;
