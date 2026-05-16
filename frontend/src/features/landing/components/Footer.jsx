import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Calendar, ChevronRight } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiTiktok } from "@icons-pack/react-simple-icons";

const clinica = [
  { label: "Nosotros", href: "#" },
  { label: "Especialidades", href: "#especialidades" },
  { label: "Sedes", href: "#" },
  { label: "Resultados de Laboratorio", href: "#" },
];

const legal = [
  { label: "Política de Privacidad", href: "#" },
  { label: "Términos y Condiciones", href: "#" },
  { label: "Política de Cookies", href: "#" },
];

const socials = [
  { name: "Facebook", href: "#", Icon: SiFacebook },
  { name: "Instagram", href: "#", Icon: SiInstagram },
  { name: "TikTok", href: "#", Icon: SiTiktok },
  { name: "X", href: "#", Icon: SiX },
];

export const Footer = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer className="relative w-full pt-24 pb-10 overflow-hidden">
      <div className="absolute -top-[1px] left-0 w-full h-24 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 60C240 20 480 80 720 60S960 20 1200 60s240 40 240 40v40H0V60Z" fill="currentColor" className="text-medi-400" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-medi-400 via-medi-500 to-medi-600" />
      <div className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-white/18 via-medi-300/8 to-transparent blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-medi-200/12 via-white/6 to-transparent blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-col gap-6"
          >
            <Link to="/" className="flex flex-col leading-[0.85] font-black text-white tracking-tighter text-4xl hover:opacity-85 transition-opacity w-fit drop-shadow-sm">
              <span>medi</span>
              <span>kids</span>
            </Link>
            <p className="text-white/90 text-sm leading-relaxed max-w-[180px] font-medium">
              Transformando la atención pediátrica con tecnología y empatía.
            </p>
            <div className="flex flex-col gap-3 pt-1">
              <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Síguenos en</span>
              <div className="flex items-center gap-0.5">
                {socials.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="group p-2 rounded-lg bg-white/12 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
                  >
                    <Icon className="w-4.2 h-4.2 text-white/90 group-hover:text-white transition-colors duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Clínica</h4>
              <span className="w-full h-[2px] bg-white/20 rounded-full" />
            </div>
            <nav className="flex flex-col gap-2.5">
              {clinica.map((item) => (
                <a key={item.label} href={item.href} className="group text-white/90 hover:text-white text-[13px] font-semibold transition-all duration-200 w-fit flex items-center gap-1">
                  <ChevronRight size={11} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-white/70" />
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Horarios</h4>
              <span className="w-full h-[2px] bg-white/20 rounded-full" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0 mt-0.5">
                  <Clock size={13} className="text-white" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-white leading-tight">Emergencias</span>
                  <span className="text-xs text-white/85 leading-tight mt-0.5 font-medium">24/7 — Todos los días</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0 mt-0.5">
                  <Calendar size={13} className="text-white" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-white leading-tight">Consultas</span>
                  <span className="text-xs text-white/85 leading-tight mt-0.5 font-medium">Lunes a Sábado</span>
                  <span className="text-xs text-white/85 leading-tight font-medium">8:00 a.m. — 7:00 p.m.</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Legal</h4>
              <span className="w-full h-[2px] bg-white/20 rounded-full" />
            </div>
            <nav className="flex flex-col gap-2.5">
              {legal.map((item) => (
                <a key={item.label} href={item.href} className="group text-white/90 hover:text-white text-[13px] font-semibold transition-all duration-200 w-fit flex items-center gap-1">
                  <ChevronRight size={11} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-white/70" />
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Contacto</h4>
              <span className="w-full h-[2px] bg-white/20 rounded-full" />
            </div>
            <div className="flex flex-col gap-3.5">
              <a href="tel:+51970854221" className="group flex items-center gap-2.5 text-white/95 hover:text-white transition-all duration-200 w-fit">
                <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200 backdrop-blur-sm shrink-0">
                  <Phone size={13} className="text-white" />
                </span>
                <span className="font-bold text-[13px]">970 854 221</span>
              </a>
              <a href="mailto:contacto@medikids.com" className="group flex items-center gap-2.5 text-white/95 hover:text-white transition-all duration-200 w-fit">
                <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200 backdrop-blur-sm shrink-0">
                  <Mail size={13} className="text-white" />
                </span>
                <span className="font-bold text-[13px]">contacto@medikids.com</span>
              </a>
              <div className="flex items-start gap-2.5 text-white/90 w-fit">
                <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0 mt-0.5">
                  <MapPin size={13} className="text-white" />
                </span>
                <span className="text-[13px] font-semibold leading-relaxed">
                  Av. Primavera 2450,<br />Surco, Lima
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="pt-7 border-t border-white/15 text-center">
          <p className="text-white/70 text-xs font-semibold">&copy; 2026 Medikids — Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
};
