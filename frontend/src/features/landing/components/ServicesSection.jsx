import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const tablerIcons = {
  Heart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    </svg>
  ),
  Dental: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5.5c-1.074 -.586 -2.583 -1.5 -4 -1.5c-2.1 0 -4 1.247 -4 5c0 4.899 1.056 8.41 2.671 10.537c.573 .756 1.97 .521 2.567 -.236c.398 -.505 .819 -1.439 1.262 -2.801c.292 -.771 .892 -1.504 1.5 -1.5c.602 0 1.21 .737 1.5 1.5c.443 1.362 .864 2.295 1.262 2.8c.597 .759 2 .993 2.567 .237c1.615 -2.127 2.671 -5.637 2.671 -10.537c0 -3.74 -1.908 -5 -4 -5c-1.423 0 -2.92 .911 -4 1.5" />
      <path d="M12 5.5l3 1.5" />
    </svg>
  ),
  Brain: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
      <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
      <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
      <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
      <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
      <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
    </svg>
  ),
  Shield: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
    </svg>
  ),
};

const services = [
  {
    title: "Pediatría General",
    description: "Control integral del niño sano, nutrición y prevención de enfermedades desde el primer día.",
    icon: "Heart",
    stat: "+5,000",
    statLabel: "consultas al año",
  },
  {
    title: "Odontopediatría",
    description: "Cuidado dental preventivo y correctivo con un enfoque amigable y sin traumas.",
    icon: "Dental",
    stat: "98%",
    statLabel: "sin caries en revisiones",
  },
  {
    title: "Psicología Infantil",
    description: "Acompañamiento emocional y desarrollo cognitivo para cada etapa de crecimiento.",
    icon: "Brain",
    stat: "+2,000",
    statLabel: "sesiones realizadas",
  },
  {
    title: "Emergencias 24/7",
    description: "Atención inmediata con especialistas de guardia preparados para cualquier situación.",
    icon: "Shield",
    stat: "< 15 min",
    statLabel: "tiempo de respuesta",
  },
];

export const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });

  return (
    <section className="relative w-full bg-transparent py-20 overflow-hidden" id="especialidades" ref={ref}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-medi-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-medi-50/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.15, ease: "easeOut" }}
          className="flex flex-col lg:flex-row justify-between items-center text-center lg:items-end lg:text-left mb-16 gap-6"
        >
          <div className="max-w-2xl space-y-4 mx-auto lg:mx-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Especialidades <span className="text-medi-500">Médicas</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-500 max-w-xl leading-relaxed font-medium">
              Cobertura total para la salud de tus hijos, respaldada por ciencia y empatía.
            </p>
          </div>
          <button
            type="button"
            className="group inline-flex items-center gap-2 text-gray-700 font-bold text-sm hover:text-medi-600 transition-colors pb-2 border-b-2 border-gray-300 hover:border-medi-400"
          >
            Ver todo el directorio
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative rounded-2xl hover:-translate-y-1 transition-transform duration-200 will-change-transform"
            >
              <div className="absolute inset-0 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.15 + index * 0.1, ease: "easeOut" }}
                className="relative z-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col"
              >
                <div className="h-1 w-full bg-gradient-to-r from-medi-400 to-medi-500" />

                <div className="p-6 md:p-7 flex flex-col flex-grow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medi-50 to-medi-100 flex items-center justify-center text-medi-500 group-hover:from-medi-400 group-hover:to-medi-500 group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                    {tablerIcons[service.icon]}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2.5 group-hover:text-medi-600 transition-colors duration-200">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed text-sm flex-grow">
                    {service.description}
                  </p>

                  <div className="my-4 border-t border-gray-50" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-medi-600 transition-colors duration-200">
                        {service.stat}
                      </span>
                      <span className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                        {service.statLabel}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-medi-400 group-hover:text-white group-hover:border-medi-400 group-hover:translate-x-1 transition-all duration-200">
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
