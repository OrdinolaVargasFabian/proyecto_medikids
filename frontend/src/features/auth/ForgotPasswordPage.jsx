import { useState } from "react";
import { forgotPassword } from "../../services/api";
import { Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await forgotPassword(email);
      setMessage("Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
    } catch (err) {
      setError("Ocurrió un error al procesar tu solicitud.");
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
          Recuperar contraseña
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
            <label htmlFor="forgot-email" className="block text-sm font-bold text-gray-900 mb-2">
              Correo electrónico *
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-medi-200 rounded-lg focus:outline-none focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-[15px] text-gray-900 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-lg text-[15px] font-medium text-white bg-medi-600 hover:bg-medi-700 active:scale-[0.99] transition-all disabled:opacity-60 mb-6"
          >
            {loading ? "Enviando..." : "Enviar instrucciones"}
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
