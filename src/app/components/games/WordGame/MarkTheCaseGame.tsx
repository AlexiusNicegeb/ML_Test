import { GrammarCase } from "@/app/enums";
import StatCard from "@/app/ui/components/WordGame/StatCard";
import React, { useState, FC, useRef, useEffect } from "react";

interface TargetWord {
  id: number;
  word: string;
  correctCase: GrammarCase;
  hint?: string;
  uniqueId?: string;
}

interface Props {
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
}

const text = `Am Morgen packte ich meinen Rucksack und erzählte meiner Schwester von meinen Plänen. Auf dem Weg zur Bushaltestelle grüßte ich einen Nachbarn und half einer alten Dame mit ihrem schweren Einkauf. Im Bus las ich ein spannendes Buch und bot dem Fahrer ein freundliches Lächeln an. Schließlich erreichte ich mein Ziel und zeigte dem Wächter meinen Ausweis.`;

const targets = [
  {
    id: 1,
    word: "meinen",
    correctCase: GrammarCase.Akkusativ,
    hint: "Nach 'packen' benutzt man Akkusativ.",
  },
  {
    id: 2,
    word: "meiner",
    correctCase: GrammarCase.Dativ,
    hint: "Das ist eine Dativform wegen 'erzählen von'.",
  },
  {
    id: 3,
    word: "einen",
    correctCase: GrammarCase.Akkusativ,
    hint: "Nach 'grüßen' brauchst du Akkusativ (Wen?).",
  },
  {
    id: 4,
    word: "einer",
    correctCase: GrammarCase.Dativ,
    hint: "Nach 'helfen' brauchst du Dativ (Wem?).",
  },
  {
    id: 5,
    word: "ein",
    correctCase: GrammarCase.Akkusativ,
    hint: "Nach 'lesen' Akkusativ (Was?).",
  },
  {
    id: 6,
    word: "dem",
    correctCase: GrammarCase.Dativ,
    hint: "Nach 'bieten' Dativ (Wem?).",
  },
  {
    id: 7,
    word: "mein",
    correctCase: GrammarCase.Akkusativ,
    hint: "Nach 'erreichen' Akkusativ (Was?).",
  },
  {
    id: 8,
    word: "dem",
    correctCase: GrammarCase.Dativ,
    hint: "Nach 'zeigen' Dativ (Wem?).",
  },
];

