import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useTutorial } from "../context/TutorialContext";
import { TUTORIAL_STEPS } from "../tutorial/tutorialSteps";

const PAD = 10;
const TOOLTIP_W = 320;
const TOOLTIP_H = 170;

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
  const isLast = currentStep === totalSteps - 1;

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

    if (triggerType === "click") {
      document.addEventListener("click", handleClick);
    } else if (triggerType === "change") {
      document.addEventListener("change", handleChange, true);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("change", handleChange, true);
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

  const hasAutoAdvance = !!step.trigger;

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
        <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 500, color: "#6b7280", lineHeight: 1.55 }}>
          {step.message}
        </p>

        {/* Hint para pasos con auto-avance */}
        {hasAutoAdvance && (
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 600, color: "#9cb151", display: "flex", alignItems: "center", gap: 4 }}>
            <span>↑</span> Interactúa con el área resaltada para continuar
          </p>
        )}

        {/* Botones */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={exitTutorial}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "white",
              fontSize: 13,
              fontWeight: 700,
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            Salir
          </button>
          <button
            onClick={nextStep}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(to right, #9cb151, #7d9440)",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(156,177,81,0.4)",
            }}
          >
            {isLast ? "Finalizar ✓" : "Siguiente →"}
          </button>
        </div>
      </div>

      {/* X roja arriba-derecha */}
      <button
        onClick={exitTutorial}
        aria-label="Cerrar tutorial"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "#ef4444",
          border: "none",
          color: "white",
          fontSize: 20,
          fontWeight: 900,
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(239,68,68,0.45)",
          pointerEvents: "auto",
          zIndex: 10001,
        }}
      >
        ×
      </button>

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
