"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const experiences = [
  {
    date: "2024",
    role: "Software Development Intern",
    company: "Marcello Tech",
    description: "Worked extensively with Node.js to build backend systems. Gained hands-on experience in modern web technologies and software development practices."
  },
  {
    date: "2023 - Present",
    role: "B.Tech IT Student",
    company: "Rathinam Technical Campus",
    description: "Specializing in software engineering, AI, and modern web development."
  }
];

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(lineRef.current, {
      scaleY: 0,
      transformOrigin: "top",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 80%",
        scrub: true,
      }
    });

    const entries = containerRef.current?.querySelectorAll(".timeline-entry");
    if (entries) {
      entries.forEach((entry, i) => {
        gsap.from(entry, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: entry,
            start: "top 85%",
            toggleActions: "play none none none",
          }
        });
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative py-24 max-w-4xl mx-auto">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2">
        <div ref={lineRef} className="w-full h-full bg-accent"></div>
      </div>

      <div className="flex flex-col gap-16 md:gap-24">
        {experiences.map((exp, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={i} className={`timeline-entry relative flex flex-col md:flex-row items-start ${isLeft ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute left-4 md:left-1/2 top-1.5 w-3 h-3 rounded-full bg-accent -translate-x-1/2 shadow-[0_0_10px_var(--accent)] z-10"></div>
              
              <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <span className="text-accent font-mono text-sm tracking-widest">{exp.date}</span>
                <h3 className="text-xl md:text-2xl font-bold mt-2">{exp.role}</h3>
                <h4 className="text-fg-muted font-medium mt-1">{exp.company}</h4>
                <p className="mt-4 text-fg-muted/80 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
