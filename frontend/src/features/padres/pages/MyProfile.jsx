import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile, useTarjetas, queryKeys } from "../../../hooks/useApiData";
import { updateMyProfile, updateClient, changePassword, saveTarjeta, deleteTarjeta, setPredeterminadaTarjeta } from "../../../services/api";
import { MyProfileSkeleton } from "../../../app/components/skeletons/MyProfileSkeleton";

const EyeIcon = ({ visible }) =>
  visible
    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;

const CheckIcon = () =>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;

const XIcon = () =>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;

const getPasswordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 5);
};

const strengthLabel = ["Muy débil", "Débil", "Regular", "Buena", "Fuerte", "Muy fuerte"];

const detectMarca = (num) => {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  return "Otro";
};

const marcaColor = {
  Visa: "from-blue-700 to-blue-900",
  Mastercard: "from-red-600 to-orange-600",
  Amex: "from-teal-600 to-emerald-800",
  Otro: "from-gray-600 to-gray-800",
};

const MarcaIcon = ({ marca }) => {
  if (marca === "Visa") return (
    <span className="text-white font-extrabold italic text-lg tracking-tight">VISA</span>
  );
  if (marca === "Mastercard") return (
    <span className="flex items-center gap-0.5">
      <span className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
      <span className="w-5 h-5 rounded-full bg-yellow-400 opacity-90 -ml-2" />
    </span>
  );
  if (marca === "Amex") return (
    <span className="text-white font-extrabold text-xs tracking-widest">AMEX</span>
  );
  return <span className="text-white text-xs font-bold">CARD</span>;
};

const CARD_INITIAL = { alias: "", numero: "", nombre_titular: "", vencimiento: "" };

const formatCardNumber = (val) => {
  const digits = val.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};
