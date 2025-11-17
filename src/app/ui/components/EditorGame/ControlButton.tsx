import { FaLock } from "react-icons/fa6";
export type ButtonConfig = {
  label: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
};

export const ControlButton: React.FC<ButtonConfig> = ({
  label,
  icon,
  gradientFrom,
  disabled,
  gradientTo,
  className,
  onClick,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    style={{
      backgroundImage: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
    }}
    className={`relative w-[80px] h-20 xl:w-[200px] rounded-3xl shadow-md flex flex-col items-center justify-center 
      transition-transform overflow-hidden text-sm font-semibold text-gray-800
      ${disabled ? "opacity-40 cursor-not-allowed hover:scale-100" : "hover:scale-105"}
      ${className || ""}`}
    title={disabled ? "Finish the previous round first" : ""}
  >
    <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-layer.svg')] bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] bg-gradient-radial from-white/30 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="animate-shine absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12" />
    </div>
    <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none" />
    <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />

    <div className="z-10 flex flex-col items-center">
      <span className="text-lg sm:text-base">
        {disabled ? <FaLock /> : icon}
      </span>
      <span className="text-xs mt-1">{label}</span>
    </div>
  </button>
);
