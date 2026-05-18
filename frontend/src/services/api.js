import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL
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
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const verify2FA = (email, code) =>
  api.post('/auth/verify-2fa', { email, code }).then((r) => r.data);

export const registerUser = (data) =>
  api.post('/usuario/save', data).then((r) => r.data);

export const registerClient = (data) =>
  api.post('/cliente/save', data).then((r) => r.data);

export const getClienteByUserId = (idUsuario) =>
  api.get(`/cliente/usuario/${idUsuario}`).then((r) => r.data);

export const updateUser = (id, data) =>
  api.put(`/usuario/update/${id}`, data).then((r) => r.data);

export const updateClient = (id, data) =>
  api.put(`/cliente/update/${id}`, data).then((r) => r.data);

export const getUsuarioById = (id) =>
  api.get(`/usuario/getBy/${id}`).then((r) => r.data);

export const getDoctors = () =>
  api.get('/medico/all').then((r) => r.data);

export const getDoctorById = (id) =>
  api.get(`/medico/getBy/${id}`).then((r) => r.data);

export const saveDoctor = (data) =>
  api.post('/medico/save', data).then((r) => r.data);

export const saveDoctorWithUser = (data) =>
  api.post('/medico/saveWithUser', data).then((r) => r.data);

export const updateDoctor = (id, data) =>
  api.put(`/medico/update/${id}`, data).then((r) => r.data);

export const toggleDoctorStatus = (id) =>
  api.put(`/medico/toggle-status/${id}`).then((r) => r.data);

export const getSpecialties = () =>
  api.get('/especialidad/all').then((r) => r.data);

export default api;
