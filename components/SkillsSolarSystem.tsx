"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

const skillCategories = [
  {
    name: "AI & ML",
    color: "#38BDF8",
    radius: 4,
    speed: 0.2,
    items: ["NLP", "FastAPI", "Python", "MCP", "RAG"]
  },
  {
    name: "Backend",
    color: "#a78bfa",
    radius: 7,
    speed: 0.15,
    items: ["Node.js", "SQL", "REST APIs", "C++"]
  },
  {
    name: "Frontend",
    color: "#34d399",
    radius: 10,
    speed: 0.1,
    items: ["React", "Next.js", "Tailwind", "Three.js", "GSAP"]
  }
];

function OrbitRing({ radius, color }: { radius: number, color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SkillPlanet({ item, radius, angle, speed, color }: any) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const currentAngle = angle + time * speed;
    groupRef.current.position.x = Math.cos(currentAngle) * radius;
    groupRef.current.position.z = Math.sin(currentAngle) * radius;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Html distanceFactor={15} center position={[0, -0.6, 0]}>
        <div className="text-xs font-mono px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded text-white whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity cursor-default pointer-events-auto">
          {item}
        </div>
      </Html>
    </group>
  );
}

function SolarSystem() {
  const centralGroup = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (centralGroup.current) {
      centralGroup.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={centralGroup} rotation={[0.2, 0, 0]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
      
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} wireframe />
        <Html center position={[0, 0, 0]}>
          <div className="text-sm font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">CORE</div>
        </Html>
      </mesh>

      {skillCategories.map((cat) => (
        <group key={cat.name}>
          <OrbitRing radius={cat.radius} color={cat.color} />
          {cat.items.map((item, j) => {
            const angle = (j / cat.items.length) * Math.PI * 2;
            return (
              <SkillPlanet 
                key={item} 
                item={item} 
                radius={cat.radius} 
                angle={angle} 
                speed={cat.speed} 
                color={cat.color} 
              />
            );
          })}
        </group>
      ))}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

export default function SkillsSolarSystem() {
  return (
    <div className="w-full h-[600px] md:h-[800px] rounded-3xl overflow-hidden border border-white/5 bg-black relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] z-10"></div>
      <Canvas camera={{ position: [0, 8, 20], fov: 45 }} dpr={[1, 2]}>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.5}
        />
        <SolarSystem />
      </Canvas>
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <p className="text-fg-muted font-mono text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full inline-block"></span>
          Drag to explore ecosystem
        </p>
      </div>
    </div>
  );
}
