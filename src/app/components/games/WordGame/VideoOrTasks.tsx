import { Instructions } from "@/app/types";
import { VideoSection } from "@/app/ui/components/WordGame/VideoSection";
import { AnimatePresence } from "framer-motion";
import TasksContainer from "./TasksContainer";
import { motion } from "framer-motion";
export const InfoOrTasks = ({
  isInfoOpen,
  setIsInfoOpen,
  instructions,
  handlePrev,
  handleNext,
}: {
  isInfoOpen: boolean;
  setIsInfoOpen: (open: boolean) => void;
  instructions: Instructions;
  handlePrev: () => void;
  handleNext: () => void;
}) => {
  return (
    <AnimatePresence mode="wait">
      {isInfoOpen ? (
        <motion.div
          key="video-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 w-full "
        >
          <VideoSection handleCloseVideo={() => setIsInfoOpen(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="tasks-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex-1 w-full "
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <TasksContainer
            instructions={instructions}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
