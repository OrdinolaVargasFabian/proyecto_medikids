import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle, MessageSquare, Send } from "lucide-react";
import { getAllIncidents, respondToIncident } from "../../../services/api";
import { AdminTableSkeleton } from "../../../app/components/skeletons/AdminTableSkeleton";

const INCIDENT_TYPES = {
  retraso: { label: "Retraso", color: "text-amber-600 bg-amber-50 border-amber-200" },
  no_asistire: { label: "No asistió", color: "text-red-600 bg-red-50 border-red-200" },
  emergencia: { label: "Emergencia", color: "text-red-600 bg-red-50 border-red-200" },
  cambio_turno: { label: "Cambio de turno", color: "text-blue-600 bg-blue-50 border-blue-200" },
};

export const AdminIncidents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [respondModal, setRespondModal] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [sending, setSending] = useState(false);

  const loadIncidents = () => {
    setLoading(true);
    getAllIncidents()
      .then(setIncidents)
      .catch(() => setError("Error al cargar incidentes"))
      .finally(() => setLoading(false));
  };

  useEffect(loadIncidents, []);

  const handleRespond = async (id) => {
    if (!responseText.trim()) return;
    setSending(true);
    try {
      await respondToIncident(id, { respuesta_admin: responseText });
      setRespondModal(null);
      setResponseText("");
      loadIncidents();
    } catch {
      setError("Error al enviar respuesta");
    } finally {
      setSending(false);
    }
  };

  const pendingCount = incidents.filter((i) => !i.respuesta_admin).length;

  if (loading) return <AdminTableSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-lg font-bold text-gray-900">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-medi-500 text-white rounded-xl font-bold hover:bg-medi-600 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Incidentes</h2>
          <p className="text-gray-500 font-medium mt-1">Gestiona los incidentes reportados por los médicos.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 font-medium">Pendientes</div>
          <div className={`text-2xl font-extrabold ${pendingCount > 0 ? "text-red-500" : "text-emerald-500"}`}>{pendingCount}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Historial de Incidentes <span className="text-medi-500 font-extrabold">({incidents.length})</span></h3>
        </div>

        {incidents.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
            <CheckCircle className="w-10 h-10" />
            <p className="font-semibold text-sm">No hay incidentes registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {incidents.map((inc) => {
              const typeInfo = INCIDENT_TYPES[inc.tipo_incidente] || { label: inc.tipo_incidente, color: "text-gray-600 bg-gray-50 border-gray-100" };
              const docName = `${inc.medico?.usuario?.nombres || ""} ${inc.medico?.usuario?.apellidos || ""}`.trim() || "—";
              const isActive = !inc.respuesta_admin;
              return (
                <div key={inc.id_incidente} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeInfo.color.split(" ").slice(0, 2).join(" ")}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900">{typeInfo.label}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            isActive ? "text-amber-600 bg-amber-50 border-amber-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"
                          }`}>
                            {isActive ? "Activa" : "Resuelta"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {inc.fecha_registro?.split("T")[0] || "—"} · {docName}
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{inc.descripcion}</p>
                        {inc.respuesta_admin && (
                          <div className="mt-3 p-3 bg-medi-50 rounded-xl border border-medi-100">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-medi-700 mb-1">
                              <MessageSquare className="w-3.5 h-3.5" /> Respuesta del administrador
                            </div>
                            <p className="text-sm text-gray-700">{inc.respuesta_admin}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <button
                        onClick={() => setRespondModal(inc)}
                        className="shrink-0 px-4 py-2 text-xs font-bold text-white bg-medi-500 hover:bg-medi-600 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Responder
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {respondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Responder Incidente</h3>
            <p className="text-sm text-gray-500 mb-6">
              {INCIDENT_TYPES[respondModal.tipo_incidente]?.label || respondModal.tipo_incidente} · {respondModal.medico?.usuario?.nombres} {respondModal.medico?.usuario?.apellidos}
            </p>
            <div className="mb-4 p-4 bg-gray-50 rounded-2xl text-sm text-gray-700">{respondModal.descripcion}</div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tu respuesta</label>
              <textarea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Escribe tu respuesta al médico..."
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => { setRespondModal(null); setResponseText(""); }}
                className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRespond(respondModal.id_incidente)}
                disabled={!responseText.trim() || sending}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sending ? "Enviando..." : <><Send className="w-4 h-4" /> Enviar Respuesta</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};