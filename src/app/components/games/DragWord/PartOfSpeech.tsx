import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
export const PartOfSpeech = ({
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
      partOfSpeech: type,
    },
  });

  const cardStyles = {
    Noun: "from-blue-300 to-blue-500 ring-blue-400",
    Artikel: "from-teal-300 to-teal-500 ring-teal-400",
    Verb: "from-green-300 to-green-500 ring-green-400",
    Adjective: "from-purple-300 to-purple-500 ring-purple-400",
    Pronomen: "from-pink-300 to-pink-500 ring-pink-400",
    Adverb: "from-yellow-300 to-yellow-500 ring-yellow-400 text-black",
    Preposition: "from-orange-300 to-orange-500 ring-orange-400 text-black",
    Numerale: "from-emerald-300 to-emerald-500 ring-emerald-400",
    Konjunktion: "from-red-300 to-red-500 ring-red-400",
    Interjektion: "from-indigo-300 to-indigo-500 ring-indigo-400",
  };

  const typeLetter = {
    Noun: "N",
    Artikel: "AR",
    Verb: "V",
    Adjective: "A",
    Pronomen: "P",
    Adverb: "D",
    Preposition: "PR",
    Numerale: "NUM",
    Konjunktion: "K",
    Interjektion: "I",
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
        relative w-[90px] h-[60px] sm:w-[70px] sm:h-[50px] sm:text-sm  rounded-xl text-white font-bold 
        flex items-center justify-center text-lg 
        shadow-lg select-none cursor-grab
        bg-gradient-to-br ${cardStyles[type as keyof typeof cardStyles]}
        ${isDragging ? "" : "hover:scale-105 transition-transform duration-200"}
      `}
    >
      {type}
      <span className="absolute bottom-2 right-2 sm:bottom-4 text-5xl sm:text-2xl opacity-10">
        {typeLetter[type as keyof typeof typeLetter]}
      </span>
    </motion.div>
  );
};
