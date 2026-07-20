"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export default function AnimatedCounter({ value, prefix = "", suffix = "", label }: Props) {
  const countRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!countRef.current) return;
    
    const counter = { val: 0 };
    
    gsap.to(counter, {
      val: value,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.innerText = Math.round(counter.val).toString();
        }
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col">
      <div className="text-3xl md:text-5xl font-bold text-accent tracking-tighter">
        {prefix}<span ref={countRef}>0</span>{suffix}
      </div>
      <div className="text-xs md:text-sm font-mono tracking-widest text-fg-muted uppercase mt-2">
        {label}
      </div>
    </div>
  );
}