const MarkTheCaseTrainer: FC<Props> = ({ gameStarted, setGameStarted }) => {
  const [selectedWord, setSelectedWord] = useState<TargetWord | null>(null);
  const [selectedCase, setSelectedCase] = useState<GrammarCase | "">("");
  const [result, setResult] = useState<null | boolean>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState<Record<string, number>>(
    {}
  );
  const [toast, setToast] = useState<null | {
    message: string;
    type: "success" | "error";
  }>(null);

  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  const phrases = ["Klasse!", "Genial!", "Richtig gut!", "Super!"];
  const correctSoundRef = useRef(new Audio("/sounds/correctSound.mp3"));
  const wrongSoundRef = useRef(new Audio("/sounds/wrongSound.mp3"));

  const handleCheck = () => {
    if (!selectedWord || !selectedCase) return;

    const isCorrect = selectedCase === selectedWord.correctCase;

    if (isCorrect) {
      correctSoundRef.current.pause();
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play();

      if (selectedWord.uniqueId && !completed.includes(selectedWord.uniqueId)) {
        setCompleted((prev) => [...prev, selectedWord.uniqueId!]);
        setXp((prev) => prev + 10);
        setStreak((prev) => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) setBestStreak(newStreak);
          return newStreak;
        });
      }
    } else {
      wrongSoundRef.current.pause();
      wrongSoundRef.current.currentTime = 0;
      wrongSoundRef.current.play();

      setXp((prev) => Math.max(0, prev - 5));
      setStreak(0);
      setWrongAttempts((prev) => ({
        ...prev,
        [selectedWord.uniqueId!]: (prev[selectedWord.uniqueId!] || 0) + 1,
      }));
    }

    setResult(isCorrect);

    setToast({
      message: isCorrect
        ? phrases[Math.floor(Math.random() * phrases.length)]
        : "Falsch, nochmal versuchen.",
      type: isCorrect ? "success" : "error",
    });
  };

  const renderText = () => {
    const words = text.split(" ");

    return words.map((word, index) => {
      const cleanedWord = word.replace(/[.,!?]/g, "");
      const matchingTargets = targets.filter((t) => t.word === cleanedWord);
      const uniqueId = `${cleanedWord}-${index}`;

      const isCompleted = completed.includes(uniqueId);

      if (matchingTargets.length > 0) {
        return (
          <span
            key={uniqueId}
            onClick={() => {
              if (isCompleted) return;
              const target = matchingTargets[0];
              if (!target) return;
              setSelectedWord({ ...target, uniqueId });
              setSelectedCase("");
              setResult(null);
            }}
            className={`inline mx-1 font-bold transition-all duration-500 ease-in-out ${
              isCompleted
                ? "text-green-600 cursor-default line-through decoration-2 decoration-green-500 opacity-80 animate-fadeInGlow"
                : "cursor-pointer text-blue-600 hover:underline"
            }`}
          >
            {word}
          </span>
        );
      } else {
        return (
          <span key={uniqueId} className="inline mx-1">
            {word}
          </span>
        );
      }
    });
  };

  const totalTargetInstances = text.split(" ").filter((word, index) => {
    const cleanedWord = word.replace(/[.,!?]/g, "");
    return targets.some((t) => t.word === cleanedWord);
  }).length;
  const isAllCompleted = completed.length === totalTargetInstances;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="relative h-full">
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
        className={`bg-gradient-to-b from-[#bfdbfe] to-[#93c5fd] rounded-3xl shadow-2xl max-w-7xl mx-auto overflow-hidden relative ${
          gameStarted
            ? "h-full  min-h-[600px] sm:w-[90vw]"
            : "w-[500px] sm:w-full"
        }`}
      >
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 w-[160%] h-[160%] bg-gradient-radial from-white/10 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {toast && (
          <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } ${toast ? "opacity-100" : "opacity-0"}`}
          >
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col bg-white/60 backdrop-blur-md border-b border-white/30 rounded-t-3xl p-5 shadow-md relative z-10 ">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-2xl font-extrabold text-[#005B8F] drop-shadow-sm sm:text-lg ">
              Fälle & Präpositionen Trainer
            </h2>
            <button
              className="bg-gradient-to-r from-[#FCA5A5] to-[#F87171] hover:brightness-105 active:brightness-95 text-white font-bold py-2 px-5 sm:px-2 sm:py-1 rounded-full shadow transition-transform hover:scale-105"
              onClick={() => setGameStarted(false)}
            >
              End game
            </button>
          </div>

          {/* NEW Info Block */}
          <div className="text-[#1e3a8a] text-sm font-medium flex items-center gap-2">
            <span>Markiere ein Wort & wähle den passenden Fall ✍️</span>
          </div>
        </div>

        <div className="max-w-4xl flex flex-row-reverse flex-wrap items-center justify-center gap-4 mt-6 px-6 mx-auto ">
          {/* XP Block */}
          <StatCard
            icon="⭐"
            label="XP"
            value={xp}
            status={
              result === true
                ? "success"
                : result === false
                  ? "error"
                  : "default"
            }
          />
          <StatCard icon="🔥" label="Streak" value={streak} />
          <StatCard icon="🏆" label="Best Streak" value={bestStreak} />

          {/* Progress Bar */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative w-full bg-[#e5e7eb] rounded-full h-6 shadow-inner border border-[#cbd5e1] overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg transition-all duration-500 ease-in-out"
                style={{
                  width: `${(completed.length / totalTargetInstances) * 100}%`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-semibold text-[#1e3a8a] drop-shadow-sm">
                {Math.round((completed.length / totalTargetInstances) * 100)}%
                erledigt
              </div>
            </div>
          </div>
        </div>

        {isAllCompleted && (
          <div className="bg-gradient-to-r from-green-200 to-green-100 text-[#065F46] font-semibold rounded-2xl px-6 py-4 text-center shadow-lg my-3 mx-9 drop-shadow animate-pulse border border-green-300">
            🎉 <span className="font-bold">Glückwunsch!</span> Du hast alle
            Wörter korrekt zugeordnet! <br />
            <span className="text-sm mt-2 block">
              🚀 End XP: {xp} | 🔥 Best Streak: {bestStreak}
            </span>
          </div>
        )}

        {!isAllCompleted && streak >= 3 && (
          <div className="bg-yellow-100 text-yellow-800 rounded-xl px-4 py-1 mt-3 text-center shadow animate-pulse mx-6 mb-4">
            🔥 {streak}er Serie! Super gemacht!
          </div>
        )}

        <div className="px-6 py-6 flex flex-col items-center gap-6">
          <div className="bg-white/80 p-4 sm:p-6 rounded-2xl shadow-lg w-full text-lg leading-7 backdrop-blur-sm break-words whitespace-normal">
            {renderText()}
          </div>

          {selectedWord && (
            <div className="p-4 sm:p-6 border rounded-2xl bg-white/80 shadow-lg w-full max-w-2xl flex flex-col gap-5 backdrop-blur-sm">
              <div className="w-full">
                <p className="text-base text-gray-700 mb-2">
                  Gewähltes Wort:{" "}
                  <span className="font-bold text-[#005B8F]">
                    {selectedWord.word}
                  </span>
                </p>
              </div>

              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-1">
                  Wähle den Fall:
                  <select
                    value={selectedCase}
                    onChange={(e) =>
                      setSelectedCase(e.target.value as GrammarCase)
                    }
                    className="w-full p-3 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition text-sm"
                  >
                    <option value="">— Select case —</option>
                    {Object.values(GrammarCase).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                onClick={handleCheck}
                className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white py-3 px-4 rounded-xl hover:brightness-105 transition w-full font-bold shadow-lg"
              >
                Check
              </button>

              {/* {result !== null && (
                <div
                  className={`p-3 py-2 rounded-xl text-center font-bold flex items-center justify-center gap-2 ${
                    result
                      ? "text-green-700 bg-green-100 border border-green-300"
                      : "text-red-700 bg-red-100 border border-red-300"
                  }`}
                >
                  {result
                    ? phrases[Math.floor(Math.random() * phrases.length)]
                    : "Falsch, nochmal versuchen."}
                </div>
              )} */}

              {wrongAttempts[selectedWord.id] >= 2 && (
                <div className="mt-2 p-3 bg-yellow-100 text-yellow-800 rounded-xl text-sm border border-yellow-300 animate-pulse">
                  💡 Hinweis:{" "}
                  {selectedWord.hint ||
                    "Dieses Wort steht oft im Dativ/Akkusativ 😉"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkTheCaseTrainer;
