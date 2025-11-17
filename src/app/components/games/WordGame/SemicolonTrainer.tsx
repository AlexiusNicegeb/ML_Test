import React, { useState } from "react";

type Props = {
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
};

const sampleText =
  "This is a demo sentence to test your semicolon placement logic. Click on any word to add a semicolon.";

const SemicolonTrainer: React.FC<Props> = ({ gameStarted, setGameStarted }) => {
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);

  const handleClick = (index: number) => {
    setSelectedPositions((prev) =>
      prev.includes(index)
        ? prev.filter((pos) => pos !== index)
        : [...prev, index]
    );
  };

  const renderText = () => {
    const words = sampleText.split(" ");

    return words.map((word, index) => {
      const hasSemicolon = selectedPositions.includes(index);
      return (
        <span key={index} className="inline-flex items-center mx-1">
          <span
            onClick={() => handleClick(index)}
            className={`cursor-pointer font-semibold transition-colors duration-300 ${
              hasSemicolon
                ? "text-green-600 underline decoration-green-500"
                : "hover:text-blue-500"
            }`}
          >
            {word}
          </span>
          {hasSemicolon && (
            <span className="ml-1 text-green-600 font-bold">;</span>
          )}
        </span>
      );
    });
  };

  return (
    <div className="relative h-full">
      {!gameStarted && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-3xl">
          <h2 className="text-[#000] text-3xl font-extrabold mb-8 text-center px-6 drop-shadow-sm">
            Bist du bereit? Starte dein Semikolon-Abenteuer! 🚀
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
            ? "h-full min-h-[500px] sm:w-[90vw]"
            : "w-[500px] sm:w-full"
        }`}
      >
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 w-[160%] h-[160%] bg-gradient-radial from-white/10 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Header */}
        <div className="flex flex-col bg-white/60 backdrop-blur-md border-b border-white/30 rounded-t-3xl p-5 shadow-md relative z-10">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-2xl font-extrabold text-[#005B8F] drop-shadow-sm">
              Semicolon Trainer
            </h2>
            <button
              className="bg-gradient-to-r from-[#FCA5A5] to-[#F87171] hover:brightness-105 active:brightness-95 text-white font-bold py-2 px-5 rounded-full shadow transition-transform hover:scale-105"
              onClick={() => setGameStarted(false)}
            >
              End game
            </button>
          </div>

          {/* Info Block */}
          <div className="text-[#1e3a8a] text-sm font-medium flex items-center gap-2 mt-2">
            <span>Click on any word to place/remove a semicolon ✍️</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col items-center gap-6">
          <div className="bg-white/80 p-6 sm:p-8 rounded-2xl shadow-lg w-full text-lg leading-7 backdrop-blur-sm break-words whitespace-normal text-center">
            {renderText()}
          </div>

          {selectedPositions.length > 0 && (
            <div className="bg-gradient-to-r from-green-100 to-green-50 text-green-700 font-semibold rounded-2xl px-6 py-4 text-center shadow-lg mx-9 drop-shadow border border-green-300">
              ✅ You&#39;ve added {selectedPositions.length} semicolon
              {selectedPositions.length > 1 ? "s" : ""} so far!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SemicolonTrainer;
