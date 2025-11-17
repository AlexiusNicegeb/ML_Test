import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
export const SentenceType = ({
  type,
  isDragging = false,
  onClick,
}: {
  type: string;
  isDragging?: boolean;
  onClick?: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type,
    data: {
      partType: type,
    },
  });
  const typeLetter = {
    Subjekt: "S",
    Prädikat: "P",
    "Objekt im Genitiv": "OG",
    "Objekt im Dativ": "OD",
    "Objekt im Akkusativ": "OA",
    Adverbiale: "ADV",
  };

  const typeColors = {
    Subjekt: "from-blue-300 to-blue-500 ring-blue-400",
    Prädikat: "from-green-300 to-green-500 ring-green-400",
    "Objekt im Genitiv": "from-purple-300 to-purple-500 ring-purple-400",
    "Objekt im Dativ": "from-teal-300 to-teal-500 ring-teal-400",
    "Objekt im Akkusativ":
      "from-yellow-300 to-yellow-500 ring-yellow-400 text-black",
    Adverbiale: "from-pink-300 to-pink-500 ring-pink-400",
  };

  const motionStyle = transform
    ? {
        x: transform.x,
        y: transform.y,
      }
    : {
        x: 0,
        y: 0,
      };

  return (
    <motion.div
      onClick={onClick}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      style={{
        x: motionStyle.x,
        y: motionStyle.y,
        zIndex: isDragging ? 999 : 1,
      }}
      className={`
        touch-none
        relative sm:w-[80px] sm:h-[45px] w-[160px] h-[60px] rounded-xl text-white font-bold 
        flex items-center justify-center text-lg sm:text-sm
        shadow-lg select-none cursor-grab text-center
        bg-gradient-to-br ${typeColors[type as keyof typeof typeColors]}
        ${isDragging ? "" : "hover:scale-105 transition-transform duration-200"}
      `}
    >
      {type}
      <span className="absolute bottom-2 right-2 text-5xl sm:text-2xl opacity-10">
        {typeLetter[type as keyof typeof typeLetter]}
      </span>
    </motion.div>
  );
};
