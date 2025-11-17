"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import VictoryModal from "../../../ui/components/WordGame/VictoryModal";
import { ProgressMap } from "./ProgressMap";
import { QUIZ_QUESTIONS } from "@/app/staticData";
import { QuizResultCard } from "./ResultCartd";
import { QuizHeaderStats } from "./HeaderStats";

const cardStyles: Record<string, string> = {
  Noun: "from-blue-300 to-blue-500 ring-blue-400",
  Artikel: "from-teal-300 to-teal-500 ring-teal-400",
  Verb: "from-green-300 to-green-500 ring-green-400",
  Adjective: "from-purple-300 to-purple-500 ring-purple-400",
  Pronomen: "from-pink-300 to-pink-500 ring-pink-400",
  Adverb: "from-yellow-300 to-yellow-500 ring-yellow-400 text-black",
  Preposition: "from-orange-300 to-orange-500 ring-orange-400 text-black",
  Numerale: "from-emerald-300 to-emerald-500 ring-emerald-400",
  Konjunktion: "from-red-300 to-red-500 ring-red-400",
  Interjektion: "from-indigo-300 to-indigo-500 ring-indigo-400",
};

export const QuizGameNew = ({
  gameStarted,
  setGameStarted,
}: {
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
}) => {
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [wasTimeout, setWasTimeout] = useState<boolean>(false);
  const [results, setResults] = useState<("correct" | "wrong" | null)[]>([]);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    correctSound.current = new Audio("/sounds/correctSound.mp3");
    wrongSound.current = new Audio("/sounds/wrongSound.mp3");
  }, []);

  useEffect(() => {
    if (selected !== null || gameStarted === false) return;
    if (timeLeft === 0) {
      setSelected(-1);
      setWasTimeout(true);
      wrongSound.current?.play();
      setResults((prev) => [...prev, "wrong"]);

      setTimeout(() => {
        if (current < QUIZ_QUESTIONS.length - 1) {
          setCurrent((prev) => prev + 1);
          setSelected(null);
          setWasTimeout(false);

          setTimeLeft(5);
        } else {
          setShowResult(true);
        }
      }, 1000);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, selected, gameStarted]);

  useEffect(() => {
    setTimeLeft(5);
  }, [current]);

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const correct = QUIZ_QUESTIONS[current].correctIndex;
    if (index === correct) {
      setScore((s) => s + 1);
      correctSound.current?.play();
    } else if (index !== -1) {
      wrongSound.current?.play();
    }
    setResults((prev) => [
      ...prev,
      index === correct && !wasTimeout ? "correct" : "wrong",
    ]);

    setTimeout(() => {
      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent((prev) => prev + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const getCardClass = (opt: string, idx: number) => {
    const color =
      cardStyles[opt as keyof typeof cardStyles] ||
      "from-gray-200 to-gray-400 ring-gray-300";
    const base =
      "w-36 h-16 w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)]  sm:h-10  rounded-2xl flex items-center justify-center text-md font-semibold text-center ring-2 shadow-xl transition-all duration-300 text-white font-bold";
    if (selected === null)
      return `bg-gradient-to-br ${color} hover:scale-105 ${base}`;
    if (wasTimeout) {
      return `bg-gradient-to-br ${color} ${base} opacity-40`;
    }
    if (idx === QUIZ_QUESTIONS[current].correctIndex)
      return `bg-gradient-to-br ${color} ${base} ring-4 ring-green-500 scale-105 animate-bounce`;
    if (idx === selected)
      return `bg-gradient-to-br ${color} ${base} ring-4 ring-red-500 opacity-60 animate-shake`;
    return `bg-gradient-to-br ${color} ${base} opacity-40 text-white`;
  };

  useEffect(() => {
    if (showResult) {
      const allCorrect =
        results.length === QUIZ_QUESTIONS.length &&
        results.every((r) => r === "correct");
      if (allCorrect) {
        setTimeout(() => {
          setShowVictoryModal(true);
        }, 300);
      }
    }
  }, [showResult]);

  return (
    <div
      className={`relative w-full h-full ${!gameStarted && "max-h-[450px] overflow-hidden"}`}
    >
      {!gameStarted && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-3xl">
          <h2 className="text-[#000] text-4xl font-extrabold mb-8 text-center px-6 drop-shadow-sm">
            Start your quiz! 🧠
          </h2>
          <button
            onClick={() => {
              setGameStarted(true);
            }}
            className="bg-gradient-to-r from-[#6EE7B7] to-[#34D399] hover:brightness-105 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-transform hover:scale-105"
          >
            Start
          </button>
        </div>
      )}

      <div className="flex-col gap-4  bg-gradient-to-b from-[#bfdbfe] to-[#93c5fd] min-h-[580px]  flex items-center  backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl ">
        <div className=" z-30 w-full bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-lg  rounded-t-3xl px-6 py-4  flex flex-col ">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-2xl font-extrabold text-[#002B50] drop-shadow-sm tracking-tight">
              Quiz!
            </h2>
            <button
              className="bg-gradient-to-r from-[#FCA5A5] to-[#F87171] hover:brightness-105 active:brightness-95 text-white font-bold py-2 px-5 rounded-full shadow transition-transform hover:scale-105"
              onClick={() => setGameStarted(false)}
            >
              End game
            </button>
          </div>
        </div>

        {!showResult ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`flex ${gameStarted && "min-w-[700px]"} sm:min-w-[300px] flex-col gap-6  bg-white/80 backdrop-blur-sm rounded-3xl p-2 px-10 mx-10 sm:mx-2 sm:px-4`}
            >
              <QuizHeaderStats current={current} timeLeft={timeLeft} />

              <div className="relative w-[500px]  mx-auto h-3 bg-white/50 rounded-full sm:w-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                  style={{
                    width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              <h2 className=" text-center text-4xl sm:text-2xl sm:py-1  font-extrabold text-dark py-4 px-10 ">
                {QUIZ_QUESTIONS[current].question}
              </h2>

              {wasTimeout && (
                <div className="text-center text-sm text-red-700 font-bold  animate-pulse">
                  Zeit ist um!
                </div>
              )}

              <div className="flex flex-wrap w-full max-w-3xl gap-4 justify-center">
                {QUIZ_QUESTIONS[current].options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(idx)}
                    className={getCardClass(opt, idx)}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>

              <ProgressMap
                results={results}
                current={current}
                total={QUIZ_QUESTIONS.length}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <QuizResultCard
            score={score}
            onReplay={() => {
              setCurrent(0);
              setSelected(null);
              setScore(0);
              setResults([]);
              setTimeLeft(5);
              setWasTimeout(false);
              setShowResult(false);
            }}
          />
        )}
      </div>

      <VictoryModal
        show={showVictoryModal}
        onClose={() => {
          setShowVictoryModal(false);
        }}
        title="🎉 Stark gemacht!"
        description="Du hast alle Fragen richtig beantwortet – weiter so!"
        imageSrc="/robot3.png"
      />
    </div>
  );
};
