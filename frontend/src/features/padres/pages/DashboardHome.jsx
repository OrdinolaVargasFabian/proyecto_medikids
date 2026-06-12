import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useChildren, useCitas, useDoctores } from "../../../hooks/useApiData";
import { DashboardHomeSkeleton } from "../../../app/components/skeletons/DashboardHomeSkeleton";

const quickActions = [
  { label: "Agendar Cita", to: "/padres/agendar", icon: "M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", color: "from-medi-400 to-medi-500" },
  { label: "Mis Hijos", to: "/padres/hijos", icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z", color: "from-medi-500 to-medi-600" },
  { label: "Historial", to: "/padres/historial", icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z", color: "from-medi-600 to-medi-700" },
  { label: "Mi Perfil", to: "/padres/perfil", icon: "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z", color: "from-medi-400 to-medi-600" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
};

const isDoctorActivo = (estado) => String(estado || "").toLowerCase() === "activo";

export const DashboardHome = () => {
  const usuario = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("usuario")); }
    catch { return null; }
  }, []);

  const clientId = useMemo(() => {
    try { return Number(localStorage.getItem("cliente_id")); }
    catch { return null; }
  }, []);

  const { data: childrenData = [], isLoading: loadingChildren } = useChildren(clientId);
  const { data: citasData = [], isLoading: loadingCitas } = useCitas(clientId);
  const { data: doctoresData = [], isLoading: loadingDoctores } = useDoctores();

  const children = childrenData;
  const appointments = citasData;
  const loading = loadingChildren || loadingCitas || loadingDoctores;

  const activeDoctorsCount = useMemo(
    () => doctoresData.filter((d) => d.activo === "1" && isDoctorActivo(d.estado)).length,
    [doctoresData]
  );

  const upcoming = useMemo(
    () => appointments.filter((a) => a.estado === "Pendiente"),
    [appointments]
  );

  const completedCount = useMemo(
    () => appointments.filter((a) => a.estado === "Completada").length,
    [appointments]
  );

  const stats = useMemo(() => [
    { label: "Hijos Registrados", value: String(children.length), icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" },
    { label: "Pr\u00f3ximas Citas", value: String(upcoming.length), icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" },
    { label: "Historial Completo", value: String(completedCount), icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" },
    { label: "M\u00e9dicos Disponibles", value: String(activeDoctorsCount), icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" },
  ], [children.length, upcoming.length, completedCount, activeDoctorsCount]);

  if (loading) {
    return <DashboardHomeSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-medi-400 via-medi-500 to-medi-600 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-extrabold tracking-tight">{"\u00a1"}Bienvenido de nuevo!</h2>
        <p className="text-medi-100 mt-2 text-lg font-medium">Gestiona la salud de tus hijos de forma f{"\u00e1"}cil y r{"\u00e1"}pida.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-medi-50 rounded-xl flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-medi-600">
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Acceso R{"\u00e1"}pido</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className={`bg-gradient-to-br ${a.color} text-white rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                </svg>
                <span className="text-sm font-bold">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Pr{"\u00f3"}ximas Citas</h3>
            <Link to="/padres/historial" className="text-sm font-bold text-medi-600 hover:text-medi-500 transition-colors">Ver todo</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 font-medium">No tienes citas pr{"\u00f3"}ximas.</p>
              <Link to="/padres/agendar" className="text-sm font-bold text-medi-600 hover:text-medi-500 mt-2 inline-block">
                Agendar una cita
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 4).map((a) => {
                const date = a.fecha_cita;
                const time = a.hora_cita;
                const childName = a.paciente?.nombre_completo || "—";
                const docName = a.medico?.usuario
                  ? `${a.medico.usuario.nombres} ${a.medico.usuario.apellidos}`
                  : "—";
                const specialty = a.medico?.especialidad?.nombre || "";
                return (
                  <div key={a.id_cita} className="flex items-center gap-4 p-3 rounded-xl hover:bg-medi-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-medi-100 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-medi-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">
                        {childName} {"\u2014"} {docName}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {date ? formatDate(date) : ""}{date && time ? " \u00b7 " : ""}{time || ""}
                      </div>
                    </div>
                    {specialty && (
                      <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1 rounded-full shrink-0">
                        {specialty.split(" ")[0]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
