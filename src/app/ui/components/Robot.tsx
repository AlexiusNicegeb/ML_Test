"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export const Robot = ({
  loading = true,
  text,
}: {
  loading?: boolean;
  text?: string;
}) => {
  const robotRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!loading && text && textRef.current) {
      gsap.killTweensOf(textRef.current);
      gsap.killTweensOf(robotRef.current);
      textRef.current.textContent = text;
      return;
    }

    if (loading) {
      if (robotRef.current) {
        gsap.to(robotRef.current, {
          scale: 1.1,
          rotate: 5,
          y: -15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 1.1,
        });
      }

      const texts = [
        "🧠 Gehirn wird hochgefahren...",
        "⚡ Intelligenz-Upgrade läuft...",
        "👾 Wissen wird geladen...",
        "🚨 Kognition in Vorbereitung...",
        "🤖 Schulmodus aktiviert...",
      ];

      if (textRef.current) {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
        texts.forEach((text) => {
          tl.to(textRef.current, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              if (textRef.current) textRef.current.textContent = text;
            },
          });
          tl.to(textRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          });
        });
      }
    }
  }, [loading, text]);

  return (
    <div className="fixed inset-0 z-[9999] w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-[#dbeafe] via-[#c7e4fd] to-[#93c5fd]  font-mono overflow-hidden">
      <motion.div
        className="absolute w-[500px] h-[500px] sm:w-[300px] sm:h-[300px] rounded-full bg-gradient-to-tr from-[#93c5fd] to-[#7dd3fc]  blur-[120px] animate-pulse"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.img
        ref={robotRef}
        src="/loadingRobot.png"
        alt="Neural Bot"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-[380px] sm:w-[290px] h-auto z-10 drop-shadow-[0_0_50px_cyan]"
      />

      <motion.div
        ref={textRef}
        className="text-2xl sm:text-lg font-bold mt-10 z-10 tracking-widest drop-shadow-[0_0_20px_cyan]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        Loading...
      </motion.div>

      <motion.div
        className="absolute w-full h-full top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_98%,rgba(0,255,255,0.1)_100%)] animate-glitch-lines" />
      </motion.div>
    </div>
  );
};
