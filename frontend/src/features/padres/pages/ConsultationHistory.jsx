import { useState, useEffect, useMemo } from "react";
import { useChildren, useCitas } from "../../../hooks/useApiData";
import { ConsultationHistorySkeleton } from "../../../app/components/skeletons/ConsultationHistorySkeleton";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
};

const statusColor = {
  Completada: "text-emerald-600 bg-emerald-50 border-emerald-100",
  Cancelada: "text-red-600 bg-red-50 border-red-100",
  Pendiente: "text-amber-600 bg-amber-50 border-amber-100",
};

export const ConsultationHistory = () => {
  const clientId = useMemo(() => {
    try { return Number(localStorage.getItem("cliente_id")); }
    catch { return null; }
  }, []);

  const { data: children = [], isLoading: loadingChildren } = useChildren(clientId);
  const { data: citas = [], isLoading: loadingCitas } = useCitas(clientId);

  const appointments = citas;
  const loading = loadingChildren || loadingCitas;

  const [filter, setFilter] = useState("todos");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (citas.length > 0 && !selected) {
      setSelected(citas[0]);
    }
  }, [citas]);

  const filtered = useMemo(() => {
    if (filter === "todos") return appointments;
    return appointments.filter((a) => String(a.paciente?.id_paciente) === filter);
  }, [appointments, filter]);

  const detail = selected || filtered[0] || null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Historial de Consultas</h2>
          <p className="text-gray-500 font-medium mt-1">Registro completo de todas las consultas m{"\u00e9"}dicas.</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all self-start"
        >
          <option value="todos">Todos los hijos</option>
          {children.map((c) => (
            <option key={c.id_paciente} value={c.id_paciente}>{c.nombre_completo}</option>
          ))}
        </select>
      </div>

      {loading ? <ConsultationHistorySkeleton /> : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-medi-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-medi-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">No hay consultas registradas</h3>
          <p className="text-gray-500 font-medium text-sm">Las consultas aparecer{"\u00e1"}n aqu{"\u00ed"} una vez que agendes y completes una cita.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="text-left px-4 sm:px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Fecha</th>
                    <th className="text-left px-4 sm:px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Hijo</th>
                    <th className="hidden sm:table-cell text-left px-4 sm:px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">M{"\u00e9"}dico</th>
                    <th className="hidden lg:table-cell text-left px-4 sm:px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Especialidad</th>
                    <th className="text-left px-4 sm:px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((row) => {
                    return (
                      <tr
                        key={row.id_cita}
                        onClick={() => setSelected(row)}
                        className={`hover:bg-medi-50/50 transition-colors group cursor-pointer ${selected?.id_cita === row.id_cita ? "bg-medi-50/80" : ""}`}
                      >
                        <td className="px-4 sm:px-6 py-4 font-bold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                          {row.fecha_cita ? formatDate(row.fecha_cita) : "—"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-gray-700 font-medium text-xs sm:text-sm">
                          {row.paciente?.nombre_completo || "—"}
                        </td>
                        <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-gray-700 text-xs sm:text-sm">
                          {row.medico?.usuario ? `${row.medico.usuario.nombres} ${row.medico.usuario.apellidos}` : "—"}
                        </td>
                        <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                          <span className="text-xs font-bold text-medi-600 bg-medi-50 px-2.5 py-1.5 rounded-full whitespace-nowrap">
                            {row.medico?.especialidad?.nombre || "—"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full border whitespace-nowrap ${statusColor[row.estado] || "text-gray-600 bg-gray-50 border-gray-100"}`}>
                            {row.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Detalle de Consulta</h3>
            {detail ? (
              <div className="space-y-4">
                <div className="bg-medi-50/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-medi-700">
                        {detail.paciente?.nombre_completo || "—"}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {detail.fecha_cita ? formatDate(detail.fecha_cita) : "—"}{detail.hora_cita ? ` · ${detail.hora_cita}` : ""}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${statusColor[detail.estado] || ""}`}>
                      {detail.estado}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {detail.medico?.usuario ? `${detail.medico.usuario.nombres} ${detail.medico.usuario.apellidos}` : "—"}
                    {" \u00b7 "}
                    {detail.medico?.especialidad?.nombre || "—"}
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Motivo</div>
                  <p className="text-sm text-gray-700 font-medium">{detail.motivo || "—"}</p>
                </div>

                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notas del M{"\u00e9"}dico</div>
                  <p className="text-sm text-gray-600 bg-white rounded-xl p-4 border border-gray-100 leading-relaxed">
                    {detail.comentarios || "Sin notas por el momento."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <p className="text-sm font-medium">Selecciona una consulta para ver el detalle</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
