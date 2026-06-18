import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaceVerification } from "./FaceVerification";
import { adminVerify2FA } from "../../services/api";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const Fake404 = () => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
    <div className="text-center">
      <h1 className="text-7xl font-black text-gray-200 mb-4">404</h1>
      <p className="text-gray-400 text-lg font-medium">Página no encontrada</p>
    </div>
  </div>
);

const EyeIcon = ({ visible }) =>
  visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );

export const AdminLoginPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(() => !hash);
  const [valid, setValid] = useState(() => !!hash);
  const [stage, setStage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [preAuthToken, setPreAuthToken] = useState("");
  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    if (!hash) return;
    axios.post(`${API_URL}/admin/admin-hash/verify`, { hash })
      .then(() => {
        setValid(true);
        setValidating(false);
      })
      .catch(() => {
        setValid(false);
        setValidating(false);
      });
  }, [hash]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/admin/auth/login`, { email, password });

      if (res.data.preAuthToken) {
        setPreAuthToken(res.data.preAuthToken);
        setStage("face");
      } else if (res.data.message && res.data.message.includes("Código")) {
        setStage("otp");
      } else if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Credenciales inválidas o IP no autorizada";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminVerify2FA(email, otpCode);
      localStorage.setItem("token", res.token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Código inválido o expirado");
    } finally {
      setLoading(false);
    }
  };

  const handleFaceCancel = () => {
    setStage("login");
    setPreAuthToken("");
    setError("");
  };

  if (validating) return null;

  if (!valid) return <Fake404 />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl font-black text-white tracking-tighter leading-[0.9]">
            <span className="text-medi-400">medi</span><span className="text-white">kids</span>
          </div>
          <p className="text-gray-400 text-sm font-medium mt-2">Panel Administrativo</p>
        </div>

        {stage === "login" && (
          <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-5 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-medi-400 to-medi-600 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-white">Acceso Restringido</h2>
              <p className="text-gray-400 text-xs font-medium mt-1">Solo personal autorizado</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-400/30 transition-all outline-none placeholder:text-gray-500"
                placeholder="admin@medikids.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-400/30 transition-all outline-none placeholder:text-gray-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        )}

        {stage === "face" && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <FaceVerification
              email={email}
              preAuthToken={preAuthToken}
              onCancel={handleFaceCancel}
            />
          </div>
        )}

        {stage === "otp" && (
          <form onSubmit={handleOtpSubmit} className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-5 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-medi-400 to-medi-600 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-white">Código de Verificación</h2>
              <p className="text-gray-400 text-xs font-medium mt-1">
                Ingresa el código de 6 dígitos enviado a tu correo
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Código</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-bold tracking-[0.3em] text-center focus:border-medi-400 focus:ring-2 focus:ring-medi-400/30 transition-all outline-none placeholder:text-gray-500"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>

            <button
              type="button"
              onClick={() => setStage("login")}
              className="w-full py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Volver
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
