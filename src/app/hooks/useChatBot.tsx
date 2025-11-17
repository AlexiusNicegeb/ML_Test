import { useRef, useState } from "react";
import { INTRO_QA } from "@/app/staticData";

type Message = { role: "user" | "bot"; text: string };

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingText, setTypingText] = useState("");
  const [initialized, setInitialized] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const sendBotAnswer = (text: string) => {
    let i = 0;
    clearTimeout(typingTimeout.current as any);

    typingTimeout.current = setInterval(() => {
      setTypingText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(typingTimeout.current as any);
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "bot", text }]);
          setTypingText("");
        }, 300);
      }
    }, 20);
  };

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    sendBotAnswer("🛠️ Sorry! Chatbot backend isn't connected yet.");
  };

  const askPredefined = (index: number) => {
    const selected = INTRO_QA[index];
    if (messages.find((m) => m.text === selected.question)) return;
    setMessages((prev) => [...prev, { role: "user", text: selected.question }]);
    sendBotAnswer(selected.answer);
  };

  const startBotIntro = () => {
    if (initialized) return;
    setInitialized(true);
    const queue = [
      "Hey there! Let's get you started. 👋",
      "We're not just another boring platform. We're the game-changer. 🧠🔥",
      "Check this out — why we're better than the rest:",
      "__FEATURES__",
    ];

    queue.reduce((acc, msg, idx) => {
      return acc.then(() => {
        return new Promise((res) => {
          setTimeout(() => {
            if (msg === "__FEATURES__") {
              setMessages((prev) => [...prev, { role: "bot", text: msg }]);
            } else {
              sendBotAnswer(msg);
            }
            res(true as any);
          }, 2500);
        });
      });
    }, Promise.resolve());
  };

  return {
    messages,
    typingText,
    sendUserMessage,
    askPredefined,
    startBotIntro,
  };
};
