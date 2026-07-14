import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useTutorial } from "../context/TutorialContext";
import { TUTORIAL_STEPS } from "../tutorial/tutorialSteps";

const PAD = 8;
const TOOLTIP_W = 320;
const TOOLTIP_H = 150;

const calcTooltipPos = (rect, winW, winH, side) => {
  if (side === "left") {
    const x = rect.left - TOOLTIP_W - 16;
    if (x >= 16) return { top: rect.top - PAD, left: x };
    return { top: rect.top - PAD, left: rect.right + 16 };
  }
  if (side === "right") {
    const x = rect.right + 16;
    if (x + TOOLTIP_W <= winW - 16) return { top: rect.top - PAD, left: x };
    return { top: rect.top - PAD, left: rect.left - TOOLTIP_W - 16 };
  }

  const spaceBelow = winH - rect.bottom - PAD;
  const spaceAbove = rect.top - PAD;

  if (spaceBelow >= TOOLTIP_H + 16) {
    return {
      top: rect.bottom + PAD + 8,
      left: Math.max(16, Math.min(winW - TOOLTIP_W - 16, rect.left + rect.width / 2 - TOOLTIP_W / 2)),
    };
  }
  if (spaceAbove >= TOOLTIP_H + 16) {
    return {
      top: rect.top - PAD - TOOLTIP_H - 8,
      left: Math.max(16, Math.min(winW - TOOLTIP_W - 16, rect.left + rect.width / 2 - TOOLTIP_W / 2)),
    };
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

  const findTarget = useCallback(
    () => document.querySelector(step?.selector || ""),
    [step?.selector]
  );

  const measure = useCallback(() => {
    if (!step?.selector || !isActive) return;

    const el = findTarget();
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect(rect);
        el.scrollIntoView({ block: "center", behavior: "instant" });
        return;
      }
    }
    setTargetRect(null);
  }, [step?.selector, isActive, findTarget]);

  useEffect(() => {
    if (!isActive) return;
    advancingRef.current = false;
    setTargetRect(null);
    measure();
  }, [measure, isActive, currentStep]);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(measure, 300);
    return () => clearInterval(timer);
  }, [measure, isActive]);

  useEffect(() => {
    if (!isActive) return;
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, isActive]);

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
      if (el && el.contains(e.target)) advance();
    };

    const handleChange = (e) => {
      const el = document.querySelector(selector);
      if (el && el.contains(e.target)) advance();
    };

    const handleFocusOut = (e) => {
      const el = document.querySelector(selector);
      if (el && el.contains(e.target) && !el.contains(e.relatedTarget)) advance();
    };

    if (triggerType === "click") document.addEventListener("click", handleClick);
    else if (triggerType === "change") document.addEventListener("change", handleChange, true);
    else if (triggerType === "blur") document.addEventListener("focusout", handleFocusOut, true);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("change", handleChange, true);
      document.removeEventListener("focusout", handleFocusOut, true);
    };
  }, [isActive, step?.trigger, step?.selector, nextStep]);

  if (!isActive || !step) return null;

  // Si el elemento es un dropdown abierto, ocultar guía hasta que seleccione
  if (findTarget()?.dataset?.open === "true") return null;
  if (advancingRef.current) return null;

  const winW = window.innerWidth;
  const winH = window.innerHeight;

  const hasRect = targetRect && targetRect.width > 0 && targetRect.height > 0;
  const x = hasRect ? Math.max(0, targetRect.left - PAD) : 0;
  const y = hasRect ? Math.max(0, targetRect.top - PAD) : 0;
  const w = hasRect ? targetRect.width + PAD * 2 : 0;
  const h = hasRect ? targetRect.height + PAD * 2 : 0;

  const tooltipPos = hasRect
    ? calcTooltipPos(targetRect, winW, winH, step.tooltipSide)
    : { top: winH / 2 - TOOLTIP_H / 2, left: winW / 2 - TOOLTIP_W / 2 };

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
      {hasRect && (
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id="mkids-tutorial-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect x={x} y={y} width={w} height={h} rx={12} fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.72)" mask="url(#mkids-tutorial-mask)" />
        </svg>
      )}

      {hasRect && (
        <div
          style={{
            position: "absolute",
            left: x, top: y, width: w, height: h,
            borderRadius: 12,
            border: "2px solid rgba(156,177,81,0.9)",
            boxSizing: "border-box",
            pointerEvents: "none",
            animation: "mkidsTutorialPulse 2s ease-in-out infinite",
          }}
        />
      )}

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

        <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#111827" }}>
          {step.title}
        </h4>

        <p style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 500, color: "#6b7280", lineHeight: 1.55 }}>
          {step.message}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={exitTutorial}
            style={{
              padding: "8px 16px", borderRadius: 10, border: "1.5px solid #fca5a5",
              background: "white", fontSize: 12, fontWeight: 700, color: "#ef4444", cursor: "pointer",
            }}
          >
            Cancelar guía
          </button>
          {!step.trigger && (
            <button
              onClick={() => nextStep()}
              style={{
                padding: "8px 20px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #a8c262, #8fa845)",
                fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(156,177,81,0.35)",
              }}
            >
              {currentStep === TUTORIAL_STEPS.length - 1 ? "Finalizar" : "Siguiente →"}
            </button>
          )}
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
