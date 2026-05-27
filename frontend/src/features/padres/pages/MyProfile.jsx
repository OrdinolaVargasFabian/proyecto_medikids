import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile, queryKeys } from "../../../hooks/useApiData";
import { updateMyProfile, updateClient, changePassword } from "../../../services/api";
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

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile({
        id_rol: usuario.id_rol,
        nombres,
        apellidos,
        email,
        telefono: telefono ? parseInt(telefono, 10) : 0,
      });

      const updatedUser = { ...usuario, nombres, apellidos, email, telefono: telefono ? parseInt(telefono, 10) : 0 };
      localStorage.setItem("usuario", JSON.stringify(updatedUser));
      setUsuario(updatedUser);

      if (cliente) {
        await updateClient(cliente.id_cliente, {
          id_usuario: usuario.id_usuario,
          dni_responsable: dni ? parseInt(dni, 10) : 0,
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
