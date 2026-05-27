import { useState } from "react";
import { CreditCardIcon, BanknotesIcon, QrCodeIcon } from "@heroicons/react/24/outline";

export const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [metodoPago, setMetodoPago] = useState("");
  const [metodoBD, setMetodoBD] = useState("");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Agendar Nueva Cita</h2>
        <p className="text-gray-500 font-medium mt-1">Selecciona los detalles para reservar una consulta.</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {["Datos del Paciente", "Especialidad y Médico", "Fecha y Hora", "Pasarela de Pago", "Confirmación"].map((label, i) => (
          <div key={label} className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold transition-all ${step > i + 1
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
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900">Pasarela de Pago</h3>
            <p className="text-gray-500 font-medium">Selecciona tu método de pago preferido.</p>

            {/* Métodos de pago */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: "yapeplin", label: "Yape / Plin", metodo_bd: "Transferencia", bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-700", icon: <QrCodeIcon className="w-5 h-5 text-purple-700" />},
                { id: "paypal", label: "PayPal", metodo_bd: "Transferencia", bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-700", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#1d4ed8" d="M20.437 7.104a4 4 0 0 0-.573-.523a4.72 4.72 0 0 0-1.157-3.74C17.623 1.619 15.775 1 13.214 1H7.001a1.89 1.89 0 0 0-1.864 1.592l-2.59 16.406a1.533 1.533 0 0 0 1.516 1.785h2.664l-.082.52A1.467 1.467 0 0 0 8.093 23h3.235a1.76 1.76 0 0 0 1.75-1.47l.641-4.031l.011-.055h.299c4.032 0 6.55-1.993 7.285-5.762a5.15 5.15 0 0 0-.877-4.578m-12.595 6.6l-.714 4.535l-.086.544H4.606L7.097 3h6.117c1.936 0 3.318.404 3.993 1.164a2.97 2.97 0 0 1 .607 2.733l-.018.113c-.012.076-.023.15-.044.246a5.85 5.85 0 0 1-2.005 3.67a6.68 6.68 0 0 1-4.217 1.183H9.707a1.88 1.88 0 0 0-1.865 1.595m11.51-2.405c-.552 2.828-2.243 4.145-5.323 4.145h-.484a1.76 1.76 0 0 0-1.75 1.473l-.65 4.074L8.717 21l.478-3.034l.612-3.853h1.719c.157 0 .295-.023.448-.029c.359-.012.717-.026 1.053-.068c.205-.025.393-.072.59-.108c.273-.05.545-.1.801-.171c.19-.053.368-.122.55-.186c.238-.085.474-.174.697-.279q.25-.12.486-.257a7 7 0 0 0 .613-.392q.214-.153.415-.32a7 7 0 0 0 .537-.52c.113-.12.228-.237.333-.367a7 7 0 0 0 .48-.693c.076-.122.161-.235.232-.363a8 8 0 0 0 .52-1.154l.03-.068l.014-.032a4.3 4.3 0 0 1 .026 2.193"/></svg> },
                { id: "tarjeta", label: "Tarjeta", metodo_bd: "Tarjeta", bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-700", icon: <CreditCardIcon className="w-5 h-5 text-gray-700" /> },
                { id: "efectivo", label: "Efectivo", metodo_bd: "Efectivo", bg: "bg-medi-100", border: "border-medi-200", text: "text-medi-700", icon: <BanknotesIcon className="w-5 h-5 text-medi-700" /> },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setMetodoPago(method.id);
                    setMetodoBD(method.metodo_bd);
                  }}
                  className={`rounded-2xl p-5 text-center transition-all border-2 ${metodoPago === method.id
                    ? "border-medi-500 bg-medi-50 shadow-lg scale-[1.02]"
                    : "border-gray-100 bg-white hover:border-medi-300 hover:shadow-md"
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${method.bg} ${method.border} border flex items-center justify-center mx-auto mb-3`}>
                    {method.icon}
                  </div>
                  <div className={`text-sm font-extrabold ${metodoPago === method.id ? "text-medi-600" : "text-gray-700"}`}>
                    {method.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Formulario según método */}
            {metodoPago === "yapeplin" && (
              <div className="bg-purple-50 rounded-2xl p-6 space-y-4 border border-purple-100">
                <h4 className="font-extrabold text-purple-700">Pagar con Yape / Plin</h4>
                <p className="text-sm text-purple-600 font-medium">Escanea el QR con tu app de Yape o Plin.</p>
                <div className="bg-white rounded-xl p-4 w-32 h-32 mx-auto flex items-center justify-center border border-purple-200">
                  <span className="text-gray-400 text-xs font-medium text-center">QR aquí</span>
                </div>
                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  className="w-full px-5 py-3.5 bg-white border border-purple-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
            )}

            {metodoPago === "paypal" && (
              <div className="bg-blue-50 rounded-2xl p-6 space-y-4 border border-blue-100">
                <h4 className="font-extrabold text-blue-700">Pagar con PayPal</h4>
                <input
                  type="email"
                  placeholder="Correo de tu cuenta PayPal"
                  className="w-full px-5 py-3.5 bg-white border border-blue-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            )}

            {metodoPago === "tarjeta" && (
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-200">
                <h4 className="font-extrabold text-gray-800">Pagar con Tarjeta</h4>
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  maxLength={19}
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={3}
                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Nombre en la tarjeta"
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all"
                />
              </div>
            )}

            {metodoPago === "efectivo" && (
              <div className="bg-medi-50 rounded-2xl p-6 space-y-3 border border-medi-200">
                <h4 className="font-extrabold text-medi-700">Pago en Efectivo</h4>
                <p className="text-sm text-medi-600 font-medium">Realiza el pago en caja al momento de llegar a tu cita.</p>
                <div className="bg-white rounded-xl p-4 border border-medi-200 text-sm text-gray-600 font-medium space-y-2">
                  <p>Caja principal - Piso 1</p>
                  <p>Llega 15 minutos antes de tu cita</p>
                  <p>Presenta tu DNI al momento del pago</p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
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

            {/* Detalles de la cita */}
            <div className="bg-medi-50/50 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Detalles de la Cita</p>
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

            {/* Detalles del pago */}
            <div className="bg-gray-50 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Detalles del Pago</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Método de Pago</span>
                <span className="font-bold text-gray-900 capitalize">
                  {metodoPago === "yapeplin" && "Yape / Plin"}
                  {metodoPago === "paypal" && "PayPal"}
                  {metodoPago === "tarjeta" && "Tarjeta"}
                  {metodoPago === "efectivo" && "Efectivo"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Tipo de Transacción</span>
                <span className="font-bold text-gray-900">{metodoBD}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                <span className="text-gray-500 font-medium">Monto a Pagar</span>
                <span className="font-extrabold text-medi-600 text-base">S/ 80.00</span>
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
            className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            ← Anterior
          </button>
          <button
            onClick={() => setStep(Math.min(5, step + 1))}
            disabled={step === 5}
            className="px-8 py-3 bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            {step === 5 ? "Finalizar" : step === 3 ? "Proceder al Pago →" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
};
