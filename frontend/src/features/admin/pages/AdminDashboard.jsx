const todayAppointments = [
  { time: "08:00", patient: "Sofía López", doctor: "Dra. María García", specialty: "Pediatría General", status: "Completada" },
  { time: "08:30", patient: "Mateo López", doctor: "Dr. Carlos Mendoza", specialty: "Neurología Pediátrica", status: "En curso" },
  { time: "09:00", patient: "Valentina López", doctor: "Dr. Andrés Torres", specialty: "Odontopediatría", status: "Completada" },
  { time: "09:30", patient: "Luis Hernández", doctor: "Dra. María García", specialty: "Pediatría General", status: "En curso" },
  { time: "10:00", patient: "Ana Ramírez", doctor: "Dra. Laura Jiménez", specialty: "Dermatología Pediátrica", status: "Pendiente" },
  { time: "10:30", patient: "Diego Castillo", doctor: "Dr. Roberto Sánchez", specialty: "Cardiología Pediátrica", status: "Pendiente" },
  { time: "11:00", patient: "Camila Torres", doctor: "Dr. Carlos Mendoza", specialty: "Neurología Pediátrica", status: "Pendiente" },
  { time: "11:30", patient: "Emilio Vargas", doctor: "Dra. María García", specialty: "Pediatría General", status: "Pendiente" },
  { time: "12:00", patient: "Regina Flores", doctor: "Dr. Andrés Torres", specialty: "Odontopediatría", status: "Pendiente" },
  { time: "14:00", patient: "Iker Navarro", doctor: "Dr. Roberto Sánchez", specialty: "Cardiología Pediátrica", status: "Pendiente" },
  { time: "14:30", patient: "Aitana Ríos", doctor: "Dra. María García", specialty: "Pediatría General", status: "Pendiente" },
  { time: "15:00", patient: "Santiago Luna", doctor: "Dra. Laura Jiménez", specialty: "Dermatología Pediátrica", status: "Cancelada" },
];

const summary = [
  { label: "Total Citas", value: "12", color: "text-gray-900", bg: "bg-gray-100" },
  { label: "Completadas", value: "2", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "En Curso", value: "2", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Pendientes", value: "7", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Canceladas", value: "1", color: "text-red-600", bg: "bg-red-50" },
];

const statusStyle = {
  "Completada": "text-emerald-600 bg-emerald-50 border-emerald-100",
  "En curso": "text-blue-600 bg-blue-50 border-blue-100",
  "Pendiente": "text-amber-600 bg-amber-50 border-amber-100",
  "Cancelada": "text-red-600 bg-red-50 border-red-100",
};

const today = new Date();
const dateStr = today.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight capitalize">{dateStr}</h2>
        <p className="text-gray-500 font-medium mt-1">Resumen de todas las citas del día.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {summary.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Citas del Día</h3>
          <div className="flex gap-2">
            <select className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all">
              <option>Todos los médicos</option>
              <option>Dra. María García</option>
              <option>Dr. Carlos Mendoza</option>
              <option>Dr. Andrés Torres</option>
              <option>Dra. Laura Jiménez</option>
              <option>Dr. Roberto Sánchez</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hora</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Paciente</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Médico</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Especialidad</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {todayAppointments.map((apt, i) => (
                <tr key={i} className="hover:bg-medi-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{apt.time}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{apt.patient}</td>
                  <td className="px-6 py-4 text-gray-700">{apt.doctor}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1.5 rounded-full">{apt.specialty}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusStyle[apt.status]}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
