import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Stethoscope, AlertTriangle, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { getAllAppointments, getDoctors, getAllPatients, getAllIncidents, getAllPayments } from "../../../services/api";
import { AdminTableSkeleton } from "../../../app/components/skeletons/AdminTableSkeleton";

const statusStyle = {
  "Pendiente": "text-amber-600 bg-amber-50 border-amber-100",
  "Completada": "text-emerald-600 bg-emerald-50 border-emerald-100",
  "En curso": "text-blue-600 bg-blue-50 border-blue-100",
  "Cancelada": "text-red-600 bg-red-50 border-red-100",
};

const todayStr = new Date().toISOString().split("T")[0];
const dateStr = new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

const isDoctorActivo = (estado) => String(estado || "").toLowerCase() === "activo";

const StatCard = ({ icon: Icon, label, value, color, bg, to }) => {
  const content = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-medi-200 transition-all cursor-pointer">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState("");

  useEffect(() => {
    Promise.all([
      getAllAppointments(),
      getDoctors(),
      getAllPatients(),
      getAllIncidents(),
      getAllPayments(),
    ])
      .then(([citas, docs, pacs, incs, pags]) => {
        setAppointments(citas);
        setDoctors(docs);
        setPatients(pacs);
        setIncidents(incs);
        setPayments(pags);
      })
      .catch(() => setError("Error al cargar datos del dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const todayAppointments = useMemo(() => {
    let list = appointments.filter((a) => a.fecha_cita === todayStr);
    if (filterDoctor) {
      list = list.filter((a) => {
        const fullName = `${a.medico?.usuario?.nombres || ""} ${a.medico?.usuario?.apellidos || ""}`.trim().toLowerCase();
        return fullName.includes(filterDoctor.toLowerCase());
      });
    }
    list.sort((a, b) => (a.hora_cita || "").localeCompare(b.hora_cita || ""));
    return list;
  }, [appointments, filterDoctor]);

  const stats = useMemo(() => {
    const pendingIncidents = incidents.filter((i) => !i.respuesta_admin);
    const totalRevenue = payments.reduce((sum, p) => sum + (p.monto || 0), 0);
    const completedPayments = payments.filter((p) => p.estado_transaccion === "completado" || p.estado_transaccion === "COMPLETADO");
    const totalPaid = completedPayments.reduce((sum, p) => sum + (p.monto || 0), 0);
    return {
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter((d) => isDoctorActivo(d.estado)).length,
      totalPatients: patients.length,
      todayCount: todayAppointments.length,
      pendingCount: todayAppointments.filter((a) => a.estado === "Pendiente").length,
      pendingIncidents: pendingIncidents.length,
      totalRevenue,
      totalPaid,
      completedPayments: completedPayments.length,
    };
  }, [appointments, doctors, patients, incidents, payments, todayAppointments]);

  if (loading) return <AdminTableSkeleton headerWidth="w-72" subtitleWidth="w-96" cards={5} cardsCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-5" cardHeight="h-28" tableHeight="h-80" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-lg font-bold text-gray-900">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-medi-500 text-white rounded-xl font-bold hover:bg-medi-600 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight capitalize">{dateStr}</h2>
          <p className="text-gray-500 font-medium mt-1">Panel de administración — resumen general del sistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={Calendar} label="Citas" to="/admin/citas" value={stats.todayCount} color="text-medi-600" bg="bg-medi-50" />
        <StatCard icon={Stethoscope} label="Médicos Activos" to="/admin/medicos" value={stats.activeDoctors} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={Users} label="Pacientes" to="/admin/pacientes" value={stats.totalPatients} color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={Clock} label="Pendientes Hoy" to="/admin/citas" value={stats.pendingCount} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={AlertTriangle} label="Incidentes Pendientes" to="/admin/incidentes" value={stats.pendingIncidents} color="text-red-600" bg="bg-red-50" />
        <StatCard icon={DollarSign} label="Ingresos" to="/admin/pagos" value={`S/ ${stats.totalPaid.toFixed(0)}`} color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">
                Citas de Hoy <span className="text-medi-500 font-extrabold">({stats.todayCount})</span>
              </h3>
            </div>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none"
            >
              <option value="">Todos los médicos</option>
              {doctors.map((d) => {
                const name = `${d.usuario?.nombres || ""} ${d.usuario?.apellidos || ""}`.trim();
                return <option key={d.id_medico} value={name}>{name}</option>;
              })}
            </select>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
              <Calendar className="w-10 h-10" />
              <p className="font-semibold text-sm">No hay citas programadas para hoy</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hora</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Paciente</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Médico</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Especialidad</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Asistencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {todayAppointments.map((apt) => {
                    const docName = `${apt.medico?.usuario?.nombres || ""} ${apt.medico?.usuario?.apellidos || ""}`.trim() || "—";
                    const specialty = apt.medico?.especialidad?.nombre || "—";
                    return (
                      <tr key={apt.id_cita} className="hover:bg-medi-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{apt.hora_cita || "—"}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{apt.paciente?.nombre_completo || "—"}</td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{docName}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1.5 rounded-full">{specialty}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusStyle[apt.estado] || "text-gray-600 bg-gray-50 border-gray-100"}`}>
                            {apt.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {apt.asistencia === '1' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                              <CheckCircle className="w-3.5 h-3.5" /> Asistió
                            </span>
                          ) : apt.estado === "Pendiente" || !apt.asistencia ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-400">
                              <Clock className="w-3.5 h-3.5" /> Por definir
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500">
                              <XCircle className="w-3.5 h-3.5" /> No asistió
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Resumen Rápido</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600 font-medium">Total Médicos</span>
              <span className="text-lg font-extrabold text-gray-900">{stats.totalDoctors}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600 font-medium">Total Pacientes</span>
              <span className="text-lg font-extrabold text-gray-900">{stats.totalPatients}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600 font-medium">Incidentes Pend.</span>
              <span className={`text-lg font-extrabold ${stats.pendingIncidents > 0 ? "text-red-500" : "text-gray-900"}`}>
                {stats.pendingIncidents}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600 font-medium">Pagos Completados</span>
              <span className="text-lg font-extrabold text-emerald-600">{stats.completedPayments}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-600 font-medium">Ingresos</span>
              </div>
              <span className="text-lg font-extrabold text-emerald-600">S/ {stats.totalPaid.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
