import React from "react";

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  status?: "default" | "success" | "error";
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  status = "default",
}) => {
  let statusClasses = "";

  if (status === "success") {
    statusClasses = "ring-2 ring-green-400 shadow-green-300 animate-pulse";
  } else if (status === "error") {
    statusClasses = "ring-2 ring-red-400 shadow-red-300 animate-shake";
  } else {
    statusClasses = "shadow-lg";
  }

  return (
    <div
      className={`flex flex-col items-center bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-2 w-28 sm:w-20 transition-all duration-300 ease-in-out ${statusClasses}`}
    >
      <span className="text-2xl sm:text-lg">{icon}</span>
      <span className="text-xs text-gray-500 mt-1 text-center">{label}</span>
      <span className="text-lg sm:text-base font-bold text-[#005B8F]">
        {value}
      </span>
    </div>
  );
};

export default StatCard;
