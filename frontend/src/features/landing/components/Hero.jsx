import { motion } from "framer-motion";
import heroImg from "../../../assets/images/hero1.webp";

export const Hero = () => {
  return (
    <section id="hero" className="relative w-full bg-transparent pt-[clamp(1rem,3.5vw,3.5rem)] pb-[clamp(2rem,8vw,9rem)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-medi-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-medi-100/40 blur-3xl" />
        <div className="absolute top-1/4 left-[60%] w-[300px] h-[300px] rounded-full border border-medi-200/20" />
        <div className="absolute bottom-1/4 left-[10%] w-[200px] h-[200px] rounded-full border border-medi-300/15" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #b8ca76 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 min-[861px]:grid-cols-[1fr_1.1fr] gap-6 sm:gap-8 min-[861px]:gap-6 lg:gap-12 xl:gap-16 items-center relative z-10"
      >
        <div className="flex flex-col gap-6 sm:gap-8 min-[861px]:gap-6 lg:gap-8 max-[860px]:items-center max-[860px]:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medi-100/60 backdrop-blur-sm rounded-full border border-medi-200/50 max-[860px]:mx-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medi-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-medi-500" />
              </span>
              <span className="text-sm font-semibold text-medi-700">
                Más de 10,000 familias confían en nosotros
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[2.5rem] sm:text-5xl min-[861px]:text-[3.15rem] lg:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight"
          >
            Salud infantil a{" "}
            <br className="hidden sm:block" />
            <span className="text-medi-500">nivel experto.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed font-medium"
          >
            Reserva citas con los mejores pediatras, accede a historiales
            médicos y cuida lo que más amas con tecnología de vanguardia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 pt-2 max-[860px]:items-center"
          >
            <button
              type="button"
              className="group bg-medi-500 text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-lg hover:bg-medi-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-[0_8px_30px_rgba(184,202,118,0.4)] hover:shadow-[0_16px_40px_rgba(184,202,118,0.5)] inline-flex items-center gap-2 sm:gap-3 max-[860px]:w-fit"
            >
              Conoce el Portal
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
            <button
              type="button"
              className="px-5 sm:px-8 py-2.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-lg text-slate-500 hover:text-medi-600 hover:bg-medi-50 transition-all duration-200 border-2 border-slate-200 hover:border-medi-300 max-[860px]:w-fit inline-flex items-center gap-2 sm:gap-3"
            >
              Ver especialidades
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex gap-6 sm:gap-8 pt-4 sm:pt-6 border-t border-slate-100 max-[860px]:justify-center"
          >
            {[
              { value: '5+', label: 'Especialistas' },
              { value: '24/7', label: 'Disponible' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative min-[861px]:ml-9"
        >
          {/* Tarjeta Superior */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute top-0 right-2 sm:right-0 z-30 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-3 sm:p-4 border border-slate-100 flex items-center gap-3 w-auto max-w-[230px] origin-top-right"
            style={{ zoom: 'min(0.8, max(0.55, calc(0.2 + 0.08vw)))' }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-medi-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-medi-500">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">Más de 15 años</p>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">de experiencia</p>
            </div>
          </motion.div>

          <div className="relative overflow-hidden rounded-2xl mx-auto w-[200px] sm:w-[250px] md:w-[310px] lg:w-[380px] xl:w-[450px] aspect-[4/5] translate-x-px">
            <img
              src={heroImg}
              alt="Médico atendiendo a un niño"
              className="absolute inset-0 w-full h-full object-cover block select-none pointer-events-none"
            />

            <motion.div
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[15%] left-2 z-10 w-5 h-5 sm:w-6 sm:h-6 text-medi-400/80"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3" />
              </svg>
            </motion.div>

            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[40%] -right-1 z-10 w-4 h-4 sm:w-5 sm:h-5 text-medi-400/70 hidden sm:block"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3" />
              </svg>
            </motion.div>

            <motion.div
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[20%] left-2 sm:left-4 z-10 w-5 h-5 sm:w-7 sm:h-7 text-medi-300/70 hidden sm:block"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3" />
              </svg>
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: [0.45, 0.95, 0.45] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[48%] left-[8%] z-10 w-4 h-4 sm:w-5 sm:h-5 text-medi-400/70"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3" />
            </svg>
          </motion.div>

          <motion.div
            animate={{ opacity: [0.25, 0.75, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[28%] right-[16%] z-10 w-3 h-3 sm:w-4 sm:h-4 text-medi-300/60"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3" />
            </svg>
          </motion.div>

          {/* Tarjeta Inferior */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute bottom-0 left-0 lg:-left-[4.25rem] z-20 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-3 sm:p-4 flex items-center gap-3 border border-slate-100 w-auto max-w-[230px] origin-bottom-left"
            style={{ zoom: 'min(0.8, max(0.55, calc(0.2 + 0.08vw)))' }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-medi-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-medi-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">4.9 / 5 estrellas</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Google Reviews</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};