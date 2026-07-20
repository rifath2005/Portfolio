"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Props {
  text: string;
  className?: string;
}

export default function ScrollRevealText({ text, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const lines = containerRef.current?.querySelectorAll(".reveal-line");
    if (!lines) return;

    gsap.from(lines, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const lines = text.split("\n").filter(l => l.trim() !== "");

  return (
    <div ref={containerRef} className={`flex flex-col gap-2 ${className}`}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <p className="reveal-line">{line}</p>
        </div>
      ))}
    </div>
  );
}