const strengthColor = ["bg-red-500", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-medi-400", "bg-medi-500"];

const PasswordField = ({ id, label, value, onChange, visible, onToggle, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 pr-12 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        <EyeIcon visible={visible} />
      </button>
    </div>
  </div>
);

export const MyProfile = () => {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  });

  const queryClient = useQueryClient();
  const { data: cliente, isLoading: loading } = useProfile(usuario?.id_usuario);
  const { data: tarjetas = [], isLoading: loadingTarjetas } = useTarjetas(usuario?.id_usuario);

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");

  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState(CARD_INITIAL);
  const [cardFormError, setCardFormError] = useState("");
  const [savingCard, setSavingCard] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const strength = getPasswordStrength(newPassword);

  useEffect(() => {
    if (!confirmPassword || !newPassword) {
      setPasswordError("");
    } else if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (!usuario) return;
    setNombres(usuario.nombres || "");
    setApellidos(usuario.apellidos || "");
    setEmail(usuario.email || "");
    setTelefono(usuario.telefono ? String(usuario.telefono) : "");

    if (cliente) {
      setDni(cliente.dni_responsable ? String(cliente.dni_responsable) : "");
      setDireccion(cliente.direccion || "");
    }
  }, [usuario, cliente]);

  useEffect(() => {
    if (!message.text) return;
    const t = setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    return () => clearTimeout(t);
  }, [message]);

  const initials =
    ((usuario?.nombres || "")[0] || "U") +
    ((usuario?.apellidos || "")[0] || "").toUpperCase();

  const roleLabel = usuario?.id_rol === 1
    ? "Padre / Tutor"
    : usuario?.id_rol === 2
      ? "Médico"
      : usuario?.id_rol === 3
        ? "Administrador"
        : "Usuario";

  const handleSaveCard = async () => {
    const digits = cardForm.numero.replace(/\s/g, "");
    if (!cardForm.alias.trim()) { setCardFormError("El alias es obligatorio"); return; }
    if (digits.length < 13) { setCardFormError("Número de tarjeta inválido"); return; }
    if (!cardForm.nombre_titular.trim()) { setCardFormError("El nombre es obligatorio"); return; }
    const [mes, anio] = cardForm.vencimiento.split("/");
    if (!mes || !anio || isNaN(Number(mes)) || isNaN(Number(anio))) {
      setCardFormError("Fecha de vencimiento inválida (MM/AA)");
      return;
    }
    setSavingCard(true);
    setCardFormError("");
    try {
      await saveTarjeta({
        alias: cardForm.alias.trim(),
        ultimos_digitos: digits.slice(-4),
        marca: detectMarca(digits),
        nombre_titular: cardForm.nombre_titular.trim(),
        mes_vencimiento: parseInt(mes, 10),
        anio_vencimiento: 2000 + parseInt(anio, 10),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tarjetas(usuario.id_usuario) });
      setShowCardModal(false);
      setCardForm(CARD_INITIAL);
      setMessage({ text: "Tarjeta guardada correctamente", type: "success" });
    } catch {
      setCardFormError("Error al guardar la tarjeta");
    } finally {
      setSavingCard(false);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await deleteTarjeta(id);
      queryClient.invalidateQueries({ queryKey: queryKeys.tarjetas(usuario.id_usuario) });
      setMessage({ text: "Tarjeta eliminada", type: "success" });
    } catch {
      setMessage({ text: "Error al eliminar la tarjeta", type: "error" });
    }
  };

  const handleSetPredeterminada = async (id) => {
    try {
      await setPredeterminadaTarjeta(id);
      queryClient.invalidateQueries({ queryKey: queryKeys.tarjetas(usuario.id_usuario) });
    } catch {
      setMessage({ text: "Error al actualizar la tarjeta", type: "error" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile({
        id_rol: usuario.id_rol,
        nombres,
        apellidos,
        email,
        telefono: telefono ? parseInt(telefono.replace(/\D/g, ''), 10) || 0 : 0,
      });

      const updatedUser = { ...usuario, nombres, apellidos, email, telefono: telefono ? parseInt(telefono.replace(/\D/g, ''), 10) || 0 : 0 };
      localStorage.setItem("usuario", JSON.stringify(updatedUser));
      setUsuario(updatedUser);

      if (cliente) {
        await updateClient(cliente.id_cliente, {
          id_usuario: usuario.id_usuario,
          dni_responsable: dni ? parseInt(dni.replace(/\D/g, ''), 10) || 0 : 0,
          direccion,
        });
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.profile(usuario.id_usuario) });
      setMessage({ text: "Datos actualizados correctamente", type: "success" });
    } catch {
      setMessage({ text: "Error al guardar los cambios", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(usuario.id_usuario, { currentPassword, newPassword });
      setMessage({ text: "Contraseña actualizada correctamente", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage({ text: "Error al actualizar la contraseña", type: "error" });
    } finally {
      setSavingPassword(false);
    }
  };

  const showMessage = message.text;
  const isError = message.type === "error";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        <div className="flex-1 min-w-0 space-y-6">

          {loading ? <MyProfileSkeleton /> : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-medi-400 to-medi-600 p-5 sm:p-6 lg:p-8 text-white flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-inner shrink-0">
                  {initials || "U"}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">{nombres} {apellidos}</h3>
                  <p className="text-medi-100 text-xs sm:text-sm font-medium">{roleLabel}</p>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombres</label>
                    <input
                      type="text"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      className="w-full px-4 lg:px-5 py-3 lg:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Apellidos</label>
                    <input
                      type="text"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      className="w-full px-4 lg:px-5 py-3 lg:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 lg:px-5 py-3 lg:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                      placeholder="999888777"
                      className="w-full px-4 lg:px-5 py-3 lg:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">DNI</label>
                    <input
                      type="text"
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                      placeholder="12345678"
                      className="w-full px-4 lg:px-5 py-3 lg:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dirección</label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Av. Principal 123"
                      className="w-full px-4 lg:px-5 py-3 lg:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-3.5 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Mis Tarjetas ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Mis Tarjetas</h3>
              <button
                onClick={() => { setShowCardModal(true); setCardForm(CARD_INITIAL); setCardFormError(""); }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-xs font-bold rounded-xl shadow transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar Tarjeta
              </button>
            </div>

            {loadingTarjetas ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-medi-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tarjetas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-500">No tienes tarjetas guardadas</p>
                <p className="text-xs text-gray-400 mt-1">Agrega una para agilizar tus pagos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tarjetas.map((t) => (
                  <div key={t.id_tarjeta} className="relative group">
                    {/* Tarjeta visual */}
                    <div className={`bg-gradient-to-br ${marcaColor[t.marca] || marcaColor.Otro} rounded-2xl p-5 text-white shadow-lg`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Alias</p>
                          <p className="text-white font-bold text-sm mt-0.5">{t.alias}</p>
                        </div>
                        <MarcaIcon marca={t.marca} />
                      </div>
                      <p className="text-white/80 text-base font-mono tracking-widest mb-4">
                        •••• •••• •••• {t.ultimos_digitos}
                      </p>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider">Titular</p>
                          <p className="text-white font-semibold text-sm">{t.nombre_titular}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs uppercase tracking-wider">Vence</p>
                          <p className="text-white font-semibold text-sm">
                            {String(t.mes_vencimiento).padStart(2, "0")}/{String(t.anio_vencimiento).slice(-2)}
                          </p>
                        </div>
                      </div>
                      {t.es_predeterminada && (
                        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    {/* Acciones */}
                    <div className="flex gap-2 mt-2">
                      {!t.es_predeterminada && (
                        <button
                          onClick={() => handleSetPredeterminada(t.id_tarjeta)}
                          className="flex-1 py-2 text-xs font-bold text-medi-600 bg-medi-50 hover:bg-medi-100 rounded-xl transition-colors"
                        >
                          Usar por defecto
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCard(t.id_tarjeta)}
                        className="flex-1 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Modal Agregar Tarjeta ── */}
          <AnimatePresence>
            {showCardModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={(e) => { if (e.target === e.currentTarget) setShowCardModal(false); }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-extrabold text-gray-900">Nueva Tarjeta</h4>
                    <button
                      onClick={() => setShowCardModal(false)}
                      className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Vista previa mini de la tarjeta */}
                  <div className={`bg-gradient-to-br ${marcaColor[detectMarca(cardForm.numero)]} rounded-2xl p-4 text-white`}>
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-white/70 text-xs font-medium">{cardForm.alias || "Alias de la tarjeta"}</p>
                      <MarcaIcon marca={detectMarca(cardForm.numero)} />
                    </div>
                    <p className="font-mono text-base tracking-widest mb-3">
                      {cardForm.numero
                        ? cardForm.numero.replace(/\d(?=\d{4})/g, "•").replace(/\s/g, " ")
                        : "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex justify-between text-xs">
                      <span>{cardForm.nombre_titular || "NOMBRE TITULAR"}</span>
                      <span>{cardForm.vencimiento || "MM/AA"}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Alias *</label>
                      <input
                        type="text"
                        placeholder="Ej: Mi Visa personal"
                        value={cardForm.alias}
                        onChange={(e) => setCardForm((f) => ({ ...f, alias: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Número de Tarjeta *</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardForm.numero}
                        maxLength={19}
                        onChange={(e) => setCardForm((f) => ({ ...f, numero: formatCardNumber(e.target.value) }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-mono font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre del Titular *</label>
                      <input
                        type="text"
                        placeholder="Como aparece en la tarjeta"
                        value={cardForm.nombre_titular}
                        onChange={(e) => setCardForm((f) => ({ ...f, nombre_titular: e.target.value.toUpperCase() }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Vencimiento *</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardForm.vencimiento}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "");
                            if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                            setCardForm((f) => ({ ...f, vencimiento: v }));
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {cardFormError && (
                    <p className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      {cardFormError}
                    </p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setShowCardModal(false)}
                      className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveCard}
                      disabled={savingCard}
                      className="flex-1 py-3 text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 rounded-2xl shadow transition-all disabled:opacity-60"
                    >
                      {savingCard ? "Guardando..." : "Guardar Tarjeta"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 lg:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Cambiar Contraseña</h3>

            <div className="space-y-5">
              <PasswordField
                id="currentPassword"
                label="Contraseña Actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                visible={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
                placeholder="Ingresa tu contraseña actual"
              />

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <PasswordField
                  id="newPassword"
                  label="Nueva Contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  visible={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                  placeholder="Mín. 6 caracteres"
                />
                <PasswordField
                  id="confirmPassword"
                  label="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  visible={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  placeholder="Repite la nueva contraseña"
                />
              </div>

              {newPassword && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strengthColor[strength]}`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500 shrink-0 w-16 text-right">
                      {strengthLabel[strength]}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      { check: newPassword.length >= 6, label: "Al menos 6 caracteres" },
                      { check: /[A-Z]/.test(newPassword), label: "Una mayúscula" },
                      { check: /[a-z]/.test(newPassword), label: "Una minúscula" },
                      { check: /[0-9]/.test(newPassword), label: "Un número" },
                      { check: /[^A-Za-z0-9]/.test(newPassword), label: "Un carácter especial" },
                    ].map(({ check, label }) => (
                      <li
                        key={label}
                        className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                          check ? "text-emerald-600" : "text-gray-400"
                        }`}
                      >
                        <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          check ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                        }`}>
                          {check ? <CheckIcon /> : <XIcon />}
                        </span>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-red-500 flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  {passwordError}
                </motion.p>
              )}

              <button
                onClick={handlePasswordChange}
                disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword || !!passwordError}
                className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-3.5 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white text-sm font-bold rounded-2xl transition-all disabled:cursor-not-allowed"
              >
                {savingPassword ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border ${
                  isError
                    ? "bg-white border-l-4 border-l-red-500 text-red-800"
                    : "bg-white border-l-4 border-l-emerald-500 text-emerald-800"
                }`}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg ${
                  isError
                    ? "bg-gradient-to-br from-red-500 to-red-600"
                    : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                }`}>
                  {isError
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  }
                </div>
                <p className="flex-1 text-sm font-bold">{message.text}</p>
                <button
                  onClick={() => setMessage({ text: "", type: "" })}
                  className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-black/5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Notificaciones</h3>
            <div className="space-y-2">
              {[
                { label: "Recordatorio de citas", desc: "24h antes de cada cita." },
                { label: "Resultados de estudios", desc: "Cuando estén listos." },
                { label: "Promociones", desc: "Ofertas y novedades." },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900">{n.label}</div>
                    <div className="text-xs text-gray-500 font-medium">{n.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-medi-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medi-500" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
