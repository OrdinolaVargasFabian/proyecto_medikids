import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { login as loginApi, verify2FA, registerUser, registerClient } from "../../services/api";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [code, setCode] = useState("");

  const [regNombres, setRegNombres] = useState("");
  const [regApellidos, setRegApellidos] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regDni, setRegDni] = useState("");

  const goToDashboard = (usuario) => {
    const rol = usuario?.id_rol;
    if (rol === 1 || rol === "1" || rol === 2 || rol === "2") navigate("/padres");
    else if (rol === 3 || rol === "3") navigate("/admin");
    else navigate("/padres");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginApi(email, password);
      setVerifyEmail(email);
      setTab("verify");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verify2FA(verifyEmail, code);
      localStorage.setItem("token", res.token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));
      goToDashboard(res.usuario);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Código inválido o expirado. Solicita un nuevo código.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (regPassword !== regConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (regPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (regDni.length > 0 && regDni.length < 8) {
      setError("El DNI debe tener al menos 8 dígitos");
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser({
        id_rol: 1,
        nombres: regNombres,
        apellidos: regApellidos,
        email: regEmail,
        password: regPassword,
        telefono: regTelefono ? parseInt(regTelefono, 10) : 0,
      });
      await registerClient({
        id_usuario: user.id_usuario,
        dni_responsable: regDni ? parseInt(regDni, 10) : 0,
        direccion: "",
      }).catch(() => {});
      setError("");
      setTab("login");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Error al registrar. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full font-sans selection:bg-medi-900 selection:text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full flex ${tab === "register" ? "flex-row-reverse" : ""}`}
        >
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-2 sm:p-8 bg-gradient-to-br from-medi-50 via-white to-medi-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[260px] sm:max-w-md flex flex-col gap-1 sm:gap-6"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-[2.5rem] shadow-[0_24px_60px_rgba(184,202,118,0.2)] border border-medi-200/60 p-2 sm:p-10 relative">
                <div className="hidden sm:block absolute -top-20 -right-20 w-60 h-60 rounded-full bg-medi-200/30 blur-3xl pointer-events-none" />
                <div className="hidden sm:block absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-medi-100/40 blur-3xl pointer-events-none" />

                <div className="flex justify-center w-full mb-0 sm:mb-4 relative z-10">
                  <Link
                    to="/"
                    className="flex flex-col items-start text-left leading-[0.9] font-black text-medi-500 tracking-tighter text-xl sm:text-5xl hover:opacity-80 transition-opacity drop-shadow-sm"
                  >
                    <span>medi</span>
                    <span>kids</span>
                  </Link>
                </div>

                <div className="text-center mb-0.5 sm:mb-6 relative z-10">
                  <h2 className="text-sm sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {tab === "verify" ? "Verificación" : "¡Bienvenido!"}
                  </h2>
                  <p className="text-gray-500 font-medium mt-0 sm:mt-1 text-[8px] sm:text-sm">
                    {tab === "login"
                      ? "Accede a tu cuenta para continuar"
                      : tab === "verify"
                        ? "Ingresa el código que enviamos a tu correo"
                        : "Crea tu cuenta y empieza hoy"}
                  </p>
                </div>

                {tab !== "verify" && (
                  <div className="flex w-full bg-medi-100/60 rounded-lg sm:rounded-2xl mb-0.5 sm:mb-6 relative z-10">
                    <button
                      onClick={() => { setTab("login"); setError(""); }}
                      className={`flex-1 py-2.5 text-center font-bold text-sm rounded-xl transition-all duration-200 ${
                        tab === "login"
                          ? "bg-white text-medi-700 shadow-sm"
                          : "text-medi-500 hover:text-medi-700"
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => { setTab("register"); setError(""); }}
                      className={`flex-1 py-2.5 text-center font-bold text-sm rounded-xl transition-all duration-200 ${
                        tab === "register"
                          ? "bg-white text-medi-700 shadow-sm"
                          : "text-medi-500 hover:text-medi-700"
                      }`}
                    >
                      Registro
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium text-center relative z-10">
                    {error}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {tab === "login" ? (
                    <motion.form
                      key="login"
                      onSubmit={handleLogin}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-1 sm:space-y-4 relative z-10"
                    >
                      <div>
                        <label htmlFor="email" className="block text-[9px] sm:text-sm font-bold text-gray-700 mb-0 sm:mb-1.5 pl-1">
                          Correo electrónico
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@correo.com"
                          className="w-full px-2 sm:px-5 py-1.5 sm:py-3.5 bg-white border border-gray-200 rounded-lg sm:rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-[9px] sm:text-sm font-bold text-gray-700 mb-0 sm:mb-1.5 pl-1">
                          Contraseña
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="********"
                          className="w-full px-2 sm:px-5 py-1.5 sm:py-3.5 bg-white border border-gray-200 rounded-lg sm:rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                        />
                      </div>

                      <div className="pt-0 sm:pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-1.5 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-2xl shadow-lg text-[10px] sm:text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                          {loading ? "Verificando..." : "Continuar"}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </motion.form>
                  ) : tab === "verify" ? (
                    <motion.form
                      key="verify"
                      onSubmit={handleVerify}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-1 sm:space-y-4 relative z-10"
                    >
                      <div className="text-center mb-0 sm:mb-2">
                        <p className="text-[9px] sm:text-sm text-gray-500">
                          Código enviado a <strong className="text-gray-700">{verifyEmail}</strong>
                        </p>
                      </div>

                      <div>
                        <label htmlFor="code" className="block text-[9px] sm:text-sm font-bold text-gray-700 mb-0 sm:mb-1.5 pl-1">
                          Código de verificación
                        </label>
                        <input
                          id="code"
                          name="code"
                          type="text"
                          required
                          maxLength={6}
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="w-full px-2 sm:px-5 py-1.5 sm:py-3.5 bg-white border border-gray-200 rounded-lg sm:rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm text-center text-lg sm:text-2xl tracking-[0.5em]"
                        />
                      </div>

                      <div className="pt-0 sm:pt-2">
                        <button
                          type="submit"
                          disabled={loading || code.length !== 6}
                          className="w-full flex items-center justify-center gap-2 py-1.5 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-2xl shadow-lg text-[10px] sm:text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                          {loading ? "Verificando..." : "Verificar"}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => { setTab("login"); setError(""); }}
                          className="text-xs sm:text-sm text-medi-500 hover:text-medi-700 font-medium"
                        >
                          ← Volver al inicio de sesión
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      onSubmit={handleRegister}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-1 relative z-10"
                    >
                      <div className="grid grid-cols-2 gap-1 sm:gap-3">
                        <div>
                          <label htmlFor="reg-nombres" className="block text-xs font-bold text-gray-700 mb-1 pl-1">
                            Nombres
                          </label>
                          <input
                            id="reg-nombres"
                            type="text"
                            required
                            value={regNombres}
                            onChange={(e) => setRegNombres(e.target.value)}
                            placeholder="Tu Nombre"
                            className="w-full px-2 sm:px-4 py-1 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="reg-apellidos" className="block text-[9px] sm:text-xs font-bold text-gray-700 mb-0 sm:mb-1 pl-1">
                            Apellidos
                          </label>
                          <input
                            id="reg-apellidos"
                            type="text"
                            required
                            value={regApellidos}
                            onChange={(e) => setRegApellidos(e.target.value)}
                            placeholder="Tus Apellidos"
                            className="w-full px-2 sm:px-4 py-1 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reg-email" className="block text-[9px] sm:text-xs font-bold text-gray-700 mb-0 sm:mb-1 pl-1">
                          Correo electrónico
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="tu@correo.com"
                          className="w-full px-2 sm:px-4 py-1 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-1 sm:gap-3">
                        <div>
                          <label htmlFor="reg-telefono" className="block text-[9px] sm:text-xs font-bold text-gray-700 mb-0 sm:mb-1 pl-1">
                            Teléfono
                          </label>
                          <input
                            id="reg-telefono"
                            type="tel"
                            value={regTelefono}
                            onChange={(e) => setRegTelefono(e.target.value.replace(/\D/g, ""))}
                            placeholder="999888777"
                            className="w-full px-2 sm:px-4 py-1 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="reg-dni" className="block text-[9px] sm:text-xs font-bold text-gray-700 mb-0 sm:mb-1 pl-1">
                            DNI
                          </label>
                          <input
                            id="reg-dni"
                            type="text"
                            value={regDni}
                            onChange={(e) => setRegDni(e.target.value.replace(/\D/g, ""))}
                            placeholder="12345678"
                            className="w-full px-2 sm:px-4 py-1 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 sm:gap-3">
                        <div>
                          <label htmlFor="reg-password" className="block text-[9px] sm:text-xs font-bold text-gray-700 mb-0 sm:mb-1 pl-1">
                            Contraseña
                          </label>
                          <input
                            id="reg-password"
                            type="password"
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Mín. 6"
                            className="w-full px-2 sm:px-4 py-1 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="reg-confirm" className="block text-[9px] sm:text-xs font-bold text-gray-700 mb-0 sm:mb-1 pl-1">
                            Confirmar
                          </label>
                          <input
                            id="reg-confirm"
                            type="password"
                            required
                            value={regConfirm}
                            onChange={(e) => setRegConfirm(e.target.value)}
                            placeholder="Repite"
                            className="w-full px-2 sm:px-4 py-1 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[10px] sm:text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="pt-0 sm:pt-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-1.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl shadow-lg text-[10px] sm:text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                          {loading ? "Registrando..." : "Crear Cuenta"}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <motion.div
            layout="position"
            transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.5 }}
            className="hidden lg:flex w-1/2 h-full bg-white items-center justify-center"
          >
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
