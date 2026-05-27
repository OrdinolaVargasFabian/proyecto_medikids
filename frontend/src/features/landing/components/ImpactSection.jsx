import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const StatCounter = ({ targetValue, label, index }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const inView = useInView(counterRef, { once: true, margin: "0px" });

  const row = Math.floor(index / 2);
  const isK = targetValue.toLowerCase().includes("k");
  const cleanNumber = parseInt(targetValue.replace(/[+,k]/g, "").replace(",", ""));
  const prefix = targetValue.startsWith("+") ? "+" : "";
  const suffix = isK ? "k" : "";

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = Math.ceil(cleanNumber / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= cleanNumber) {
        setCount(cleanNumber);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, cleanNumber]);

  const formattedCount = count.toLocaleString();

  return (
    <motion.div
      ref={counterRef}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.0, delay: 0.05 + row * 0.18, ease: "easeOut" }}
      className="group w-full p-3 sm:p-5 md:p-7 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 hover:border-white/30 transition-all duration-200 flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
    >
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-1 sm:mb-2 md:mb-3 tracking-tighter">
        {prefix}{formattedCount}{suffix}
      </div>
      <div className="text-[10px] sm:text-xs md:text-sm text-white/70 uppercase tracking-widest font-bold">
        {label}
      </div>
    </motion.div>
  );
};

const stats = [
  { value: "+6,000", label: "Niños nacidos sanos" },
  { value: "+498k", label: "Consultas externas" },
  { value: "+3,100", label: "Cirugías exitosas" },
  { value: "+45k", label: "Vacunas aplicadas" },
];

export const ImpactSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "0px" });

  return (
    <section id="impact" className="relative w-full bg-gradient-to-br from-medi-500 to-medi-600 py-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-medi-400/20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-white/10 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.1, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left max-w-lg lg:max-w-none mx-auto lg:mx-0"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Que más pequeños vivan{" "}
              <span className="relative">
                <span className="relative z-10 text-white italic font-black">sanos</span>
                <span className="absolute bottom-1 left-0 w-full h-2 bg-medi-50/40 rounded-full -z-0" />
              </span>{" "}
              para alegrar sus hogares.
            </h2>
            <p className="text-xl text-white/80 max-w-md lg:max-w-none mx-auto lg:mx-0 leading-relaxed font-medium">
              En Medikids combinamos trato humano con excelencia médica para darte la tranquilidad que tu familia merece.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <StatCounter key={stat.label} targetValue={stat.value} label={stat.label} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
