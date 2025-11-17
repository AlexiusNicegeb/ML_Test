import { FC } from "react";
import { motion } from "framer-motion";

interface Props {
  selectedPart: string;
  onClose: () => void;
  videoMap: Record<string, string>;
}

export const PartVideoPlayer: FC<Props> = ({
  selectedPart,
  onClose,
  videoMap,
}) => {
  if (!selectedPart) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2 }}
      className="flex-[1] w-full bg-gradient-to-b from-[#dbeafe] to-[#bfdbfe] rounded-3xl shadow-2xl overflow-hidden relative min-h-[400px] border border-white/30 backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-white/60 p-4 border-b border-white/30">
        <h3 className="text-xl font-extrabold text-[#1e3a8a] drop-shadow-sm">
          {selectedPart} Video
        </h3>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-[#FCA5A5] to-[#F87171] hover:brightness-105 active:brightness-95 text-white font-bold py-2 px-5 rounded-full shadow transition-transform hover:scale-105"
        >
          Close
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <iframe
          title="Video"
          src={videoMap[selectedPart]}
          width="100%"
          height="280"
          className="rounded-xl shadow-lg border border-white/40"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
};
