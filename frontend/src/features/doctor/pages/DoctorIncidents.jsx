import { useState } from "react";

const SHIFTS = ["Matutino (08:00 - 12:00)", "Vespertino (14:00 - 18:00)"];
const INCIDENT_TYPES = [
  { value: "retraso", label: "Retraso", icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { value: "no_asistire", label: "No podré asistir", icon: "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636", color: "text-red-600 bg-red-50 border-red-200" },
  { value: "emergencia", label: "Emergencia personal", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z", color: "text-red-600 bg-red-50 border-red-200" },
  { value: "cambio_turno", label: "Cambio de turno", icon: "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5", color: "text-blue-600 bg-blue-50 border-blue-200" },
];

const initialReports = [
  { id: 1, type: "retraso", date: "2026-05-07", shift: "Matutino (08:00 - 12:00)", reason: "Tráfico pesado en la autopista.", status: "Activa" },
  { id: 2, type: "no_asistire", date: "2026-05-06", shift: "Vespertino (14:00 - 18:00)", reason: "Malestar general, fiebre.", status: "Resuelta" },
];

export const DoctorIncidents = () => {
  const [reports, setReports] = useState(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "", date: "", shift: "", reason: "" });

  const handleSubmit = () => {
    if (!form.type || !form.date || !form.shift || !form.reason) return;
    setReports((prev) => [
      { id: Date.now(), ...form, status: "Activa" },
      ...prev,
    ]);
    setForm({ type: "", date: "", shift: "", reason: "" });
    setShowForm(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Incidencias</h2>
          <p className="text-gray-500 font-medium mt-1">Reporta retrasos, ausencias o emergencias.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Reportar Incidencia
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {INCIDENT_TYPES.map((t) => (
          <div key={t.value} className={`rounded-2xl border p-5 ${t.color}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
            </svg>
            <div className="text-sm font-extrabold">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Historial de Incidencias</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {reports.map((r) => {
            const typeInfo = INCIDENT_TYPES.find((t) => t.value === r.type);
            return (
              <div key={r.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeInfo?.color.split(" ").slice(0, 2).join(" ")}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={typeInfo?.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{typeInfo?.label}</div>
                    <div className="text-sm text-gray-500">{r.date} · {r.shift.split(" ")[0]}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{r.reason}</div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  r.status === "Activa"
                    ? "text-amber-600 bg-amber-50 border-amber-100"
                    : "text-emerald-600 bg-emerald-50 border-emerald-100"
                }`}>
                  {r.status}
                </span>
              </div>
            );
          })}
          {reports.length === 0 && (
            <div className="p-12 text-center text-gray-400 font-medium">No hay incidencias reportadas.</div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">Reportar Incidencia</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tipo de Incidencia</label>
                <div className="grid grid-cols-2 gap-3">
                  {INCIDENT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        form.type === t.value
                          ? "border-medi-500 bg-medi-50"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                        </svg>
                        <span className="text-sm font-bold text-gray-900">{t.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fecha</label>
                  <input
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Turno</label>
                  <select
                    value={form.shift}
                    onChange={(e) => setForm({ ...form, shift: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none"
                  >
                    <option value="">Seleccionar</option>
                    {SHIFTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Motivo / Detalles</label>
                <textarea
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Describe el motivo..."
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.type || !form.date || !form.shift || !form.reason}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Reportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
