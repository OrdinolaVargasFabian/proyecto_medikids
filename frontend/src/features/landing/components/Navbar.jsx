import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
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

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-lg border-b border-medi-100/60"
          : "bg-transparent backdrop-blur-none border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex-shrink-0 flex flex-col leading-[0.9] font-black text-medi-400 tracking-tighter text-3xl hover:opacity-80 transition-opacity"
        >
          <span>medi</span>
          <span>kids</span>
        </Link>

        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => {
            const active = isActive(item.ids);
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative font-bold transition-colors ${
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

        <div className="flex items-center">
          <Link
            to="/login"
            className="bg-medi-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-medi-500 transition-all shadow-md hover:shadow-lg hover:shadow-medi-400/30 active:scale-95"
          >
            Portal de Padres
          </Link>
        </div>
      </div>
    </motion.header>
  );
};