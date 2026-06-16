import { useState, useMemo } from "react"
import { Users, Calendar, Stethoscope, DollarSign, AlertCircle } from "lucide-react"
import { useAdminStats } from "../hooks/useAdminStats"
import { TimeFilter } from "../components/TimeFilter"
import { KpiCard } from "../components/KpiCard"
import { RendimientoChart } from "../components/RendimientoChart"
import { DoctorAgenda } from "../components/DoctorAgenda"
import { PremiumTable } from "../components/PremiumTable"

const kpiConfig = [
  { key: "pacientes", icon: Users, label: "Pacientes", linkTo: "/admin/pacientes" },
  { key: "citas", icon: Calendar, label: "Citas", linkTo: "/admin/citas" },
  { key: "medicos", icon: Stethoscope, label: "Médicos", linkTo: "/admin/medicos" },
  { key: "facturacion", icon: DollarSign, label: "Facturación", linkTo: "/admin/pagos" },
]

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("month")
  const { kpis, chartData, rendimientoData, especialidadData, tablaHoy, isLoading, isError } =
    useAdminStats(timeRange)

  const dateStr = useMemo(
    () =>
      capitalize(
        new Date().toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      ),
    []
  )

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-100/70 shadow-sm p-8 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Error al cargar datos</h2>
          <p className="text-sm text-gray-500 mb-6">No se pudieron obtener las métricas. Verifica la conexión con el servidor.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="h-7 w-64 bg-gray-200 rounded-lg" />
              <div className="h-4 w-48 bg-gray-100 rounded" />
            </div>
            <div className="h-9 w-48 bg-gray-100 rounded-xl" />
          </div>
          <div className="grid grid-cols-4 gap-5 mb-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100/70 shadow-sm p-5">
                <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3" />
                <div className="h-8 w-24 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-50 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-5 mb-5">
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6">
              <div className="h-[300px] bg-gray-50 rounded-xl" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6">
              <div className="h-[300px] bg-gray-50 rounded-xl" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6">
            <div className="h-8 w-48 bg-gray-100 rounded mb-4" />
            <div className="h-48 bg-gray-50 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5">
              {dateStr} · Resumen general de la clínica
            </p>
          </div>
          <TimeFilter value={timeRange} onChange={setTimeRange} />
        </div>

        <div className="space-y-5">
          {/* Fila 1 — KPIs */}
          <div className="grid grid-cols-12 gap-4">
            {kpiConfig.map(({ key, icon, label, linkTo }) => (
              <div key={key} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <KpiCard
                  icon={icon}
                  label={label}
                  value={kpis[key].valor}
                  cambio={kpis[key].cambio}
                  subtitle={kpis[key].subtitle}
                  linkTo={linkTo}
                />
              </div>
            ))}
          </div>

          {/* Fila 2 — Rendimiento (2/3) + Especialidad (1/3) */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8">
              <RendimientoChart data={rendimientoData} timeRange={timeRange} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <DoctorAgenda data={especialidadData} />
            </div>
          </div>

          {/* Fila 3 — Tabla full-width */}
          <PremiumTable data={tablaHoy} />
        </div>
      </div>
    </div>
  )
}
