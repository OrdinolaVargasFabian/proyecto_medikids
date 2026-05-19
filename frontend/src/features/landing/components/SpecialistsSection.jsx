import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import doc1 from "../../../assets/images/doc1.webp";
import doc2 from "../../../assets/images/doc2.webp";
import doc3 from "../../../assets/images/doc3.webp";
import doc4 from "../../../assets/images/doc4.webp";
import dra1 from "../../../assets/images/dra1.webp";
import dra2 from "../../../assets/images/dra2.webp";
import dra3 from "../../../assets/images/dra3.webp";

const specialists = [
  { name: "Dr. Philip Bailey", specialty: "Pediatría General", img: doc1 },
  { name: "Dra. Vera Hasson", specialty: "Neurología Pediátrica", img: dra1 },
  { name: "Dr. Matthew Hill", specialty: "Odontopediatría", img: doc2 },
  { name: "Dra. Jeanette Hoff", specialty: "Dermatología Pediátrica", img: dra2 },
  { name: "Dr. Carlos Mendoza", specialty: "Cardiología Pediátrica", img: doc3 },
  { name: "Dra. Lucía Fernández", specialty: "Oftalmología Pediátrica", img: dra3 },
  { name: "Dr. Roberto Aliaga", specialty: "Psicología Infantil", img: doc4 },
];

export const SpecialistsSection = () => {
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [autoPlay, setAutoPlay] = useState(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const getStep = () => {
    const el = carouselRef.current;
    if (!el) return 320;
    const firstCard = el.querySelector("[data-card]");
    if (!firstCard) return 320;
    return firstCard.offsetWidth + 24;
  };

  const isAnimating = useRef(false);
  const pendingScroll = useRef(null);

  const snapToNearest = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const step = getStep();
    const nearest = Math.round(el.scrollLeft / step) * step;
    if (Math.abs(el.scrollLeft - nearest) > 1) {
      el.scrollTo({ left: nearest, behavior: "instant" });
    }
  }, []);

  const scrollBy = useCallback((direction) => {
    if (isAnimating.current) {
      pendingScroll.current = direction;
      return;
    }
    setAutoPlay(false);
    const el = carouselRef.current;
    if (!el) return;
    const step = getStep();
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const current = el.scrollLeft;
    const target = direction === "left"
      ? Math.max(0, current - step)
      : Math.min(maxScroll, current + step);
    if (Math.abs(current - target) < 1) return;
    isAnimating.current = true;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  const autoplayNext = useCallback(() => {
    const el = carouselRef.current;
    if (!el || isAnimating.current) return;
    const step = getStep();
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const current = el.scrollLeft;
    const target = current + step > maxScroll ? 0 : current + step;
    if (Math.abs(current - target) < 1) return;
    isAnimating.current = true;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScrollEnd = () => {
      isAnimating.current = false;
      if (pendingScroll.current) {
        const dir = pendingScroll.current;
        pendingScroll.current = null;
        scrollBy(dir);
      }
    };
    el.addEventListener("scrollend", onScrollEnd);
    return () => el.removeEventListener("scrollend", onScrollEnd);
  }, [scrollBy]);

  const updateEdgeState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= maxScroll - 2);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdgeState, { passive: true });
    return () => el.removeEventListener("scroll", updateEdgeState);
  }, [updateEdgeState]);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(autoplayNext, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, autoplayNext]);

  useEffect(() => {
    const onResize = () => snapToNearest();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [snapToNearest]);

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
            onClick={() => scrollBy("left")}
            disabled={atStart}
            className={`absolute top-1/2 left-2 md:left-8 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.1)] flex items-center justify-center text-medi-400 border border-medi-100 transition-all duration-200 z-30 active:scale-95 ${atStart ? "opacity-0 pointer-events-none" : "opacity-70 group-hover/carousel:opacity-100 hover:bg-medi-400 hover:text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 pr-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div
            ref={carouselRef}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="flex gap-6 overflow-x-auto pt-4 pb-10 px-4 sm:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>

            {specialists.map((doc, index) => (
              <motion.div
                key={index}
                data-card
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className="group flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 overflow-hidden border-b-4 border-b-transparent hover:border-b-medi-400"
              >
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
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
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scrollBy("right")}
            disabled={atEnd}
            className={`absolute top-1/2 right-2 md:right-8 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.1)] flex items-center justify-center text-medi-400 border border-medi-100 transition-all duration-200 z-30 active:scale-95 ${atEnd ? "opacity-0 pointer-events-none" : "opacity-70 group-hover/carousel:opacity-100 hover:bg-medi-400 hover:text-white"}`}
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
