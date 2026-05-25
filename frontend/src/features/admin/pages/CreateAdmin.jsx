import { useState } from "react";
import { UserPlus, Mail, Lock, User, Phone, Shield } from "lucide-react";
import { crearAdmin } from "../../../services/api";

const ROLES = [
  { id: 3, label: "Super Admin (control total)" },
  { id: 4, label: "Admin Operativo" },
];

export const CreateAdmin = () => {
  const [form, setForm] = useState({
    idRol: 4,
    email: "",
    password: "",
    nombres: "",
    apellidos: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "idRol" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.nombres || !form.apellidos || !form.telefono) {
      setToast({ message: "Completa todos los campos obligatorios", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await crearAdmin({ ...form, telefono: Number(form.telefono) });
      setToast({ message: "Admin creado correctamente", type: "success" });
      setForm({ idRol: 4, email: "", password: "", nombres: "", apellidos: "", telefono: "" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Error al crear admin", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-medi-100 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-medi-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Admin</h1>
          <p className="text-sm text-gray-500">Crea un nuevo usuario administrativo</p>
        </div>
      </div>

      {toast.message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold ${
          toast.type === "error"
            ? "bg-red-50 text-red-600 border border-red-100"
            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
        }`}>
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rol</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="idRol"
              value={form.idRol}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-medi-400 focus:border-transparent appearance-none"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-medi-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-medi-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombres</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                placeholder="Nombres"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-medi-400 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Apellidos</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-medi-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="999999999"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-medi-400 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-medi-500 hover:bg-medi-600 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? "Creando..." : "Crear Admin"}
        </button>
      </form>
    </div>
  );
};
