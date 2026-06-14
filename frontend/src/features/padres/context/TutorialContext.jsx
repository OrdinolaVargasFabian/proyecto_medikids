import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TUTORIAL_STEPS } from "../tutorial/tutorialSteps";

const TutorialContext = createContext(null);

export const TutorialProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    const step = TUTORIAL_STEPS[currentStep];

    if (step?.navigateTo) {
      navigate(step.navigateTo);
    }

    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsActive(false);
      setCurrentStep(0);
    }
  }, [currentStep, navigate]);

  const exitTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const tutorialFormStep =
    isActive ? (TUTORIAL_STEPS[currentStep]?.formStep ?? null) : null;

  return (
    <TutorialContext.Provider
      value={{ isActive, currentStep, tutorialFormStep, startTutorial, nextStep, exitTutorial }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("useTutorial must be used within TutorialProvider");
  return ctx;
};
