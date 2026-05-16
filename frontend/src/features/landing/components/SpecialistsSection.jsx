import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const specialists = [
  { name: "Dr. Philip Bailey", specialty: "Urología Pediátrica" },
  { name: "Dra. Vera Hasson", specialty: "Cardiología Infantil" },
  { name: "Dr. Matthew Hill", specialty: "Neuropediatría" },
  { name: "Dra. Jeanette Hoff", specialty: "Cirugía Pediátrica" },
  { name: "Dr. Carlos Mendoza", specialty: "Odontopediatría" },
  { name: "Dra. Lucía Fernández", specialty: "Neumología Pediátrica" },
  { name: "Dr. Roberto Aliaga", specialty: "Gastroenterología Pediátrica" },
  { name: "Dra. Sofía Castillo", specialty: "Dermatología Infantil" },
];

export const SpecialistsSection = () => {
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || !carouselRef.current) return;
    const interval = setInterval(() => {
      const el = carouselRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const scroll = (direction) => {
    setAutoPlay(false);
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const scrollAmount = window.innerWidth > 1024 ? 320 : 280;
      if (direction === "left") {
        if (scrollLeft <= 0) {
          carouselRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      } else {
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <section ref={sectionRef} className="w-full bg-transparent py-24 overflow-hidden" id="equipo">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-end text-right mb-16 px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            Conoce a nuestros <span className="text-medi-500">especialistas</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
            Contamos con un equipo médico altamente cualificado y comprometido con la salud y el bienestar de los más pequeños de la casa.
          </p>
        </motion.div>

        <div className="relative group/carousel max-w-full px-14 md:px-24">
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 left-2 md:left-8 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.1)] flex items-center justify-center text-medi-400 border border-medi-100 opacity-70 group-hover/carousel:opacity-100 hover:bg-medi-400 hover:text-white transition-all duration-200 z-30 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 pr-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div
            ref={carouselRef}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-4 pb-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>

            {specialists.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className="group flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 overflow-hidden border-b-4 border-b-transparent hover:border-b-medi-400"
              >
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-gray-50" />
                  <span className="text-gray-400 font-bold tracking-widest uppercase text-xs z-0">
                    [ Foto Doctor ]
                  </span>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <button className="bg-medi-400 text-white p-2 rounded-lg shadow-md hover:bg-medi-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-10 flex flex-col">
                    <svg viewBox="0 0 400 60" className="w-full text-medi-400 drop-shadow-sm block translate-y-[1px]">
                      <path fill="currentColor" d="M0,40 Q100,0 200,30 T400,20 L400,60 L0,60 Z" />
                    </svg>
                    <div className="bg-medi-400 w-full pt-1 pb-4 flex justify-center gap-3 relative z-10">
                      {[...Array(4)].map((_, i) => (
                        <a
                          key={i}
                          href="#"
                          className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-medi-400 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            <path d="M2 12h20" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 text-center bg-white group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-medi-50/40 relative z-20 transition-colors duration-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                  <p className="text-sm font-medium text-gray-500">{doc.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 right-2 md:right-8 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.1)] flex items-center justify-center text-medi-400 border border-medi-100 opacity-70 group-hover/carousel:opacity-100 hover:bg-medi-400 hover:text-white transition-all duration-200 z-30 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 pl-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
