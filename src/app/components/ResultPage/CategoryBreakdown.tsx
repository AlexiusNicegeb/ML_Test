import { motion } from "framer-motion";
import { SubScore, SubScoreBar } from "./SubScoreBar";

interface CategoryDetailProps {
  title: string;
  sub: SubScore[];
}

export const CategoryBreakdown = ({ title, sub }: CategoryDetailProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-white/60 backdrop-blur-sm border border-[#d0e7ff] rounded-2xl p-6 sm:p-2 shadow space-y-4 w-full"
  >
    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    <motion.div
      className="space-y-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {sub.map((item, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <SubScoreBar {...item} />
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);
