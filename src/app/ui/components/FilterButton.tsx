interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}
export const FilterButton = ({
  label,
  isActive,
  onClick,
}: FilterButtonProps) => (
  <div className={`filter-item ${isActive ? "active" : ""}`} onClick={onClick}>
    {label}
  </div>
);
