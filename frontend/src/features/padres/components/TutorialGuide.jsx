import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useTutorial } from "../context/TutorialContext";
import { TUTORIAL_STEPS } from "../tutorial/tutorialSteps";

const PAD = 10;
const TOOLTIP_W = 320;
const TOOLTIP_H = 150;

const calcTooltipPos = (rect, winW, winH) => {
  const spaceBelow = winH - rect.bottom - PAD;
  const spaceAbove = rect.top - PAD;

  let top, left;

  if (spaceBelow >= TOOLTIP_H + 16) {
    top = rect.bottom + PAD + 8;
    left = Math.max(16, Math.min(winW - TOOLTIP_W - 16, rect.left + rect.width / 2 - TOOLTIP_W / 2));
    return { top, left };
  }

  if (spaceAbove >= TOOLTIP_H + 16) {
    top = rect.top - PAD - TOOLTIP_H - 8;
    left = Math.max(16, Math.min(winW - TOOLTIP_W - 16, rect.left + rect.width / 2 - TOOLTIP_W / 2));
    return { top, left };
  }

  return {
    top: Math.max(16, winH / 2 - TOOLTIP_H / 2),
    left: Math.max(16, winW / 2 - TOOLTIP_W / 2),
  };
};

export const TutorialGuide = () => {
  const { isActive, currentStep, nextStep, exitTutorial } = useTutorial();
  const [targetRect, setTargetRect] = useState(null);
  const advancingRef = useRef(false);

  const step = TUTORIAL_STEPS[currentStep];
  const totalSteps = TUTORIAL_STEPS.length;

  // Encuentra el elemento y calcula su posición
  const findAndMeasure = useCallback(() => {
    if (!step?.selector || !isActive) return;

    let attempts = 0;
    const maxAttempts = 15;

    const tryFind = () => {
      const el = document.querySelector(step.selector);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          setTargetRect(el.getBoundingClientRect());
        }, 350);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryFind, 200);
      }
    };

    setTargetRect(null);
    advancingRef.current = false;
    setTimeout(tryFind, 100);
  }, [step?.selector, isActive, currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    findAndMeasure();

    const onResize = () => {
      const el = document.querySelector(step?.selector);
      if (el) setTargetRect(el.getBoundingClientRect());
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [findAndMeasure]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-avance al interactuar con el elemento resaltado
  useEffect(() => {
    if (!isActive || !step?.trigger) return;

    const selector = step.selector;
    const triggerType = step.trigger;

    const advance = () => {
      if (advancingRef.current) return;
      advancingRef.current = true;
      setTimeout(() => nextStep(), 80);
    };

    const handleClick = (e) => {
      const el = document.querySelector(selector);
      if (el && (el === e.target || el.contains(e.target))) {
        advance();
      }
    };

    const handleChange = (e) => {
      const el = document.querySelector(selector);
      if (el && (el === e.target || el.contains(e.target))) {
        advance();
      }
    };

    const handleFocusOut = (e) => {
      const el = document.querySelector(selector);
      if (el && (el === e.target || el.contains(e.target))) {
        // Solo avanza si el foco salió del elemento por completo
        if (!el.contains(e.relatedTarget)) {
          advance();
        }
      }
    };

    if (triggerType === "click") {
      document.addEventListener("click", handleClick);
    } else if (triggerType === "change") {
      document.addEventListener("change", handleChange, true);
    } else if (triggerType === "blur") {
      document.addEventListener("focusout", handleFocusOut, true);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("change", handleChange, true);
      document.removeEventListener("focusout", handleFocusOut, true);
    };
  }, [isActive, step?.trigger, step?.selector, nextStep]);

  if (!isActive || !step) return null;

  const winW = window.innerWidth;
  const winH = window.innerHeight;

  const x = targetRect ? Math.max(0, targetRect.left - PAD) : 0;
  const y = targetRect ? Math.max(0, targetRect.top - PAD) : 0;
  const w = targetRect ? targetRect.width + PAD * 2 : 0;
  const h = targetRect ? targetRect.height + PAD * 2 : 0;

  const tooltipPos = targetRect
    ? calcTooltipPos(targetRect, winW, winH)
    : { top: winH / 2 - TOOLTIP_H / 2, left: winW / 2 - TOOLTIP_W / 2 };

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Overlay oscuro con recorte spotlight */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="mkids-tutorial-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect x={x} y={y} width={w} height={h} rx={12} fill="black" />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.72)"
          mask="url(#mkids-tutorial-mask)"
        />
      </svg>

      {/* Borde pulsante alrededor del elemento objetivo */}
      {targetRect && (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: w,
            height: h,
            borderRadius: 12,
            border: "2px solid rgba(156,177,81,0.9)",
            boxSizing: "border-box",
            pointerEvents: "none",
            animation: "mkidsTutorialPulse 2s ease-in-out infinite",
          }}
        />
      )}

      {/* Tarjeta tooltip */}
      <div
        style={{
          position: "absolute",
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: TOOLTIP_W,
          background: "white",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          padding: "20px 24px",
          pointerEvents: "auto",
          zIndex: 10000,
        }}
      >
        {/* Contador + barra de progreso */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#9cb151", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Paso {currentStep + 1} de {totalSteps}
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {TUTORIAL_STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentStep ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === currentStep ? "#9cb151" : i < currentStep ? "#c8d891" : "#e5e7eb",
                  transition: "all 0.25s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Título */}
        <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#111827" }}>
          {step.title}
        </h4>

        {/* Mensaje */}
        <p style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 500, color: "#6b7280", lineHeight: 1.55 }}>
          {step.message}
        </p>

        {/* Solo botón Cancelar */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={exitTutorial}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "1.5px solid #fca5a5",
              background: "white",
              fontSize: 13,
              fontWeight: 700,
              color: "#ef4444",
              cursor: "pointer",
            }}
          >
            Cancelar guía
          </button>
        </div>
      </div>

      <style>{`
        @keyframes mkidsTutorialPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(156,177,81,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(156,177,81,0.08); }
        }
      `}</style>
    </div>,
    document.body
  );
};
