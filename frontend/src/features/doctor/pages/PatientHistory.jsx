import { useParams, Link } from "react-router-dom";

const patientsHistory = {
  "1": {
    name: "Sofía López",
    age: 7,
    avatar: "SL",
    color: "from-pink-400 to-rose-500",
    bloodType: "O+",
    allergies: ["Polen"],
    notes: "Paciente con buen estado general. Se recomienda control semestral.",
    history: [
      { date: "02 Abr 2026", doctor: "Dra. María García", reason: "Control de rutina", diagnosis: "Normal. Presión arterial y peso adecuados.", treatment: "Seguir con alimentación balanceada." },
      { date: "10 Dic 2025", doctor: "Dra. María García", reason: "Vacunación hexavalente", diagnosis: "Sin reacciones adversas.", treatment: "Próxima vacuna en 6 meses." },
      { date: "15 Jul 2025", doctor: "Dr. Carlos Mendoza", reason: "Dolor de cabeza recurrente", diagnosis: "Cefalea tensional leve.", treatment: "Reposo visual y limitar tiempo de pantallas." },
    ],
  },
  "2": {
    name: "Mateo López",
    age: 4,
    avatar: "ML",
    color: "from-blue-400 to-indigo-500",
    bloodType: "A+",
    allergies: [],
    notes: "Paciente en desarrollo normal. Pendiente de resultados de estudios neurológicos.",
    history: [
      { date: "28 Mar 2026", doctor: "Dr. Carlos Mendoza", reason: "Dolores de cabeza frecuentes", diagnosis: "Pendiente de estudios complementarios.", treatment: "Se recetaron estudios de imagen. Pendiente." },
      { date: "05 Nov 2025", doctor: "Dra. Laura Jiménez", reason: "Erupción cutánea", diagnosis: "Dermatitis atópica leve.", treatment: "Crema hidrocortisona. Evitar detergentes agresivos." },
    ],
  },
  "3": {
    name: "Valentina López",
    age: 10,
    avatar: "VL",
    color: "from-amber-400 to-orange-500",
    bloodType: "A+",
    allergies: ["Lactosa", "Penicilina"],
    notes: "Alérgica a penicilina y lactosa. Tener precaución con medicamentos.",
    history: [
      { date: "15 Ene 2026", doctor: "Dr. Andrés Torres", reason: "Revisión dental anual", diagnosis: "Sin novedades. Buena higiene bucal.", treatment: "Continuar con cepillado y uso de hilo dental." },
    ],
  },
};

export const PatientHistory = () => {
  const { id } = useParams();
  const patient = patientsHistory[id];

  if (!patient) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-extrabold text-gray-900">Paciente no encontrado</h2>
        <Link to="/doctor" className="mt-4 inline-block text-medi-600 font-bold hover:underline">← Volver al panel</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <Link to="/doctor" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver al panel
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className={`bg-gradient-to-br ${patient.color} p-8 text-white`}>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-extrabold shadow-inner">
              {patient.avatar}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">{patient.name}</h2>
              <p className="text-white/80 text-lg font-medium">{patient.age} años</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de Sangre</div>
              <div className="text-lg font-extrabold text-gray-900">{patient.bloodType}</div>
            </div>
            {patient.allergies.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alergias</div>
                <div className="flex gap-2 mt-1">
                  {patient.allergies.map((a) => (
                    <span key={a} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {patient.notes && (
            <div className="bg-medi-50/50 rounded-2xl p-5 border border-medi-100">
              <div className="text-xs font-bold text-medi-600 uppercase tracking-wider mb-1">Notas del Médico</div>
              <p className="text-sm text-gray-700 font-medium">{patient.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100">
          <h3 className="text-xl font-extrabold text-gray-900">Historial Médico</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {patient.history.map((h, i) => (
            <div key={i} className="p-8 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1.5 rounded-full">{h.date}</span>
                  <span className="ml-2 text-xs font-bold text-gray-400">{h.doctor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Motivo</span>
                  <p className="text-sm font-bold text-gray-900">{h.reason}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Diagnóstico</span>
                  <p className="text-sm text-gray-700">{h.diagnosis}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tratamiento</span>
                  <p className="text-sm text-gray-700">{h.treatment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
