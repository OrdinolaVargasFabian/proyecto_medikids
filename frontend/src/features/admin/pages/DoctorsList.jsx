import { useState } from "react";

const initialDoctors = [
  { id: 1, name: "Dra. María García", email: "maria.garcia@medikids.com", phone: "+52 55 1111 0001", specialty: "Pediatría General", status: "Activo", description: "Especialista en pediatría general con 15 años de experiencia." },
  { id: 2, name: "Dr. Carlos Mendoza", email: "carlos.mendoza@medikids.com", phone: "+52 55 1111 0002", specialty: "Neurología Pediátrica", status: "Activo", description: "Neurólogo pediatra certificado, subespecialidad en epilepsia infantil." },
  { id: 3, name: "Dr. Andrés Torres", email: "andres.torres@medikids.com", phone: "+52 55 1111 0003", specialty: "Odontopediatría", status: "Activo", description: "Odontopediatra con enfoque en niños con necesidades especiales." },
  { id: 4, name: "Dra. Laura Jiménez", email: "laura.jimenez@medikids.com", phone: "+52 55 1111 0004", specialty: "Dermatología Pediátrica", status: "Inactivo", description: "Dermatóloga pediatra, experiencia en dermatitis atópica severa." },
  { id: 5, name: "Dr. Roberto Sánchez", email: "roberto.sanchez@medikids.com", phone: "+52 55 1111 0005", specialty: "Cardiología Pediátrica", status: "Activo", description: "Cardiólogo infantil, especialista en cardiopatías congénitas." },
];

const specialties = [
  "Pediatría General",
  "Neurología Pediátrica",
  "Odontopediatría",
  "Dermatología Pediátrica",
  "Cardiología Pediátrica",
  "Oftalmología Pediátrica",
  "Psicología Infantil",
];

export const DoctorsList = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", specialty: "", status: "Activo", description: "" });

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", specialty: "", status: "Activo", description: "" });
    setShowModal(true);
  };

  const openEdit = (doc) => {
    setEditingId(doc.id);
    setForm({ name: doc.name, email: doc.email, phone: doc.phone, specialty: doc.specialty, status: doc.status, description: doc.description });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setDoctors((prev) => prev.map((d) => (d.id === editingId ? { ...d, ...form } : d)));
    } else {
      setDoctors((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
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

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Médico</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Especialidad</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contacto</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-medi-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medi-400 to-medi-600 text-white flex items-center justify-center text-sm font-extrabold">
                        {doc.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-400">{doc.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1.5 rounded-full">{doc.specialty}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{doc.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                      doc.status === "Activo"
                        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                        : "text-gray-500 bg-gray-50 border-gray-200"
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEdit(doc)}
                      className="px-4 py-2 text-xs font-bold text-medi-600 bg-medi-50 hover:bg-medi-100 rounded-xl transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">
              {editingId ? "Editar Médico" : "Agregar Médico"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Correo</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Especialidad</label>
                <select
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none"
                >
                  <option value="">Selecciona especialidad</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estado</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descripción</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
              >
                {editingId ? "Guardar Cambios" : "Agregar Médico"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
