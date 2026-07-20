"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import AnimatedCounter from "./AnimatedCounter";
import ProjectScene from "./ProjectScene";
import ArchitectureViz, { ArchNode, ArchConnection } from "./ArchitectureViz";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

interface Project {
  title: string;
  subtitle: string;
  tags: string[];
  metrics: { value: number; prefix?: string; suffix?: string; label: string }[];
  type: "flow" | "shatter" | "grid";
  problem?: string;
  approach?: string;
  outcome?: string;
  architecture?: {
    nodes: ArchNode[];
    connections: ArchConnection[];
  };
}

export default function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.State | null>(null);

  const toggleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!cardRef.current) return;
    
    flipState.current = Flip.getState(cardRef.current);
    setIsExpanded(!isExpanded);
  };

  useLayoutEffect(() => {
    if (!flipState.current || !cardRef.current) return;
    
    document.body.style.overflow = isExpanded ? "hidden" : "auto";
    
    Flip.from(flipState.current, {
      duration: 0.8,
      ease: "expo.inOut",
      absolute: true,
      zIndex: 50
    });
    
    flipState.current = null;
  }, [isExpanded]);

  useGSAP(() => {
    const card = cardRef.current;
    const bg = bgRef.current;
    if (!card || !bg) return;
    
    // Parallax background on hover
    const xTo = gsap.quickTo(bg, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(bg, "y", { duration: 0.5, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (isExpanded) return; // Disable parallax when expanded
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 2;
      const y = ((e.clientY - top) / height - 0.5) * 2;
      
      xTo(-x * 20);
      yTo(-y * 20);
    };

    const handleMouseLeave = () => {
      if (isExpanded) return;
      setIsHovered(false);
      xTo(0);
      yTo(0);
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mouseenter", () => !isExpanded && setIsHovered(true));

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mouseenter", () => !isExpanded && setIsHovered(true));
    };
  }, [isExpanded]);

  return (
    <div className="relative w-full aspect-square md:aspect-[21/9] mb-12 last:mb-0">
      {/* The Flipping Card */}
      <div 
        ref={cardRef} 
        onClick={() => !isExpanded && toggleExpand()}
        className={`overflow-hidden group bg-bg-alt transition-colors duration-500
          ${isExpanded ? "fixed inset-0 z-50 rounded-none cursor-default m-0 w-full h-full" : "relative w-full h-full rounded-2xl cursor-pointer border border-white/10 hover:border-white/30"}
        `}
      >
        <div 
          ref={bgRef}
          className={`absolute inset-0 transition-transform duration-700 ease-out ${isExpanded ? 'scale-100' : 'scale-105 group-hover:scale-[1.1]'}`}
        >
          <ProjectScene type={project.type} isHovered={isHovered || isExpanded} />
          <div className={`absolute inset-0 transition-opacity duration-1000 ${isExpanded ? 'bg-bg-alt/90' : 'bg-gradient-to-t from-bg-alt via-bg-alt/50 to-transparent'}`}></div>
        </div>

        {/* Close Button */}
        {isExpanded && (
          <button 
            onClick={toggleExpand}
            className="absolute top-8 right-8 z-50 text-fg-muted hover:text-white text-sm font-mono tracking-widest uppercase cursor-pointer"
          >
            [ Close ]
          </button>
        )}

        {/* Collapsed View */}
        <div className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-end pointer-events-none transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100 delay-300'}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <div className="flex-1 max-w-2xl">
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{project.title}</h3>
              <p className="text-lg md:text-xl text-fg-muted mb-6">{project.subtitle}</p>
              
              <div className="flex flex-wrap gap-2 mb-6 md:mb-0">
                {project.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono tracking-wide backdrop-blur-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out delay-100">
              {project.metrics.map((metric, i) => (
                <AnimatedCounter 
                  key={i}
                  value={metric.value} 
                  prefix={metric.prefix} 
                  suffix={metric.suffix} 
                  label={metric.label} 
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className={`absolute bottom-0 left-0 h-1 bg-accent transition-all duration-700 ease-out ${isExpanded ? 'w-full opacity-30' : 'w-0 group-hover:w-full'}`}></div>

        {/* Expanded View Content */}
        <div className={`absolute inset-0 p-8 md:p-[10%] pt-32 overflow-y-auto transition-opacity duration-500 delay-300 ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none hidden'}`}>
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-16">{project.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16 md:gap-32">
              <div className="space-y-16">
                {project.problem && (
                  <section>
                    <h4 className="text-accent mb-4 uppercase tracking-widest text-sm font-mono">The Problem</h4>
                    <p className="text-fg-muted text-xl leading-relaxed">{project.problem}</p>
                  </section>
                )}
                {project.approach && (
                  <section>
                    <h4 className="text-accent mb-4 uppercase tracking-widest text-sm font-mono">The Approach</h4>
                    <p className="text-fg-muted text-xl leading-relaxed">{project.approach}</p>
                  </section>
                )}
                {project.outcome && (
                  <section>
                    <h4 className="text-accent mb-4 uppercase tracking-widest text-sm font-mono">The Outcome</h4>
                    <p className="text-fg-muted text-xl leading-relaxed">{project.outcome}</p>
                  </section>
                )}
                {project.architecture && (
                  <section className="pt-8">
                    <h4 className="text-accent mb-6 uppercase tracking-widest text-sm font-mono">System Architecture</h4>
                    <div className="w-full aspect-[4/3] max-h-[450px]">
                      <ArchitectureViz nodes={project.architecture.nodes} connections={project.architecture.connections} />
                    </div>
                  </section>
                )}
              </div>
              
              <div className="space-y-16">
                <div>
                  <h4 className="text-accent mb-6 uppercase tracking-widest text-sm font-mono">Impact</h4>
                  <div className="flex flex-col gap-8">
                    {project.metrics.map((metric, i) => (
                      <AnimatedCounter 
                        key={i}
                        value={metric.value} 
                        prefix={metric.prefix} 
                        suffix={metric.suffix} 
                        label={metric.label} 
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-accent mb-6 uppercase tracking-widest text-sm font-mono">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-mono tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
