"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!barRef.current) return;
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
      }
    });
  });

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[100] pointer-events-none">
      <div ref={barRef} className="w-full h-full bg-accent scale-x-0 origin-left drop-shadow-[0_0_8px_var(--accent)]"></div>
    </div>
  );
}
