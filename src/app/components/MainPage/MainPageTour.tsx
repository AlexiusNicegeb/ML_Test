"use client";

import { useTypeWriter } from "@/app/hooks/useTypeWriter";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const steps = [
  // {
  //   id: "writing-trainer",
  //   text: "Trainiere hier deine Schreibfähigkeiten. Das ist dein Startpunkt.",
  // },
  {
    id: "start-new-course",
    text: "Starte einen neuen Kurs. Klar, direkt, ohne Schnickschnack.",
  },
  {
    id: "all-courses",
    text: "Hier findest du alle Kurse. Entdecke, was dir taugt.",
  },
  // {
  //   id: "continue-learning",
  //   text: "Mach da weiter, wo du aufgehört hast. Kein Zurücklehnen.",
  // },
  {
    id: "results",
    text: "Ergebnisse. Lerne aus Fehlern, dominiere den Stoff.",
  },
];

const openBurgerMenu = () => {
  const btn = document.getElementById("burger-button");
  if (btn) btn.click();
};

const waitForElement = (id: string, timeout = 2000): Promise<HTMLElement> => {
  return new Promise((resolve, reject) => {
    const interval = 50;
    let elapsed = 0;

    const check = () => {
      const el = document.getElementById(id);
      if (el) resolve(el);
      else if (elapsed >= timeout) reject(`Element #${id} not found`);
      else {
        elapsed += interval;
        setTimeout(check, interval);
      }
    };

    check();
  });
};

export const MainPageTour = ({ onComplete }: { onComplete?: () => void }) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const typedText = useTypeWriter(steps[stepIndex].text);
  const isMobile = window.innerWidth < 768;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isPositioned, setIsPositioned] = useState<boolean>(false);

  const updateBubblePosition = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    const bubbleWidth = bubbleRef.current?.offsetWidth || 300;

    setPosition({
      top: rect.top + scrollTop + 24,
      left: isMobile
        ? rect.left
        : Math.min(
            rect.left + scrollLeft + rect.width - bubbleWidth / 2,
            window.innerWidth - bubbleWidth - 20
          ),
    });
    setIsPositioned(true);
  }, []);

  useEffect(() => {
    const currentStep = steps[stepIndex];
    const needsMenu = ["results"].includes(currentStep.id);
    const elevatedParents: HTMLElement[] = [];

    const elevateParents = (el: HTMLElement) => {
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        const computed = window.getComputedStyle(parent);
        const isStackingContext =
          computed.transform !== "none" ||
          computed.zIndex !== "auto" ||
          computed.filter !== "none" ||
          computed.opacity !== "1";

        if (isStackingContext) {
          parent.classList.add("z-[9996]", !isMobile && "relative");
          elevatedParents.push(parent);
        }

        parent = parent.parentElement;
      }
    };

    const run = async () => {
      if (needsMenu && isMobile) {
        openBurgerMenu();
        setIsMenuOpen(true);
        await new Promise((res) => setTimeout(res, 150));
      }

      try {
        const el = await waitForElement(currentStep.id, 2000);
        await new Promise((res) => setTimeout(res, 100));

        elevateParents(el);

        const classesToAdd = [
          "ring-2",
          "ring-blue-500",
          "rounded-3xl",
          "transition-all",
          "duration-300",
          "z-[9997]",
          "shadow-lg",
        ];

        if (needsMenu) {
          classesToAdd.push("bg-white", "text-orange-500");
        }

        el.classList.add(...classesToAdd);

        requestAnimationFrame(() => {
          updateBubblePosition(el);
        });

        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (err) {
        console.warn(err);
      }
    };

    run();

    return () => {
      const el = document.getElementById(steps[stepIndex].id);
      const classesToRemove = [
        "ring-2",
        "ring-blue-500",
        "transition-all",
        "duration-300",
        "z-[9997]",
        "shadow-lg",
      ];

      if (needsMenu) {
        classesToRemove.push("bg-white", "text-orange-500");
      }

      el.classList.remove(...classesToRemove);

      elevatedParents.forEach((parent) => {
        parent.classList.remove("z-[9996]", "relative");
      });
    };
  }, [stepIndex]);

  const handleNext = () => {
    if (isMenuOpen) {
      openBurgerMenu();
      setIsMenuOpen(false);
    }
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      localStorage.setItem("mainTourDone", "true");
      onComplete();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[998] pointer-events-none bg-gradient-to-br from-[#c7e4fd]/20 to-[#bfdbfe]/20 backdrop-blur-[2px]" />
      <AnimatePresence>
        {isPositioned && (
          <motion.div
            ref={bubbleRef}
            key={stepIndex}
            initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -30 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="absolute z-[9998] w-[340px] sm:w-[200px] max-w-[90vw] bg-white border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl rounded-2xl p-6 sm:p-2 text-white text-sm"
            style={{
              top: position.top,
              left: position.left,
              boxShadow: "0 0 25px 5px rgba(0,255,255,0.4)",
              background:
                "linear-gradient(145deg, rgba(0,0,0,0.4), rgba(30,30,60,0.7))",
            }}
          >
            <p className="font-mono text-[16px] sm:text-xs leading-relaxed min-h-[48px] sm:min-h-max">
              {typedText}
            </p>

            <button
              onClick={() => {
                localStorage.setItem("mainTourDone", "true");
                onComplete?.();
              }}
              className="cursor-pointer absolute top-3 right-3 sm:-top-2 sm:right-0 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-400 hover: text-white text-xs font-semibold px-3 py-1 sm:p-0.5 sm:px-1.5 rounded-full shadow-sm transition-all duration-200"
            >
              <span className="text-white text-sm leading-none sm:text-xs">
                Skip
              </span>
            </button>

            {typedText === steps[stepIndex].text && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-2"
              >
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-pink-500 hover:to-yellow-500 text-white sm:text-sm font-bold py-2 px-6 sm:p-1 sm:px-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Weiter →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
