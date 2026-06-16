import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api, { getDoctorByUserId } from "../../../services/api";
import { queryKeys } from "../../../hooks/useApiData";

const DAYS = [
  { label: "Lun", offset: 0 },
  { label: "Mar", offset: 1 },
  { label: "Mié", offset: 2 },
  { label: "Jue", offset: 3 },
  { label: "Vie", offset: 4 },
  { label: "Sáb", offset: 5 },
];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? 1 : -(day - 1);
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const toKey = (dateStr, hour) => `${dateStr}_${hour}`;

const getHour = (val) => {
  if (typeof val === "number") return Math.floor(val / 3600000);
  if (typeof val === "string") return parseInt(val, 10);
  return -1;
};

export const DoctorSchedules = () => {
  const queryClient = useQueryClient();

  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [available, setAvailable] = useState([]);
  const [booked, setBooked] = useState([]);
  const [savedAvailable, setSavedAvailable] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const usuario = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("usuario")); }
    catch { return null; }
  }, []);

  const { data: medico, isLoading: loadingMedico } = useQuery({
    queryKey: ['doctor', usuario?.id_usuario],
    queryFn: () => getDoctorByUserId(usuario.id_usuario),
    enabled: !!usuario?.id_usuario,
  });

  const weekDays = useMemo(() =>
    DAYS.map((d) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + d.offset);
      return { ...d, date, dateStr: formatDate(date) };
    }), [weekStart]);

  const todayDate = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const todayStr = useMemo(() => formatDate(todayDate), [todayDate]);
  const currentMonday = useMemo(() => getMonday(todayDate), [todayDate]);

  const canGoPrev = weekStart.getTime() > currentMonday.getTime();
  const isPastDate = (dateStr) => dateStr < todayStr;

  const inicio = weekDays[0]?.dateStr;
  const fin = weekDays[5]?.dateStr;

  const { data: horariosRes, isLoading: loadingHorarios } = useQuery({
    queryKey: queryKeys.horariosSemana(medico?.id_medico, inicio, fin),
    queryFn: () => api.get(`/horarios/medico/${medico.id_medico}/semana`, { params: { inicio, fin } }).then(r => r.data),
    enabled: !!medico?.id_medico && !!inicio && !!fin,
  });

  const loading = loadingMedico || loadingHorarios;

  useEffect(() => {
    if (!horariosRes) return;
    const avail = [];
    const bkd = [];
    (horariosRes || []).forEach((h) => {
      const dateStr = h.fecha;
      if (!dateStr) return;
      const hour = getHour(h.hora_inicio);
      if (hour < 0) return;
      const key = toKey(dateStr, hour);
      if (String(h.disponible) === "1") avail.push(key);
      else bkd.push(key);
    });
    setAvailable(avail);
    setBooked(bkd);
    setSavedAvailable(avail);
    setMsg(null);
  }, [horariosRes]);

  const isDirty = useMemo(() => {
    if (available.length !== savedAvailable.length) return true;
    return available.some(k => !savedAvailable.includes(k));
  }, [available, savedAvailable]);

  const toggleCell = (dateStr, hour) => {
    const key = toKey(dateStr, hour);
    if (booked.includes(key)) return;
    setAvailable((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (!medico) return;
    setSaving(true);
    setMsg(null);
    try {
      const bloques = available.map((key) => {
        const [dateStr, hourStr] = key.split("_");
        const hour = parseInt(hourStr, 10);
        return {
          fecha: dateStr,
          hora_inicio: `${String(hour).padStart(2, "0")}:00:00`,
          hora_fin: `${String(hour + 1).padStart(2, "0")}:00:00`,
        };
      });
      const inicio = weekDays[0].dateStr;
      const fin = weekDays[5].dateStr;
      await api.post("/horarios/save-semana", {
        id_medico: medico.id_medico,
        inicio,
        fin,
        bloques,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.horariosSemana(medico.id_medico, inicio, fin),
      });
      setSavedAvailable([...available]);
      setMsg({ type: "success", text: "Horarios guardados correctamente" });
    } catch {
      setMsg({ type: "error", text: "Error al guardar los horarios" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-6">
        <Link
          to="/doctor"
          className="group p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-medi-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Horarios de Atención</h2>
          <p className="text-gray-500 font-medium mt-1">Configura tu disponibilidad semanal.</p>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl text-sm font-bold text-center ${
          msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {msg.text}
        </div>
      )}

      {!medico ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 font-medium">
          No se encontró tu perfil de médico. Contacta al administrador.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/80">
              {canGoPrev ? (
              <button onClick={() => setWeekStart((prev) => {
                const d = new Date(prev); d.setDate(d.getDate() - 7); return d;
              })} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-medi-600 hover:bg-medi-50 rounded-xl transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                Semana anterior
              </button>
              ) : <div className="w-[140px]" />}

              <div className="text-center">
                <div className="text-lg font-extrabold text-gray-900">
                  {weekDays[0].date.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
                  {" — "}
                  {weekDays[5].date.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              <button onClick={() => setWeekStart((prev) => {
                const d = new Date(prev); d.setDate(d.getDate() + 7); return d;
              })} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-medi-600 hover:bg-medi-50 rounded-xl transition-all">
                Semana siguiente
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-400 font-medium">
                Cargando horarios...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-20 p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-r border-b border-gray-100 bg-gray-50/50" />
                      {weekDays.map((d) => (
                        <th key={d.dateStr} className={`p-3 text-center border-b border-gray-100 bg-gray-50/50 ${d.dateStr === todayStr ? "bg-medi-50" : ""}`}>
                          <div className={`text-sm font-extrabold uppercase tracking-wide ${d.dateStr === todayStr ? "text-medi-700" : "text-gray-900"}`}>{d.label}</div>
                          <div className={`text-xs mt-0.5 ${d.dateStr === todayStr ? "text-medi-500 font-bold" : "text-gray-400"}`}>{d.date.getDate()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HOURS.map((hour) => (
                      <tr key={hour}>
                        <td className="w-20 p-3 text-xs font-bold text-gray-400 border-r border-b border-gray-100 bg-gray-50/50 text-center">{`${String(hour).padStart(2, "0")}:00`}</td>
                        {weekDays.map((d) => {
                          const key = toKey(d.dateStr, hour);
                          const isAvail = available.includes(key);
                          const isBooked = booked.includes(key);
                          const isPast = isPastDate(d.dateStr);

                          if (isPast) {
                            return (
                              <td key={d.dateStr} className="h-12 border-b border-r border-gray-100 bg-gray-50/80 cursor-not-allowed opacity-40">
                                <div className="flex items-center justify-center h-full" />
                              </td>
                            );
                          }

                          if (isBooked) {
                            return (
                              <td key={d.dateStr} className="h-12 border-b border-r border-gray-100 bg-gray-100 cursor-not-allowed">
                                <div className="flex items-center justify-center h-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-300 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                </div>
                              </td>
                            );
                          }

                          if (isAvail) {
                            return (
                              <td key={d.dateStr} onClick={() => toggleCell(d.dateStr, hour)} className="h-12 border-b border-r border-medi-200 bg-medi-400/20 hover:bg-medi-400/30 cursor-pointer transition-all">
                                <div className="flex items-center justify-center h-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-medi-600 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td key={d.dateStr} onClick={() => toggleCell(d.dateStr, hour)} className={`h-12 border-b border-r border-gray-100 bg-white hover:bg-medi-50 cursor-pointer transition-all ${d.dateStr === todayStr ? "border-medi-200" : ""}`}>
                              <div className="flex items-center justify-center h-full" />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-medi-400/20 border border-medi-200" />
                  <span className="text-gray-500">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-gray-300 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  </div>
                  <span className="text-gray-500">Reservado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white border border-gray-200" />
                  <span className="text-gray-500">Libre</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving || !isDirty}
                  className={`px-10 py-3 font-extrabold rounded-2xl transition-all shadow-lg active:scale-95 text-white ${
                    saving || !isDirty
                      ? "bg-medi-300 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-600 hover:to-medi-700 shadow-medi-200"
                  }`}
                >
                  {saving ? "Guardando..." : !isDirty ? "Sin cambios" : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};