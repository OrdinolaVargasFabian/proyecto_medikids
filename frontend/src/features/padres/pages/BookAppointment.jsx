import { useState } from "react";

export const BookAppointment = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Agendar Nueva Cita</h2>
        <p className="text-gray-500 font-medium mt-1">Selecciona los detalles para reservar una consulta.</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {["Datos del Paciente", "Especialidad y Médico", "Fecha y Hora", "Confirmación"].map((label, i) => (
          <div key={label} className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold transition-all ${
              step > i + 1
                ? "bg-medi-500 text-white"
                : step === i + 1
                ? "bg-medi-500 text-white shadow-lg shadow-medi-200"
                : "bg-gray-100 text-gray-400"
            }`}>
              {step > i + 1 ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="hidden sm:block">
              <div className={`text-xs font-bold uppercase tracking-wider ${step === i + 1 ? "text-medi-600" : "text-gray-400"}`}>
                Paso {i + 1}
              </div>
              <div className={`text-sm font-bold ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>{label}</div>
            </div>
            {i < 3 && <div className="flex-1 h-px bg-gray-200 last:hidden" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">¿Para quién es la cita?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Sofía López", age: "7 años", avatar: "SL", color: "from-pink-400 to-rose-500" },
                { name: "Mateo López", age: "4 años", avatar: "ML", color: "from-blue-400 to-indigo-500" },
                { name: "Valentina López", age: "10 años", avatar: "VL", color: "from-amber-400 to-orange-500" },
              ].map((child) => (
                <button
                  key={child.name}
                  className={`bg-gradient-to-br ${child.color} text-white rounded-2xl p-6 text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg`}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-extrabold mx-auto mb-3 shadow-inner">
                    {child.avatar}
                  </div>
                  <div className="text-lg font-extrabold tracking-tight">{child.name}</div>
                  <div className="text-white/80 text-sm font-medium">{child.age}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Especialidad y Médico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Especialidad</label>
                <select className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none">
                  <option>Selecciona una especialidad</option>
                  <option>Pediatría General</option>
                  <option>Neurología Pediátrica</option>
                  <option>Odontopediatría</option>
                  <option>Dermatología Pediátrica</option>
                  <option>Cardiología Pediátrica</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Médico</label>
                <select className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all appearance-none">
                  <option>Selecciona un médico</option>
                  <option>Dra. María García</option>
                  <option>Dr. Carlos Mendoza</option>
                  <option>Dr. Andrés Torres</option>
                  <option>Dra. Laura Jiménez</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Fecha y Hora</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fecha</label>
                <input
                  type="date"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hora</label>
                <input
                  type="time"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Motivo de la Consulta</label>
              <textarea
                rows={4}
                placeholder="Describe brevemente el motivo de la visita..."
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all resize-none"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-medi-100 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-medi-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">¡Cita lista para agendar!</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              Revisa los detalles antes de confirmar. Recibirás un correo con la confirmación.
            </p>
            <div className="bg-medi-50/50 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Paciente</span>
                <span className="font-bold text-gray-900">Sofía López</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Médico</span>
                <span className="font-bold text-gray-900">Dra. María García</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Especialidad</span>
                <span className="font-bold text-gray-900">Pediatría General</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Fecha</span>
                <span className="font-bold text-gray-900">12 de Mayo, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Hora</span>
                <span className="font-bold text-gray-900">10:00 AM</span>
              </div>
            </div>
            <button className="px-10 py-4 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all">
              Confirmar y Agendar
            </button>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setStep(Math.min(4, step + 1))}
            disabled={step === 4}
            className="px-8 py-3 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step === 4 ? "Finalizar" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
};
