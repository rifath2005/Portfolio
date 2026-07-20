"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device supports hover (not touch)
    if (window.matchMedia("(hover: none)").matches) return;
    setIsVisible(true);
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Center initially
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power3" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-magnetic]")
      ) {
        if (!prefersReducedMotion) {
          gsap.to(ring, { scale: 3, borderColor: "var(--accent)", duration: 0.3 });
        } else {
          gsap.to(ring, { borderColor: "var(--accent)", duration: 0.3 });
        }
      } else {
        gsap.to(ring, { scale: 1, borderColor: "white", duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border-[1.5px] border-white mix-blend-difference will-change-transform"
      >
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1 w-1 rounded-full bg-white mix-blend-difference will-change-transform"
      />
    </>
  );
}
