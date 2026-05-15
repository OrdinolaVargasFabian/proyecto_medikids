import { useState } from "react";
import { Link } from "react-router-dom";

const appointmentsData = {
  "2026-05-07": [
    { id: 1, time: "08:00", patient: "Sofía López", age: 7, avatar: "SL", reason: "Control de rutina", status: "asistió", color: "from-pink-400 to-rose-500" },
    { id: 2, time: "08:30", patient: "Mateo López", age: 4, avatar: "ML", reason: "Dolores de cabeza", status: "en espera", color: "from-blue-400 to-indigo-500" },
    { id: 3, time: "09:00", patient: "Valentina López", age: 10, avatar: "VL", reason: "Revisión dental", status: "en espera", color: "from-amber-400 to-orange-500" },
    { id: 4, time: "09:30", patient: "Luis Hernández", age: 6, avatar: "LH", reason: "Vacunación", status: "asistió", color: "from-teal-400 to-emerald-500" },
    { id: 5, time: "10:00", patient: "Ana Ramírez", age: 8, avatar: "AR", reason: "Dermatitis atópica", status: "en espera", color: "from-purple-400 to-violet-500" },
    { id: 6, time: "10:30", patient: "Diego Castillo", age: 5, avatar: "DC", reason: "Control cardíaco", status: "pendiente", color: "from-cyan-400 to-sky-500" },
    { id: 7, time: "11:00", patient: "Camila Torres", age: 9, avatar: "CT", reason: "Dolor abdominal", status: "pendiente", color: "from-rose-400 to-pink-500" },
    { id: 8, time: "12:00", patient: "Emilio Vargas", age: 3, avatar: "EV", reason: "Fiebre recurrente", status: "no asistió", color: "from-orange-400 to-red-500" },
  ],
  "2026-05-08": [
    { id: 21, time: "09:00", patient: "Regina Flores", age: 7, avatar: "RF", reason: "Control pediátrico", status: "pendiente", color: "from-pink-400 to-rose-500" },
    { id: 22, time: "10:00", patient: "Iker Navarro", age: 6, avatar: "IN", reason: "Revisión auditiva", status: "pendiente", color: "from-blue-400 to-indigo-500" },
    { id: 23, time: "11:30", patient: "Aitana Ríos", age: 4, avatar: "AR", reason: "Alergias estacionales", status: "pendiente", color: "from-amber-400 to-orange-500" },
  ],
  "2026-05-09": [
    { id: 31, time: "08:00", patient: "Santiago Luna", age: 10, avatar: "SL", reason: "Control anual", status: "pendiente", color: "from-teal-400 to-emerald-500" },
    { id: 32, time: "09:00", patient: "María Solís", age: 5, avatar: "MS", reason: "Vacunación", status: "pendiente", color: "from-purple-400 to-violet-500" },
    { id: 33, time: "10:30", patient: "Jorge Medina", age: 8, avatar: "JM", reason: "Dolor de oído", status: "pendiente", color: "from-cyan-400 to-sky-500" },
    { id: 34, time: "11:00", patient: "Lucía Peña", age: 3, avatar: "LP", reason: "Tos persistente", status: "pendiente", color: "from-rose-400 to-pink-500" },
    { id: 35, time: "12:00", patient: "Daniel Cruz", age: 6, avatar: "DC", reason: "Control de peso", status: "pendiente", color: "from-orange-400 to-red-500" },
  ],
};

const statusStyles = {
  "asistió": "text-emerald-600 bg-emerald-50 border-emerald-100",
  "en espera": "text-amber-600 bg-amber-50 border-amber-100",
  "pendiente": "text-gray-500 bg-gray-50 border-gray-200",
  "no asistió": "text-red-600 bg-red-50 border-red-100",
};

const dayLabels = ["2026-05-07", "2026-05-08", "2026-05-09"];
const dayNames = ["Hoy", "Mañana", "09 May"];

const summaryStats = [
  { label: "Citas Hoy", value: "8", color: "text-medi-600" },
  { label: "Atendidas", value: "2", color: "text-emerald-600" },
  { label: "Pendientes", value: "4", color: "text-amber-600" },
  { label: "No Asistieron", value: "1", color: "text-red-600" },
];

export const DoctorDashboard = () => {
  const [selectedDay, setSelectedDay] = useState(dayLabels[0]);
  const [appointments, setAppointments] = useState(appointmentsData);

  const currentAppts = appointments[selectedDay] || [];

  const handleAttendance = (id, newStatus) => {
    setAppointments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((day) => {
        updated[day] = updated[day].map((a) =>
          a.id === id ? { ...a, status: newStatus } : a
        );
      });
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-medi-400 via-medi-500 to-medi-600 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-extrabold tracking-tight">Panel del Médico</h2>
        <p className="text-medi-100 mt-2 text-lg font-medium">Gestiona tus citas y pacientes del día.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex">
            {dayLabels.map((day, i) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-4 text-sm font-bold transition-all relative ${
                  selectedDay === day
                    ? "text-medi-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {dayNames[i]}
                {selectedDay === day && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-medi-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hora</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Paciente</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Motivo</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentAppts.map((apt) => (
                <tr key={apt.id} className="hover:bg-medi-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{apt.time}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/doctor/paciente/${apt.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${apt.color} text-white flex items-center justify-center text-xs font-extrabold`}>
                        {apt.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{apt.patient}</div>
                        <div className="text-xs text-gray-400">{apt.age} años</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{apt.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusStyles[apt.status]}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {apt.status !== "asistió" && apt.status !== "no asistió" && (
                        <>
                          <button
                            onClick={() => handleAttendance(apt.id, "asistió")}
                            className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                          >
                            Asistió
                          </button>
                          <button
                            onClick={() => handleAttendance(apt.id, "no asistió")}
                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                          >
                            No Asistió
                          </button>
                        </>
                      )}
                      {apt.status === "asistió" && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">✓ Atendido</span>
                      )}
                      {apt.status === "no asistió" && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl">✗ Ausente</span>
                      )}
                      <Link
                        to={`/doctor/paciente/${apt.id}`}
                        className="px-3 py-1.5 text-xs font-bold text-medi-600 bg-medi-50 hover:bg-medi-100 rounded-xl transition-colors"
                      >
                        Historial
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {currentAppts.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-medium">No hay citas para este día.</div>
        )}
      </div>
    </div>
  );
};
