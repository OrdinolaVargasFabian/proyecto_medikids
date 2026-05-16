const history = [
  { date: "02 Abr 2026", child: "Sofía López", doctor: "Dra. María García", specialty: "Pediatría General", reason: "Control de rutina", status: "Completada", notes: "Presión arterial normal, peso adecuado." },
  { date: "28 Mar 2026", child: "Mateo López", doctor: "Dr. Carlos Mendoza", specialty: "Neurología Pediátrica", reason: "Dolores de cabeza frecuentes", status: "Completada", notes: "Se recetaron estudios complementarios. Pendiente de resultados." },
  { date: "15 Ene 2026", child: "Valentina López", doctor: "Dr. Andrés Torres", specialty: "Odontopediatría", reason: "Revisión dental anual", status: "Completada", notes: "Sin novedades. Se recomienda seguir con higiene bucal." },
  { date: "10 Dic 2025", child: "Sofía López", doctor: "Dra. María García", specialty: "Pediatría General", reason: "Vacunación", status: "Completada", notes: "Vacuna hexavalente aplicada sin reacciones adversas." },
  { date: "05 Nov 2025", child: "Mateo López", doctor: "Dra. Laura Jiménez", specialty: "Dermatología Pediátrica", reason: "Erupción cutánea", status: "Completada", notes: "Diagnóstico: dermatitis atópica. Crema recetada." },
];

export const ConsultationHistory = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Historial de Consultas</h2>
          <p className="text-gray-500 font-medium mt-1">Registro completo de todas las consultas médicas.</p>
        </div>
        <div className="flex gap-2">
          <select className="text-sm bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all">
            <option>Todos los hijos</option>
            <option>Sofía López</option>
            <option>Mateo López</option>
            <option>Valentina López</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hijo</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Médico</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Especialidad</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Motivo</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((row) => (
                <tr key={`${row.date}-${row.child}-${row.reason}`} className="hover:bg-medi-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{row.child}</td>
                  <td className="px-6 py-4 text-gray-700">{row.doctor}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1.5 rounded-full">{row.specialty}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">{row.reason}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detalle de Consulta</h3>
        <div className="bg-medi-50/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-bold text-medi-700">Sofía López — 02 Abr 2026</div>
              <div className="text-xs text-gray-500 font-medium">Dra. María García · Pediatría General</div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">Completada</span>
          </div>
          <p className="text-sm text-gray-600 bg-white rounded-xl p-4 border border-gray-100">
            Presión arterial normal, peso adecuado. Se recomienda seguir con alimentación balanceada y próxima cita en 6 meses.
          </p>
        </div>
      </div>
    </div>
  );
};
