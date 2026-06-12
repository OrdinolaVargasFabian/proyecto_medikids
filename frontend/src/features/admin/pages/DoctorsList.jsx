import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { getDoctors, getSpecialties, saveDoctorWithUser, updateDoctor, updateUser, toggleDoctorStatus, deleteDoctor } from "../../../services/api";
import { AdminTableSkeleton } from "../../../app/components/skeletons/AdminTableSkeleton";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  const isError = message.toLowerCase().includes("error");
  return (
    <div className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-3 transition-all animate-slide-in ${
      isError ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
    }`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${isError ? "" : ""}`}>
        {isError
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        }
      </svg>
      {message}
    </div>
  );
};

const Modal = ({ children, open, onClose, title, subtitle }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
          <div className="shrink-0 px-5 sm:px-8 pt-5 sm:pt-8 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {subtitle && <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>}
          </div>
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6" data-lenis-prevent>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const initialForm = {
  nombres: "", apellidos: "", email: "", password: "",
  nro_colegiatura: "", id_especialidad: "", estado: "activo",
  url_foto: "", genero: "",
};

export const DoctorsList = () => {
  const queryClient = useQueryClient();
  const { data: doctors = [], isLoading: loading } = useQuery({
    queryKey: ['admin', 'doctors'],
    queryFn: getDoctors,
  });
  const { data: specialties = [] } = useQuery({
    queryKey: ['admin', 'specialties'],
    queryFn: getSpecialties,
    staleTime: 10 * 60 * 1000,
  });

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [photoError, setPhotoError] = useState(false);

  const [form, setForm] = useState({ ...initialForm });

  const showToast = (message, type = "success") => setToast({ message, type });

  const openAdd = () => {
    setEditingDoctor(null);
    setForm({ ...initialForm });
    setPhotoError(false);
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
      url_foto: doc.url_foto || "",
      genero: doc.genero || "",
    });
    setPhotoError(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nombres || !form.apellidos || !form.email || !form.nro_colegiatura || !form.id_especialidad) {
      showToast("Completa todos los campos obligatorios", "error");
      return;
    }
    if (!editingDoctor && !form.password) {
      showToast("La contraseña es obligatoria para nuevos médicos", "error");
      return;
    }
    setSaving(true);
    try {
      if (editingDoctor) {
        await updateUser(editingDoctor.id_usuario, {
          id_rol: 2, nombres: form.nombres, apellidos: form.apellidos,
          email: form.email, telefono: 0,
        });
        await updateDoctor(editingDoctor.id_medico, {
          nro_colegiatura: form.nro_colegiatura,
          url_foto: form.url_foto || "",
          genero: form.genero || null,
          estado: form.estado,
          id_usuario: editingDoctor.id_usuario,
          id_especialidad: parseInt(form.id_especialidad, 10),
        });
        queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
        showToast("Médico actualizado correctamente");
      } else {
        await saveDoctorWithUser({
          nombres: form.nombres, apellidos: form.apellidos, email: form.email,
          password: form.password, telefono: 0,
          nro_colegiatura: form.nro_colegiatura,
          url_foto: form.url_foto || "",
          genero: form.genero || null,
          estado: form.estado,
          id_especialidad: parseInt(form.id_especialidad, 10),
        });
        queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
        showToast("Médico registrado correctamente");
      }
      setShowModal(false);
    } catch {
      showToast(editingDoctor ? "Error al actualizar médico" : "Error al registrar médico", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleDoctorStatus(id);
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
    } catch {
      showToast("Error al cambiar estado", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
      setConfirmDelete(null);
      showToast("Médico eliminado permanentemente");
    } catch {
      showToast("Error al eliminar médico", "error");
    }
  };

  const getInitials = (n, a) => ((n || "")[0] || "") + ((a || "")[0] || "");

  const getSpecialtyName = (id) => {
    const s = specialties.find((sp) => sp.id_especialidad === id);
    return s ? s.nombre : "—";
  };

  const columnHelper = useMemo(() => createColumnHelper(), []);

  const columns = useMemo(() => [
    columnHelper.accessor('usuario', {
      header: 'Médico',
      cell: info => {
        const u = info.getValue();
        const doc = info.row.original;
        const initials = getInitials(u?.nombres, u?.apellidos) || "DR";
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medi-400 to-medi-600 text-white flex items-center justify-center text-sm font-extrabold shrink-0 overflow-hidden">
              {doc.url_foto ? (
                <img src={doc.url_foto} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
              ) : initials}
            </div>
            <div>
              <div className="font-bold text-gray-900">{u?.nombres} {u?.apellidos}</div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('nro_colegiatura', {
      header: 'Colegiatura',
      cell: info => <span className="font-medium text-gray-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor('id_especialidad', {
      id: 'especialidad',
      header: 'Especialidad',
      cell: info => (
        <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1.5 rounded-full">
          {getSpecialtyName(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('genero', {
      header: 'Género',
      cell: info => {
        const val = info.getValue();
        return <span className="text-gray-600">{val === "masculino" ? "Masculino" : val === "femenino" ? "Femenino" : val === "otro" ? "Otro" : "—"}</span>;
      },
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: info => {
        const doc = info.row.original;
        const isActive = String(doc.estado || "").toLowerCase() === "activo";
        return (
          <button
            onClick={() => handleToggle(doc.id_medico)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              isActive
                ? "text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"
                : "text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {isActive ? "Activo" : "Inactivo"}
          </button>
        );
      },
    }),
    columnHelper.accessor('id_medico', {
      id: 'acciones',
      header: 'Acciones',
      cell: info => {
        const doc = info.row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => openEdit(doc)} className="px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">Editar</button>
            <button onClick={() => setConfirmDelete(doc)} className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">Eliminar</button>
          </div>
        );
      },
    }),
  ], [columnHelper, specialties]);

  const table = useReactTable({
    data: doctors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderPhotoPreview = () => {
    if (!form.url_foto) {
      return (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-medi-300 to-medi-500 text-white flex items-center justify-center text-2xl font-extrabold shrink-0">
          {getInitials(form.nombres, form.apellidos) || "?"}
        </div>
      );
    }
    return (
      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-200">
        <img
          src={form.url_foto}
          alt="Preview"
          className="w-full h-full object-cover"
          onError={() => setPhotoError(true)}
          onLoad={() => setPhotoError(false)}
        />
      </div>
    );
  };

  const DoctorCard = ({ doc }) => {
    const initials = getInitials(doc.usuario?.nombres, doc.usuario?.apellidos) || "DR";
    return (
      <div className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-b-0 hover:bg-medi-50/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medi-400 to-medi-600 text-white flex items-center justify-center text-sm font-extrabold shrink-0 overflow-hidden">
          {doc.url_foto ? (
            <img src={doc.url_foto} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
          ) : initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 truncate">{doc.usuario?.nombres} {doc.usuario?.apellidos}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {doc.nro_colegiatura} · {getSpecialtyName(doc.id_especialidad)}
            {doc.genero && <span> · {doc.genero === "masculino" ? "M" : doc.genero === "femenino" ? "F" : "O"}</span>}
          </div>
        </div>
        <button
          onClick={() => handleToggle(doc.id_medico)}
          className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 transition-all ${
            String(doc.estado || "").toLowerCase() === "activo"
              ? "text-emerald-600 bg-emerald-50 border-emerald-100"
              : "text-gray-500 bg-gray-50 border-gray-200"
          }`}
        >
          {String(doc.estado || "").toLowerCase() === "activo" ? "Activo" : "Inactivo"}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Gestión de Médicos</h2>
          <p className="text-gray-500 font-medium mt-1">Administra los perfiles de los médicos del sistema.</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar Médico
        </button>
      </div>

      {loading ? <AdminTableSkeleton variant="doctors" /> : (
        <>
          {/* Vista desktop: tabla */}
          <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/80">
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className={`text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${header.id === 'acciones' ? 'text-right' : ''}`}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium">No hay médicos registrados</td>
                    </tr>
                  ) : table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-medi-50/50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className={`px-6 py-4 ${cell.column.id === 'acciones' ? 'text-right' : ''}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vista mobile/tablet: cards */}
          <div className="md:hidden bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {doctors.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400 font-medium">No hay médicos registrados</div>
            ) : doctors.map((doc) => (
              <div key={doc.id_medico}>
                <DoctorCard doc={doc} />
                <div className="flex gap-2 px-4 pb-4 pt-0">
                  <button onClick={() => openEdit(doc)} className="flex-1 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">Editar</button>
                  <button onClick={() => setConfirmDelete(doc)} className="flex-1 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal formulario */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingDoctor ? "Editar Médico" : "Agregar Médico"}
        subtitle={editingDoctor ? "Actualiza los datos del médico." : "Registra un nuevo médico con su usuario de acceso."}
      >
        <div className="space-y-4">
          {/* Foto + URL */}
          <div className="bg-medi-50/50 rounded-2xl p-4">
            <p className="text-xs font-bold text-medi-600 uppercase tracking-wider mb-3">Foto del Médico</p>
            <div className="flex items-center gap-4">
              {renderPhotoPreview()}
              <div className="flex-1 min-w-0">
                <input type="url" placeholder="https://ejemplo.com/foto.jpg"
                  value={form.url_foto} onChange={(e) => { setForm({ ...form, url_foto: e.target.value }); setPhotoError(false); }}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none placeholder:text-gray-300" />
                {photoError && <p className="text-xs text-red-500 mt-1">No se pudo cargar la imagen desde esa URL</p>}
              </div>
            </div>
          </div>

          {/* Datos del Médico */}
          <div className="bg-medi-50/50 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-medi-600 uppercase tracking-wider">Datos del Médico</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Nombres <span className="text-red-400">*</span></label>
                <input type="text" value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Apellidos <span className="text-red-400">*</span></label>
                <input type="text" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Nro. Colegiatura <span className="text-red-400">*</span></label>
                <input type="text" value={form.nro_colegiatura} onChange={(e) => setForm({ ...form, nro_colegiatura: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Género</label>
                <select value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none appearance-none">
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Especialidad <span className="text-red-400">*</span></label>
              <select value={form.id_especialidad} onChange={(e) => setForm({ ...form, id_especialidad: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none appearance-none">
                <option value="">Seleccionar</option>
                {specialties.map((s) => (
                  <option key={s.id_especialidad} value={s.id_especialidad}>{s.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Credenciales */}
          <div className="bg-medi-50/50 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-medi-600 uppercase tracking-wider">Credenciales de Acceso</p>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">Correo electrónico <span className="text-red-400">*</span></label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 pl-1">
                {editingDoctor ? "Nueva contraseña" : "Contraseña"} {!editingDoctor && <span className="text-red-400">*</span>}
              </label>
              <input type="password" placeholder={editingDoctor ? "Dejar vacío para mantener actual" : ""}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none placeholder:text-gray-300" />
            </div>
          </div>

          {/* Toggle visible */}
          <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">Visible para usuarios</p>
              <p className="text-xs text-gray-500">El médico aparecerá en el directorio público</p>
            </div>
            <button onClick={() => setForm({ ...form, estado: form.estado === "activo" ? "inactivo" : "activo" })}
              className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${form.estado === "activo" ? "bg-emerald-500" : "bg-gray-300"}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.estado === "activo" ? "left-7" : "left-1"}`} />
            </button>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? "Guardando..." : editingDoctor ? "Actualizar Médico" : "Agregar Médico"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmación eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Eliminar Médico</h3>
            <p className="text-sm text-gray-500 font-medium mb-1">
              ¿Estás seguro de eliminar permanentemente a <strong>{confirmDelete.usuario?.nombres} {confirmDelete.usuario?.apellidos}</strong>?
            </p>
            <p className="text-xs text-red-500 font-medium mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">
              <button onClick={() => setConfirmDelete(null)} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete.id_medico)} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl shadow-lg transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};