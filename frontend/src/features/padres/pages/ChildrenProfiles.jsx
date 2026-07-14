import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useChildren, queryKeys } from "../../../hooks/useApiData";
import { createChild } from "../../../services/api";
import { ChildrenProfilesSkeleton } from "../../../app/components/skeletons/ChildrenProfilesSkeleton";
import { CustomSelect } from "../../../components/CustomSelect";
import { DateInput } from "../../../components/DateInput";

const getInitials = (name) =>
  name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "";

const getAge = (birthDate) => {
  if (!birthDate) return { value: 0, unit: 'años' };
  const today = new Date();
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return { value: 0, unit: 'años' };
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) { years--; months += 12; }
  if (years >= 1) return { value: years, unit: years === 1 ? 'año' : 'años' };
  if (months < 0) months = 0;
  return { value: months, unit: months === 1 ? 'mes' : 'meses' };
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
};

export const ChildrenProfiles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clientId = useMemo(() => {
    try { return Number(localStorage.getItem("cliente_id")); }
    catch { return null; }
  }, []);

  const { data: children = [], isLoading: loading } = useChildren(clientId);

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ nombre_completo: "", dni_menor: "", fecha_nacimiento: "", genero: "" });


  const validateName = (name) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/.test(name);
  
  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    if (birth > today) return false;
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age <= 17;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateName(form.nombre_completo)) {
      setError("El nombre no debe contener números ni caracteres especiales.");
      return;
    }
    if (!validateAge(form.fecha_nacimiento)) {
      setError("La edad máxima permitida es 17 años y la fecha debe ser válida.");
      return;
    }
    if (!form.genero) {
      setError("Por favor selecciona un género.");
      return;
    }

    const dniDuplicado = children.some((c) => c.dni_menor === form.dni_menor);
    if (dniDuplicado) {
      setError("El DNI ingresado ya corresponde a un hijo registrado.");
      return;
    }

    const idCliente = Number(localStorage.getItem("cliente_id"));
    if (!idCliente || isNaN(idCliente)) {
      setError("No se encontró tu perfil de cliente. Cierra sesión y vuelve a iniciar sesión.");
      return;
    }

    setSaving(true);
    try {
      await createChild({ ...form, id_cliente: idCliente });
      queryClient.invalidateQueries({ queryKey: queryKeys.children(idCliente) });
      setShowModal(false);
      setForm({ nombre_completo: "", dni_menor: "", fecha_nacimiento: "", genero: "" });
    } catch (err) {
      const msg =
        err?.response?.status === 409
          ? err.response.data?.error || "El DNI ya se encuentra registrado en el sistema."
          : "Error al crear el perfil. Inténtalo nuevamente.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ChildrenProfilesSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-gray-500 font-medium">Información general y estado de salud de cada uno.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-medi-500 to-medi-600 text-white rounded-xl font-bold text-sm hover:from-medi-400 hover:to-medi-500 transition-all shadow-md active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Añadir Hijo
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">{error}</div>
      )}

      {children.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-medi-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-medi-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">Aún no tienes hijos registrados</h3>
          <p className="text-gray-500 font-medium text-sm">Añade el perfil de tu hijo para empezar a gestionar sus citas y salud.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {children.map((child) => {
            const initials = getInitials(child.nombre_completo);
            const age = getAge(child.fecha_nacimiento);
            return (
              <div
                key={child.id_paciente}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-medi-500 flex items-center justify-center text-white text-lg font-extrabold shrink-0 shadow-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-gray-900 truncate">{child.nombre_completo}</h3>
                      <span className="inline-block mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-medi-50 text-medi-700">
                        {age.value} {age.unit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0">
                        <rect width="18" height="12" x="3" y="6" rx="2" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="3" x2="21" y1="11" y2="11" />
                      </svg>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">DNI</div>
                        <div className="text-xs font-bold text-gray-700 mt-0.5">{child.dni_menor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 shrink-0">
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                        <path d="M8 14h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 14h.01" />
                      </svg>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Nacimiento</div>
                        <div className="text-xs font-bold text-gray-700 mt-0.5">{formatDate(child.fecha_nacimiento)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    onClick={() => navigate('/padres/historial', { state: { hijoId: child.id_paciente } })}
                    className="w-full py-2.5 text-sm font-bold text-medi-600 bg-medi-50 hover:bg-medi-100 rounded-xl transition-colors group-hover:bg-medi-100"
                  >
                    Ver historial
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
              <div className="shrink-0 px-8 pt-8 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-gray-900">Añadir Hijo</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-6" data-lenis-prevent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={form.nombre_completo}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                          setForm({ ...form, nombre_completo: val });
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">DNI</label>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        value={form.dni_menor}
                        onChange={(e) => setForm({ ...form, dni_menor: e.target.value.replace(/\D/g, "") })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Género</label>
                      <CustomSelect
                        value={form.genero}
                        onChange={(val) => setForm({ ...form, genero: val })}
                        placeholder="Seleccionar"
                        options={[
                          { value: "masculino", label: "Masculino" },
                          { value: "femenino", label: "Femenino" },
                        ]}
                        className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Fecha Nacimiento</label>
                      <DateInput
                        value={form.fecha_nacimiento}
                        onChange={(val) => setForm({ ...form, fecha_nacimiento: val })}
                        min={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 17); return d.toISOString().split('T')[0]; })()}
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-medium transition-all"
                        required
                      />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 transition-all shadow-md active:scale-[0.98] disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
