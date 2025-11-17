import { animateRobot } from "@/app/animation/robots";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
const points = [
  {
    their: "Schüler schreiben einen Text → fertig",
    ours: "Schüler schreiben Schritt für Schritt mit Anleitung",
  },
  {
    their: "KI gibt oberflächliches Feedback",
    ours: "Unsere KI gibt zielgerichtete Tipps nach Rubrik",
  },
  {
    their: "Immer gleiche langweilige Übungen",
    ours: "Individuelle Pfade je nach Fehlern & Stärken",
  },
];
export const PlatformBattleBlock = () => {
  const robotRef = useRef(null);

  useEffect(() => {
    if (robotRef.current) {
      animateRobot(robotRef.current);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-[#f8fafc] to-[#e2ecf7] rounded-2xl  p-6 space-y-6 sm:p-2 sm:space-y-2"
    >
      <h3 className="text-xl sm:text-lg font-bold text-center text-gray-800 ">
        🥊 Let’s compare — oldschool vs
        <span className="text-[#00A6F4]"> Maturahilfe</span>
      </h3>
      <div className="grid sm:hidden grid-cols-3 sm:grid-cols-1 gap-6 sm:gap-2 items-start">
        {/* Left: Bad practices */}
        <div className="flex flex-col gap-3">
          {points.map((item, i) => (
            <div
              key={`their-${i}`}
              className="relative bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-4 sm:p-2 shadow-inner border border-red-300"
            >
              <div className="absolute -top-2 -left-2 text-red-600 text-xs  bg-white px-2 py-[2px] sm:px-1 rounded-full shadow">
                ❌
              </div>
              <p className="text-sm sm:text-xs font-medium text-red-800 leading-snug">
                {item.their}
              </p>
            </div>
          ))}
        </div>

        {/* Middle: Robot */}
        <div className="flex sm:hidden flex-col items-center justify-center relative">
          <img
            src="/robot2.png"
            ref={robotRef}
            className=" sm:h-[200px]"
            alt="robot"
          />
        </div>

        {/* Right: Our magic */}
        <div className="flex flex-col gap-3">
          {points.map((item, i) => (
            <div
              key={`ours-${i}`}
              className="relative bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 sm:p-2 shadow-inner border border-green-300"
            >
              <div className="absolute -top-2 -right-2 text-green-600 text-xs bg-white px-2 sm:px-1 py-[2px] rounded-full shadow">
                ✅
              </div>
              <p className="text-sm sm:text-xs font-medium text-green-900 leading-snug">
                {item.ours}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden sm:flex flex-col gap-4">
        {points.map((item, i) => (
          <div key={`mobile-${i}`} className="flex flex-col gap-2">
            <div className="relative bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-2 shadow-inner border border-red-300">
              <div className="absolute -top-2 sm:-top-3 sm:text-[10px] -left-2 text-red-600 text-xs bg-white px-2 py-[2px] rounded-full shadow">
                ❌
              </div>
              <p className="text-xs font-medium text-red-800 leading-snug">
                {item.their}
              </p>
            </div>
            <div className="relative bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-2 shadow-inner border border-green-300">
              <div className="absolute -top-2 sm:text-[10px] -right-2 text-green-600 text-xs bg-white px-2 py-[2px] rounded-full shadow">
                ✅
              </div>
              <p className="text-xs font-medium text-green-900 leading-snug">
                {item.ours}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
