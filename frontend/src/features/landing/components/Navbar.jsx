import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Inicio", href: "#", ids: ["hero", "impact"] },
  { label: "Especialidades", href: "#especialidades", ids: ["especialidades"] },
  { label: "Equipo Médico", href: "#equipo", ids: ["equipo"] },
  { label: "Portal", href: "#nosotros", ids: ["nosotros"] },
  { label: "Testimonios", href: "#testimonios", ids: ["testimonios"] },
  { label: "FAQ", href: "#faq", ids: ["faq"] },
];

const allIds = navItems.flatMap((item) => item.ids);

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { threshold: 0, rootMargin: "-80px 0px -80px 0px" }
    );
    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const isActive = useCallback(
    (itemIds) => itemIds.includes(activeId),
    [activeId]
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full sticky top-0 z-50 relative transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-lg border-b border-medi-100/60"
          : "bg-transparent max-[930px]:bg-white/90 backdrop-blur-none max-[930px]:backdrop-blur-xl border-b border-transparent max-[930px]:border-medi-100/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex-shrink-0 flex flex-col leading-[0.9] font-black text-medi-400 tracking-tighter text-2xl min-[931px]:text-3xl hover:opacity-80 transition-opacity"
        >
          <span>medi</span>
          <span>kids</span>
        </Link>

        <nav className="flex max-[930px]:hidden gap-6 lg:gap-8">
          {navItems.map((item) => {
            const active = isActive(item.ids);
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative text-sm lg:text-base font-bold transition-colors whitespace-nowrap ${
                  active ? "text-medi-500" : "text-medi-700 hover:text-medi-400"
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-medi-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex max-[930px]:hidden items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-bold text-medi-700 hover:text-medi-500 transition-colors"
          >
            Regístrate
          </Link>
          <span className="text-medi-300 select-none">|</span>
          <Link
            to="/login"
            className="bg-gradient-to-r from-medi-500 to-medi-600 text-white px-5 lg:px-6 py-2 rounded-xl text-sm font-bold hover:from-medi-400 hover:to-medi-500 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Inicia Sesión
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hidden max-[930px]:flex flex-col gap-1.5 p-2"
          aria-label="Menú"
        >
          <span
            className={`block h-0.5 bg-medi-600 rounded-full transition-all duration-300 ${
              menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"
            }`}
          />
          <span
            className={`block h-0.5 bg-medi-600 rounded-full transition-all duration-300 ${
              menuOpen ? "opacity-0" : "w-6"
            }`}
          />
          <span
            className={`block h-0.5 bg-medi-600 rounded-full transition-all duration-300 ${
              menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden max-[930px]:block absolute top-full left-0 right-0 overflow-hidden bg-white backdrop-blur-3xl border-b border-medi-100/60 shadow-lg"
          >
            <div className="px-4 sm:px-6 pb-6 pt-2 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.ids);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className={`block py-3 px-4 rounded-xl font-bold transition-all ${
                      active
                        ? "bg-medi-100 text-medi-600"
                        : "text-medi-700 hover:bg-medi-50 hover:text-medi-500"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <hr className="my-4 border-medi-200" />
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center py-3 px-4 rounded-xl font-bold text-medi-700 hover:bg-medi-50 transition-colors"
              >
                Regístrate
              </Link>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-medi-500 to-medi-600 hover:from-medi-400 hover:to-medi-500 transition-all shadow-md"
              >
                Inicia Sesión
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};