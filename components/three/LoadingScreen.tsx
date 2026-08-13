// 'use client';
"use client";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL Context creation failed, continuing loading sequence with CSS fallback:', err);
    }

    // Particle system
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const t = Math.random();
      colors[i * 3]     = t < 0.5 ? 0.0  : 0.48; // R
      colors[i * 3 + 1] = t < 0.5 ? 0.83 : 0.33; // G
      colors[i * 3 + 2] = t < 0.5 ? 1.0  : 0.93; // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    camera.position.z = 8;

    // Progress simulation
    let prog = 0;
    const progInterval = setInterval(() => {
      prog += Math.random() * 4;
      if (prog > 100) prog = 100;
      setProgress(Math.floor(prog));
    }, 60);

    let frame: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      particles.rotation.x = t * 0.04;
      particles.rotation.y = t * 0.06;
      ico.rotation.x = t * 0.3;
      ico.rotation.y = t * 0.5;

      if (renderer) renderer.render(scene, camera);
    };
    if (renderer) animate();

    const timer = setTimeout(() => {
      clearInterval(progInterval);
      setProgress(100);
      setFadeOut(true);
      setTimeout(onComplete, 600);
    }, 2400);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      if (renderer) renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      clearInterval(progInterval);
      cancelAnimationFrame(frame);
      if (renderer) {
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#050508] flex flex-col items-center justify-center transition-opacity duration-600"
      style={{ opacity: fadeOut ? 0 : 1, pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      <div ref={mountRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Name */}
        <div className="flex gap-1">
          {'PULKIT'.split('').map((char, i) => (
            <span
              key={i}
              className="text-5xl md:text-7xl font-black tracking-[0.3em] text-white"
              style={{
                fontFamily: "'Courier New', monospace",
                animation: `fadeIn 0.1s ease-out ${i * 0.08}s both`,
                textShadow: '0 0 30px rgba(0, 212, 255, 0.8)',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <p className="text-[#00d4ff] text-sm tracking-[0.5em] uppercase opacity-70">
          Portfolio Loading
        </p>

        {/* Progress bar */}
        <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
              boxShadow: '0 0 10px #00d4ff80',
            }}
          />
        </div>

        <span className="text-white/30 text-xs font-mono">{progress}%</span>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}
