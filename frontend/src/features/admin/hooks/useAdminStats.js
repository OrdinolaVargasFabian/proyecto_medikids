import { useQuery } from "@tanstack/react-query"
import { getAllAppointments, getAllPatients, getAllPayments, getDoctors } from "../../../services/api"
import { useMemo } from "react"

function toDateStr(d) {
  if (!d) return ""
  if (typeof d === "string") return d.split("T")[0]
  return d.toISOString().split("T")[0]
}

function inRange(dateStr, start, end) {
  if (!dateStr) return false
  const d = toDateStr(dateStr)
  return d >= start && d <= end
}

function computeAge(birthDate) {
  if (!birthDate) return "-"
  const now = new Date()
  const birth = new Date(birthDate)
  let years = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) years--
  if (years > 0) return `${years}a`
  const months = now.getMonth() - birth.getMonth() + (now.getFullYear() - birth.getFullYear()) * 12
  if (months > 0) return `${months}m`
  const days = Math.floor((now - birth) / 86400000)
  return `${days}d`
}

function getDateRange(range) {
  const now = new Date()
  let start, end

  switch (range) {
    case "week": {
      const day = now.getDay()
      start = new Date(now)
      start.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
      end = new Date(start)
      end.setDate(start.getDate() + 6)
      break
    }
    case "year":
      start = new Date(now.getFullYear(), 0, 1)
      end = new Date(now.getFullYear(), 11, 31)
      break
    case "month":
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
  }

  const ss = toDateStr(start)
  const ee = toDateStr(end)

  let ps, pe
  if (range === "year") {
    ps = `${now.getFullYear() - 1}-01-01`
    pe = `${now.getFullYear() - 1}-12-31`
  } else if (range === "week") {
    ps = toDateStr(new Date(start.getTime() - 7 * 86400000))
    pe = toDateStr(new Date(start.getTime() - 86400000))
  } else {
    ps = toDateStr(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    pe = toDateStr(new Date(now.getFullYear(), now.getMonth(), 0))
  }

  return { start: ss, end: ee, prevStart: ps, prevEnd: pe }
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const TODAY = toDateStr(new Date())

export function useAdminStats(timeRange = "month") {
  const { data: citas = [], isLoading: citasLoading, isError: citasError } = useQuery({
    queryKey: ["admin", "citas"],
    queryFn: getAllAppointments,
    refetchInterval: 120_000,
  })

  const { data: pacientes = [], isLoading: pacientesLoading, isError: pacientesError } = useQuery({
    queryKey: ["admin", "pacientes"],
    queryFn: getAllPatients,
    refetchInterval: 120_000,
  })

  const { data: pagos = [], isLoading: pagosLoading, isError: pagosError } = useQuery({
    queryKey: ["admin", "pagos"],
    queryFn: getAllPayments,
    refetchInterval: 120_000,
  })

  const { data: medicos = [], isLoading: medicosLoading, isError: medicosError } = useQuery({
    queryKey: ["admin", "medicos"],
    queryFn: getDoctors,
    refetchInterval: 120_000,
  })

  const isError = citasError || pacientesError || pagosError || medicosError
  const isLoading = citasLoading || pacientesLoading || pagosLoading || medicosLoading

  const range = useMemo(() => getDateRange(timeRange), [timeRange])

  const citasFiltradas = useMemo(
    () => citas.filter((c) => inRange(c.fecha_cita, range.start, range.end)),
    [citas, range]
  )
  const citasPrev = useMemo(
    () => citas.filter((c) => inRange(c.fecha_cita, range.prevStart, range.prevEnd)),
    [citas, range]
  )

  const pagosFiltrados = useMemo(
    () => pagos.filter((p) => inRange(p.fecha_pago, range.start, range.end)),
    [pagos, range]
  )
  const pagosPrev = useMemo(
    () => pagos.filter((p) => inRange(p.fecha_pago, range.prevStart, range.prevEnd)),
    [pagos, range]
  )

  // ── KPIs ──
  const kpis = useMemo(() => {
    const pendientes = citasFiltradas.filter((c) => c.estado === "Pendiente").length
    const completadas = citasFiltradas.filter((c) => c.estado === "Completada").length

    const ingresos = pagosFiltrados.reduce((s, p) => s + (p.monto || 0), 0)
    const ingresosPrev = pagosPrev.reduce((s, p) => s + (p.monto || 0), 0)

    const activos = medicos.filter((m) => m.estado === "activo").length
    const inactivos = medicos.filter((m) => m.estado === "inactivo").length

    const calc = (a, p) => (p === 0 ? (a > 0 ? 100 : 0) : Math.round(((a - p) / p) * 100))

    return {
      pacientes: {
        valor: pacientes.length.toLocaleString("es-PE"),
        cambio: calc(pacientes.length, 0),
        subtitle: "Total registrados",
      },
      citas: {
        valor: citasFiltradas.length.toLocaleString("es-PE"),
        cambio: calc(citasFiltradas.length, citasPrev.length),
        subtitle: `${pendientes} pendientes · ${completadas} completadas`,
      },
      medicos: {
        valor: medicos.length.toLocaleString("es-PE"),
        cambio: calc(medicos.length, 0),
        subtitle: `${activos} disponibles · ${inactivos} ausentes`,
      },
      facturacion: {
        valor: `S/ ${ingresos.toLocaleString("es-PE")}`,
        cambio: calc(ingresos, ingresosPrev),
        subtitle: "vs. período anterior",
      },
    }
  }, [citasFiltradas, citasPrev, pagosFiltrados, pagosPrev, medicos, pacientes])

  // ── Chart Data (Admitidas vs En Consulta) ──
  const chartData = useMemo(() => {
    if (timeRange === "week") {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(range.start)
        d.setDate(d.getDate() + i)
        const dayStr = toDateStr(d)
        const dayCitas = citasFiltradas.filter((c) => toDateStr(c.fecha_cita) === dayStr)
        return {
          label: DIAS[d.getDay()],
          admitidas: dayCitas.filter((c) => c.estado === "En curso").length,
          consulta: dayCitas.filter((c) => c.estado === "Completada").length,
        }
      })
    }

    if (timeRange === "year") {
      return Array.from({ length: 12 }, (_, i) => {
        const monthCitas = citasFiltradas.filter((c) => new Date(c.fecha_cita).getMonth() === i)
        return {
          label: MONTHS[i],
          admitidas: monthCitas.filter((c) => c.estado === "En curso").length,
          consulta: monthCitas.filter((c) => c.estado === "Completada").length,
        }
      })
    }

    const weeks = []
    const start = new Date(range.start)
    const end = new Date(range.end)
    let wStart = new Date(start)
    while (wStart <= end) {
      const wEnd = new Date(Math.min(wStart.getTime() + 6 * 86400000, end.getTime()))
      const weekCitas = citasFiltradas.filter((c) => {
        if (!c.fecha_cita) return false
        const cd = new Date(c.fecha_cita)
        return cd >= wStart && cd <= wEnd
      })
      weeks.push({
        label: `Sem ${weeks.length + 1}`,
        admitidas: weekCitas.filter((c) => c.estado === "En curso").length,
        consulta: weekCitas.filter((c) => c.estado === "Completada").length,
      })
      wStart = new Date(wEnd)
      wStart.setDate(wStart.getDate() + 1)
    }
    return weeks
  }, [citasFiltradas, range, timeRange])

  // ── Rendimiento Mensual: Citas vs Ingresos ──
  const rendimientoData = useMemo(() => {
    if (timeRange === "week") {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(range.start)
        d.setDate(d.getDate() + i)
        const dayStr = toDateStr(d)
        const dayCitas = citasFiltradas.filter((c) => toDateStr(c.fecha_cita) === dayStr)
        const dayPagos = pagosFiltrados.filter((p) => toDateStr(p.fecha_pago) === dayStr)
        return {
          label: DIAS[d.getDay()],
          citas: dayCitas.length,
          ingresos: dayPagos.reduce((s, p) => s + (p.monto || 0), 0),
        }
      })
    }

    if (timeRange === "year") {
      return Array.from({ length: 12 }, (_, i) => {
        const monthCitas = citasFiltradas.filter((c) => new Date(c.fecha_cita).getMonth() === i)
        const monthPagos = pagosFiltrados.filter((p) => {
          if (!p.fecha_pago) return false
          return new Date(p.fecha_pago).getMonth() === i
        })
        return {
          label: MONTHS[i],
          citas: monthCitas.length,
          ingresos: monthPagos.reduce((s, p) => s + (p.monto || 0), 0),
        }
      })
    }

    const weeks = []
    const start = new Date(range.start)
    const end = new Date(range.end)
    let wStart = new Date(start)
    while (wStart <= end) {
      const wEnd = new Date(Math.min(wStart.getTime() + 6 * 86400000, end.getTime()))
      const weekCitas = citasFiltradas.filter((c) => {
        if (!c.fecha_cita) return false
        const cd = new Date(c.fecha_cita)
        return cd >= wStart && cd <= wEnd
      })
      const weekPagos = pagosFiltrados.filter((p) => {
        if (!p.fecha_pago) return false
        const pd = new Date(p.fecha_pago)
        return pd >= wStart && pd <= wEnd
      })
      weeks.push({
        label: `Sem ${weeks.length + 1}`,
        citas: weekCitas.length,
        ingresos: weekPagos.reduce((s, p) => s + (p.monto || 0), 0),
      })
      wStart = new Date(wEnd)
      wStart.setDate(wStart.getDate() + 1)
    }
    return weeks
  }, [citasFiltradas, pagosFiltrados, range, timeRange])

  // ── Agenda (próximas citas de HOY con info del médico) ──
  const agenda = useMemo(() => {
    const citasHoy = citas
      .filter((c) => toDateStr(c.fecha_cita) === TODAY)
      .sort((a, b) => {
        const aTime = a.fecha_cita ? new Date(a.fecha_cita).getTime() : 0
        const bTime = b.fecha_cita ? new Date(b.fecha_cita).getTime() : 0
        return aTime - bTime
      })
      .slice(0, 6)

    return citasHoy.map((c) => {
      const med = c.medico
      const nombre = med?.usuario
        ? `${med.usuario.nombres || ""} ${med.usuario.apellidos || ""}`.trim()
        : "Sin médico"
      const especialidad = med?.especialidad_nombre || med?.especialidad?.nombre || "General"
      const hora = c.fecha_cita
        ? new Date(c.fecha_cita).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        : "-"
      return {
        id: c.id,
        nombre,
        foto: med?.foto || null,
        especialidad,
        hora,
      }
    })
  }, [citas])

  // ── Tabla (Citas de Hoy) ──
  const tablaHoy = useMemo(() => {
    const citasHoy = citas
      .filter((c) => toDateStr(c.fecha_cita) === TODAY)
      .slice(0, 20)

    return citasHoy.map((c, idx) => {
      const pac = c.paciente
      const nombreCompleto = pac?.nombre_completo || "Sin nombre"
      const edad = computeAge(pac?.fecha_nacimiento)
      const genero = pac?.genero || "-"
      const fotoPaciente = pac?.foto || null

      const especialidad = c.medico?.especialidad_nombre || c.medico?.especialidad?.nombre || "General"

      return {
        id: c.id || idx + 1,
        nombre: nombreCompleto,
        foto: fotoPaciente,
        edad,
        genero,
        especialidad,
        estado: c.estado || "-",
      }
    })
  }, [citas])

  // ── Distribución por Especialidad ──
  const especialidadData = useMemo(() => {
    const map = {}
    citasFiltradas.forEach((c) => {
      const esp = c.medico?.especialidad_nombre || c.medico?.especialidad?.nombre || "General"
      map[esp] = (map[esp] || 0) + 1
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [citasFiltradas])

  return {
    kpis,
    chartData,
    rendimientoData,
    agenda,
    especialidadData,
    tablaHoy,
    isLoading,
    isError,
  }
}
