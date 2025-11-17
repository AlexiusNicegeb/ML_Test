import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import gsap from "gsap";
type Props = {
  show: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  imageSrc?: string;
  buttonText?: string;
  confettiOnMount?: boolean;
  customContent?: React.ReactNode;
};

const VictoryModal: React.FC<Props> = ({
  show,
  onClose,
  title = "🎉 Super gemacht!",
  description = "Du hast gezeigt, was du drauf hast. Weiter so!",
  imageSrc = "/robot3.png",
  buttonText = "Noch ein Spiel",
  confettiOnMount = true,
  customContent,
}) => {
  useEffect(() => {
    if (show && confettiOnMount) {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [show, confettiOnMount, onClose]);

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (show && imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-gradient-to-br from-green-200 via-green-100 to-white text-green-800 border border-green-300 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        <h2 className="text-3xl font-black mb-3">{title}</h2>
        <p className="text-base mb-4">{description}</p>

        {imageSrc && (
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Victory"
            className="h-40 mx-auto mb-4 animate-fadeInUp"
          />
        )}

        {customContent}

        <button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold py-2 px-6 rounded-full shadow hover:scale-105 transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default VictoryModal;
