"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SectionDivider() {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!lineRef.current) return;
    gsap.from(lineRef.current, {
      scaleX: 0,
      transformOrigin: "left",
      ease: "power3.out",
      duration: 1.5,
      scrollTrigger: {
        trigger: lineRef.current,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });
  });

  return (
    <div className="w-full">
      <div className="w-full h-[1px] bg-white/5">
        <div ref={lineRef} className="w-full h-full bg-accent opacity-50 origin-left"></div>
      </div>
    </div>
  );
}
