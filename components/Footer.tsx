"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!footerRef.current) return;
    gsap.from(footerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      }
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative bg-bg py-24 px-8 md:px-[10%] border-t border-white/10" id="contact">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
        
        <div className="flex-1">
          <h2 className="text-sm font-mono tracking-widest text-accent mb-8">CHAPTER 05 — CONTACT</h2>
          <h3 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8">
            Let's build<br />something.
          </h3>
          <p className="text-fg-muted text-lg max-w-md">
            Available for new opportunities. Reach out if you want to collaborate on AI systems, scalable infrastructure, or digital experiences.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-80">
          <Magnetic as="a" href="mailto:syedrifathm@gmail.com" className="group flex items-center justify-between p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-accent hover:bg-accent/10 transition-all cursor-pointer">
            <span className="text-xl font-medium tracking-wide">Email</span>
            <span className="text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform font-mono">↗</span>
          </Magnetic>
          
          <Magnetic as="a" href="https://www.linkedin.com/in/syedrifathm/" target="_blank" className="group flex items-center justify-between p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-accent hover:bg-accent/10 transition-all cursor-pointer">
            <span className="text-xl font-medium tracking-wide">LinkedIn</span>
            <span className="text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform font-mono">↗</span>
          </Magnetic>
          
          <Magnetic as="a" href="https://github.com/rifath2005" target="_blank" className="group flex items-center justify-between p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-accent hover:bg-accent/10 transition-all cursor-pointer">
            <span className="text-xl font-medium tracking-wide">GitHub</span>
            <span className="text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform font-mono">↗</span>
          </Magnetic>
        </div>
        
      </div>
      
      <div className="max-w-6xl mx-auto mt-32 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-fg-muted text-sm font-mono">
        <p>© {new Date().getFullYear()} Rifath M. All rights reserved.</p>
        <p>Engineered with Next.js, R3F & GSAP.</p>
      </div>
    </footer>
  );
}
