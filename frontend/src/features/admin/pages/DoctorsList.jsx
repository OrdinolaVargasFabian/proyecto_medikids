import { useState, useEffect } from "react";
import { getDoctors, getSpecialties, saveDoctorWithUser, toggleDoctorStatus } from "../../../services/api";

export const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    nombres: "", apellidos: "", email: "", password: "",
    nro_colegiatura: "", id_especialidad: "", estado: "activo",
  });

  useEffect(() => {
    Promise.all([getDoctors(), getSpecialties()])
      .then(([docs, specs]) => {
        setDoctors(docs);
        setSpecialties(specs);
      })
      .catch(() => setMessage("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setForm({ nombres: "", apellidos: "", email: "", password: "",
      nro_colegiatura: "", id_especialidad: "", estado: "activo" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nombres || !form.apellidos || !form.email || !form.password || !form.nro_colegiatura || !form.id_especialidad) {
      setMessage("Completa todos los campos obligatorios");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await saveDoctorWithUser({
        ...form,
        id_especialidad: parseInt(form.id_especialidad, 10),
        telefono: 0,
      });
      const docs = await getDoctors();
      setDoctors(docs);
      setShowModal(false);
      setMessage("Médico registrado correctamente");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error al registrar médico");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleDoctorStatus(id);
      setDoctors((prev) => prev.map((d) => (d.id_medico === id ? updated : d)));
    } catch {
      setMessage("Error al cambiar estado");
    }
  };

  const getInitials = (nombres, apellidos) =>
    ((nombres || "")[0] || "") + ((apellidos || "")[0] || "");

  const getSpecialtyName = (id) => {
    const s = specialties.find((sp) => sp.id_especialidad === id);
    return s ? s.nombre : "—";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Gestión de Médicos</h2>
          <p className="text-gray-500 font-medium mt-1">Administra los perfiles de los médicos del sistema.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar Médico
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-sm font-bold text-center ${
          message.includes("Error") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 font-medium">
          Cargando médicos...
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Médico</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Colegiatura</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Especialidad</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                      No hay médicos registrados
                    </td>
                  </tr>
                ) : doctors.map((doc) => (
                  <tr key={doc.id_medico} className="hover:bg-medi-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medi-400 to-medi-600 text-white flex items-center justify-center text-sm font-extrabold">
                          {getInitials(doc.nombres, doc.apellidos) || "DR"}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{doc.nombres} {doc.apellidos}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{doc.nro_colegiatura}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1.5 rounded-full">
                        {getSpecialtyName(doc.id_especialidad)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(doc.id_medico)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                          doc.estado === "activo"
                            ? "text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"
                            : "text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {doc.estado === "activo" ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggle(doc.id_medico)}
                        className="px-4 py-2 text-xs font-bold text-medi-600 bg-medi-50 hover:bg-medi-100 rounded-xl transition-colors"
                      >
                        {doc.estado === "activo" ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Agregar Médico</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">Registra un nuevo médico con su usuario de acceso.</p>

            <div className="space-y-4">
              <div className="bg-medi-50/50 rounded-2xl px-5 py-3">
                <p className="text-xs font-bold text-medi-600 uppercase tracking-wider mb-3">Datos del Médico</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Nombres *</label>
                    <input type="text" value={form.nombres}
                      onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Apellidos *</label>
                    <input type="text" value={form.apellidos}
                      onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Nro. Colegiatura *</label>
                  <input type="text" value={form.nro_colegiatura}
                    onChange={(e) => setForm({ ...form, nro_colegiatura: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Especialidad *</label>
                  <select value={form.id_especialidad}
                    onChange={(e) => setForm({ ...form, id_especialidad: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none">
                    <option value="">Seleccionar</option>
                    {specialties.map((s) => (
                      <option key={s.id_especialidad} value={s.id_especialidad}>{s.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-medi-50/50 rounded-2xl px-5 py-3">
                <p className="text-xs font-bold text-medi-600 uppercase tracking-wider mb-3">Credenciales de Acceso</p>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Correo electrónico *</label>
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="doctor@medikids.com"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Contraseña *</label>
                  <input type="password" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mín. 6 caracteres"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Visible para usuarios</p>
                  <p className="text-xs text-gray-500">El médico aparecerá en el directorio público</p>
                </div>
                <button
                  onClick={() => setForm({ ...form, estado: form.estado === "activo" ? "inactivo" : "activo" })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    form.estado === "activo" ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    form.estado === "activo" ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowModal(false)}
                className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60">
                {saving ? "Registrando..." : "Agregar Médico"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
