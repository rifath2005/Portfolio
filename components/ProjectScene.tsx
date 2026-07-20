"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  type: "flow" | "shatter" | "grid";
  isHovered: boolean;
}

function FlowScene({ isHovered }: { isHovered: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100;
  
  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      randoms[i] = Math.random();
    }
    return { positions, randoms };
  }, []);

  const accentColor = useMemo(() => {
    if (typeof window !== "undefined") {
      const rootStyle = getComputedStyle(document.documentElement);
      const accent = rootStyle.getPropertyValue("--accent").trim();
      if (accent) return new THREE.Color(accent);
    }
    return new THREE.Color("#38BDF8");
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uAccent: { value: accentColor },
  }), [accentColor]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.uTime.value = time;
    
    const targetHover = isHovered ? 1 : 0;
    uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.1;
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1 + uniforms.uHover.value * 0.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={count} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uHover;
          attribute float aRandom;
          void main() {
            vec3 pos = position;
            float angle = uTime * (0.2 + uHover * 2.0) + aRandom * 6.28;
            float radius = length(pos.xy);
            pos.x = cos(angle) * radius;
            pos.y = sin(angle) * radius;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (3.0 + uHover * 2.0) * (10.0 / -mvPosition.z);
          }
        `}
        fragmentShader={`
          uniform float uHover;
          uniform vec3 uAccent;
          void main() {
            vec2 uv = gl_PointCoord.xy - 0.5;
            if (length(uv) > 0.5) discard;
            vec3 color = mix(vec3(0.5), uAccent, uHover);
            gl_FragColor = vec4(color, 0.6 + uHover * 0.4);
          }
        `}
      />
    </points>
  );
}

function ShatterScene({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hoverVal, setHoverVal] = useState(0);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const targetHover = isHovered ? 1 : 0;
    setHoverVal(prev => prev + (targetHover - prev) * 0.1);
    
    meshRef.current.rotation.x += delta * (0.2 + hoverVal * 2);
    meshRef.current.rotation.y += delta * (0.3 + hoverVal * 2);
    
    if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
      meshRef.current.material.wireframe = hoverVal > 0.5;
      meshRef.current.material.opacity = 0.2 + hoverVal * 0.8;
      
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      const color = hoverVal > 0.5 ? accent || "#38BDF8" : "#ffffff";
      meshRef.current.material.color.set(color);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 0]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.2} wireframe={false} />
    </mesh>
  );
}

function GridScene({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoverVal, setHoverVal] = useState(0);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const targetHover = isHovered ? 1 : 0;
    setHoverVal(prev => prev + (targetHover - prev) * 0.1);
    
    groupRef.current.children.forEach((child, i) => {
      const originalY = (Math.floor(i / 5) - 2) * 1.5;
      const originalX = ((i % 5) - 2) * 1.5;
      
      const driftX = Math.sin(time + i) * 0.5;
      const driftY = Math.cos(time + i) * 0.5;
      
      child.position.x = originalX + driftX * (1 - hoverVal);
      child.position.y = originalY + driftY * (1 - hoverVal);
      
      if (child instanceof THREE.Mesh) {
        const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
        const color = hoverVal > 0.5 ? accent || "#38BDF8" : "#ffffff";
        if (child.material instanceof THREE.MeshBasicMaterial) {
          child.material.color.set(color);
          child.material.opacity = 0.3 + hoverVal * 0.5;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh key={i} position={[(i % 5 - 2) * 1.5, (Math.floor(i / 5) - 2) * 1.5, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} wireframe />
        </mesh>
      ))}
    </group>
  );
}

export default function ProjectScene({ type, isHovered }: Props) {
  const [inView, setInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 bg-transparent opacity-50 mix-blend-screen transition-opacity duration-700" style={{ opacity: isHovered ? 0.8 : 0.3 }}>
      <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 0, 8] }} dpr={[1, 2]}>
        {type === "flow" && <FlowScene isHovered={isHovered} />}
        {type === "shatter" && <ShatterScene isHovered={isHovered} />}
        {type === "grid" && <GridScene isHovered={isHovered} />}
      </Canvas>
    </div>
  );
}
