import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef, useState } from "react";
import { $getRoot } from "lexical";

interface TypingSpeedPluginProps {
  onMostUsedWordChange?: (word: string) => void;
  gameOver?: boolean;
  setGameOver?: (gameOver: boolean) => void;
}

const Gauge = ({ value = 90, size = 128 }) => {
  const clampValue = Math.max(0, Math.min(100, value));
  const rotation = (clampValue / 100) * 180 - 90;

  return (
    <div className="relative" style={{ width: size, height: size / 2 }}>
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <defs>
          <linearGradient id="gauge-gradient">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          stroke="url(#gauge-gradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <div
        className="absolute bottom-0 left-1/2 origin-bottom w-1 h-[40%] bg-black rounded-full"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </div>
  );
};

export default Gauge;

export function TypingSpeedPlugin({
  onMostUsedWordChange,
  setGameOver,
}: TypingSpeedPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [cps, setCps] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [mostUsedWord, setMostUsedWord] = useState("");
  const [mostUsedChar, setMostUsedChar] = useState("");
  const startTimeRef = useRef<number | null>(null);

  // const [editorKey, setEditorKey] = useState(0);

  const handleGameOver = () => setGameOver && setGameOver(true);

  useEffect(() => {
    const unregisterUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const textContent = root.getTextContent().trim();

          if (textContent.length === 0) {
            // Reset if empty
            startTimeRef.current = null;
            setCps(0);
            setCpm(0);
            setWpm(0);
            setMostUsedWord("");
            setMostUsedChar("");
            return;
          }

          // Start timer when the first character is typed
          if (startTimeRef.current === null) {
            startTimeRef.current = Date.now();
          }

          const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
          if (elapsedSeconds > 0) {
            // Calculate average characters per second and minute (cumulative)
            const totalCps = textContent.length / elapsedSeconds;
            setCps(totalCps);
            setCpm(totalCps * 60);

            // Extract words using regex (ignores punctuation)
            const wordsArray = textContent.match(/\b\w+\b/g) || [];
            setWpm((wordsArray.length * 60) / elapsedSeconds);

            // Compute most used word (case-insensitive)
            const wordFreq: Record<string, number> = {};
            wordsArray.forEach((word: string) => {
              const lowerWord = word.toLowerCase();
              wordFreq[lowerWord] = (wordFreq[lowerWord] || 0) + 1;
            });

            const frequentWord = Object.entries(wordFreq).reduce(
              (acc, [word, count]) =>
                count > acc.count ? { word, count } : acc,
              { word: "", count: 0 }
            ).word;

            setMostUsedWord(frequentWord);
            if (onMostUsedWordChange) {
              onMostUsedWordChange(frequentWord);
            }

            // Compute most used character (ignoring whitespace, case insensitive)
            const charFreq: Record<string, number> = {};
            for (const char of textContent.toLowerCase()) {
              if (char.trim() === "") continue;
              charFreq[char] = (charFreq[char] || 0) + 1;
            }

            const frequentChar = Object.entries(charFreq).reduce(
              (acc, [char, count]) =>
                count > acc.count ? { char, count } : acc,
              { char: "", count: 0 }
            ).char;

            setMostUsedChar(frequentChar);
          }
        });
      }
    );

    return () => unregisterUpdateListener();
  }, [editor, onMostUsedWordChange]);

  return (
    <div className="typing-speed gap-6 w-full z-50">
      {/* Leben */}
      <div className="relative h-48 bg-gradient-to-b from-[#E0E7FF] to-[#C7D2FE] rounded-3xl shadow-md flex flex-col items-center justify-center transition-transform hover:scale-105 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-layer.svg')] bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"></div>

        {/* Light Glow */}
        <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] bg-gradient-radial from-white/20 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Animated Shine */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="animate-shine absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none"></div>
        <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>

        <Gauge value={90} size={100} />
        <p className="text-4xl font-extrabold text-[#3730A3] mt-2 drop-shadow-sm">
          90%
        </p>
        <p className="text-sm font-semibold text-[#3730A3] uppercase tracking-wide drop-shadow-sm text-center">
          Leben
        </p>
      </div>

      {/* Zeichen pro Sekunde */}
      <div className="relative h-48 bg-gradient-to-b from-[#D1FAE5] to-[#A7F3D0] rounded-3xl shadow-md flex flex-col items-center justify-center transition-transform hover:scale-105 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-layer.svg')] bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"></div>

        {/* Light Glow */}
        <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] bg-gradient-radial from-white/20 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Animated Shine */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="animate-shine absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none"></div>
        <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>

        <Gauge value={cps} size={100} />
        <p className="text-4xl font-extrabold text-[#065F46] mt-2 drop-shadow-sm">
          {Math.round(cps)}
        </p>
        <p className="text-sm font-semibold text-[#065F46] uppercase tracking-wide drop-shadow-sm text-center">
          Zeichen pro Sekunde
        </p>
      </div>

      {/* Zeichen pro Minute */}
      <div className="relative h-48 bg-gradient-to-b from-[#ECFCCB] to-[#D9F99D] rounded-3xl shadow-md flex flex-col items-center justify-center transition-transform hover:scale-105 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-layer.svg')] bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"></div>

        {/* Light Glow */}
        <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] bg-gradient-radial from-white/20 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Animated Shine */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="animate-shine absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none"></div>
        <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>

        <Gauge value={cpm} size={100} />
        <p className="text-4xl font-extrabold text-[#4D7C0F] mt-2 drop-shadow-sm">
          {Math.round(cpm)}
        </p>
        <p className="text-sm font-semibold text-[#4D7C0F] uppercase tracking-wide drop-shadow-sm text-center">
          Zeichen pro Minute
        </p>
      </div>

      {/* Worte pro Minute */}
      <div className="relative h-48 bg-gradient-to-b from-[#FFE7D1] to-[#FCD9B6] rounded-3xl shadow-md flex flex-col items-center justify-center transition-transform hover:scale-105 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-layer.svg')] bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"></div>

        {/* Light Glow */}
        <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] bg-gradient-radial from-white/20 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Animated Shine */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="animate-shine absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none"></div>
        <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>

        <Gauge value={wpm} size={100} />
        <p className="text-4xl font-extrabold text-[#7C2D12] mt-2 drop-shadow-sm">
          {Math.round(wpm)}
        </p>
        <p className="text-sm font-semibold text-[#7C2D12] uppercase tracking-wide drop-shadow-sm text-center">
          Worte pro Minute
        </p>
      </div>

      {/* Häufigstes Wort */}
      <div className="relative h-48 bg-gradient-to-b from-[#DBEAFE] to-[#BFDBFE] rounded-3xl shadow-md flex flex-col items-center justify-center transition-transform hover:scale-105 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-layer.svg')] bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"></div>

        {/* Light Glow */}
        <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] bg-gradient-radial from-white/20 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Animated Shine */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="animate-shine absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none"></div>
        <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>

        <p className="text-sm font-semibold text-[#1E3A8A] uppercase tracking-wide mb-2 drop-shadow-sm text-center">
          Häufigstes Wort
        </p>
        <p className="text-lg font-bold text-[#1E3A8A] bg-white py-1 px-3 rounded-xl shadow border border-[#d0e7ff]">
          {mostUsedWord || "N/A"}
        </p>
      </div>

      {/* Häufigster Buchstabe/Zeichen */}
      <div className="relative h-48 bg-gradient-to-b from-[#FCE7F3] to-[#FBCFE8] rounded-3xl shadow-md flex flex-col items-center justify-center transition-transform hover:scale-105 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-layer.svg')] bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"></div>

        {/* Light Glow */}
        <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] bg-gradient-radial from-white/20 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Animated Shine */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="animate-shine absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none"></div>
        <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>

        <p className="text-sm font-semibold text-[#831843] uppercase tracking-wide mb-2 drop-shadow-sm text-center">
          Häufigster Buchstabe/Zeichen
        </p>
        <p className="text-lg font-bold text-[#831843] bg-white py-1 px-3 rounded-xl shadow border border-[#d0e7ff]">
          {mostUsedChar || "N/A"}
        </p>
      </div>
    </div>
  );
}
