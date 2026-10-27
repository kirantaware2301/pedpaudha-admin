import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8080' : 'https://well-ngo-backend.vercel.app');

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

const ADMIN_ACCESS_TOKEN_KEY = 'uday-admin-access-token';

api.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
  if (accessToken && config.url !== '/admin/auth/login') {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  const isLoginRequest = error.config?.url === '/admin/auth/login';
  if ((error.response?.status === 401 || error.response?.status === 403) && !isLoginRequest) {
    sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
    if (window.location.pathname !== '/login') window.location.replace('/login');
  }
  return Promise.reject(error);
});

export const hasAdminSession = () => Boolean(sessionStorage.getItem(ADMIN_ACCESS_TOKEN_KEY));

export const clearAdminSession = () => sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);

export const AdminApi = {
  login: async (email: string, password: string) => {
    const res = await api.post('/admin/auth/login', { email, password });
    sessionStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, res.data.accessToken);
    return res.data;
  },

  // Overview
  getOverview: async () => {
    const res = await api.get('/admin/overview');
    return res.data;
  },

  // Programs
  getPrograms: async () => {
    const res = await api.get('/admin/programs');
    return res.data;
  },

  createProgram: async (data: any) => {
    const res = await api.post('/admin/programs', data);
    return res.data;
  },

  updateProgram: async (id: number, data: any) => {
    const res = await api.put(`/admin/programs/${id}`, data);
    return res.data;
  },

  uploadProgramImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/admin/programs/upload-image', formData, {
      headers: { 'Content-Type': undefined },
    });
    return res.data;
  },

  toggleProgramActive: async (id: number) => {
    const res = await api.patch(`/admin/programs/${id}/toggle-active`);
    return res.data;
  },

  deleteProgram: async (id: number) => {
    const res = await api.delete(`/admin/programs/${id}`);
    return res.data;
  },

  // Volunteers ("Get Involved")
  getVolunteers: async (status: string = 'ALL') => {
    const res = await api.get(`/admin/volunteers?status=${status}`);
    return res.data;
  },

  updateVolunteerStatus: async (id: number, status: string) => {
    const res = await api.patch(`/admin/volunteers/${id}/status`, { status });
    return res.data;
  },

  deleteVolunteer: async (id: number) => {
    const res = await api.delete(`/admin/volunteers/${id}`);
    return res.data;
  },

  // Contact Inquiries
  getContacts: async (status: string = 'ALL') => {
    const res = await api.get(`/admin/contacts?status=${status}`);
    return res.data;
  },

  updateContactStatus: async (id: number, status: string) => {
    const res = await api.patch(`/admin/contacts/${id}/status`, { status });
    return res.data;
  },

  deleteContact: async (id: number) => {
    const res = await api.delete(`/admin/contacts/${id}`);
    return res.data;
  },

  // Donations
  getDonations: async () => {
    const res = await api.get('/admin/donations');
    return res.data;
  },

  // Events Management
  getEvents: async () => {
    const res = await api.get('/admin/events');
    return res.data;
  },

  createEvent: async (data: any) => {
    const res = await api.post('/admin/events', data);
    return res.data;
  },

  updateEvent: async (id: number, data: any) => {
    const res = await api.put(`/admin/events/${id}`, data);
    return res.data;
  },

  toggleEventPublish: async (id: number) => {
    const res = await api.patch(`/admin/events/${id}/toggle-publish`);
    return res.data;
  },

  deleteEvent: async (id: number) => {
    const res = await api.delete(`/admin/events/${id}`);
    return res.data;
  },

  uploadEventImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/admin/events/upload-image', formData, {
      headers: { 'Content-Type': undefined },
    });
    return res.data;
  },

  getEventRegistrations: async (id: number) => {
    const res = await api.get(`/admin/events/${id}/registrations`);
    return res.data;
  }
};

export default api;
