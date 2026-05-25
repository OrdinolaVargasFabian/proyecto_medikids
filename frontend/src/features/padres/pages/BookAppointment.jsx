import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useChildren, useDoctores, useEspecialidades, useHorariosDisponibles, queryKeys } from "../../../hooks/useApiData";
import { saveAppointment } from "../../../services/api";
import { BookAppointmentSkeleton } from "../../../app/components/skeletons/BookAppointmentSkeleton";

const colors = [
  { from: "from-pink-400", to: "to-rose-500" },
  { from: "from-blue-400", to: "to-indigo-500" },
  { from: "from-amber-400", to: "to-orange-500" },
  { from: "from-emerald-400", to: "to-teal-500" },
  { from: "from-violet-400", to: "to-purple-500" },
];

const getInitials = (name) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const getAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const formatTime = (val) => {
  if (!val) return "";
  if (typeof val === "string") {
    const parts = val.split(":");
    if (parts.length >= 2) return parts[0] + ":" + parts[1];
  }
  if (typeof val === "number") {
    const hours = Math.floor(val / 3600000);
    const minutes = Math.floor((val % 3600000) / 60000);
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  }
  return "";
};

export const BookAppointment = () => {
  const usuario = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("usuario")); }
    catch { return null; }
  }, []);

  const queryClient = useQueryClient();

  const clientId = useMemo(() => {
    try { return Number(localStorage.getItem("cliente_id")); }
    catch { return null; }
  }, []);

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [motivo, setMotivo] = useState("");

  const { data: children = [], isLoading: loadingChildren } = useChildren(clientId);
  const { data: doctors = [], isLoading: loadingDoctores } = useDoctores();
  const { data: specialties = [], isLoading: loadingEspecialidades } = useEspecialidades();
  const { data: horarios = [], isLoading: loadingHorarios } = useHorariosDisponibles(selectedDoctor?.id_medico);

  const loading = loadingChildren || loadingDoctores || loadingEspecialidades || (!clientId && !loadingChildren);

  const activeDoctors = useMemo(
    () => doctors.filter((d) => d.activo === "1" && d.estado === "activo"),
    [doctors]
  );

  const filteredDoctors = useMemo(
    () => activeDoctors.filter((d) => d.id_especialidad === Number(selectedSpecialty)),
    [activeDoctors, selectedSpecialty]
  );

  const canGoNext = () => {
    if (step === 1) return !!selectedChild;
    if (step === 2) return !!selectedSpecialty && !!selectedDoctor;
    if (step === 3) return !!selectedHorario && !!motivo;
    return true;
  };

  const getSpecialtyName = (id) => {
    const s = specialties.find((sp) => sp.id_especialidad === id);
    return s ? s.nombre : "—";
  };

  const formatDateDisplay = (d) => {
    if (!d) return "";
    if (typeof d === "string" && d.includes("-")) {
      return new Date(d + "T00:00:00").toLocaleDateString("es-PE", {
        day: "2-digit", month: "long", year: "numeric",
      });
    }
    return new Date(d).toLocaleDateString("es-PE", {
      day: "2-digit", month: "long", year: "numeric",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await saveAppointment({
        motivo,
        estado: "Pendiente",
        asistencia: "0",
        comentarios: "",
        id_horario: selectedHorario.id_horario,
        id_medico: selectedDoctor.id_medico,
        id_paciente: selectedChild.id_paciente,
        fecha_cita: date,
        hora_cita: time,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.citas(clientId) });
      if (selectedDoctor) queryClient.invalidateQueries({ queryKey: queryKeys.horariosDisponibles(selectedDoctor.id_medico) });
      setMessage("Cita agendada correctamente");
      setTimeout(() => {
        setStep(1);
        setSelectedChild(null);
        setSelectedSpecialty("");
        setSelectedDoctor(null);
        setSelectedHorario(null);
        setDate("");
        setTime("");
        setMotivo("");
        setMessage("");
      }, 2500);
    } catch {
      setMessage("Error al agendar la cita");
    } finally {
      setSaving(false);
    }
  };

  if (!usuario) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 font-medium">
        Debes iniciar sesión para agendar una cita.
      </div>
    );
  }

  if (loading) {
    return <BookAppointmentSkeleton />;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Agendar Nueva Cita</h2>
        <p className="text-gray-500 font-medium mt-1">Selecciona los detalles para reservar una consulta.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold text-center ${
          message.includes("Error") || message.includes("inic")
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {message}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        {["Datos del Paciente", "Especialidad y M\u00e9dico", "Fecha y Hora", "Confirmaci\u00f3n"].map((label, i) => (
          <div key={label} className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold transition-all ${
              step > i + 1
                ? "bg-medi-500 text-white"
                : step === i + 1
                ? "bg-medi-500 text-white shadow-lg shadow-medi-200"
                : "bg-gray-100 text-gray-400"
            }`}>
              {step > i + 1 ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="hidden sm:block">
              <div className={`text-xs font-bold uppercase tracking-wider ${step === i + 1 ? "text-medi-600" : "text-gray-400"}`}>
                Paso {i + 1}
              </div>
              <div className={`text-sm font-bold ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>{label}</div>
            </div>
            {i < 3 && <div className="flex-1 h-px bg-gray-200 last:hidden" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">{"\u00bf"}Para qui{"\u00e9"}n es la cita?</h3>
            {children.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-medium mb-2">No tienes hijos registrados.</p>
                <p className="text-sm text-gray-400">Primero agrega un perfil en "Mis Hijos".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {children.map((child, index) => {
                  const color = colors[index % colors.length];
                  return (
                    <button
                      key={child.id_paciente}
                      onClick={() => setSelectedChild(child)}
                      className={`bg-gradient-to-br ${color.from} ${color.to} text-white rounded-2xl p-6 text-center transition-all shadow-md ${
                        selectedChild?.id_paciente === child.id_paciente
                          ? "ring-4 ring-white ring-offset-2 ring-offset-transparent scale-[1.02] shadow-xl"
                          : "hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-extrabold mx-auto mb-3 shadow-inner">
                        {getInitials(child.nombre_completo)}
                      </div>
                      <div className="text-lg font-extrabold tracking-tight">{child.nombre_completo}</div>
                      <div className="text-white/80 text-sm font-medium">{getAge(child.fecha_nacimiento)} a{"\u00f1"}os</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Especialidad y M{"\u00e9"}dico</h3>
            {activeDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-medium mb-2">No hay m{"\u00e9"}dicos disponibles.</p>
                <p className="text-sm text-gray-400">Por el momento no hay m{"\u00e9"}dicos activos para agendar citas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Especialidad</label>
                  <select value={selectedSpecialty}
                    onChange={(e) => { setSelectedSpecialty(e.target.value); setSelectedDoctor(null); setSelectedHorario(null); }}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none">
                    <option value="">Selecciona una especialidad</option>
                    {specialties.map((s) => (
                      <option key={s.id_especialidad} value={s.id_especialidad}>{s.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">M{"\u00e9"}dico</label>
                  <select value={selectedDoctor?.id_medico || ""}
                    onChange={(e) => {
                      const doc = filteredDoctors.find((d) => d.id_medico === Number(e.target.value));
                      setSelectedDoctor(doc || null);
                    }}
                    disabled={!selectedSpecialty}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none disabled:opacity-40 disabled:cursor-not-allowed">
                    <option value="">Selecciona un m{"\u00e9"}dico</option>
                    {filteredDoctors.map((d) => (
                      <option key={d.id_medico} value={d.id_medico}>
                        {d.usuario?.nombres} {d.usuario?.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {selectedDoctor && (
              <div className="bg-medi-50/50 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-medi-400 to-medi-600 text-white flex items-center justify-center text-lg font-extrabold shadow-inner">
                  {getInitials(`${selectedDoctor.usuario?.nombres} ${selectedDoctor.usuario?.apellidos}`) || "DR"}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{selectedDoctor.usuario?.nombres} {selectedDoctor.usuario?.apellidos}</div>
                  <div className="text-sm text-medi-600 font-medium">{getSpecialtyName(selectedDoctor.id_especialidad)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Selecciona un Turno Disponible</h3>
            {horarios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-medium">No hay horarios disponibles para este médico.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {horarios.map((h) => {
                  const isSelected = selectedHorario?.id_horario === h.id_horario;
                  const fechaStr = h.fecha;
                  const fechaDate = new Date(fechaStr + "T00:00:00");

                  return (
                    <button
                      key={h.id_horario}
                      type="button"
                      onClick={() => {
                        setSelectedHorario(h);
                        setDate(fechaStr);
                        setTime(formatTime(h.hora_inicio));
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-medi-500 bg-medi-50 shadow-md"
                          : "border-gray-100 hover:border-medi-300 hover:bg-medi-50/50"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold ${
                        isSelected ? "bg-medi-500 text-white" : "bg-medi-100 text-medi-600"
                      }`}>
                        {fechaDate.toLocaleDateString("es", { day: "2-digit", timeZone: "UTC" })}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">
                          {fechaDate.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {formatTime(h.hora_inicio)} - {formatTime(h.hora_fin)}
                        </div>
                      </div>
                      {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-medi-600 shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Motivo de la Consulta</label>
              <textarea rows={4} value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all resize-none" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-medi-100 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-medi-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">{"\u00a1"}Cita lista para agendar!</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              Revisa los detalles antes de confirmar. Recibir{"\u00e1"}s un correo con la confirmaci{"\u00f3"}n.
            </p>
            <div className="bg-medi-50/50 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Paciente</span>
                <span className="font-bold text-gray-900">{selectedChild?.nombre_completo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">M{"\u00e9"}dico</span>
                <span className="font-bold text-gray-900">
                  {selectedDoctor?.usuario?.nombres} {selectedDoctor?.usuario?.apellidos}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Especialidad</span>
                <span className="font-bold text-gray-900">{getSpecialtyName(selectedDoctor?.id_especialidad)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Fecha</span>
                <span className="font-bold text-gray-900">{date ? formatDateDisplay(date) : "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Horario</span>
                <span className="font-bold text-gray-900">{selectedHorario ? `${formatTime(selectedHorario.hora_inicio)} - ${formatTime(selectedHorario.hora_fin)}` : "—"}</span>
              </div>
              {motivo && (
                <div className="pt-2 border-t border-medi-100">
                  <span className="text-xs text-gray-500 font-medium">Motivo:</span>
                  <p className="text-sm font-bold text-gray-900 mt-1">{motivo}</p>
                </div>
              )}
            </div>
            <button onClick={handleSave} disabled={saving}
              className="px-10 py-4 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60">
              {saving ? "Agendando..." : "Confirmar y Agendar"}
            </button>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            {"\u2190"} Anterior
          </button>
          {step < 4 && (
            <button onClick={() => canGoNext() && setStep(step + 1)}
              disabled={!canGoNext()}
              className="px-8 py-3 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              Siguiente {"\u2192"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};