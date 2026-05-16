import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { question: "¿Cómo agendo una cita para mi hijo?", answer: "Puedes agendar fácilmente a través de nuestro Portal de Padres, llamando a nuestra central telefónica o enviándonos un mensaje por WhatsApp. Nuestro equipo te confirmará el horario al instante." },
  { question: "¿Atienden emergencias las 24 horas?", answer: "Sí, contamos con un área de emergencias pediátricas operativa las 24 horas del día, los 365 días del año, con especialistas de guardia siempre listos para atender cualquier urgencia." },
  { question: "¿Aceptan seguros médicos particulares?", answer: "Trabajamos con las principales aseguradoras y EPS del país. En el Portal de Padres puedes verificar la cobertura exacta de tu plan y los copagos correspondientes a cada especialidad." },
  { question: "¿A partir de qué edad puedo llevar a mi bebé?", answer: "Atendemos desde el control del recién nacido (primeros días de vida) hasta la adolescencia (17 años). Contamos con subespecialistas para cada etapa del desarrollo infantil." },
];

export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const handleToggle = (index) => setActiveIndex(activeIndex === index ? null : index);

  return (
    <section className="w-full bg-transparent py-24 overflow-hidden" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col">
            <div className="flex flex-col items-start text-left mb-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
                Resolvemos tus <span className="text-medi-500">dudas</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
                Encuentra respuestas rápidas a las preguntas más comunes sobre nuestras citas y servicios médicos.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => {
                const isOpen = activeIndex === index;
                return (
                  <div
                    key={index}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden shadow-sm ${
                      isOpen ? "border-medi-400 shadow-md bg-white" : "border-gray-200 hover:border-medi-300 bg-white/80"
                    }`}
                  >
                    <button
                      onClick={() => handleToggle(index)}
                      className={`w-full flex items-center justify-between p-5 text-left transition-colors duration-200 ${
                        isOpen ? "bg-medi-400 text-white" : "bg-white text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-bold pr-8">{faq.question}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 text-gray-500 leading-relaxed font-medium border-t border-gray-50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative w-full h-[400px] sm:h-[500px] hidden lg:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full shadow-xl flex items-center justify-center z-20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-medi-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
