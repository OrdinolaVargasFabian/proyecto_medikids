import { useState, useEffect } from "react";
import { getDoctors, getSpecialties, saveDoctorWithUser, updateDoctor, updateUser, toggleDoctorStatus, deleteDoctor } from "../../../services/api";

export const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

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
    setEditingDoctor(null);
    setForm({ nombres: "", apellidos: "", email: "", password: "",
      nro_colegiatura: "", id_especialidad: "", estado: "activo" });
    setShowModal(true);
  };

  const openEdit = (doc) => {
    setEditingDoctor(doc);
    setForm({
      nombres: doc.usuario?.nombres || "",
      apellidos: doc.usuario?.apellidos || "",
      email: doc.usuario?.email || "",
      password: "",
      nro_colegiatura: doc.nro_colegiatura || "",
      id_especialidad: String(doc.id_especialidad || ""),
      estado: doc.estado || "activo",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nombres || !form.apellidos || !form.email || !form.nro_colegiatura || !form.id_especialidad) {
      setMessage("Completa todos los campos obligatorios");
      return;
    }

    if (!editingDoctor && !form.password) {
      setMessage("La contraseña es obligatoria para nuevos médicos");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      if (editingDoctor) {
        await updateUser(editingDoctor.id_usuario, {
          id_rol: 2,
          nombres: form.nombres,
          apellidos: form.apellidos,
          email: form.email,
          telefono: 0,
        });

        await updateDoctor(editingDoctor.id_medico, {
          nro_colegiatura: form.nro_colegiatura,
          url_foto: editingDoctor.url_foto || "",
          estado: form.estado,
          id_usuario: editingDoctor.id_usuario,
          id_especialidad: parseInt(form.id_especialidad, 10),
        });

        const docs = await getDoctors();
        setDoctors(docs);
        setMessage("Médico actualizado correctamente");
      } else {
        await saveDoctorWithUser({
          ...form,
          id_especialidad: parseInt(form.id_especialidad, 10),
          telefono: 0,
        });
        const docs = await getDoctors();
        setDoctors(docs);
        setMessage("Médico registrado correctamente");
      }
      setShowModal(false);
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage(editingDoctor ? "Error al actualizar médico" : "Error al registrar médico");
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

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((d) => d.id_medico !== id));
      setConfirmDelete(null);
      setMessage("Médico eliminado permanentemente");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error al eliminar médico");
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
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Gesti&oacute;n de M&eacute;dicos</h2>
          <p className="text-gray-500 font-medium mt-1">Administra los perfiles de los m&eacute;dicos del sistema.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar M&eacute;dico
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
          Cargando m&eacute;dicos...
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">M&eacute;dico</th>
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
                      No hay m&eacute;dicos registrados
                    </td>
                  </tr>
                ) : doctors.map((doc) => (
                  <tr key={doc.id_medico} className="hover:bg-medi-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medi-400 to-medi-600 text-white flex items-center justify-center text-sm font-extrabold">
                          {getInitials(doc.usuario?.nombres, doc.usuario?.apellidos) || "DR"}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{doc.usuario?.nombres} {doc.usuario?.apellidos}</div>
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(doc)}
                          className="px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmDelete(doc)}
                          className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => handleToggle(doc.id_medico)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                            doc.estado === "activo"
                              ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                              : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                        >
                          {doc.estado === "activo" ? "Desactivar" : "Activar"}
                        </button>
                      </div>
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
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              {editingDoctor ? "Editar M&eacute;dico" : "Agregar M&eacute;dico"}
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-6">
              {editingDoctor ? "Actualiza los datos del m&eacute;dico." : "Registra un nuevo m&eacute;dico con su usuario de acceso."}
            </p>

            <div className="space-y-4">
              <div className="bg-medi-50/50 rounded-2xl px-5 py-3">
                <p className="text-xs font-bold text-medi-600 uppercase tracking-wider mb-3">Datos del M&eacute;dico</p>
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
                  <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Correo electr&oacute;nico *</label>
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">
                    {editingDoctor ? "Nueva contrase&ntilde;a (dejar vac&iacute;o para mantener)" : "Contrase&ntilde;a *"}
                  </label>
                  <input type="password" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Visible para usuarios</p>
                  <p className="text-xs text-gray-500">El m&eacute;dico aparecer&aacute; en el directorio p&uacute;blico</p>
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
                {saving ? "Guardando..." : editingDoctor ? "Actualizar M&eacute;dico" : "Agregar M&eacute;dico"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Eliminar M&eacute;dico</h3>
            <p className="text-sm text-gray-500 font-medium mb-1">
              &iquest;Est&aacute;s seguro de eliminar permanentemente a <strong>{confirmDelete.usuario?.nombres} {confirmDelete.usuario?.apellidos}</strong>?
            </p>
            <p className="text-xs text-red-500 font-medium mb-6">Esta acci&oacute;n no se puede deshacer.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmDelete.id_medico)}
                className="px-6 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl shadow-lg transition-all">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
