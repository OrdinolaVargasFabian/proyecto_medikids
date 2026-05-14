import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getClienteByUserId, updateUser, updateClient } from "../../../services/api";

export const MyProfile = () => {
  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  }, []);

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    if (!usuario) return;
    setNombres(usuario.nombres || "");
    setApellidos(usuario.apellidos || "");
    setEmail(usuario.email || "");
    setTelefono(usuario.telefono ? String(usuario.telefono) : "");

    getClienteByUserId(usuario.id_usuario)
      .then((c) => {
        setCliente(c);
        setDni(c.dni_responsable ? String(c.dni_responsable) : "");
        setDireccion(c.direccion || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [usuario]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
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
      await updateUser(usuario.id_usuario, {
        id_rol: usuario.id_rol,
        nombres,
        apellidos,
        email,
        password: usuario.password,
        telefono: telefono ? parseInt(telefono, 10) : 0,
      });

      const updatedUser = { ...usuario, nombres, apellidos, email, telefono: telefono ? parseInt(telefono, 10) : 0 };
      localStorage.setItem("usuario", JSON.stringify(updatedUser));

      if (cliente) {
        await updateClient(cliente.id_cliente, {
          id_usuario: usuario.id_usuario,
          dni_responsable: dni ? parseInt(dni, 10) : 0,
          direccion,
        });
      }

      setMessage("Datos actualizados correctamente");
    } catch {
      setMessage("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 font-medium">
              Cargando perfil...
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-medi-400 to-medi-600 p-8 text-white flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-extrabold shadow-inner">
                  {initials || "U"}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight">{nombres} {apellidos}</h3>
                  <p className="text-medi-100 text-sm font-medium">{roleLabel}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombres</label>
                    <input
                      type="text"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Apellidos</label>
                    <input
                      type="text"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                      placeholder="999888777"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">DNI</label>
                    <input
                      type="text"
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                      placeholder="12345678"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dirección</label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Av. Principal 123"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3.5 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <button
                    onClick={() => {
                      setNombres(usuario.nombres || "");
                      setApellidos(usuario.apellidos || "");
                      setEmail(usuario.email || "");
                      setTelefono(usuario.telefono ? String(usuario.telefono) : "");
                      if (cliente) {
                        setDni(cliente.dni_responsable ? String(cliente.dni_responsable) : "");
                        setDireccion(cliente.direccion || "");
                      }
                      setMessage("");
                    }}
                    className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border ${
                  message.includes("Error")
                    ? "bg-white border-l-4 border-l-red-500 text-red-800"
                    : "bg-white border-l-4 border-l-emerald-500 text-emerald-800"
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                  message.includes("Error")
                    ? "bg-gradient-to-br from-red-500 to-red-600"
                    : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                }`}>
                  {message.includes("Error")
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{message}</p>
                </div>
                <button
                  onClick={() => setMessage("")}
                  className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 self-start">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Notificaciones</h3>
          <div className="space-y-3">
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
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-medi-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medi-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
