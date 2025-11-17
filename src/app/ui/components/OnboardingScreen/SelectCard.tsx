export const SelectCard = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl bg-white/40 backdrop-blur-sm border border-[#d0e7ff] px-6 py-3 sm:px-3 sm:py-2 sm:text-sm text-blue-900 font-semibold shadow transition hover:bg-white/60 hover:shadow-md hover:scale-105 ${
        selected ? "ring-2 ring-blue-300" : ""
      }`}
    >
      {label}
    </button>
  );
};
