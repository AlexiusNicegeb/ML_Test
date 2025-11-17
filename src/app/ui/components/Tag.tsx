import { RiDeleteBinLine } from "react-icons/ri";

interface TagProps {
  disabled?: boolean;
  label: string;
  deleteable?: boolean;
  onDelete?: () => void;
}
export const Tag = ({ label, deleteable, onDelete, disabled }: TagProps) => {
  return (
    <div className="tag">
      {label}
      {deleteable && (
        <button
          disabled={disabled}
          className="ml-2"
          onClick={() => {
            if (onDelete) {
              onDelete();
            }
          }}
        >
          <RiDeleteBinLine size={20} />
        </button>
      )}
    </div>
  );
};
