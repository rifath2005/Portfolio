"use client";

import { useEffect, useRef, useState } from "react";
import Magnetic from "./Magnetic";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > window.innerHeight * 0.5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out px-8 md:px-[10%] flex items-center justify-between ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } ${
        isScrolled ? "bg-bg/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-8"
      }`}
    >
      <Magnetic as="a" href="#" className="font-bold tracking-widest text-lg">
        RIFATH M
      </Magnetic>
      
      <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest">
        <Magnetic as="a" href="#about" className="hover:text-accent transition-colors">ABOUT</Magnetic>
        <Magnetic as="a" href="#experience" className="hover:text-accent transition-colors">EXPERIENCE</Magnetic>
        <Magnetic as="a" href="#works" className="hover:text-accent transition-colors">WORKS</Magnetic>
      </div>
      
      <Magnetic as="a" href="#contact" className="text-sm font-medium border border-white/20 px-6 py-2 rounded-full hover:border-accent hover:text-accent transition-colors">
        CONNECT ↗
      </Magnetic>
    </nav>
  );
}
