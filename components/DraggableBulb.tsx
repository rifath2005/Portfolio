"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function DraggableBulb() {
  const bulbRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<SVGPathElement>(null);
  
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const bulb = bulbRef.current;
    if (!bulb) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // QuickTo for spring physics
    const xTo = gsap.quickTo(bulb, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(bulb, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const rotTo = gsap.quickTo(bulb, "rotation", { duration: 0.8, ease: "elastic.out(1, 0.4)" });

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      bulb.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      let x = e.clientX - startX;
      let y = e.clientY - startY;
      
      // Constrain movement (can only pull down a certain amount)
      y = Math.max(0, Math.min(y, 100));
      // Constrain x movement for the pendulum swing
      x = Math.max(-100, Math.min(x, 100));
      
      currentX = x;
      currentY = y;
      
      xTo(currentX);
      yTo(currentY);
      rotTo(currentX * -0.2); // Swing angle based on horizontal drag
      
      // Update rope: Quadratic bezier from top (2,0) to bulb center
      if (ropeRef.current) {
        ropeRef.current.setAttribute("d", `M 2 0 Q ${2 + currentX * 0.5} ${50 + currentY/2} ${2 + currentX} ${100 + currentY}`);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      
      // If pulled down far enough, toggle
      if (currentY > 60) {
        const newState = !isOn;
        setIsOn(newState);
        window.dispatchEvent(new CustomEvent("bulbToggle", { detail: { isOn: newState } }));
      }
      
      currentX = 0;
      currentY = 0;
      xTo(0);
      yTo(0);
      rotTo(0);
      
      // Animate rope back to rest
      if (ropeRef.current) {
        gsap.to(ropeRef.current, {
          attr: { d: "M 2 0 Q 2 50 2 100" },
          duration: 0.8,
          ease: "elastic.out(1, 0.4)"
        });
      }
      
      bulb.releasePointerCapture(e.pointerId);
    };

    bulb.addEventListener("pointerdown", handlePointerDown);
    bulb.addEventListener("pointermove", handlePointerMove);
    bulb.addEventListener("pointerup", handlePointerUp);

    return () => {
      bulb.removeEventListener("pointerdown", handlePointerDown);
      bulb.removeEventListener("pointermove", handlePointerMove);
      bulb.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isOn]);

  return (
    <div className="absolute right-[10%] top-0 z-50 flex flex-col items-center select-none">
      <svg className="w-1 h-[150px] overflow-visible" viewBox="0 0 4 100">
        <path ref={ropeRef} d="M 2 0 Q 2 50 2 100" stroke="#444" strokeWidth="2" fill="none" />
      </svg>
      <div 
        ref={bulbRef} 
        className="relative -mt-2 cursor-grab active:cursor-grabbing p-4 group"
        style={{ touchAction: "none", transformOrigin: "top center" }}
      >
        <div className={`w-12 h-16 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${isOn ? 'border-accent bg-accent/20 shadow-[0_0_30px_var(--accent)]' : 'border-white/30 bg-black/50 group-hover:border-white/50'}`}>
          <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isOn ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-white/20'}`}></div>
        </div>
      </div>
    </div>
  );
}
