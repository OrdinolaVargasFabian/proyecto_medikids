const children = [
  {
    name: "Sofía López",
    age: 7,
    bloodType: "O+",
    lastVisit: "02 Abr 2026",
    nextAppt: "12 May 2026",
    allergies: ["Polen"],
    avatar: "SL",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Mateo López",
    age: 4,
    bloodType: "A+",
    lastVisit: "28 Mar 2026",
    nextAppt: "15 May 2026",
    allergies: [],
    avatar: "ML",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Valentina López",
    age: 10,
    bloodType: "A+",
    lastVisit: "15 Ene 2026",
    nextAppt: null,
    allergies: ["Lactosa", "Penicilina"],
    avatar: "VL",
    color: "from-amber-400 to-orange-500",
  },
];

export const ChildrenProfiles = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Perfiles de Mis Hijos</h2>
        <p className="text-gray-500 font-medium mt-1">Información general y estado de salud de cada uno.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {children.map((child) => (
          <div
            key={child.name}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`bg-gradient-to-br ${child.color} p-6 text-white`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-extrabold shadow-inner">
                  {child.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight">{child.name}</h3>
                  <p className="text-white/80 text-sm font-medium">{child.age} años</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo Sangre</div>
                  <div className="text-lg font-extrabold text-gray-900">{child.bloodType}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Última Visita</div>
                  <div className="text-sm font-bold text-gray-900">{child.lastVisit}</div>
                </div>
                {child.nextAppt && (
                  <div className="col-span-2 bg-medi-50 rounded-2xl p-3 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-medi-600 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <div>
                      <div className="text-xs font-bold text-medi-600">Próxima Cita</div>
                      <div className="text-sm font-extrabold text-medi-800">{child.nextAppt}</div>
                    </div>
                  </div>
                )}
              </div>

              {child.allergies.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alergias</div>
                  <div className="flex flex-wrap gap-2">
                    {child.allergies.map((a) => (
                      <span key={a} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full py-3 text-sm font-bold text-medi-600 bg-medi-50 hover:bg-medi-100 rounded-2xl transition-colors">
                Ver Historial Completo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
