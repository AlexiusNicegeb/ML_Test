import gsap from "gsap";

export const animateRobot = (target: HTMLElement) => {
  const tl = gsap.timeline({ repeat: -1 });

  tl.to(target, {
    y: -15,
    rotate: -10,
    duration: 0.7,
    ease: "power1.out",
  })
    .to(target, {
      y: 0,
      rotate: 0,
      duration: 0.7,
      ease: "bounce.out",
    })
    .to(target, {
      y: -15,
      rotate: 10,
      duration: 0.7,
      ease: "power1.out",
    })
    .to(target, {
      y: 0,
      rotate: 0,
      duration: 0.7,
      ease: "bounce.out",
    });

  return tl;
};
