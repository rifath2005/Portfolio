"use client";

import { ReactNode, useEffect } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
}

export function Providers({ children }: { children: ReactNode }) {
  // Lenis uses requestAnimationFrame, ReactLenis root does everything for us
  return <ReactLenis root>{children}</ReactLenis>;
}
