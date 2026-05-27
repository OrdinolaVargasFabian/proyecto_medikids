import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login as loginApi, registerUser, registerClient, getClienteByUserId /*, verify2FA, resend2FA */ } from "../../services/api";
import registerImg from "../../assets/images/register.avif";
import loginImg from "../../assets/images/login.avif";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*
  // ── 2FA (desactivado) ──────────────────────────────────────────────────
  const [verifyEmail, setVerifyEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!resendSuccess) return;
    const t = setTimeout(() => {
      setResendSuccess(false);
      setResendCooldown(5);
    }, 2000);
    return () => clearTimeout(t);
  }, [resendSuccess]);

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setResendSuccess(false);
    try {
      await resend2FA(verifyEmail);
      setResendSuccess(true);
    } catch (err) {
      setError("Error al reenviar el código");
    } finally {
      setLoading(false);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────
  */

  const [regNombres, setRegNombres] = useState("");
  const [regApellidos, setRegApellidos] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regDni, setRegDni] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // ── Redirigir inmediato si ya hay sesión activa ──
  const sesToken = localStorage.getItem("token");
  if (sesToken) {
    try {
      const payload = JSON.parse(atob(sesToken.split(".")[1]));
      const exp = payload.exp;
      if (!exp || exp >= Math.floor(Date.now() / 1000)) {
        const rol = Number(payload.id_rol);
        const target = rol === 1 ? "/padres"
                     : rol === 2 ? "/doctor"
                     : rol === 3 ? "/admin/dashboard"
                     : "/padres";
        return <Navigate to={target} replace />;
      }
      localStorage.removeItem("token");
    } catch {
      localStorage.removeItem("token");
    }
  }

  const EyeIcon = ({ visible }) =>
    visible
      ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
      : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;

  const goToDashboard = (usuario) => {
    const rol = usuario?.id_rol;
    if (rol === 1 || rol === "1") navigate("/padres");
    else if (rol === 2 || rol === "2") navigate("/doctor");
    else if (rol === 3 || rol === "3") navigate("/admin/dashboard");
    else navigate("/padres");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));

      if (res.usuario?.id_rol == 1) {
        try {
          const cliente = await getClienteByUserId(res.usuario.id_usuario);
          if (cliente?.id_cliente) {
            localStorage.setItem("cliente_id", String(cliente.id_cliente));
          }
        } catch {
          // Aún no tiene registro en cliente; se creará al completar el registro
        }
      }

      goToDashboard(res.usuario);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /*
  // ── handleLogin con 2FA ───────────────────────────────────────────────
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
  // ──────────────────────────────────────────────────────────────────────────
  */

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Nombres y apellidos validations
    if (!regNombres.trim() || !regApellidos.trim()) {
      setError("Nombres y Apellidos son obligatorios.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setError("El correo electrónico no es válido (ejemplo: usuario@dominio.com).");
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(regPassword)) {
      setError("La contraseña debe tener al menos 6 caracteres, incluyendo 1 mayúscula, 1 minúscula y 1 carácter especial.");
      return;
    }

    if (regPassword !== regConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // DNI validation (exactly 8 digits)
    if (!regDni || regDni.length !== 8) {
      setError("El DNI es obligatorio y debe tener exactamente 8 dígitos.");
      return;
    }

    // Telefono validation (exactly 9 digits if entered)
    if (regTelefono && regTelefono.length !== 9) {
      setError("El teléfono debe tener exactamente 9 dígitos.");
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
    <div className="w-full h-dvh font-sans selection:bg-medi-900 selection:text-white overflow-hidden">
      <div className="w-full h-full flex">
        <div className={`w-full lg:w-1/2 h-full overflow-y-auto flex flex-col justify-center items-center p-4 sm:p-8 bg-gradient-to-br from-medi-50 via-white to-medi-100 ${tab === "register" ? "lg:order-2" : ""}`}>
          <div className="w-full max-w-md flex flex-col gap-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] shadow-[0_24px_60px_rgba(184,202,118,0.2)] border border-medi-200/60 p-6 sm:p-10 relative">
                <div className="hidden sm:block absolute -top-20 -right-20 w-60 h-60 rounded-full bg-medi-200/30 blur-3xl pointer-events-none" />
                <div className="hidden sm:block absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-medi-100/40 blur-3xl pointer-events-none" />

                <div className="text-center mb-6 relative z-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {tab === "verify" ? "Verificación" : tab === "login" ? "Inicia Sesión" : "Regístrate"}
                  </h2>
                  <p className="text-gray-500 font-medium mt-1 text-sm">
                    {tab === "login"
                      ? "Accede a tu cuenta para continuar"
                      : tab === "verify"
                        ? "Ingresa el código que enviamos a tu correo"
                        : "Crea tu cuenta y empieza hoy"}
                  </p>
                </div>

                <div className="flex w-full bg-medi-100/60 rounded-xl sm:rounded-2xl mb-6 relative z-10">
                    <button
                      onClick={() => { setTab("login"); setError(""); setRegNombres(""); setRegApellidos(""); setRegEmail(""); setRegPassword(""); setRegConfirm(""); }}
                      className={`flex-1 py-2.5 text-center font-bold text-sm rounded-lg transition-all duration-200 ${
                        tab === "login"
                          ? "bg-white text-medi-700 shadow-sm"
                          : "text-medi-500 hover:text-medi-700"
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => { setTab("register"); setError(""); setEmail(""); setPassword(""); }}
                      className={`flex-1 py-2.5 text-center font-bold text-sm rounded-lg transition-all duration-200 ${
                        tab === "register"
                          ? "bg-white text-medi-700 shadow-sm"
                          : "text-medi-500 hover:text-medi-700"
                      }`}
                    >
                      Registro
                    </button>
                    </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium text-center relative z-10">
                    {error}
                  </div>
                )}

                  {tab === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5 pl-1">
                          Correo electrónico
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl sm:rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1.5 pl-1">
                          Contraseña
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 sm:px-5 py-3 sm:py-3.5 pr-12 bg-white border border-gray-200 rounded-xl sm:rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <EyeIcon visible={showPassword} />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 px-4 rounded-xl sm:rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                          {loading ? "Ingresando..." : "Iniciar Sesión"}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4 relative z-10">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="reg-nombres" className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                            Nombres
                          </label>
                          <input
                            id="reg-nombres"
                            type="text"
                            required
                            value={regNombres}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) setRegNombres(val);
                            }}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="reg-apellidos" className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                            Apellidos
                          </label>
                          <input
                            id="reg-apellidos"
                            type="text"
                            required
                            value={regApellidos}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) setRegApellidos(val);
                            }}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reg-email" className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                          Correo electrónico
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[áéíóúÁÉÍÓÚñÑ]/g, "");
                            setRegEmail(val);
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="reg-dni" className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                            DNI
                          </label>
                          <input
                            id="reg-dni"
                            type="text"
                            maxLength={8}
                            value={regDni}
                            onChange={(e) => setRegDni(e.target.value.replace(/\D/g, ""))}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="reg-telefono" className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                            Teléfono
                          </label>
                          <input
                            id="reg-telefono"
                            type="text"
                            maxLength={9}
                            value={regTelefono}
                            onChange={(e) => setRegTelefono(e.target.value.replace(/\D/g, ""))}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="reg-password" className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                            Contraseña
                          </label>
                          <div className="relative">
                            <input
                              id="reg-password"
                              type={showRegPassword ? "text" : "password"}
                              required
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              className="w-full px-4 py-2.5 pr-11 bg-white border border-gray-200 rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <EyeIcon visible={showRegPassword} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="reg-confirm" className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                            Confirmar
                          </label>
                          <div className="relative">
                            <input
                              id="reg-confirm"
                              type={showRegConfirm ? "text" : "password"}
                              required
                              value={regConfirm}
                              onChange={(e) => setRegConfirm(e.target.value)}
                              className="w-full px-4 py-2.5 pr-11 bg-white border border-gray-200 rounded-xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 font-medium shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegConfirm(!showRegConfirm)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <EyeIcon visible={showRegConfirm} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                          {loading ? "Registrando..." : "Crear Cuenta"}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  )}
              </div>
          </div>
        </div>

        <div
          className={`hidden lg:flex w-1/2 h-full bg-white items-center justify-center overflow-hidden ${tab === "register" ? "lg:order-1" : ""}`}
        >
          <div className="w-full h-full">
            <img src={tab === "register" ? registerImg : loginImg} alt={tab === "register" ? "Registro" : "Inicio de sesión"} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};
