import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const splashImgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!splashImgRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete,
    });

    tl.to(splashImgRef.current, {
      scale: 1.05,
      rotateZ: 8,
      filter: "drop-shadow(0 0 15px rgba(0,166,244,0.8))",
      duration: 1.4,
    });

    tl.to(splashImgRef.current, {
      scale: 2.6,
      rotateZ: 15,
      yPercent: -30,
      opacity: 0,
      filter: "blur(18px)",
      duration: 1.4,
    });
  }, [onComplete]);

  return (
    <motion.img
      ref={splashImgRef}
      src="/maturahilfe_newLogo.svg"
      alt="logo"
      className="w-[660px] h-[260px]"
    />
  );
};
