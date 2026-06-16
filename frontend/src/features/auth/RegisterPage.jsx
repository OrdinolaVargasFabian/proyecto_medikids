import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, registerClient } from "../../services/api";
import { AuthLayout } from "./AuthLayout";
import { motion, AnimatePresence } from "framer-motion";

const formatPhone = (rawDigits) => {
  if (!rawDigits) return "";
  const match = rawDigits.match(/^(\d{0,3})(\d{0,3})(\d{0,3})$/);
  if (!match) return rawDigits;
  const parts = [match[1], match[2], match[3]].filter(Boolean);
  return parts.join(" ");
};

const passwordRules = [
  { regex: /.{8,}/,  label: "Mínimo 8 caracteres" },
  { regex: /[A-Z]/,  label: "Al menos 1 letra mayúscula" },
  { regex: /[a-z]/,  label: "Al menos 1 letra minúscula" },
  { regex: /\d/,     label: "Al menos 1 número" },
  { regex: /[\W_]/,  label: "Al menos 1 carácter especial" },
];

const ValidationItem = ({ passed, label }) => (
  <div className={`flex items-center gap-1.5 text-xs ${passed ? "text-green-600" : "text-red-400"}`}>
    <span className="text-[11px] font-bold shrink-0 w-4 text-center">
      {passed ? "✓" : "✗"}
    </span>
    {label}
  </div>
);

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");

  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);

  const EyeIcon = ({ visible }) =>
    visible
      ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
      : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (!nombres.trim() || !apellidos.trim()) {
      setError("Nombres y Apellidos son obligatorios.");
      return;
    }

    if (!dni || dni.length !== 8) {
      setError("El DNI es obligatorio y debe tener exactamente 8 dígitos.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombres.trim() || !apellidos.trim()) {
      setError("Nombres y Apellidos son obligatorios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El correo electrónico no es válido (ejemplo: usuario@dominio.com).");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, incluyendo 1 mayúscula, 1 minúscula y 1 carácter especial.");
      return;
    }

    if (!dni || dni.length !== 8) {
      setError("El DNI es obligatorio y debe tener exactamente 8 dígitos.");
      return;
    }

    if (telefono && telefono.length !== 9) {
      setError("El teléfono debe tener exactamente 9 dígitos.");
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser({
        id_rol: 1,
        nombres,
        apellidos,
        email,
        password,
        telefono: telefono ? parseInt(telefono, 10) : 0,
      });
      await registerClient({
        id_usuario: user.id_usuario,
        dni_responsable: dni ? parseInt(dni, 10) : 0,
        direccion: "",
      }).catch(() => {});
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Error al registrar. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>

      {/* Logo MediKids */}
      <div className="mb-5 flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-medi-500">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
          <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
        <span className="text-lg font-extrabold text-gray-900 tracking-tight">Medi<span className="text-medi-500">Kids</span></span>
      </div>

      {/* Cabecera + Stepper */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
          Crear Cuenta
        </h2>

        <div className="flex items-center justify-center">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              step >= 1 ? "bg-medi-600 text-white" : "bg-medi-100 text-gray-400"
            }`}
          >
            {step > 1 ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : "1"}
          </div>

          <div className="relative h-1 w-40 bg-gray-200 overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-medi-600 transition-all duration-500 ease-in-out ${
                step > 1 ? "w-full" : "w-0"
              }`}
            />
          </div>

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              step === 2 ? "bg-medi-600 text-white" : "bg-medi-100 text-gray-400"
            }`}
          >
            2
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            onSubmit={handleNext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="min-h-[262px]">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="reg-nombres" className="block text-sm font-bold text-gray-900 mb-2">
                  Nombres *
                </label>
                <input
                  id="reg-nombres"
                  type="text"
                  required
                  placeholder="Ej. Carlos"
                  value={nombres}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) setNombres(val);
                  }}
                  className="w-full px-4 py-3.5 bg-white border border-medi-200 rounded-lg focus:outline-none focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[15px] text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="reg-apellidos" className="block text-sm font-bold text-gray-900 mb-2">
                  Apellidos *
                </label>
                <input
                  id="reg-apellidos"
                  type="text"
                  required
                  placeholder="Ej. Pérez"
                  value={apellidos}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) setApellidos(val);
                  }}
                  className="w-full px-4 py-3.5 bg-white border border-medi-200 rounded-lg focus:outline-none focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[15px] text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="reg-dni" className="block text-sm font-bold text-gray-900 mb-2">
                  DNI *
                </label>
                <input
                  id="reg-dni"
                  type="text"
                  maxLength={8}
                  placeholder="00000000"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3.5 bg-white border border-medi-200 rounded-lg focus:outline-none focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[15px] text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="reg-telefono" className="block text-sm font-bold text-gray-900 mb-2">
                  Teléfono
                </label>
                <div className="w-full flex items-center bg-white border border-medi-200 rounded-lg focus-within:border-medi-400 focus-within:ring-2 focus-within:ring-medi-200 transition-colors overflow-hidden">
                  <div className="shrink-0 ml-4 flex rounded-sm overflow-hidden" style={{ width: 24, height: 18 }}>
                    <div className="w-1/3 h-full bg-[#D91023]"></div>
                    <div className="w-1/3 h-full bg-white"></div>
                    <div className="w-1/3 h-full bg-[#D91023]"></div>
                  </div>
                  <span className="inline-block w-px h-5 bg-gray-200 mx-3 shrink-0"></span>
                  <input
                    id="reg-telefono"
                    type="text"
                    inputMode="numeric"
                    placeholder="999 888 777"
                    value={formatPhone(telefono)}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "").slice(0, 9);
                      setTelefono(rawValue);
                    }}
                    className="flex-1 min-w-0 w-full px-0 py-3.5 pr-4 bg-transparent border-0 outline-none focus:ring-0 text-[15px] text-gray-900 placeholder-gray-300 font-medium tracking-wider"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-lg text-[15px] font-medium text-white bg-medi-600 hover:bg-medi-700 active:scale-[0.99] transition-all"
            >
              Siguiente
            </button>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="min-h-[262px]">
            <div className="mb-6">
              <label htmlFor="reg-email" className="block text-sm font-bold text-gray-900 mb-2">
                Correo electrónico *
              </label>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => {
                  const val = e.target.value.replace(/[áéíóúÁÉÍÓÚñÑ]/g, "");
                  setEmail(val);
                }}
                className="w-full px-4 py-3.5 bg-white border border-medi-200 rounded-lg focus:outline-none focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[15px] text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="mb-6">
              <div>
                <label htmlFor="reg-password" className="block text-sm font-bold text-gray-900 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 pr-11 bg-white border border-medi-200 rounded-lg focus:outline-none focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[15px] text-gray-900 placeholder-gray-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-1.5">
                      {passwordRules.map((r, i) => (
                        <ValidationItem key={i} passed={r.regex.test(password)} label={r.label} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setStep(1); setError(""); }}
                className="flex-1 py-3.5 px-4 rounded-lg text-[15px] font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 px-4 rounded-lg text-[15px] font-medium text-white bg-medi-600 hover:bg-medi-700 active:scale-[0.99] transition-all disabled:opacity-60"
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </button>
            </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="h-6" />

      {/* Enlace a login */}
      <div className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-bold text-medi-600 hover:text-medi-700 transition-colors">
          Iniciar sesión
        </Link>
      </div>

    </AuthLayout>
  );
};
