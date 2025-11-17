import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";

const roundContent = {
  "1": {
    image: "/robot.png",
    heading: "Runde 2",
    text: "Level 2 – Konzentration und Tempo sind gefragt!",
  },
  "2": {
    image: "/robot2.png",
    heading: "Runde 3",
    text: "Letzter Push. Du bist fast am Ziel.",
  },
  "3": {
    image: "/robot3.png",
    heading: "Runde 4",
    text: "Neue Herausforderung. Gib alles!",
  },
  "4": {
    image: "/robot.png",
    heading: "Runde 5",
    text: "Die letzte Stufe. Keine Fehler jetzt.",
  },
};

export default function CinematicPhotoIntro({ onStart, round }) {
  const [visible, setVisible] = useState<boolean>(true);

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);

  const content = roundContent[String(round)] ?? roundContent["1"];

  useEffect(() => {
    if (!visible) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      imageRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4 },
      "+=0.2"
    )
      .fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        "-=0.3"
      )
      .fromTo(
        paragraphRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        "-=0.2"
      )
      .fromTo(
        buttonRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(1.7)" },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, [visible]);

  useEffect(() => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: -5,
        rotation: 3,
        scale: 1.02,
        yoyo: true,
        repeat: -1,
        duration: 1.5,
        ease: "sine.inOut",
      });
    }
  }, []);

  const handleStart = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        setVisible(false);
        onStart();
      },
    });
  };

  return (
    <>
      {visible && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#bfdbfe] via-[#93c5fd] to-[#7dd3fc] text-white overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="bg-white/45 p-10 rounded-3xl justify-center items-center flex flex-col">
              <Image
                ref={imageRef}
                src={content.image}
                alt="mission"
                width={300}
                height={300}
                className={`transition-opacity duration-300 `}
                priority
              />
              <h1
                ref={headingRef}
                className="text-5xl sm:text-2xl font-extrabold mb-4 tracking-tight text-black drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {content.heading}
              </h1>
              <p
                ref={paragraphRef}
                className="text-xl mb-8 text-gray-700 max-w-2xl"
              >
                {content.text}
              </p>
              <button
                ref={buttonRef}
                onClick={handleStart}
                className="px-8 py-3 bg-white text-black rounded-full font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition"
              >
                Spiel starten 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
