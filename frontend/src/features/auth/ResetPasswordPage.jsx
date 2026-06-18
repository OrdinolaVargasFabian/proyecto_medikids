import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../../services/api";
import { AuthLayout } from "./AuthLayout";

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

const EyeIcon = ({ visible }) =>
  visible
    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setMessage("Contraseña actualizada exitosamente. Ya puedes iniciar sesión.");
      setPassword("");
    } catch (err) {
      setError(err.response?.data || "El enlace es inválido o expiró.");
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

      {/* Cabecera */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Nueva contraseña
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {message ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium mb-6">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="reset-password" className="block text-sm font-bold text-gray-900 mb-2">
              Contraseña *
            </label>
            <div className="relative">
              <input
                id="reset-password"
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
            {password && (
              <div className="mt-3 space-y-1.5">
                {passwordRules.map((r, i) => (
                  <ValidationItem key={i} passed={r.regex.test(password)} label={r.label} />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-lg text-[15px] font-medium text-white bg-medi-600 hover:bg-medi-700 active:scale-[0.99] transition-all disabled:opacity-60 mb-6"
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      )}

      {/* Enlace a login */}
      <div className="text-center text-sm text-gray-500">
        <Link to="/login" className="font-bold text-medi-600 hover:text-medi-700 transition-colors">
          Volver a iniciar sesión
        </Link>
      </div>

    </AuthLayout>
  );
};
