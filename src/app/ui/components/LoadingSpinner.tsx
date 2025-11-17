import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <motion.div
      className="mt-20 flex justify-center items-center w-full h-[200px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </motion.div>
  );
};
