"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingData } from "@/app/types";
import { StepSection } from "./StepSection";
import { SelectCard } from "./SelectCard";
import { SkillLevelButton } from "./SkillLevelButton";

export const OnboardingScreen = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const [data, setData] = useState<OnboardingData>({
    schoolType: null,
    skillLevel: null,
    examTime: null,
  });

  const saveOnboardingData = (data: OnboardingData) => {
    localStorage.setItem("onboardingData", JSON.stringify(data));
  };

  const isComplete =
    data.schoolType && data.skillLevel !== null && data.examTime;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#bfdbfe] via-[#93c5fd] to-[#7dd3fc] flex items-center justify-center z-[9998] p-6 sm:p-3 overflow-y-auto">
      <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-[#00A6F4]/90 to-[#3b82f6]/70 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-16 right-10 w-48 h-48 bg-gradient-to-br from-orange-400/70 to-orange-300/60 rounded-full blur-3xl animate-pulse z-0"></div>

      <motion.div
        exit={{ opacity: 0 }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-4xl p-10 sm:p-4 bg-white/60 backdrop-blur-lg border border-[#d0e7ff] rounded-3xl shadow-2xl flex flex-col gap-10 sm:gap-4 z-10"
      >
        <h2 className="text-4xl sm:text-2xl mb-0 font-extrabold text-center text-[#003366] drop-shadow-sm">
          Bevor wir starten...
        </h2>

        <StepSection number={1} title="Schultyp wählen">
          <div className="flex gap-4 justify-center flex-wrap mt-2">
            <SelectCard
              label="🎓 Matura / Abendschule"
              selected={data.schoolType === "matura"}
              onClick={() => setData((d) => ({ ...d, schoolType: "matura" }))}
            />
            <SelectCard
              label="📘 Oberstufe"
              selected={data.schoolType === "oberstufe"}
              onClick={() =>
                setData((d) => ({ ...d, schoolType: "oberstufe" }))
              }
            />
          </div>
        </StepSection>

        <StepSection number={2} title="Wie sind deine Skills?">
          <div className="flex flex-wrap justify-center gap-16 sm:gap-4">
            {[0, 1, 2, 3].map((level) => (
              <SkillLevelButton
                key={level}
                level={level}
                selected={data.skillLevel === level}
                onClick={(val) => setData((d) => ({ ...d, skillLevel: val }))}
              />
            ))}
          </div>
        </StepSection>

        <StepSection number={3} title="Wann ist deine Prüfung?">
          <div className="flex gap-4 justify-center flex-wrap">
            <SelectCard
              label="Mehr als 3 Wochen"
              selected={data.examTime === "gt3"}
              onClick={() => setData((d) => ({ ...d, examTime: "gt3" }))}
            />
            <SelectCard
              label="In 3 Wochen"
              selected={data.examTime === "eq3"}
              onClick={() => setData((d) => ({ ...d, examTime: "eq3" }))}
            />
            <SelectCard
              label="Weniger als 1 Woche"
              selected={data.examTime === "lt1"}
              onClick={() => setData((d) => ({ ...d, examTime: "lt1" }))}
            />
          </div>
        </StepSection>

        <div className="text-center mt-4 relative w-full flex justify-center">
          <motion.button
            onClick={() => {
              saveOnboardingData(data);
              onComplete();
            }}
            disabled={!isComplete}
            initial={false}
            animate={isComplete ? "active" : "disabled"}
            variants={{
              active: {
                background: [
                  "linear-gradient(to right, #d1d5db, #d1d5db)",
                  "linear-gradient(to right, #fb923c, #f97316)",
                ],
                scale: [1, 1.05],
                transition: {
                  duration: 0.6,
                  ease: "easeInOut",
                },
              },
              disabled: {
                background: "linear-gradient(to right, #d1d5db, #d1d5db)",
                scale: 1,
              },
            }}
            className="w-48 h-12 sm:w-40 sm:h-10 rounded-full text-white text-lg sm:text-base font-bold shadow-xl flex items-center justify-center transition-transform duration-300"
          >
            🚀 Start now
          </motion.button>
        </div>
      </motion.div>

      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => onComplete()}
          className="text-sm sm:text-xs font-semibold text-gray-600 bg-white/80 hover:bg-white rounded-full px-4 py-2 border border-gray-300 shadow-md transition-all"
        >
          Skip
        </button>
      </div>
    </div>
  );
};
