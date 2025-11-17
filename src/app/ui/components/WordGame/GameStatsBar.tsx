import React from "react";
import StatCard from "./StatCard";

type Props = {
  xp: number;
  streak: number;
  bestStreak: number;
  completed: number;
  total: number;
  status?: "success" | "error" | "default";
};

const GameStatsBar: React.FC<Props> = ({
  xp,
  streak,
  bestStreak,
  completed,
  total,
  status = "default",
}) => {
  const percentDone = Math.round((completed / total) * 100);

  return (
    <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-4 mt-6 px-6 max-w-4xl mx-auto">
      <StatCard icon="⭐" label="XP" value={xp} status={status} />
      <StatCard icon="🔥" label="Streak" value={streak} />
      <StatCard icon="🏆" label="Best Streak" value={bestStreak} />

      <div className="flex-1 min-w-[200px] sm:min-w-full">
        <div className="relative w-full bg-[#e5e7eb] rounded-full h-6 shadow-inner border border-[#cbd5e1] overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg transition-all duration-500 ease-in-out"
            style={{ width: `${percentDone}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-semibold text-[#1e3a8a] drop-shadow-sm">
            {percentDone}% erledigt
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatsBar;
