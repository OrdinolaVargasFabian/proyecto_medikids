import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import imgFaq from "../../../assets/images/ImgFAQ.avif";

const faqs = [
  { question: "¿Cómo agendo una cita para mi hijo?", answer: "Puedes agendar fácilmente a través de nuestro Portal de Padres, llamando a nuestra central telefónica o enviándonos un mensaje por WhatsApp. Nuestro equipo te confirmará el horario al instante." },
  { question: "¿Atienden emergencias las 24 horas?", answer: "Sí, contamos con un área de emergencias pediátricas operativa las 24 horas del día, los 365 días del año, con especialistas de guardia siempre listos para atender cualquier urgencia." },
  { question: "¿Aceptan seguros médicos particulares?", answer: "Trabajamos con las principales aseguradoras y EPS del país. En el Portal de Padres puedes verificar la cobertura exacta de tu plan y los copagos correspondientes a cada especialidad." },
  { question: "¿A partir de qué edad puedo llevar a mi bebé?", answer: "Atendemos desde el control del recién nacido (primeros días de vida) hasta la adolescencia (17 años). Contamos con subespecialistas para cada etapa del desarrollo infantil." },
];

export const FAQSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const handleToggle = (index) => setActiveIndex(activeIndex === index ? null : index);

  return (
    <section ref={ref} className="w-full bg-transparent py-20 overflow-hidden" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left mb-10"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
                Resolvemos tus <span className="text-medi-500">dudas</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
                Encuentra respuestas rápidas a las preguntas más comunes sobre nuestras citas y servicios médicos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, delay: 0.45, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
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
                      <span className="font-bold pr-8 text-lg">{faq.question}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className={`w-[26px] h-[26px] transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 5v14M5 12h14" />
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
                          <div className="px-6 py-4 text-gray-500 leading-relaxed font-medium border-t border-gray-50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
            className="relative w-full h-[520px] hidden lg:flex items-end justify-center"
          >
            <img src={imgFaq} alt="Preguntas frecuentes" className="max-w-full max-h-[93%] object-contain" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
