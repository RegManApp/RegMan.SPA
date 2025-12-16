import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  login: (credentials) => api.post('/api/Auth/login', credentials),
  register: (userData) => api.post('/api/Auth/register', userData),
};

// Admin endpoints
export const adminService = {
  getStats: () => api.get('/api/Admin/stats'),
  getUsers: () => api.get('/api/Admin/users'),
  deleteUser: (id) => api.delete(`/api/Admin/users/${id}`),
  assignRole: (userId, role) => api.post(`/api/Admin/users/${userId}/role`, { role }),
};

// Course endpoints
export const courseService = {
  getAll: () => api.get('/api/Course'),
  getById: (id) => api.get(`/api/Course/${id}`),
  create: (course) => api.post('/api/Course', course),
  update: (id, course) => api.put(`/api/Course/${id}`, course),
  delete: (id) => api.delete(`/api/Course/${id}`),
  enroll: (courseId) => api.post(`/api/Course/${courseId}/enroll`),
  unenroll: (courseId) => api.delete(`/api/Course/${courseId}/enroll`),
};

export default api;
