import { motion } from "framer-motion";
import heroImg from "../../../assets/images/hero1.webp";

export const Hero = () => {
  return (
    <section id="hero" className="relative w-full bg-transparent pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10"
      >
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medi-100/60 backdrop-blur-sm rounded-full border border-medi-200/50 w-fit">
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
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight"
          >
            Salud infantil a{" "}
            <br className="hidden sm:block" />
            <span className="text-medi-500">nivel experto.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-500 max-w-lg leading-relaxed font-medium"
          >
            Reserva citas con los mejores pediatras, accede a historiales
            médicos y cuida lo que más amas con tecnología de vanguardia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <button
              type="button"
              className="group bg-medi-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-medi-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-[0_8px_30px_rgba(184,202,118,0.4)] hover:shadow-[0_16px_40px_rgba(184,202,118,0.5)] inline-flex items-center gap-3 w-fit"
            >
              Conoce el Portal
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
            <button
              type="button"
              className="px-8 py-4 rounded-2xl font-bold text-lg text-slate-500 hover:text-medi-600 hover:bg-medi-50 transition-all duration-200 border-2 border-slate-200 hover:border-medi-300 w-fit"
            >
              Ver especialidades
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex gap-8 pt-6 border-t border-slate-100"
          >
            {[
              { value: '50+', label: 'Especialistas' },
              { value: '24/7', label: 'Disponible' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute top-0 right-0 z-30 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-4 border border-slate-100 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-medi-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-medi-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm whitespace-nowrap">15+ Años de experiencia</span>
          </motion.div>

          <div className="relative overflow-hidden rounded-2xl w-3/4 mx-auto lg:w-10/12">
            <img
              src={heroImg}
              alt="Médico atendiendo a un niño"
              className="w-full h-auto object-cover block"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none">
              <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,180 C360,320 1080,320 1440,180 L1440,320 L0,320 Z" fill="white" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.7 }}
              className="absolute top-[15%] left-2 z-10 w-6 h-6 text-medi-400/60"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z" />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.9 }}
              className="absolute top-[40%] -right-1 z-10 w-5 h-5 text-medi-400/50"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z" />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12, delay: 1.1 }}
              className="absolute bottom-[25%] left-4 z-10 w-7 h-7 text-medi-300/40"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z" />
              </svg>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
            className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3 border border-slate-100"
          >
            <div className="w-10 h-10 rounded-xl bg-medi-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-medi-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">4.9 / 5 estrellas</p>
              <p className="text-xs text-slate-400 font-medium">Google Reviews</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
