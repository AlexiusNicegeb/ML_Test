import React, { FC, useMemo } from "react";
import { Target } from "@/app/types";
import { TARGETS } from "@/app/staticData";

interface Props {
  text: string;
  completedWords: number[];
  onWordClick: (target: Target) => void;
}

export const HighlightableText: FC<Props> = React.memo(
  ({ text, completedWords, onWordClick }) => {
    const targetMap = useMemo(() => {
      const map = new Map<string, Target>();
      TARGETS.forEach((t) => map.set(t.word, t));
      return map;
    }, []);

    const words = useMemo(() => text.split(" "), [text]);

    return (
      <>
        {words.map((word, index) => {
          const clean = word.replace(/[.,!?]/g, "");
          const target = targetMap.get(clean);
          const isCompleted = target && completedWords.includes(target.id);

          if (target) {
            return (
              <span
                key={index}
                onClick={() => {
                  if (!isCompleted) onWordClick(target);
                }}
                className={`inline mx-1 font-bold transition-all duration-500 ${
                  isCompleted
                    ? "text-green-600 cursor-default line-through decoration-2 decoration-green-500 opacity-80 animate-fadeInGlow"
                    : "cursor-pointer text-blue-600 hover:underline"
                }`}
              >
                {word}
              </span>
            );
          }

          return (
            <span key={index} className="inline mx-1">
              {word}
            </span>
          );
        })}
      </>
    );
  }
);
