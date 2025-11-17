import { FC } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const LockedTooltipModal: FC<Props> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl border border-gray-200 relative ">
        <h2 className="text-2xl font-semibold text-blue-800 mb-3 text-center">
          Runde gesperrt 🔒
        </h2>
        <p className="text-gray-700 text-sm text-center leading-relaxed">
          Um diese Runde freizuschalten musst du:
          <br />
          <span className="text-black font-medium">
            ✔️ das Einführungsvideo ansehen
          </span>
          <br />
          <span className="text-black font-medium">
            ✔️ alle 3 Aufgaben (task1, task2, task3) abschicken
          </span>
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Alles klar
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <IoCloseCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default LockedTooltipModal;
