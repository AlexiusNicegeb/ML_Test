// components/QuizResultCard.tsx
"use client";

import { motion } from "framer-motion";
import {
  FaBullseye,
  FaCheckCircle,
  FaSyncAlt,
  FaExclamationCircle,
  FaRedoAlt,
} from "react-icons/fa";

import { QUIZ_QUESTIONS } from "@/app/staticData";

export const QuizResultCard = ({
  score,
  onReplay,
}: {
  score: number;
  onReplay: () => void;
}) => {
  const total = QUIZ_QUESTIONS.length;

  const getMessage = () => {
    if (score === total) {
      return {
        icon: <FaCheckCircle className="text-green-500" />,
        text: "Großartig! Du bist ein Grammatik-Gott!",
      };
    } else if (score >= total * 0.66) {
      return {
        icon: <FaCheckCircle className="text-blue-500" />,
        text: "Sehr gut! Fast perfekt!",
      };
    } else if (score >= total * 0.4) {
      return {
        icon: <FaSyncAlt className="text-yellow-500" />,
        text: "Schon okay – weiter üben!",
      };
    } else {
      return {
        icon: <FaExclamationCircle className="text-red-500" />,
        text: "Übung nötig. Du schaffst das!",
      };
    }
  };

  const { icon, text } = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-w-[700px] flex-col items-center gap-6 bg-white rounded-2xl px-10 sm:px-4 mx-10 sm:mx-2 py-8 w-full max-w-2xl shadow-md border border-slate-100"
    >
      <div className="flex items-center gap-2 text-3xl font-bold text-sky-700">
        <FaBullseye className="text-sky-500" />
        Mission abgeschlossen
      </div>

      <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 w-full text-center">
        <p className="text-xl font-semibold text-gray-700">
          Richtige Antworten: <span className="text-green-500">{score}</span> /{" "}
          <span>{total}</span>
        </p>
        <p className="text-md mt-2 text-gray-500 italic flex items-center justify-center gap-2">
          {icon}
          {text}
        </p>
      </div>

      <button
        onClick={onReplay}
        className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-sky-500 text-white font-semibold py-2 px-5 rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <FaRedoAlt />
        Replay Mission
      </button>
    </motion.div>
  );
};
