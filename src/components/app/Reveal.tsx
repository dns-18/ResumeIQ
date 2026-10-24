import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before the animation starts. */
  delay?: number;
  /** Vertical travel distance in px (fade + slight rise). */
  y?: number;
  className?: string;
};

/**
 * GSAP entrance wrapper: fades children in with a slight rise the first time
 * they scroll into view (and immediately for anything already on screen).
 * Uses gsap.context so all tweens/ScrollTriggers are cleaned up on unmount.
 * Renders statically when the user prefers reduced motion.
 */
export const Reveal = ({ children, delay = 0, y = 24, className }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
