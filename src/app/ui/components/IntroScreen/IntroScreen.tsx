"use client";

import { animateRobot } from "@/app/animation/robots";
import { useUserAuth } from "@/app/context/user/UserAuthContext";
import { useChatBot } from "@/app/hooks/useChatBot";
import { INTRO_QA } from "@/app/staticData";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { PlatformBattleBlock } from "./PlatformBattleBlock";
import { SplashScreen } from "./SplashScreen";

export const IntroScreen = ({ onClose }: { onClose: () => void }) => {
  const [showSplash, setShowSplash] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 500;
  const {
    messages,
    typingText,
    sendUserMessage,
    askPredefined,
    startBotIntro,
  } = useChatBot();
  const { logout, user } = useUserAuth();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, typingText]);

  useEffect(() => {
    if (!showSplash && robotRef.current && isMobile) {
      animateRobot(robotRef.current);
    }
  }, [showSplash, isMobile]);

  useEffect(() => {
    if (!showSplash) startBotIntro();
  }, [showSplash]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#bfdbfe] via-[#c7e4fd] to-[#dbeafe] z-[9998] flex items-center justify-center">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-4xl px-4 py-6 sm:py-0 sm:px-2 flex flex-col items-center"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-blue-200 w-full h-[80dvh] sm:h-[85dvh] flex flex-col">
            {/* Header */}
            <div className="p-6 sm:p-1 pb-2 flex flex-col items-center">
              <img
                src="/maturahilfe_newLogo.svg"
                alt="Maturahilfe logo"
                className="w-[280px] h-auto mb-2 sm:mb-1 sm:w-[230px]"
              />
              {isMobile && (
                <img
                  ref={robotRef}
                  src="/robot2.png"
                  alt="robot"
                  className="w-20 h-auto absolute top-10 right-4"
                />
              )}
              <p className="text-lg text-gray-700 sm:text-base font-semibold text-center">
                {user && user?.firstName + " " + user?.lastName + ","} welcome
                to <span className="text-[#00A6F4]">Maturahilfe!</span>
              </p>
            </div>

            {/* Question buttons */}
            <div className="px-6 pt-4 pb-2 flex sm:flex-row justify-center gap-4 items-center">
              {INTRO_QA.map((q, i) => (
                <button
                  key={i}
                  onClick={() => askPredefined(i)}
                  className="bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-blue-200 px-5 py-3 sm:px-2 sm:py-1 rounded-xl text-sm text-gray-700 font-medium shadow-md transition"
                >
                  {q.question}
                </button>
              ))}
            </div>
            <div className="flex justify-center w-[90%] mt-2 h-[1px] bg-blue-200 mx-auto" />

            {/* Chat */}
            <div
              ref={scrollRef}
              className="flex-1 scrollbar-hide overflow-y-auto px-6 py-4 space-y-4 sm:space-y-2 sm:px-3 sm:py-2 transition-all duration-300 ease-in-out"
            >
              {messages.map((msg, i) =>
                msg.text === "__FEATURES__" ? (
                  <PlatformBattleBlock key={i} />
                ) : (
                  <ChatBubble
                    key={`msg-${i}`}
                    text={msg.text}
                    role={msg.role}
                  />
                )
              )}
              {typingText.length > 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow bg-gray-200 text-gray-900 flex items-center">
                    {typingText}
                    <motion.span
                      className="ml-1 w-[6px] h-[16px] bg-gray-500 rounded-sm animate-blink"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </div>
              )}
            </div>

            <ChatInput onSend={sendUserMessage} />
          </div>

          <button
            onClick={() => {
              onClose();
            }}
            className="mt-6 text-sm px-5 py-2 bg-white border border-blue-200 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </div>
  );
};
