"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Sphere, Icosahedron, Box, Line } from "@react-three/drei";
import * as THREE from "three";

export interface ArchNode {
  id: string;
  position: [number, number, number];
  label: string;
  metric?: string;
  shape?: "sphere" | "icosahedron" | "box";
}

export interface ArchConnection {
  source: string;
  target: string;
  curveHeight?: number; // How high the curve arcs
}

interface Props {
  nodes: ArchNode[];
  connections: ArchConnection[];
}

function NodeMesh({ node, isHovered, onHover }: { node: ArchNode; isHovered: boolean; onHover: (id: string | null) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Read CSS accent variable
  const accentColor = useMemo(() => {
    if (typeof window !== "undefined") {
      const rootStyle = getComputedStyle(document.documentElement);
      const accent = rootStyle.getPropertyValue("--accent").trim();
      return accent || "#38BDF8";
    }
    return "#38BDF8";
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (node.shape === "icosahedron" || node.shape === "box") {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    
    // Smooth color transition
    const targetColor = new THREE.Color(isHovered ? accentColor : "#666666");
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.lerp(targetColor, 0.1);
      meshRef.current.material.emissive.lerp(
        new THREE.Color(isHovered ? accentColor : "#000000"),
        0.1
      );
      meshRef.current.material.emissiveIntensity = isHovered ? 0.5 : 0;
    }
  });

  const Geometry = node.shape === "icosahedron" ? Icosahedron : node.shape === "box" ? Box : Sphere;

  return (
    <group position={node.position}>
      <Geometry 
        ref={meshRef} 
        args={node.shape === "box" ? [0.6, 0.6, 0.6] : [0.4, 16, 16]}
        onPointerOver={() => onHover(node.id)}
        onPointerOut={() => onHover(null)}
      >
        <meshStandardMaterial color="#666666" roughness={0.2} metalness={0.8} />
      </Geometry>
      
      {/* HTML Tooltip strictly rendered via drei to follow 3D position */}
      {isHovered && (
        <Html center position={[0, -0.8, 0]} className="pointer-events-none whitespace-nowrap">
          <div className="bg-bg-alt/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide shadow-xl">
            <span className="text-white">{node.label}</span>
            {node.metric && (
              <>
                <span className="mx-2 text-white/30">|</span>
                <span className="text-accent">{node.metric}</span>
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function ConnectionLine({ source, target, curveHeight = 1 }: { source: ArchNode; target: ArchNode; curveHeight?: number }) {
  const lineRef = useRef<any>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  
  const accentColor = useMemo(() => {
    if (typeof window !== "undefined") {
      const rootStyle = getComputedStyle(document.documentElement);
      return rootStyle.getPropertyValue("--accent").trim() || "#38BDF8";
    }
    return "#38BDF8";
  }, []);

  // Compute curved path
  const curve = useMemo(() => {
    const v1 = new THREE.Vector3(...source.position);
    const v2 = new THREE.Vector3(...target.position);
    const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    mid.y += curveHeight; // Arc upwards/downwards
    
    return new THREE.QuadraticBezierCurve3(v1, mid, v2);
  }, [source, target, curveHeight]);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  useFrame((state) => {
    if (!particleRef.current) return;
    // Animate a particle moving along the curve
    const time = state.clock.getElapsedTime();
    const t = (time * 0.4) % 1; // loop from 0 to 1
    
    const position = curve.getPoint(t);
    particleRef.current.position.copy(position);
  });

  return (
    <group>
      {/* Background track line */}
      <Line 
        ref={lineRef}
        points={points}
        color="#333333"
        lineWidth={1.5}
        transparent
        opacity={0.5}
      />
      {/* Traveling glowing pulse */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
    </group>
  );
}

export default function ArchitectureViz({ nodes, connections }: Props) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
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
    <div ref={containerRef} className="w-full h-full min-h-[400px] bg-black/20 rounded-xl border border-white/5 overflow-hidden">
      <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 2, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        {/* Render connections */}
        {connections.map((conn, i) => {
          const source = nodes.find(n => n.id === conn.source);
          const target = nodes.find(n => n.id === conn.target);
          if (!source || !target) return null;
          return <ConnectionLine key={i} source={source} target={target} curveHeight={conn.curveHeight} />;
        })}

        {/* Render nodes */}
        {nodes.map(node => (
          <NodeMesh 
            key={node.id} 
            node={node} 
            isHovered={hoveredNode === node.id}
            onHover={setHoveredNode} 
          />
        ))}

        {/* Limited orbit controls so user doesn't get lost */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={false}
          minAzimuthAngle={-Math.PI / 4} // limit left rotation
          maxAzimuthAngle={Math.PI / 4}  // limit right rotation
          minPolarAngle={Math.PI / 3}    // limit up rotation
          maxPolarAngle={Math.PI / 2}    // limit down rotation
        />
      </Canvas>
    </div>
  );
}
