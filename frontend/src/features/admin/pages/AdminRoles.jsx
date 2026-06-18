import { useState, useEffect, useCallback } from "react";
import { getRoles, getPermisosDeRol, getAllPermisos, asignarPermisoARol, removerPermisoDeRol } from "../../../services/api";
import { Shield } from "lucide-react";
import { AdminTableSkeleton } from "../../../app/components/skeletons/AdminTableSkeleton";

export const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [selectedRol, setSelectedRol] = useState(null);
  const [permisosRol, setPermisosRol] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    Promise.all([getRoles(), getAllPermisos()])
      .then(([rolesData, permisosData]) => {
        setRoles(rolesData);
        setPermisos(permisosData);
      })
      .catch(() => setToast({ message: 'Error al cargar roles', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  const cargarPermisosRol = useCallback(async (rol) => {
    setSelectedRol(rol);
    setToast({ message: '', type: '' });
    try {
      const codigos = await getPermisosDeRol(rol.id_rol);
      setPermisosRol(codigos);
    } catch {
      setToast({ message: 'Error al cargar permisos del rol', type: 'error' });
    }
  }, []);

  const togglePermiso = async (permiso) => {
    if (!selectedRol) return;
    const idPermiso = permiso.idPermiso;
    const tiene = permisosRol.includes(permiso.codigo);
    setSaving(idPermiso);
    try {
      if (tiene) {
        await removerPermisoDeRol(selectedRol.id_rol, idPermiso);
        setPermisosRol((prev) => prev.filter((c) => c !== permiso.codigo));
      } else {
        await asignarPermisoARol(selectedRol.id_rol, idPermiso);
        setPermisosRol((prev) => [...prev, permiso.codigo]);
      }
    } catch (err) {
      setToast({ message: 'Error al cambiar permiso', type: 'error' });
    } finally {
      setSaving(null);
    }
  };

  const grupos = permisos.reduce((acc, p) => {
    if (!acc[p.recurso]) acc[p.recurso] = [];
    acc[p.recurso].push(p);
    return acc;
  }, {});

  if (loading) return <AdminTableSkeleton variant="default" />;

  return (
    <div className="p-6 font-sans max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-7 h-7 text-medi-600" />
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Roles y Permisos</h1>
      </div>

      {toast.message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold ${
          toast.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>{toast.message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* ── Lista de roles ── */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Roles</h2>
          {roles.map((rol) => (
            <button
              key={rol.id_rol}
              onClick={() => cargarPermisosRol(rol)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                selectedRol?.id_rol === rol.id_rol
                  ? "bg-medi-50 border-medi-300 text-medi-800 shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {rol.nombre_rol || `Rol #${rol.id_rol}`}
            </button>
          ))}
        </div>

        {/* ── Permisos del rol seleccionado ── */}
        <div>
          {!selectedRol ? (
            <div className="text-center py-20 text-gray-400 text-sm font-medium">
              Selecciona un rol para gestionar sus permisos
            </div>
          ) : (
            <>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Permisos de <span className="text-gray-800">{selectedRol.nombre_rol}</span>
              </h2>
              <div className="space-y-4">
                {Object.entries(grupos).map(([recurso, lista]) => (
                  <div key={recurso} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{recurso}</h3>
                    <div className="flex flex-wrap gap-2">
                      {lista.map((p) => {
                        const tiene = permisosRol.includes(p.codigo);
                        return (
                          <button
                            key={p.idPermiso}
                            disabled={saving === p.idPermiso}
                            onClick={() => togglePermiso(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                              tiene
                                ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                            } disabled:opacity-50`}
                            title={p.descripcion || p.nombre}
                          >
                            {p.accion}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
