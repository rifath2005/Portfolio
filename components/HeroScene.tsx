"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const particleCount = 800;

function Network() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const bulbRef = useRef(0); // 0 = off, 1 = on

  const { positions, randoms, lineIndices } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      randoms[i] = Math.random();
    }

    const indices = [];
    const maxDist = 2.0;
    const maxDistSq = maxDist * maxDist;
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < maxDistSq) {
          indices.push(i, j);
        }
      }
    }
    
    return { positions, randoms, lineIndices: new Uint16Array(indices) };
  }, []);

  const pointUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uBulbOn: { value: 0.0 },
    uAccent: { value: new THREE.Color("#38BDF8") },
  }), []);

  const lineUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uBulbOn: { value: 0.0 },
    uAccent: { value: new THREE.Color("#38BDF8") },
  }), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const handleBulbToggle = (e: any) => {
      bulbRef.current = e.detail.isOn ? 1 : 0;
    };
    window.addEventListener("bulbToggle", handleBulbToggle);
    
    // Read the accent variable from root
    if (typeof window !== "undefined") {
      const rootStyle = getComputedStyle(document.documentElement);
      const accent = rootStyle.getPropertyValue("--accent").trim();
      if (accent) {
        const color = new THREE.Color(accent);
        pointUniforms.uAccent.value = color;
        lineUniforms.uAccent.value = color;
      }
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("bulbToggle", handleBulbToggle);
    };
  }, [pointUniforms, lineUniforms]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pointUniforms.uTime.value = time;
    lineUniforms.uTime.value = time;
    
    // Smooth lerp mouse and bulb
    pointUniforms.uMouse.value.lerp(mouseRef.current, 0.05);
    lineUniforms.uMouse.value.lerp(mouseRef.current, 0.05);
    
    pointUniforms.uBulbOn.value += (bulbRef.current - pointUniforms.uBulbOn.value) * 0.05;
    lineUniforms.uBulbOn.value += (bulbRef.current - lineUniforms.uBulbOn.value) * 0.05;
    
    if (pointsRef.current) pointsRef.current.rotation.y = time * 0.05;
    if (linesRef.current) linesRef.current.rotation.y = time * 0.05;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aRandom" count={particleCount} array={randoms} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={pointUniforms}
          vertexShader={`
            uniform float uTime;
            uniform vec2 uMouse;
            attribute float aRandom;
            varying float vDist;
            
            void main() {
              vec3 pos = position;
              pos.y += sin(uTime * 0.5 + aRandom * 6.28) * 0.3;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              
              vec3 ndcPos = gl_Position.xyz / gl_Position.w;
              float dist = distance(ndcPos.xy, uMouse);
              vDist = dist;
              
              float size = (1.0 - smoothstep(0.0, 0.3, dist)) * 20.0 + 8.0;
              gl_PointSize = size * (10.0 / -mvPosition.z);
            }
          `}
          fragmentShader={`
            uniform float uBulbOn;
            uniform vec3 uAccent;
            varying float vDist;
            
            void main() {
              vec2 uv = gl_PointCoord.xy - 0.5;
              float len = length(uv);
              if (len > 0.5) discard;
              
              float alpha = (0.5 - len) * 2.0;
              alpha *= 0.5;
              
              float hover = 1.0 - smoothstep(0.0, 0.3, vDist);
              vec3 baseColor = mix(vec3(0.5), uAccent, uBulbOn);
              vec3 color = mix(baseColor, uAccent, hover);
              
              gl_FragColor = vec4(color, alpha + hover * 0.5);
            }
          `}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aRandom" count={particleCount} array={randoms} itemSize={1} />
          <bufferAttribute attach="index" array={lineIndices} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={lineUniforms}
          vertexShader={`
            uniform float uTime;
            uniform vec2 uMouse;
            attribute float aRandom;
            varying float vDist;
            
            void main() {
              vec3 pos = position;
              pos.y += sin(uTime * 0.5 + aRandom * 6.28) * 0.3;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              
              vec3 ndcPos = gl_Position.xyz / gl_Position.w;
              vDist = distance(ndcPos.xy, uMouse);
            }
          `}
          fragmentShader={`
            uniform float uBulbOn;
            uniform vec3 uAccent;
            varying float vDist;
            
            void main() {
              float hover = 1.0 - smoothstep(0.0, 0.3, vDist);
              vec3 baseColor = mix(vec3(0.2), uAccent, uBulbOn);
              vec3 color = mix(baseColor, uAccent, hover);
              float alpha = 0.15 + hover * 0.5;
              gl_FragColor = vec4(color, alpha);
            }
          `}
        />
      </lineSegments>
    </group>
  );
}

export default function HeroScene() {
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
    <div ref={containerRef} className="absolute inset-0 -z-10 bg-transparent">
      <Canvas frameloop={inView ? "always" : "demand"} dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
        <Network />
      </Canvas>
    </div>
  );
}
