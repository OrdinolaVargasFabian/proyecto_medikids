import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import doc1 from "../../../assets/images/doc1.avif";
import doc2 from "../../../assets/images/doc2.avif";
import doc3 from "../../../assets/images/doc3.avif";
import doc4 from "../../../assets/images/doc4.avif";
import dra1 from "../../../assets/images/dra1.avif";
import dra2 from "../../../assets/images/dra2.avif";
import dra3 from "../../../assets/images/dra3.avif";

const specialists = [
  { name: "Dr. Philip Bailey", specialty: "Pediatría General", img: doc1 },
  { name: "Dra. Vera Hasson", specialty: "Neurología Pediátrica", img: dra1 },
  { name: "Dr. Matthew Hill", specialty: "Odontopediatría", img: doc2 },
  { name: "Dra. Jeanette Hoff", specialty: "Dermatología Pediátrica", img: dra2 },
  { name: "Dr. Carlos Mendoza", specialty: "Cardiología Pediátrica", img: doc3 },
  { name: "Dra. Lucía Fernández", specialty: "Oftalmología Pediátrica", img: dra3 },
  { name: "Dr. Roberto Aliaga", specialty: "Psicología Infantil", img: doc4 },
];

const arrowBase =
  "absolute inset-y-0 my-auto w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full shadow-lg shadow-black/5 flex items-center justify-center text-gray-500 border border-gray-200 transition-all duration-300 z-30 active:scale-90 hover:scale-110 hover:bg-medi-400 hover:text-white hover:border-medi-400 hover:shadow-xl hover:shadow-medi-400/20";

const autoplayPlugin = Autoplay({ delay: 3000, stopOnInteraction: false });

export const SpecialistsSection = () => {
  const hoverTimerRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", duration: 40 },
    [autoplayPlugin]
  );

  const resetAutoplay = () => {
    autoplayPlugin.stop();
    autoplayPlugin.play();
  };

  const handleCardMouseEnter = () => {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => autoplayPlugin.stop(), 1000);
  };

  const handleCardMouseLeave = () => {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      emblaApi?.scrollNext();
      autoplayPlugin.play();
    }, 1000);
  };

  const scrollPrev = () => {
    clearTimeout(hoverTimerRef.current);
    emblaApi?.scrollPrev();
    resetAutoplay();
  };

  const scrollNext = () => {
    clearTimeout(hoverTimerRef.current);
    emblaApi?.scrollNext();
    resetAutoplay();
  };

  useEffect(() => {
    if (!emblaApi) return;

    autoplayPlugin.stop();
    const initialTimer = setTimeout(() => autoplayPlugin.play(), 2000);
    emblaApi.on('pointerDown', resetAutoplay);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hoverTimerRef.current);
      autoplayPlugin.stop();
      emblaApi.off('pointerDown', resetAutoplay);
    };
  }, [emblaApi]);

  return (
    <section className="w-full bg-transparent py-20 overflow-hidden" id="equipo">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.15, ease: "easeOut" }}
          viewport={{ once: true, margin: "0px" }}
          className="flex flex-col items-center text-center lg:items-end lg:text-right mb-12 px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            Conoce a nuestros <span className="text-medi-500">especialistas</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
            Contamos con un equipo médico altamente cualificado y comprometido con la salud y el bienestar de los más pequeños de la casa.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 1.0, delay: 0.15, ease: "easeOut" }}
          className="relative group/carousel max-w-full px-14 md:px-24"
        >
          <button
            onClick={scrollPrev}
            className={`${arrowBase} left-2 md:left-8`}
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <div
            ref={emblaRef}
            className="overflow-hidden py-7"
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="flex">
              {specialists.map((doc, index) => (
                <div key={index} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 px-3">
                  <div className="group select-none flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-transform duration-200 will-change-transform overflow-hidden border-b-4 border-b-transparent hover:border-b-medi-400">
                    <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                      <img
                        src={doc.img}
                        alt={doc.name}
                        className="absolute inset-0 w-full h-full object-cover object-[center_15%]" loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollNext}
            className={`${arrowBase} right-2 md:right-8`}
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
