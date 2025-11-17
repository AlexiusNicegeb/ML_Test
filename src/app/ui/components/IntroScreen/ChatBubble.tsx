import { motion } from "framer-motion";

type ChatBubbleProps = {
  text: string;
  role: "user" | "bot";
};

export const ChatBubble = ({ text, role }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${
          isUser ? "bg-[#cdeafe] text-gray-800" : "bg-[#f1f5f9] text-gray-800"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
};
