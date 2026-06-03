import { useQuery } from '@tanstack/react-query'
import api, {
  getClienteByUserId,
  getChildrenByClientId,
  getAppointmentsByClientId,
  getDoctors,
  getSpecialties,
  getTarjetas,
} from '../services/api'

export const queryKeys = {
  cliente: (userId) => ['cliente', userId],
  children: (clientId) => ['children', clientId],
  citas: (clientId) => ['citas', clientId],
  doctores: () => ['doctores'],
  especialidades: () => ['especialidades'],
  horariosDisponibles: (medicoId) => ['horarios', 'disponibles', medicoId],
  horariosSemana: (medicoId, inicio, fin) => ['horarios', 'semana', medicoId, inicio, fin],
  profile: (userId) => ['profile', userId],
  tarjetas: (userId) => ['tarjetas', userId],
}

export function useCliente(userId) {
  return useQuery({
    queryKey: queryKeys.cliente(userId),
    queryFn: () => getClienteByUserId(userId),
    enabled: !!userId,
  })
}

export function useChildren(clientId) {
  return useQuery({
    queryKey: queryKeys.children(clientId),
    queryFn: () => getChildrenByClientId(clientId),
    enabled: !!clientId,
  })
}

export function useCitas(clientId) {
  return useQuery({
    queryKey: queryKeys.citas(clientId),
    queryFn: () => getAppointmentsByClientId(clientId),
    enabled: !!clientId,
  })
}

export function useDoctores() {
  return useQuery({
    queryKey: queryKeys.doctores(),
    queryFn: getDoctors,
    staleTime: 10 * 60 * 1000,
  })
}

export function useEspecialidades() {
  return useQuery({
    queryKey: queryKeys.especialidades(),
    queryFn: getSpecialties,
    staleTime: 10 * 60 * 1000,
  })
}

export function useHorariosDisponibles(medicoId) {
  return useQuery({
    queryKey: queryKeys.horariosDisponibles(medicoId),
    queryFn: () => api.get(`/horarios/medico/${medicoId}/disponibles`).then(r => r.data),
    enabled: !!medicoId,
    retry: false,
  })
}

export function useHorariosSemana(medicoId, inicio, fin) {
  return useQuery({
    queryKey: queryKeys.horariosSemana(medicoId, inicio, fin),
    queryFn: () => api.get(`/horarios/medico/${medicoId}/semana`, { params: { inicio, fin } }).then(r => r.data),
    enabled: !!medicoId && !!inicio && !!fin,
  })
}

export function useProfile(userId) {
  return useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: () => getClienteByUserId(userId),
    enabled: !!userId,
  })
}

export function useTarjetas(userId) {
  return useQuery({
    queryKey: queryKeys.tarjetas(userId),
    queryFn: getTarjetas,
    enabled: !!userId,
  })
}
