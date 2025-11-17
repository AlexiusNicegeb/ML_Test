import { SentencePart } from "@/app/types";
import { useDroppable } from "@dnd-kit/core";

export const SentenceBlock = ({
  id,
  text,
  correctType,
  currentType,
  highlight,
}: SentencePart) => {
  const isGuessed = currentType !== "";

  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: isGuessed,
  });

  const baseClasses =
    "min-w-[180px] min-h-[80px] sm:min-w-[60px] sm:min-h-[35px] sm:p-1 p-4 rounded-xl border text-center sm:text-xs text-lg font-semibold transition-all duration-300";
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
      <div className="flex items-center justify-center gap-2">{text}</div>
      <div className="text-sm text-gray-500 mt-1">{currentType || "?"}</div>
    </div>
  );
};
