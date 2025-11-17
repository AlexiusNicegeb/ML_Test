import { memo } from "react";

type SkillLevelButtonProps = {
  level: number;
  selected: boolean;
  onClick: (level: number) => void;
};

export const SkillLevelButton = memo(
  ({ level, selected, onClick }: SkillLevelButtonProps) => (
    <button
      onClick={() => onClick(level)}
      className={`text-4xl bg-white sm:text-2xl px-3 py-2 rounded-2xl transition transform ${
        selected ? "border-2 border-blue-300 scale-110" : "opacity-50"
      }`}
    >
      {["😩", "😕", "🙂", "😎"][level]}
    </button>
  )
);
