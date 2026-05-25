import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Calendar, ChevronDown } from "lucide-react";

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 50 50" fill="currentColor" className={className}>
    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
    <path fillRule="nonzero" d="M170.663 256.157c-.083-47.121 38.055-85.4 85.167-85.482 47.121-.092 85.407 38.029 85.499 85.159.091 47.13-38.047 85.4-85.176 85.492-47.112.09-85.399-38.039-85.49-85.169zm-46.108.092c.141 72.602 59.106 131.327 131.69 131.185 72.592-.14 131.35-59.089 131.209-131.691-.141-72.577-59.114-131.336-131.715-131.194-72.585.141-131.325 59.114-131.184 131.7zm237.104-137.092c.033 16.954 13.817 30.682 30.772 30.649 16.961-.034 30.689-13.811 30.664-30.765-.033-16.954-13.818-30.69-30.78-30.656-16.962.033-30.689 13.818-30.656 30.772zm-208.696 345.4c-24.958-1.086-38.511-5.234-47.543-8.709-11.961-4.628-20.496-10.177-29.479-19.093-8.966-8.951-14.532-17.461-19.202-29.397-3.508-9.033-7.73-22.569-8.9-47.527-1.269-26.983-1.559-35.078-1.683-103.433-.133-68.338.116-76.434 1.294-103.441 1.069-24.941 5.242-38.512 8.709-47.536 4.628-11.977 10.161-20.496 19.094-29.478 8.949-8.983 17.459-14.532 29.403-19.202 9.025-3.526 22.561-7.715 47.511-8.9 26.998-1.278 35.085-1.551 103.423-1.684 68.353-.133 76.448.108 103.456 1.294 24.94 1.086 38.51 5.217 47.527 8.709 11.968 4.628 20.503 10.145 29.478 19.094 8.974 8.95 14.54 17.443 19.21 29.413 3.524 8.999 7.714 22.552 8.892 47.494 1.285 26.998 1.576 35.094 1.7 103.432.132 68.355-.117 76.451-1.302 103.442-1.087 24.957-5.226 38.52-8.709 47.56-4.629 11.953-10.161 20.488-19.103 29.471-8.941 8.949-17.451 14.531-29.403 19.201-9.009 3.517-22.561 7.714-47.494 8.9-26.998 1.269-35.086 1.56-103.448 1.684-68.338.133-76.424-.124-103.431-1.294zM149.977 1.773c-27.239 1.286-45.843 5.648-62.101 12.019-16.829 6.561-31.095 15.353-45.286 29.603C28.381 57.653 19.655 71.944 13.144 88.79c-6.303 16.299-10.575 34.912-11.778 62.168C.172 178.264-.102 186.973.031 256.489c.133 69.508.439 78.234 1.741 105.548 1.302 27.231 5.649 45.827 12.019 62.092 6.569 16.83 15.353 31.089 29.611 45.289 14.25 14.2 28.55 22.918 45.404 29.438 16.282 6.294 34.902 10.583 62.15 11.777 27.305 1.203 36.022 1.468 105.521 1.336 69.532-.133 78.25-.44 105.555-1.734 27.239-1.302 45.826-5.664 62.1-12.019 16.829-6.585 31.095-15.353 45.288-29.611 14.191-14.251 22.917-28.55 29.428-45.404 6.304-16.282 10.592-34.904 11.777-62.134 1.195-27.323 1.478-36.049 1.344-105.557-.133-69.516-.447-78.225-1.741-105.522-1.294-27.256-5.657-45.844-12.019-62.118-6.577-16.829-15.352-31.08-29.602-45.288-14.25-14.192-28.55-22.935-45.404-29.429-16.29-6.304-34.903-10.6-62.15-11.778C333.747.164 325.03-.101 255.506.031c-69.507.133-78.224.431-105.529 1.742z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg viewBox="0 0 30 30" fill="currentColor" className={className}>
    <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" />
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 455 512.098" fill="currentColor" className={className}>
    <path fillRule="nonzero" d="M321.331.011h-81.882v347.887c0 45.59-32.751 74.918-72.582 74.918-39.832 0-75.238-29.327-75.238-74.918 0-52.673 41.165-80.485 96.044-74.727v-88.153c-7.966-1.333-15.932-1.77-22.576-1.77C75.249 183.248 0 255.393 0 344.794c0 94.722 74.353 167.304 165.534 167.304 80.112 0 165.097-58.868 165.097-169.96V161.109c35.406 35.406 78.341 46.476 124.369 46.476V126.14C398.35 122.151 335.494 84.975 321.331 0v.011z" />
  </svg>
);

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
  { name: "Facebook", href: "#", Icon: FacebookIcon, size: "w-6 h-6" },
  { name: "Instagram", href: "#", Icon: InstagramIcon, size: "w-5 h-5" },
  { name: "TikTok", href: "#", Icon: TikTokIcon, size: "w-5 h-5" },
  { name: "X", href: "#", Icon: XIcon, size: "w-6 h-6" },
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
                {socials.map(({ name, href, Icon, size }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="group p-2 rounded-lg bg-white/12 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
                  >
                    <Icon className={`${size} text-white/90 group-hover:text-white transition-colors duration-200`} />
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
