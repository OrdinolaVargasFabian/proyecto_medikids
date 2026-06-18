import { useState, useEffect, useMemo } from "react";
import { Users, Search, Shield, ToggleLeft, ToggleRight, X } from "lucide-react";
import { getUsers, actualizarRolUsuario, cambiarStatusUsuario } from "../../../services/api";
import { AdminTableSkeleton } from "../../../app/components/skeletons/AdminTableSkeleton";

const ROLE_OPTIONS = [
  { id: 1, label: "Cliente" },
  { id: 2, label: "Médico" },
  { id: 3, label: "Super Admin" },
  { id: 4, label: "Admin Operativo" },
];

const ROLE_LABEL = {
  1: "Cliente",
  2: "Médico",
  3: "Super Admin",
  4: "Admin Operativo",
};

const ROLE_COLOR = {
  1: "text-blue-600 bg-blue-50 border-blue-100",
  2: "text-emerald-600 bg-emerald-50 border-emerald-100",
  3: "text-purple-600 bg-purple-50 border-purple-100",
  4: "text-amber-600 bg-amber-50 border-amber-100",
};

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleModal, setRoleModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [saving, setSaving] = useState(false);

  const currentUserId = useMemo(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setToast({ message: "Error al cargar usuarios", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.nombres?.toLowerCase().includes(q) ||
        u.apellidos?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const openRoleModal = (user) => {
    setSelectedRole(user.id_rol);
    setRoleModal(user);
  };

  const handleRoleSave = async () => {
    if (!roleModal || selectedRole === roleModal.id_rol) {
      setRoleModal(null);
      return;
    }
    setSaving(true);
    try {
      await actualizarRolUsuario(roleModal.id_usuario, selectedRole);
      setToast({ message: "Rol actualizado correctamente", type: "success" });
      setRoleModal(null);
      loadUsers();
    } catch {
      setToast({ message: "Error al actualizar rol", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nuevoEstado = !user.activo;
    setSaving(true);
    try {
      await cambiarStatusUsuario(user.id_usuario, nuevoEstado);
      setToast({
        message: `Usuario ${nuevoEstado ? "activado" : "desactivado"} correctamente`,
        type: "success",
      });
      setConfirmModal(null);
      loadUsers();
    } catch {
      setToast({ message: "Error al cambiar estado", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminTableSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-medi-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-medi-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-sm text-gray-500">{users.length} usuarios registrados</p>
          </div>
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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email, nombre o apellido..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-medi-400 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const isMe = user.id_usuario === currentUserId;
                return (
                <tr key={user.id_usuario} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isMe ? "bg-medi-50/30" : ""}`}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {user.email}
                    {isMe && <span className="ml-2 text-xs text-medi-600 font-bold">(tú)</span>}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{user.nombres} {user.apellidos}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${ROLE_COLOR[user.id_rol] || "text-gray-600 bg-gray-50 border-gray-100"}`}>
                      {ROLE_LABEL[user.id_rol] || "Desconocido"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      user.activo
                        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                        : "text-red-600 bg-red-50 border-red-100"
                    }`}>
                      {user.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openRoleModal(user)}
                        disabled={isMe}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          isMe
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        {isMe ? "Eres tú" : "Rol"}
                      </button>
                      <button
                        onClick={() => setConfirmModal(user)}
                        disabled={isMe && user.activo}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          isMe && user.activo
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : user.activo
                              ? "bg-red-50 hover:bg-red-100 text-red-600"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {user.activo ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                        {isMe && user.activo ? "Eres tú" : user.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>);
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400 font-medium">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cambiar Rol */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setRoleModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Cambiar Rol</h2>
              <button onClick={() => setRoleModal(null)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Usuario: <span className="font-medium text-gray-900">{roleModal.email}</span>
            </p>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    selectedRole === r.id
                      ? "border-medi-400 bg-medi-50 text-medi-700"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRoleModal(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRoleSave}
                disabled={saving || selectedRole === roleModal.id_rol}
                className="flex-1 py-3 rounded-xl bg-medi-500 hover:bg-medi-600 disabled:opacity-50 text-white font-bold text-sm transition-colors"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Estado */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {confirmModal.activo ? "Desactivar usuario" : "Activar usuario"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de {confirmModal.activo ? "desactivar" : "activar"} a <span className="font-medium text-gray-900">{confirmModal.email}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleToggleStatus(confirmModal)}
                disabled={saving}
                className={`flex-1 py-3 rounded-xl text-white font-bold text-sm transition-colors ${
                  confirmModal.activo
                    ? "bg-red-500 hover:bg-red-600 disabled:opacity-50"
                    : "bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                }`}
              >
                {saving ? "Guardando..." : confirmModal.activo ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
