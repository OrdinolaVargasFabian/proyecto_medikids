import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Calendar, ChevronDown } from "lucide-react";
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

const AccordionPanel = ({ isOpen, children }) => {
  const ref = useRef(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    if (ref.current) setH(ref.current.scrollHeight);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? { height: h, opacity: 1 } : { height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="overflow-hidden sm:!h-auto sm:!opacity-100 sm:!overflow-visible"
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
};

export const Footer = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [openSections, setOpenSections] = useState(new Set());
  const toggleSection = useCallback((id) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <footer className="relative w-full pt-16 lg:pt-24 pb-10 overflow-hidden">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-10 mb-10 lg:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-center lg:items-start sm:justify-center gap-4 sm:gap-10 lg:gap-6 sm:flex-wrap sm:col-span-2 lg:col-span-1 sm:pb-4 lg:pb-0"
          >
            <Link to="/" className="flex flex-col leading-[0.85] font-black text-white tracking-tighter text-4xl hover:opacity-85 transition-opacity w-fit drop-shadow-sm">
              <span>medi</span>
              <span>kids</span>
            </Link>
            <p className="text-white/90 text-sm leading-relaxed max-w-[280px] lg:max-w-[180px] font-medium hidden lg:block">
              Transformando la atención pediátrica con tecnología y empatía.
            </p>
            <div className="flex flex-col gap-3 pt-1">
              <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest hidden lg:block">Síguenos en</span>
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
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4 lg:gap-5"
          >
            <button
              type="button"
              onClick={() => toggleSection("clinica")}
              className="flex sm:hidden items-center justify-between w-full text-left"
            >
              <div className="flex flex-col gap-1 w-full">
                <h4 className="text-white text-sm font-bold uppercase tracking-wider">Clínica</h4>
                <span className="w-full h-[2px] bg-white/20 rounded-full" />
              </div>
              <ChevronDown size={16} className={`text-white/70 transition-transform duration-200 shrink-0 ${openSections.has("clinica") ? "" : "-rotate-90"}`} />
            </button>
            <div className="hidden sm:flex flex-col gap-1 lg:gap-2 w-full">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Clínica</h4>
              <span className="w-full h-[2px] bg-white/20 rounded-full" />
            </div>
            <AccordionPanel isOpen={openSections.has("clinica")}>
              <nav className="flex flex-col gap-2 lg:gap-2.5 w-full">
                {clinica.map((item) => (
                  <a key={item.label} href={item.href} className="group text-white/90 hover:text-white text-[13px] font-semibold transition-all duration-200 w-full sm:w-fit flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-[2px] rotate-45 bg-gradient-to-br from-white/60 to-white/20 group-hover:from-white/90 group-hover:to-white/40 transition-all duration-200 shrink-0" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </AccordionPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-4 lg:gap-5"
          >
            <button
              type="button"
              onClick={() => toggleSection("horarios")}
              className="flex sm:hidden items-center justify-between w-full text-left"
            >
              <div className="flex flex-col gap-1 w-full">
                <h4 className="text-white text-sm font-bold uppercase tracking-wider">Horarios</h4>
                <span className="w-full h-[2px] bg-white/20 rounded-full" />
              </div>
              <ChevronDown size={16} className={`text-white/70 transition-transform duration-200 shrink-0 ${openSections.has("horarios") ? "" : "-rotate-90"}`} />
            </button>
            <div className="hidden sm:flex flex-col gap-1 lg:gap-2 w-full">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Horarios</h4>
              <span className="w-full h-[2px] bg-white/20 rounded-full" />
            </div>
            <AccordionPanel isOpen={openSections.has("horarios")}>
              <div className="flex flex-col gap-3 lg:gap-4 w-full">
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
            </AccordionPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-4 lg:gap-5"
          >
            <button
              type="button"
              onClick={() => toggleSection("legal")}
              className="flex sm:hidden items-center justify-between w-full text-left"
            >
              <div className="flex flex-col gap-1 w-full">
                <h4 className="text-white text-sm font-bold uppercase tracking-wider">Legal</h4>
                <span className="w-full h-[2px] bg-white/20 rounded-full" />
              </div>
              <ChevronDown size={16} className={`text-white/70 transition-transform duration-200 shrink-0 ${openSections.has("legal") ? "" : "-rotate-90"}`} />
            </button>
            <div className="hidden sm:flex flex-col gap-1 lg:gap-2 w-full">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Legal</h4>
              <span className="w-full h-[2px] bg-white/20 rounded-full" />
            </div>
            <AccordionPanel isOpen={openSections.has("legal")}>
              <nav className="flex flex-col gap-2 lg:gap-2.5 w-full">
                {legal.map((item) => (
                  <a key={item.label} href={item.href} className="group text-white/90 hover:text-white text-[13px] font-semibold transition-all duration-200 w-full sm:w-fit flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-[2px] rotate-45 bg-gradient-to-br from-white/60 to-white/20 group-hover:from-white/90 group-hover:to-white/40 transition-all duration-200 shrink-0" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </AccordionPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col gap-4 lg:gap-5"
          >
            <button
              type="button"
              onClick={() => toggleSection("contacto")}
              className="flex sm:hidden items-center justify-between w-full text-left"
            >
              <div className="flex flex-col gap-1 w-full">
                <h4 className="text-white text-sm font-bold uppercase tracking-wider">Contacto</h4>
                <span className="w-full h-[2px] bg-white/20 rounded-full" />
              </div>
              <ChevronDown size={16} className={`text-white/70 transition-transform duration-200 shrink-0 ${openSections.has("contacto") ? "" : "-rotate-90"}`} />
            </button>
            <div className="hidden sm:flex flex-col gap-1 lg:gap-2 w-full">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider">Contacto</h4>
              <span className="w-full h-[2px] bg-white/20 rounded-full" />
            </div>
            <AccordionPanel isOpen={openSections.has("contacto")}>
              <div className="flex flex-col gap-3 lg:gap-3.5 w-full">
                <a href="tel:+51970854221" className="group flex items-center gap-2.5 text-white/95 hover:text-white transition-all duration-200 w-full sm:w-fit">
                  <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200 backdrop-blur-sm shrink-0">
                    <Phone size={13} className="text-white" />
                  </span>
                  <span className="font-bold text-[13px]">970 854 221</span>
                </a>
                <a href="mailto:contacto@medikids.com" className="group flex items-center gap-2.5 text-white/95 hover:text-white transition-all duration-200 w-full sm:w-fit">
                  <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200 backdrop-blur-sm shrink-0">
                    <Mail size={13} className="text-white" />
                  </span>
                  <span className="font-bold text-[13px]">contacto@medikids.com</span>
                </a>
                <div className="flex items-start gap-2.5 text-white/90 w-full sm:w-fit">
                  <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0 mt-0.5">
                    <MapPin size={13} className="text-white" />
                  </span>
                  <span className="text-[13px] font-semibold leading-relaxed">
                    Av. Primavera 2450,<br />Surco, Lima
                  </span>
                </div>
              </div>
            </AccordionPanel>
          </motion.div>
        </div>

        <div className="pt-3 text-center">
          <a href="#" className="group inline-flex items-center gap-2.5 text-white/70 hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white/55 group-hover:text-white transition-colors duration-200">
              <path d="M21.5 5.134a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -7.5 -.266v-15.174a10 10 0 0 1 8.5 .708m-10.5 -.707l.001 15.174a8 8 0 0 0 -7.234 .117l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -13.068a1 1 0 0 1 .5 -.866a10 10 0 0 1 8.5 -.707" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Libro de Reclamaciones</span>
          </a>
          <div className="mt-4 border-t border-white/15" />
          <p className="text-white/70 text-xs font-semibold mt-4">&copy; 2026 Medikids — Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
};
