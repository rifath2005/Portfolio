"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";

export default function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const chars = containerRef.current?.querySelectorAll(".char");
    if (!chars) return;
    
    gsap.from(chars, {
      y: 120,
      rotationZ: 10,
      opacity: 0,
      stagger: 0.05,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.2, // simulate loader finish
    });

    gsap.from(".hero-sub", {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
      delay: 0.8,
    });
  }, { scope: containerRef });

  const text = "AI ENGINEER".split("");
  const text2 = "& FULL STACK".split("");

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col justify-center h-screen px-8 md:px-[10%]">
      <div className="text-xs font-mono tracking-widest text-fg-muted mb-6 hero-sub uppercase">
        <span className="w-2 h-2 inline-block bg-accent rounded-full mr-3 animate-pulse"></span>
        Available for roles
      </div>
      
      <h1 className="text-h2 md:text-h1 font-bold leading-[0.85] tracking-tighter">
        <div className="overflow-hidden flex">
          {text.map((char, i) => (
            <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
          ))}
        </div>
        <div className="overflow-hidden flex text-fg-muted">
          {text2.map((char, i) => (
            <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
          ))}
        </div>
      </h1>
      
      <p className="hero-sub mt-8 max-w-xl text-lg text-fg-muted font-medium">
        Building intelligent systems from model to production.
        Engineered in India, scalable globally.
      </p>
      
      <div className="hero-sub mt-12 flex flex-wrap gap-6">
        <Magnetic as="a" href="#works" className="inline-flex rounded-full bg-fg text-bg px-8 py-4 font-medium hover:bg-accent hover:text-white transition-colors cursor-pointer">
          Explore Works
        </Magnetic>
        <Magnetic as="a" href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 font-medium hover:border-accent hover:text-accent transition-colors cursor-pointer">
          Initiate Connection ↗
        </Magnetic>
      </div>
    </div>
  );
}
