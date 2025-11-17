import React, { useCallback, useEffect, useRef, useState } from "react";
import VictoryModal from "@/app/ui/components/WordGame/VictoryModal";
import GameStatsBar from "@/app/ui/components/WordGame/GameStatsBar";
import { Target } from "@/app/types";
import { PHRASES, TARGETS } from "@/app/staticData";
import { HighlightableText } from "./HighlightableText";

type Props = {
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
};

const text = `Letztes Wochenende besuchten wir meine Großeltern auf dem Land. Schon früh am Morgen packten wir unsere Sachen und fuhren los. Die Sonne schien, und wir genossen die Fahrt.`;

const TimeFormTrainer: React.FC<Props> = ({ gameStarted, setGameStarted }) => {
  const [selectedWord, setSelectedWord] = useState<Target | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedTense, setSelectedTense] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedWords, setCompletedWords] = useState<number[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState<Record<number, number>>(
    {}
  );
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  const correctSoundRef = useRef(new Audio("/sounds/correctSound.mp3"));
  const wrongSoundRef = useRef(new Audio("/sounds/wrongSound.mp3"));

  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  const handleCheck = useCallback(() => {
    if (!selectedWord) return;

    const isWordCorrect =
      inputValue.trim().toLowerCase() === selectedWord.correct.toLowerCase();
    const isTenseCorrect =
      selectedTense.trim().toLowerCase() === selectedWord.tense.toLowerCase();
    const isAnswerCorrect = isWordCorrect && isTenseCorrect;

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      const sound = correctSoundRef.current;
      sound.pause();
      sound.currentTime = 0;
      sound.play();

      if (!completedWords.includes(selectedWord.id)) {
        setCompletedWords((prev) => [...prev, selectedWord.id]);
        setXp((prev) => prev + 10);
        setStreak((prev) => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) setBestStreak(newStreak);
          return newStreak;
        });
      }
    } else {
      const sound = wrongSoundRef.current;
      sound.pause();
      sound.currentTime = 0;
      sound.play();

      setXp((prev) => Math.max(0, prev - 5));
      setStreak(0);
      setWrongAttempts((prev) => ({
        ...prev,
        [selectedWord.id]: (prev[selectedWord.id] || 0) + 1,
      }));
    }
  }, [selectedWord, inputValue, selectedTense, completedWords, bestStreak]);

  const isAllCompleted = completedWords.length === TARGETS.length;

  useEffect(() => {
    if (isAllCompleted) {
      setShowVictoryModal(true);
    }
  }, [isAllCompleted]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVictoryModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative w-full h-full">
      {!gameStarted && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-3xl">
          <h2 className="text-[#000] text-3xl font-extrabold mb-8 text-center px-6 drop-shadow-sm">
            Bist du bereit? Starte dein Grammatik-Abenteuer! 🚀
          </h2>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-gradient-to-r from-[#6EE7B7] to-[#34D399] hover:brightness-105 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transition-transform hover:scale-105"
          >
            Start
          </button>
        </div>
      )}
      <div
        className={` bg-gradient-to-b min-h-[450px] from-[#bfdbfe] to-[#93c5fd] rounded-3xl shadow-2xl max-w-7xl mx-auto overflow-hidden relative w-full ${
          gameStarted
            ? " sm:min-h-[600px] xs:max-w-[300px]  md:max-w-[370px] lg:max-w-[full] "
            : "w-full max-w-[650px] sm:w-[300px] sm:max-h-[350px] sm:overflow-hidden"
        }`}
      >
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2  h-[160%] bg-gradient-radial from-white/10 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Header */}
        <div className="flex flex-col bg-white/60 backdrop-blur-md border-b border-white/30 rounded-t-3xl p-5 shadow-md relative z-10 ">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-2xl font-extrabold text-[#005B8F] drop-shadow-sm">
              Zeitformen Trainer
            </h2>
            <button
              className="bg-gradient-to-r from-[#FCA5A5] to-[#F87171] hover:brightness-105 active:brightness-95 text-white font-bold py-2 px-5 rounded-full shadow transition-transform hover:scale-105"
              onClick={() => setGameStarted(false)}
            >
              End game
            </button>
            {/* Info */}
          </div>
          <div className="text-[#1e3a8a] text-sm font-medium flex items-center gap-2">
            <span>Markiere ein Wort & wähle den passenden Fall ✍️</span>
          </div>
        </div>

        {/* Stats & Progress */}
        <GameStatsBar
          xp={xp}
          streak={streak}
          bestStreak={bestStreak}
          completed={completedWords.length}
          total={TARGETS.length}
          status={
            isCorrect === true
              ? "success"
              : isCorrect === false
                ? "error"
                : "default"
          }
        />

        <VictoryModal
          show={showVictoryModal}
          onClose={() => {
            setShowVictoryModal(false);
          }}
          title="🎉 Super gemacht!"
          description="Du hast alle Aufgaben richtig gelöst – stark!"
          imageSrc="/robot3.png"
        />

        {streak >= 3 && (
          <div className="bg-yellow-100 text-yellow-800 rounded-xl px-4 py-2 text-center shadow animate-pulse mx-6 mb-4">
            🔥 {streak}er Serie! Weiter so!
          </div>
        )}

        <div className="px-6 py-6 flex flex-col items-center gap-6">
          <div className="bg-white/80 p-4 sm:p-6 rounded-2xl shadow-lg w-full text-lg leading-7 backdrop-blur-sm break-words whitespace-normal">
            <HighlightableText
              text={text}
              completedWords={completedWords}
              onWordClick={(target) => {
                setSelectedWord(target);
                setInputValue("");
                setSelectedTense("");
                setIsCorrect(null);
              }}
            />
          </div>

          {selectedWord && gameStarted && (
            <div className="p-4 sm:p-6 border rounded-2xl bg-white/80 shadow-lg w-full max-w-2xl flex flex-col gap-5 backdrop-blur-sm">
              <div className="w-full">
                <p className="text-base text-gray-700 mb-2">
                  Gewähltes Wort:{" "}
                  <span className="font-bold text-[#005B8F]">
                    {selectedWord.word}
                  </span>
                </p>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Schreibe die korrekte Form"
                  className="w-full p-3 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Zeitform auswählen:
                  <select
                    value={selectedTense}
                    onChange={(e) => setSelectedTense(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition text-sm"
                  >
                    <option value="">— Select tense —</option>
                    <option value="present">Present</option>
                    <option value="past">Past</option>
                    <option value="future">Future</option>
                  </select>
                </label>
              </div>

              <button
                onClick={handleCheck}
                className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white py-3 px-4 rounded-xl hover:brightness-105 transition w-full font-bold shadow-lg"
              >
                Check
              </button>

              {isCorrect !== null && (
                <div
                  className={`p-3 py-2 rounded-xl text-center font-bold flex items-center justify-center gap-2 ${
                    isCorrect
                      ? "text-green-700 bg-green-100 border border-green-300"
                      : "text-red-700 bg-red-100 border border-red-300"
                  }`}
                >
                  {isCorrect
                    ? PHRASES[Math.floor(Math.random() * PHRASES.length)]
                    : "Falsch, nochmal versuchen."}
                </div>
              )}

              {wrongAttempts[selectedWord.id] >= 3 && (
                <div className="mt-2 p-3 bg-yellow-100 text-yellow-800 rounded-xl text-sm border border-yellow-300 animate-pulse">
                  💡 Hinweis:{" "}
                  {selectedWord.hint || "Achte auf die richtige Form 😉"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeFormTrainer;
