import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

export const TechPortalSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const benefits = [
    "Historial médico digital accesible 24/7",
    "Reserva y reprogramación de citas en 1 clic",
    "Resultados de laboratorio en tiempo real",
    "Recetas electrónicas directo a tu celular",
  ];

  return (
    <section ref={ref} className="w-full bg-transparent py-24 overflow-hidden relative" id="nosotros">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Toda la salud de tus hijos en <span className="text-medi-500">la palma de tu mano.</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Olvídate de las carpetas llenas de papeles. Nuestro portal para padres te da control total sobre la información médica de tu familia con seguridad y facilidad.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-medi-100 flex items-center justify-center text-medi-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              className="pt-4"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-medi-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-medi-400 active:scale-95 transition-all duration-200 shadow-lg shadow-medi-500/20"
              >
                Ingresar al Portal
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative mx-8 lg:mx-0">
            <motion.div
              initial={{ rotate: 3, scale: 1.05 }}
              animate={{ rotate: 3, scale: 1.08 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-medi-200 to-medi-50 rounded-3xl"
            />
            <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-2 relative overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                  className="w-3 h-3 rounded-full bg-red-400"
                />
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="w-3 h-3 rounded-full bg-yellow-400"
                />
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  className="w-3 h-3 rounded-full bg-green-400"
                />
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 h-64 sm:h-72 md:h-96 flex flex-col gap-4">
                <motion.div
                  className="h-6 bg-gray-200 rounded-md"
                  initial={{ width: "23%" }}
                  animate={{ width: "48%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <div className="flex gap-4">
                  <div className="w-1/2 h-24 bg-white rounded-xl border border-gray-100 shadow-sm" />
                  <div className="w-1/2 h-24 bg-white rounded-xl border border-gray-100 shadow-sm" />
                </div>
                <div className="w-full flex-1 bg-white rounded-xl border border-gray-100 shadow-sm mt-2" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
