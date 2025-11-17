// components/QuizHeaderStats.tsx
"use client";

import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaMeh,
  FaThumbsUp,
  FaBrain,
} from "react-icons/fa";

import { QUIZ_QUESTIONS } from "@/app/staticData";

export const QuizHeaderStats = ({
  current,
  timeLeft,
}: {
  current: number;
  timeLeft: number;
}) => {
  const getIcon = () => {
    const ratio = (current + 1) / QUIZ_QUESTIONS.length;
    if (ratio < 0.25)
      return <FaExclamationTriangle className="w-5 h-5 text-yellow-600" />;
    if (ratio < 0.5) return <FaMeh className="w-5 h-5 text-gray-600" />;
    if (ratio < 0.75) return <FaThumbsUp className="w-5 h-5 text-blue-600" />;
    return <FaBrain className="w-5 h-5 text-green-600" />;
  };

  const getStrokeColor = () => {
    if (timeLeft <= 2) return "#ef4444";
    if (timeLeft <= 3) return "#f97316";
    return "#10b981";
  };

  return (
    <div className="flex justify-between items-center">
      <div className="text-blue-900 font-semibold text-sm">
        Frage {current + 1} / {QUIZ_QUESTIONS.length}
      </div>

      <div className="relative w-10 h-10">
        <svg className="transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <motion.path
            d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset={(timeLeft / 5) * 100}
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: (timeLeft / 5) * 100 }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
          {timeLeft}s
        </div>
      </div>

      <div className="text-sm font-medium text-slate-800 flex items-center gap-1">
        {getIcon()}
      </div>
    </div>
  );
};
