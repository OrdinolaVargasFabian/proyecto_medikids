import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    name: "Valeria Cárdenas",
    role: "Mamá de Mateo (4 años)",
    text: "La atención en MediKids es excepcional. Mi hijo solía tenerle pánico a los médicos, pero el trato de los pediatras aquí es tan empático y lleno de paciencia que ahora viene feliz. ¡Gracias por tanta dedicación!",
    rating: 5,
  },
  {
    name: "Carlos Mendoza",
    role: "Papá de Sofía (7 años)",
    text: "Fuimos por una emergencia a medianoche y la rapidez con la que nos atendieron fue increíble. El equipo de guardia no solo estabilizó a mi hija rápido, sino que nos transmitieron mucha calma en un momento difícil.",
    rating: 5,
  },
  {
    name: "Andrea Luciana",
    role: "Mamá de gemelos (1 año)",
    text: "El portal para padres me ha salvado la vida. Poder ver las vacunas, las próximas citas y los resultados de laboratorio desde mi celular sin tener que llamar o hacer filas no tiene precio. Totalmente recomendado.",
    rating: 5,
  },
  {
    name: "Roberto Aliaga",
    role: "Papá de Lucas (10 años)",
    text: "Llevamos a nuestro hijo al odontopediatra por primera vez y el consultorio estaba diseñado especialmente para no asustarlos. Todo el procedimiento fue sin dolor y súper didáctico.",
    rating: 5,
  },
  {
    name: "Mariana Silva",
    role: "Mamá de Emma (2 meses)",
    text: "Como madre primeriza tenía muchísimas dudas. El control de niño sano aquí es súper completo, me explican cada percentil de crecimiento con calma y responden a todas mis preguntas sin apuros.",
    rating: 5,
  },
];

const StarRating = () => (
  <div className="flex gap-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
      </svg>
    ))}
  </div>
);

export const TestimonialsSection = () => {
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || !carouselRef.current) return;
    const interval = setInterval(() => {
      const el = carouselRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const cardWidth = clientWidth > 1024 ? clientWidth / 3 + 16 : clientWidth > 640 ? clientWidth / 2 + 12 : clientWidth;
        el.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const scroll = (direction) => {
    setAutoPlay(false);
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth > 1024 ? clientWidth / 2 : clientWidth;
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
    <section ref={sectionRef} className="w-full bg-transparent py-24 overflow-hidden" id="testimonios">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-end text-right mb-16 px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            Lo que dicen las <span className="text-medi-500">familias</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
            Descubre por qué cientos de padres confían en Medikids para el cuidado, prevención y tratamiento de lo que más aman.
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
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-4 pb-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>

            {testimonials.map((testimony, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="group flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start flex flex-col items-center text-center bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
              >
                <div className="w-24 h-24 rounded-full bg-gray-50 mb-4 flex items-center justify-center relative z-10 ring-4 ring-gray-50 group-hover:ring-medi-50 shadow-md transition-all duration-200">
                  <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">[FOTO]</span>
                </div>

                <StarRating />

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-medi-600 transition-colors duration-200 relative z-10">
                  {testimony.name}
                </h3>
                <p className="text-sm font-medium text-gray-500 mb-6 relative z-10">
                  {testimony.role}
                </p>

                <p className="text-gray-600 leading-relaxed relative z-10 mb-4">
                  &ldquo;{testimony.text}&rdquo;
                </p>

                <div className="absolute -bottom-4 -right-2 text-medi-50 group-hover:text-medi-400 transition-colors duration-200 pointer-events-none z-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-24 h-24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
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
