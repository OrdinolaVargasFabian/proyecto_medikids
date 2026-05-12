import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const LoginPage = () => {
  const [tab, setTab] = useState("login");

  return (
    <div className="h-screen w-full font-sans selection:bg-medi-900 selection:text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full flex ${tab === "register" ? "flex-row-reverse" : ""}`}
        >
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-6 sm:p-12 bg-gradient-to-br from-medi-50 via-white to-medi-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md flex flex-col gap-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_24px_60px_rgba(184,202,118,0.2)] border border-medi-200/60 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-medi-200/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-medi-100/40 blur-3xl pointer-events-none" />

            <div className="flex justify-center w-full mb-4 relative z-10">
              <Link
                to="/"
                className="flex flex-col items-start text-left leading-[0.9] font-black text-medi-500 tracking-tighter text-5xl hover:opacity-80 transition-opacity drop-shadow-sm"
              >
                <span>medi</span>
                <span>kids</span>
              </Link>
            </div>

            <div className="text-center mb-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                ¡Bienvenido!
              </h2>
              <p className="text-gray-500 font-medium mt-2 text-sm">
                {tab === "login"
                  ? "Accede a tu cuenta para continuar"
                  : "Crea tu cuenta y empieza hoy"}
              </p>
            </div>

            <div className="flex w-full bg-medi-100/60 rounded-2xl p-1 mb-6 relative z-10">
              <button
                onClick={() => setTab("login")}
                className={`flex-1 py-2.5 text-center font-bold text-sm rounded-xl transition-all duration-200 ${
                  tab === "login"
                    ? "bg-white text-medi-700 shadow-sm"
                    : "text-medi-500 hover:text-medi-700"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setTab("register")}
                className={`flex-1 py-2.5 text-center font-bold text-sm rounded-xl transition-all duration-200 ${
                  tab === "register"
                    ? "bg-white text-medi-700 shadow-sm"
                    : "text-medi-500 hover:text-medi-700"
                }`}
              >
                Registro
              </button>
            </div>

            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 relative z-10"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5 pl-1">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1.5 pl-1">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/padres"
                      className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 active:scale-[0.98] transition-all"
                    >
                      Continuar
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 relative z-10"
                >
                  <div>
                    <label htmlFor="reg-name" className="block text-sm font-bold text-gray-700 mb-1.5 pl-1">
                      Nombre completo
                    </label>
                    <input
                      id="reg-name"
                      name="name"
                      type="text"
                      required
                      placeholder="María García"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-bold text-gray-700 mb-1.5 pl-1">
                      Correo electrónico
                    </label>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-password" className="block text-sm font-bold text-gray-700 mb-1.5 pl-1">
                      Contraseña
                    </label>
                    <input
                      id="reg-password"
                      name="password"
                      type="password"
                      required
                      placeholder="Mínimo 8 caracteres"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-confirm" className="block text-sm font-bold text-gray-700 mb-1.5 pl-1">
                      Confirmar contraseña
                    </label>
                    <input
                      id="reg-confirm"
                      name="confirm"
                      type="password"
                      required
                      placeholder="Repite tu contraseña"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all text-sm text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 active:scale-[0.98] transition-all"
                    >
                      Crear Cuenta
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
        className="hidden lg:flex w-1/2 h-full relative bg-gradient-to-br from-medi-400 via-medi-500 to-medi-600 items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center gap-6 text-white px-12 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
          <h3 className="text-3xl font-extrabold tracking-tight">MediKids</h3>
          <p className="text-white/80 font-medium text-lg max-w-sm leading-relaxed">
            Cuidamos la salud de tus hijos con tecnología y corazón.
          </p>
          <div className="flex gap-3 mt-4">
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <div className="w-2 h-2 rounded-full bg-white/90" />
            <div className="w-2 h-2 rounded-full bg-white/60" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
    </div>
  );
};