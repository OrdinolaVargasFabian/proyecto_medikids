import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    title: "Pediatría General",
    description: "Control integral del niño sano, nutrición y prevención de enfermedades desde el primer día.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />,
    solidIcon: <path fillRule="evenodd" d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" clipRule="evenodd" />,
    stat: "+5,000",
    statLabel: "consultas al año",
  },
  {
    title: "Odontopediatría",
    description: "Cuidado dental preventivo y correctivo con un enfoque amigable y sin traumas.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6.75c0-2.07-1.68-3.75-3.75-3.75-1.39 0-2.61.76-3.23 1.9a3.751 3.751 0 00-5.77.1 3.75 3.75 0 00-2.25 3.5c0 3.75 2.25 5.25 3 7.5.3 1 1.5 1.5 2.25 1.5s1.95-1.5 2.25-1.5c1.13-1.5 1.13-2.25 1.5-2.25s.37.75 1.5 2.25c.3 0 1.5 1.5 2.25 1.5s1.95-.5 2.25-1.5c.75-2.25 3-3.75 3-7.5z" />,
    solidIcon: <path fillRule="evenodd" d="M19.5 6.75c0-2.07-1.68-3.75-3.75-3.75-1.39 0-2.61.76-3.23 1.9a3.751 3.751 0 00-5.77.1 3.75 3.75 0 00-2.25 3.5c0 3.75 2.25 5.25 3 7.5.3 1 1.5 1.5 2.25 1.5s1.95-1.5 2.25-1.5c1.13-1.5 1.13-2.25 1.5-2.25s.37.75 1.5 2.25c.3 0 1.5 1.5 2.25 1.5s1.95-.5 2.25-1.5c.75-2.25 3-3.75 3-7.5z" clipRule="evenodd" />,
    stat: "98%",
    statLabel: "sin caries en revisiones",
  },
  {
    title: "Psicología Infantil",
    description: "Acompañamiento emocional y desarrollo cognitivo para cada etapa de crecimiento.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.608-2.002a5.114 5.114 0 003.892-3.95m-1.5-2.002a5.114 5.114 0 00-3.892-3.95m-1.5 2.002a5.114 5.114 0 00-3.892-3.95m1.5 2.002a5.114 5.114 0 003.892-3.95" />,
    solidIcon: <path fillRule="evenodd" d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 11c-3.537 0-10 1.77-10 5.308V22h20v-3.692C22 14.77 15.537 13 12 13z" clipRule="evenodd" />,
    stat: "+2,000",
    statLabel: "sesiones realizadas",
  },
  {
    title: "Emergencias 24/7",
    description: "Atención inmediata con especialistas de guardia preparados para cualquier situación.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />,
    solidIcon: <path fillRule="evenodd" d="M11.953 2.571l-8 3.5A1 1 0 003 7v4.615c0 4.148 2.766 8.014 6.777 9.53a3.528 3.528 0 002.446 0C16.234 19.615 19 15.763 19 11.615V7a1 1 0 00-.594-.914l-8-3.5a1 1 0 00-.812 0zM12 8a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0112 8z" clipRule="evenodd" />,
    stat: "< 15 min",
    statLabel: "tiempo de respuesta",
  },
];

export const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative w-full bg-transparent py-28 overflow-hidden" id="especialidades" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6"
        >
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-medi-50 rounded-full border border-medi-200/50">
              <span className="w-2 h-2 rounded-full bg-medi-400" />
              <span className="text-xs font-bold text-medi-700 uppercase tracking-wider">Nuestros servicios</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Especialidades{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-medi-500">Médicas</span>
                <span className="absolute bottom-2 left-0 w-full h-2.5 bg-medi-200/50 rounded-full -z-0" />
              </span>
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
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
<div
              key={service.title}
              className="group hover:-translate-y-1.5 hover:shadow-xl hover:transition-all hover:duration-500 rounded-2xl transition-all duration-500 ease-in-out"
            >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm cursor-pointer flex flex-col h-full overflow-hidden"
            >
              <div className="relative z-10 w-14 h-14 bg-medi-50 rounded-xl flex items-center justify-center text-medi-500 group-hover:bg-medi-400 group-hover:text-white transition-all duration-200 mb-6 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7">
                  {service.icon}
                </svg>
              </div>

              <div className="relative z-10 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-medi-600 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm mb-6">
                  {service.description}
                </p>
              </div>

              <div className="relative z-10 mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 group-hover:bg-medi-50/50 transition-colors duration-200 border border-transparent group-hover:border-medi-100">
                  <div>
                    <span className="block text-2xl font-black text-gray-900 group-hover:text-medi-600 transition-colors duration-200">
                      {service.stat}
                    </span>
                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                      {service.statLabel}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-medi-500 group-hover:border-medi-200 group-hover:translate-x-1 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
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
