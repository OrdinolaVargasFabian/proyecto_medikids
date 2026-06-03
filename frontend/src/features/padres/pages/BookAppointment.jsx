import { useState, useMemo } from "react";
import { CreditCardIcon, BanknotesIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useChildren, useDoctores, useEspecialidades, useHorariosDisponibles, useCliente, useTarjetas, queryKeys } from "../../../hooks/useApiData";
import { saveAppointment, savePayment } from "../../../services/api";
import { BookAppointmentSkeleton } from "../../../app/components/skeletons/BookAppointmentSkeleton";

const marcaColorBook = {
  Visa: "from-blue-700 to-blue-900",
  Mastercard: "from-red-600 to-orange-600",
  Amex: "from-teal-600 to-emerald-800",
  Otro: "from-gray-600 to-gray-800",
};

const colors = [
  { from: "from-pink-400", to: "to-rose-500" },
  { from: "from-blue-400", to: "to-indigo-500" },
  { from: "from-amber-400", to: "to-orange-500" },
  { from: "from-emerald-400", to: "to-teal-500" },
  { from: "from-violet-400", to: "to-purple-500" },
];

const getInitials = (name) =>
  name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "";

const getAge = (birthDate) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 0;
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
  const [metodoPago, setMetodoPago] = useState("");
  const [metodoBD, setMetodoBD] = useState("");
  const [tipoComprobante, setTipoComprobante] = useState(""); // "boleta" | "factura"
  const [ruc, setRuc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [selectedTarjeta, setSelectedTarjeta] = useState(null); // tarjeta guardada seleccionada
  const [usarNuevaTarjeta, setUsarNuevaTarjeta] = useState(false);

  const { data: children = [], isLoading: loadingChildren } = useChildren(clientId);
  const { data: doctors = [], isLoading: loadingDoctores } = useDoctores();
  const { data: specialties = [], isLoading: loadingEspecialidades } = useEspecialidades();
  const { data: horarios = [], isLoading: loadingHorarios } = useHorariosDisponibles(selectedDoctor?.id_medico);
  const { data: clienteData } = useCliente(usuario?.id_usuario);
  const { data: tarjetasGuardadas = [] } = useTarjetas(usuario?.id_usuario);

  const loading = loadingChildren || loadingDoctores || loadingEspecialidades || (!clientId && !loadingChildren);

  const activeDoctors = useMemo(
    () => doctors.filter((d) => d.activo === "1" && d.estado === "activo"),
    [doctors]
  );

  const filteredDoctors = useMemo(
    () => activeDoctors.filter((d) => d.id_especialidad === selectedSpecialty?.id_especialidad),
    [activeDoctors, selectedSpecialty]
  );

  const canGoNext = () => {
    if (step === 1) return !!selectedChild;
    if (step === 2) return !!selectedSpecialty?.id_especialidad && !!selectedDoctor;
    if (step === 3) return !!selectedHorario && !!motivo;
    if (step === 4) {
      if (!metodoPago) return false;
      if (metodoPago === "tarjeta" && !selectedTarjeta && !usarNuevaTarjeta) return false;
      if (!tipoComprobante) return false;
      if (tipoComprobante === "factura") return ruc.length >= 11 && razonSocial.trim().length > 0;
      return true;
    }
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
      // Determinar documento según tipo de comprobante
      const numeroDocumento = tipoComprobante === "factura"
        ? ruc
        : String(clienteData?.dni_responsable ?? "");
      const nombreRazonSocial = tipoComprobante === "factura"
        ? razonSocial
        : `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

      // Guardar pago
      const pagoGuardado = await savePayment({
        monto: selectedSpecialty.precio,
        metodo_pago: metodoBD,
      });

      // Guardar cita
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
        id_pago: pagoGuardado.id_pago,
        tipoComprobante,
        numeroDocumento,
        nombreRazonSocial,
        metodoPago: metodoBD,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.citas(clientId) });
      if (selectedDoctor) queryClient.invalidateQueries({ queryKey: queryKeys.horariosDisponibles(selectedDoctor.id_medico) });
      setMessage("Cita agendada correctamente");
      setTimeout(() => {
        setStep(1);
        setSelectedChild(null);
        setSelectedSpecialty(null);
        setSelectedDoctor(null);
        setSelectedHorario(null);
        setDate("");
        setTime("");
        setMotivo("");
        setMetodoPago("");
        setMetodoBD("");
        setTipoComprobante("");
        setRuc("");
        setRazonSocial("");
        setSelectedTarjeta(null);
        setUsarNuevaTarjeta(false);
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
        <div className={`p-4 rounded-2xl text-sm font-bold text-center ${message.includes("Error") || message.includes("inic")
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-green-50 text-green-700 border border-green-200"
          }`}>
          {message}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        {["Datos del Paciente", "Especialidad y Médico", "Fecha y Hora", "Pasarela de Pago", "Confirmación"].map((label, i) => (
          <div key={label} className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold transition-all ${step > i + 1
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
            {i < 4 && <div className="flex-1 h-px bg-gray-200 last:hidden" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">¿Para quién es la cita?</h3>
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
                      className={`bg-gradient-to-br ${color.from} ${color.to} text-white rounded-2xl p-6 text-center transition-all shadow-md ${selectedChild?.id_paciente === child.id_paciente
                        ? "ring-4 ring-white ring-offset-2 ring-offset-transparent scale-[1.02] shadow-xl"
                        : "hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                        }`}
                    >
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-extrabold mx-auto mb-3 shadow-inner">
                        {getInitials(child.nombre_completo)}
                      </div>
                      <div className="text-lg font-extrabold tracking-tight">{child.nombre_completo}</div>
                      <div className="text-white/80 text-sm font-medium">{getAge(child.fecha_nacimiento)} años</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Especialidad y Médico</h3>
            {activeDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-medium mb-2">No hay médicos disponibles.</p>
                <p className="text-sm text-gray-400">Por el momento no hay médicos activos para agendar citas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Especialidad</label>
                  <select value={selectedSpecialty?.id_especialidad || ""}
                    onChange={(e) => {
                      const sp = specialties.find((s) => s.id_especialidad === Number(e.target.value));
                      setSelectedSpecialty(sp || null);
                      setSelectedDoctor(null);
                      setSelectedHorario(null);
                    }}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none">
                    <option value="">Selecciona una especialidad</option>
                    {specialties.map((s) => (
                      <option key={s.id_especialidad} value={s.id_especialidad}>{s.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Médico</label>
                  <select value={selectedDoctor?.id_medico || ""}
                    onChange={(e) => {
                      const doc = filteredDoctors.find((d) => d.id_medico === Number(e.target.value));
                      setSelectedDoctor(doc || null);
                    }}
                    disabled={!selectedSpecialty}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none disabled:opacity-40 disabled:cursor-not-allowed">
                    <option value="">Selecciona un médico</option>
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
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${isSelected
                        ? "border-medi-500 bg-medi-50 shadow-md"
                        : "border-gray-100 hover:border-medi-300 hover:bg-medi-50/50"
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold ${isSelected ? "bg-medi-500 text-white" : "bg-medi-100 text-medi-600"
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
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Pasarela de Pago</h3>
            <p className="text-gray-500 font-medium">Selecciona tu método de pago preferido.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: "yapeplin", label: "Yape / Plin", metodo_bd: "Transferencia", bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-700", icon: <QrCodeIcon className="w-5 h-5 text-purple-700" /> },
                { id: "paypal", label: "PayPal", metodo_bd: "Transferencia", bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-700", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#1d4ed8" d="M20.437 7.104a4 4 0 0 0-.573-.523a4.72 4.72 0 0 0-1.157-3.74C17.623 1.619 15.775 1 13.214 1H7.001a1.89 1.89 0 0 0-1.864 1.592l-2.59 16.406a1.533 1.533 0 0 0 1.516 1.785h2.664l-.082.52A1.467 1.467 0 0 0 8.093 23h3.235a1.76 1.76 0 0 0 1.75-1.47l.641-4.031l.011-.055h.299c4.032 0 6.55-1.993 7.285-5.762a5.15 5.15 0 0 0-.877-4.578m-12.595 6.6l-.714 4.535l-.086.544H4.606L7.097 3h6.117c1.936 0 3.318.404 3.993 1.164a2.97 2.97 0 0 1 .607 2.733l-.018.113c-.012.076-.023.15-.044.246a5.85 5.85 0 0 1-2.005 3.67a6.68 6.68 0 0 1-4.217 1.183H9.707a1.88 1.88 0 0 0-1.865 1.595m11.51-2.405c-.552 2.828-2.243 4.145-5.323 4.145h-.484a1.76 1.76 0 0 0-1.75 1.473l-.65 4.074L8.717 21l.478-3.034l.612-3.853h1.719c.157 0 .295-.023.448-.029c.359-.012.717-.026 1.053-.068c.205-.025.393-.072.59-.108c.273-.05.545-.1.801-.171c.19-.053.368-.122.55-.186c.238-.085.474-.174.697-.279q.25-.12.486-.257a7 7 0 0 0 .613-.392q.214-.153.415-.32a7 7 0 0 0 .537-.52c.113-.12.228-.237.333-.367a7 7 0 0 0 .48-.693c.076-.122.161-.235.232-.363a8 8 0 0 0 .52-1.154l.03-.068l.014-.032a4.3 4.3 0 0 1 .026 2.193" /></svg> },
                { id: "tarjeta", label: "Tarjeta", metodo_bd: "Tarjeta", bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-700", icon: <CreditCardIcon className="w-5 h-5 text-gray-700" /> },
                { id: "efectivo", label: "Efectivo", metodo_bd: "Efectivo", bg: "bg-medi-100", border: "border-medi-200", text: "text-medi-700", icon: <BanknotesIcon className="w-5 h-5 text-medi-700" /> },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setMetodoPago(method.id);
                    setMetodoBD(method.metodo_bd);
                  }}
                  className={`rounded-2xl p-5 text-center transition-all border-2 ${metodoPago === method.id
                    ? "border-medi-500 bg-medi-50 shadow-lg scale-[1.02]"
                    : "border-gray-100 bg-white hover:border-medi-300 hover:shadow-md"
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${method.bg} ${method.border} border flex items-center justify-center mx-auto mb-3`}>
                    {method.icon}
                  </div>
                  <div className={`text-sm font-extrabold ${metodoPago === method.id ? "text-medi-600" : "text-gray-700"}`}>
                    {method.label}
                  </div>
                </button>
              ))}
            </div>

            {metodoPago === "yapeplin" && (
              <div className="bg-purple-50 rounded-2xl p-6 space-y-4 border border-purple-100">
                <h4 className="font-extrabold text-purple-700">Pagar con Yape / Plin</h4>
                <p className="text-sm text-purple-600 font-medium">Escanea el QR con tu app de Yape o Plin.</p>
                <div className="bg-white rounded-xl p-4 w-32 h-32 mx-auto flex items-center justify-center border border-purple-200">
                  <span className="text-gray-400 text-xs font-medium text-center">QR aquí</span>
                </div>
                <input type="tel" placeholder="Número de teléfono"
                  className="w-full px-5 py-3.5 bg-white border border-purple-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all" />
              </div>
            )}

            {metodoPago === "paypal" && (
              <div className="bg-blue-50 rounded-2xl p-6 space-y-4 border border-blue-100">
                <h4 className="font-extrabold text-blue-700">Pagar con PayPal</h4>
                <input type="email" placeholder="Correo de tu cuenta PayPal"
                  className="w-full px-5 py-3.5 bg-white border border-blue-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all" />
              </div>
            )}

            {metodoPago === "tarjeta" && (
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-200">
                <h4 className="font-extrabold text-gray-800">Pagar con Tarjeta</h4>

                {/* Tarjetas guardadas */}
                {tarjetasGuardadas.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tarjetas guardadas</p>
                    {tarjetasGuardadas.map((t) => (
                      <button
                        key={t.id_tarjeta}
                        type="button"
                        onClick={() => { setSelectedTarjeta(t); setUsarNuevaTarjeta(false); }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                          selectedTarjeta?.id_tarjeta === t.id_tarjeta
                            ? "border-medi-500 bg-medi-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-medi-300"
                        }`}
                      >
                        <div className={`w-12 h-8 rounded-lg bg-gradient-to-br ${marcaColorBook[t.marca] || marcaColorBook.Otro} flex items-center justify-center shrink-0`}>
                          <span className="text-white text-xs font-bold">{t.marca === "Visa" ? "VISA" : t.marca === "Mastercard" ? "MC" : t.marca === "Amex" ? "AMEX" : "CARD"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900">{t.alias}</div>
                          <div className="text-xs text-gray-500 font-mono">•••• {t.ultimos_digitos} · {String(t.mes_vencimiento).padStart(2,"0")}/{String(t.anio_vencimiento).slice(-2)}</div>
                        </div>
                        {t.es_predeterminada && (
                          <span className="text-xs font-bold text-medi-600 bg-medi-100 px-2 py-0.5 rounded-full shrink-0">Default</span>
                        )}
                        {selectedTarjeta?.id_tarjeta === t.id_tarjeta && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-medi-600 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setUsarNuevaTarjeta(true); setSelectedTarjeta(null); }}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                        usarNuevaTarjeta
                          ? "border-medi-500 bg-medi-50 shadow-md"
                          : "border-dashed border-gray-300 bg-white hover:border-medi-400"
                      }`}
                    >
                      <div className="w-12 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-600">Usar otra tarjeta</span>
                    </button>
                  </div>
                )}

                {/* Formulario de nueva tarjeta */}
                {(usarNuevaTarjeta || tarjetasGuardadas.length === 0) && (
                  <div className="space-y-3 pt-2">
                    <input type="text" placeholder="Número de tarjeta" maxLength={19}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/AA" maxLength={5}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                      <input type="text" placeholder="CVV" maxLength={3}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                    </div>
                    <input type="text" placeholder="Nombre en la tarjeta"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                  </div>
                )}
              </div>
            )}

            {metodoPago === "efectivo" && (
              <div className="bg-medi-50 rounded-2xl p-6 space-y-3 border border-medi-200">
                <h4 className="font-extrabold text-medi-700">Pago en Efectivo</h4>
                <p className="text-sm text-medi-600 font-medium">Realiza el pago en caja al momento de llegar a tu cita.</p>
                <div className="bg-white rounded-xl p-4 border border-medi-200 text-sm text-gray-600 font-medium space-y-2">
                  <p>Caja principal - Piso 1</p>
                  <p>Llega 15 minutos antes de tu cita</p>
                  <p>Presenta tu DNI al momento del pago</p>
                </div>
              </div>
            )}

            {/* ── Tipo de Comprobante ── */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de Comprobante</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "boleta", label: "Boleta", desc: "Persona natural (DNI)" },
                  { id: "factura", label: "Factura", desc: "Empresa (RUC)" },
                ].map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => { setTipoComprobante(tipo.id); setRuc(""); setRazonSocial(""); }}
                    className={`rounded-2xl p-4 text-left transition-all border-2 ${tipoComprobante === tipo.id
                      ? "border-medi-500 bg-medi-50 shadow-md"
                      : "border-gray-100 bg-white hover:border-medi-300"
                      }`}
                  >
                    <div className={`text-sm font-extrabold ${tipoComprobante === tipo.id ? "text-medi-600" : "text-gray-700"}`}>
                      🧾 {tipo.label}
                    </div>
                    <div className="text-xs text-gray-400 font-medium mt-1">{tipo.desc}</div>
                  </button>
                ))}
              </div>

              {tipoComprobante === "boleta" && (
                <div className="bg-medi-50 rounded-2xl p-4 border border-medi-200">
                  <p className="text-xs font-bold text-medi-600 uppercase tracking-wider mb-1">DNI del Responsable</p>
                  <p className="text-sm font-bold text-gray-900">
                    {clienteData?.dni_responsable ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Se usará el DNI registrado en tu perfil.</p>
                </div>
              )}

              {tipoComprobante === "factura" && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">RUC *</label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="Ej: 20123456789"
                      value={ruc}
                      onChange={(e) => setRuc(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                    {ruc.length > 0 && ruc.length < 11 && (
                      <p className="text-xs text-red-500 mt-1">El RUC debe tener 11 dígitos.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Razón Social *</label>
                    <input
                      type="text"
                      placeholder="Nombre de la empresa"
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-medi-100 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-medi-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">¡Cita lista para agendar!</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              Revisa los detalles antes de confirmar. Recibirás un correo con la confirmación.
            </p>

            <div className="bg-medi-50/50 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Detalles de la Cita</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Paciente</span>
                <span className="font-bold text-gray-900">{selectedChild?.nombre_completo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Médico</span>
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

            <div className="bg-gray-50 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Detalles del Pago</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Método de Pago</span>
                <span className="font-bold text-gray-900 capitalize">
                  {metodoPago === "yapeplin" && "Yape / Plin"}
                  {metodoPago === "paypal" && "PayPal"}
                  {metodoPago === "tarjeta" && selectedTarjeta
                    ? `${selectedTarjeta.alias} (•••• ${selectedTarjeta.ultimos_digitos})`
                    : metodoPago === "tarjeta" ? "Tarjeta" : null}
                  {metodoPago === "efectivo" && "Efectivo"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Tipo de Transacción</span>
                <span className="font-bold text-gray-900">{metodoBD}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                <span className="text-gray-500 font-medium">Monto a Pagar</span>
                <span className="font-extrabold text-medi-600 text-base">
                  {selectedSpecialty?.precio != null ? `S/ ${Number(selectedSpecialty.precio).toFixed(2)}` : "—"}
                </span>
              </div>
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
            ← Anterior
          </button>
          {step < 5 && (
            <button onClick={() => canGoNext() && setStep(step + 1)}
              disabled={!canGoNext()}
              className="px-8 py-3 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              {step === 3 ? "Proceder al Pago →" : "Siguiente →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
