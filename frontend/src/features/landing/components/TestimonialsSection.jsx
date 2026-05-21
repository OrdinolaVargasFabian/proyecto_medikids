import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import M1 from "../../../assets/images/M1.webp";
import M2 from "../../../assets/images/M2.webp";
import M3 from "../../../assets/images/M3.webp";
import H1 from "../../../assets/images/H1.webp";
import H2 from "../../../assets/images/H2.webp";

const testimonials = [
  {
    name: "Valeria Cárdenas",
    role: "Mamá de Mateo (4 años)",
    text: "La atención en MediKids es excepcional. Mi hijo solía tenerle pánico a los médicos, pero el trato de los pediatras aquí es tan empático y lleno de paciencia que ahora viene feliz. ¡Gracias por tanta dedicación!",
    rating: 5,
    image: M1,
  },
  {
    name: "Carlos Mendoza",
    role: "Papá de Sofía (7 años)",
    text: "Fuimos por una emergencia a medianoche y la rapidez con la que nos atendieron fue increíble. El equipo de guardia no solo estabilizó a mi hija rápido, sino que nos transmitieron mucha calma en un momento difícil.",
    rating: 5,
    image: H1,
  },
  {
    name: "Andrea Luciana",
    role: "Mamá de gemelos (1 año)",
    text: "El portal para padres me ha salvado la vida. Poder ver las vacunas, las próximas citas y los resultados de laboratorio desde mi celular sin tener que llamar o hacer filas no tiene precio. Totalmente recomendado.",
    rating: 5,
    image: M2,
  },
  {
    name: "Roberto Aliaga",
    role: "Papá de Lucas (10 años)",
    text: "Llevamos a nuestro hijo al odontopediatra por primera vez y el consultorio estaba diseñado especialmente para no asustarlos. Todo el procedimiento fue sin dolor y súper didáctico.",
    rating: 5,
    image: H2,
  },
  {
    name: "Mariana Silva",
    role: "Mamá de Emma (2 meses)",
    text: "Como madre primeriza tenía muchísimas dudas. El control de niño sano aquí es súper completo, me explican cada percentil de crecimiento con calma y responden a todas mis preguntas sin apuros.",
    rating: 5,
    image: M3,
  },
];

const StarRating = () => (
  <div className="flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
      </svg>
    ))}
  </div>
);

const arrowBase =
  "absolute inset-y-0 my-auto w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full shadow-lg shadow-black/5 flex items-center justify-center text-gray-500 border border-gray-200 transition-all duration-300 z-30 active:scale-90 hover:scale-110 hover:bg-medi-400 hover:text-white hover:border-medi-400 hover:shadow-xl hover:shadow-medi-400/20";

const autoplayPlugin = Autoplay({ delay: 3000, stopOnInteraction: false });

export const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "0px" });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", duration: 40 }, [autoplayPlugin]);

  const resetAutoplay = () => {
    autoplayPlugin.stop();
    autoplayPlugin.play();
  };

  const handleMouseEnter = () => {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => autoplayPlugin.stop(), 1000);
  };

  const handleMouseLeave = () => {
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
    <section ref={sectionRef} className="w-full bg-transparent py-20 overflow-hidden" id="testimonios">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center text-center lg:items-end lg:text-right mb-12 px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4">
            Lo que dicen las <span className="text-medi-500">familias</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
            Descubre por qué cientos de padres confían en Medikids para el cuidado, prevención y tratamiento de lo que más aman.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex">
              {testimonials.map((testimony, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-3"
                >
                  <div className="group select-none flex flex-col items-center text-center bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-transform duration-200 will-change-transform relative overflow-hidden h-full"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-50 mb-3 flex items-center justify-center relative z-10 ring-4 ring-gray-50 group-hover:ring-medi-50 shadow-md transition-all duration-200 overflow-hidden">
                      <img src={testimony.image} alt={testimony.name} className="w-full h-full object-cover" />
                    </div>

                    <StarRating />

                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-medi-600 transition-colors duration-200 relative z-10">
                      {testimony.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mb-3 relative z-10">
                      {testimony.role}
                    </p>

                    <p className="text-gray-600 leading-relaxed relative z-10 mb-4">
                      &ldquo;{testimony.text}&rdquo;
                    </p>

                    <div className="absolute -bottom-4 right-0 text-medi-50 group-hover:text-medi-400 transition-colors duration-200 pointer-events-none z-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-16 h-16">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
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
