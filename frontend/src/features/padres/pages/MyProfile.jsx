export const MyProfile = () => {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Mi Perfil</h2>
        <p className="text-gray-500 font-medium mt-1">Información personal de la cuenta.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-medi-400 to-medi-600 p-8 text-white flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-extrabold shadow-inner">
            JL
          </div>
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">Juan López</h3>
            <p className="text-medi-100 text-sm font-medium">Padre / Tutor</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombre Completo</label>
              <input
                type="text"
                defaultValue="Juan López"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
              <input
                type="email"
                defaultValue="juan.lopez@email.com"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Teléfono</label>
              <input
                type="tel"
                defaultValue="+52 55 1234 5678"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dirección</label>
              <input
                type="text"
                defaultValue="Av. Reforma 123, CDMX"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="px-8 py-3.5 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all">
              Guardar Cambios
            </button>
            <button className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-2xl transition-all">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Configuración de Notificaciones</h3>
        <div className="space-y-4">
          {[
            { label: "Recordatorio de citas", desc: "Recibe un recordatorio 24h antes de cada cita." },
            { label: "Resultados de estudios", desc: "Notificación cuando los resultados estén listos." },
            { label: "Promociones y novedades", desc: "Ofertas y nuevos servicios disponibles." },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div>
                <div className="text-sm font-bold text-gray-900">{n.label}</div>
                <div className="text-xs text-gray-500 font-medium">{n.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-medi-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medi-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
