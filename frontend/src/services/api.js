import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Importante para manejar cookies/sesiones si el backend lo requiere
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
    const status = error.response?.status;
    const url = error.config?.url || '';
    if ((status === 401 || status === 403) && !url.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('cliente_id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const verify2FA = (email, code) =>
  api.post('/auth/verify-2fa', { email, code }).then((r) => r.data);

export const resend2FA = (email) =>
  api.post('/auth/resend-2fa', { email }).then((r) => r.data);

export const registerUser = (data) =>
  api.post('/usuario/save', data).then((r) => r.data);

export const registerClient = (data) =>
  api.post('/cliente/save', data).then((r) => r.data);

export const getClienteByUserId = (idUsuario) =>
  api.get(`/cliente/usuario/${idUsuario}`).then((r) => r.data);

export const updateUser = (id, data) =>
  api.put(`/usuario/update/${id}`, data).then((r) => r.data);

export const updateMyProfile = (data) =>
  api.put('/usuario/profile', data).then((r) => r.data);

export const updateClient = (id, data) =>
  api.put(`/cliente/actualizar/${id}`, data).then((r) => r.data);

export const getUsuarioById = (id) =>
  api.get(`/usuario/getBy/${id}`).then((r) => r.data);

export const getDoctors = () =>
  api.get('/medico/all').then((r) => r.data);

export const getDoctorById = (id) =>
  api.get(`/medico/getBy/${id}`).then((r) => r.data);

export const getDoctorByUserId = (idUsuario) =>
  api.get(`/medico/usuario/${idUsuario}`).then((r) => r.data);

export const saveDoctor = (data) =>
  api.post('/medico/save', data).then((r) => r.data);

export const saveDoctorWithUser = (data) =>
  api.post('/medico/saveWithUser', data).then((r) => r.data);

export const updateDoctor = (id, data) =>
  api.put(`/medico/update/${id}`, data).then((r) => r.data);

export const toggleDoctorStatus = (id) =>
  api.put(`/medico/toggle-status/${id}`).then((r) => r.data);

export const deleteDoctor = (id) =>
  api.delete(`/medico/delete/${id}`).then((r) => r.data);

export const getSpecialties = () =>
  api.get('/especialidad/all').then((r) => r.data);

export const changePassword = (id, data) =>
  api.put(`/usuario/password/${id}`, data).then((r) => r.data);

export const getChildrenByClientId = (idCliente) =>
  api.get(`/paciente/cliente/${idCliente}`).then((r) => r.data);

export const createChild = (data) =>
  api.post('/paciente/save', data).then((r) => r.data);

export const updateChild = (id, data) =>
  api.put(`/paciente/update/${id}`, data).then((r) => r.data);

export const saveAppointment = (data) =>
  api.post('/cita/save', data).then((r) => r.data);

export const getAppointmentsByPatient = (idPaciente) =>
  api.get(`/cita/paciente/${idPaciente}`).then((r) => r.data);

export const getAppointmentsByClientId = (idCliente) =>
  api.get(`/cita/cliente/${idCliente}`).then((r) => r.data);

export const getHorarios = () =>
  api.get('/horarios').then((r) => r.data);

export const getHorariosByMedico = (idMedico) =>
  api.get(`/horarios/medico/${idMedico}`).then((r) => r.data);

export const savePayment = (data) =>
  api.post('/pago/save', data).then((r) => r.data);

// ── Admin ──
export const getAllAppointments = () =>
  api.get('/cita/all').then((r) => r.data);

export const getAllPatients = () =>
  api.get('/paciente/all').then((r) => r.data);

export const getAllUsers = () =>
  api.get('/usuario/all').then((r) => r.data);

export const getAllIncidents = () =>
  api.get('/incidente/all').then((r) => r.data);

export const respondToIncident = (id, data) =>
  api.patch(`/incidente/responder/${id}`, data).then((r) => r.data);

export const getAllPayments = () =>
  api.get('/pago').then((r) => r.data);

// ── Admin: Roles y Permisos ──
export const getRoles = () =>
  api.get('/admin/roles').then((r) => r.data);

export const getPermisosDeRol = (idRol) =>
  api.get(`/admin/roles/${idRol}/permisos`).then((r) => r.data);

export const getAllPermisos = () =>
  api.get('/admin/permisos').then((r) => r.data);

export const asignarPermisoARol = (idRol, idPermiso) =>
  api.post(`/admin/roles/${idRol}/permisos`, { idPermiso }).then((r) => r.data);

export const removerPermisoDeRol = (idRol, idPermiso) =>
  api.delete(`/admin/roles/${idRol}/permisos/${idPermiso}`).then((r) => r.data);

// ── Admin: Gestión de Usuarios ──
export const crearAdmin = (data) =>
  api.post('/admin/usuarios', data).then((r) => r.data);

export const actualizarRolUsuario = (id, idRol) =>
  api.put(`/admin/usuarios/${id}/rol`, { idRol }).then((r) => r.data);

export const cambiarStatusUsuario = (id, activo) =>
  api.put(`/admin/usuarios/${id}/status`, { activo }).then((r) => r.data);

export const getUsers = () =>
  api.get('/usuario/all').then((r) => r.data);

// ── Tarjetas Guardadas ──
export const getTarjetas = () =>
  api.get('/tarjeta').then((r) => r.data);

export const saveTarjeta = (data) =>
  api.post('/tarjeta/save', data).then((r) => r.data);

export const deleteTarjeta = (id) =>
  api.delete(`/tarjeta/delete/${id}`).then((r) => r.data);

export const setPredeterminadaTarjeta = (id) =>
  api.put(`/tarjeta/${id}/predeterminada`).then((r) => r.data);

// ── Chatbot ──
export const sendChatMessage = (message, history = []) =>
  api.post('/chatbot/message', { message, history }).then((r) => r.data);

export default api;
