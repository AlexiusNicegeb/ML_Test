import { useDroppable } from "@dnd-kit/core";

export const Word = ({
  word,
  correctType,
  expected,
  highlight,
}: {
  word: string;
  correctType: string;
  expected: string;
  highlight: "none" | "correct" | "incorrect";
}) => {
  const isGuessed = correctType !== "";

  const { isOver, setNodeRef } = useDroppable({
    id: word,
    disabled: isGuessed,
  });

  const baseClasses =
    "min-w-[150px] min-h-[80px] sm:min-w-[100px] sm:min-h-[35px] sm:p-1 p-4 rounded-xl border text-center text-lg font-semibold transition-all duration-300";
  const highlightClasses =
    highlight === "correct"
      ? "bg-green-100 border-green-400 shadow-md"
      : highlight === "incorrect"
        ? "bg-red-100 border-red-400 animate-shake"
        : isOver
          ? "bg-gray-100 border-gray-500"
          : "bg-white border-gray-300";

  const guessedClasses = isGuessed
    ? "cursor-default opacity-70 border-green-400"
    : "cursor-pointer";

  return (
    <div
      ref={setNodeRef}
      className={`${baseClasses} ${highlightClasses} ${guessedClasses}`}
    >
      <div className="flex items-center justify-center gap-2">{word}</div>
      <div className="text-sm text-gray-500 mt-1">{correctType || "?"}</div>
    </div>
  );
};
