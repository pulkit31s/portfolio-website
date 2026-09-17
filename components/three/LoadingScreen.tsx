'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let frameId: number;
    let renderer: any = null;
    let progInterval: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    // Fast progress simulation
    let prog = 0;
    progInterval = setInterval(() => {
      prog += Math.random() * 6 + 3;
      if (prog >= 100) {
        prog = 100;
        clearInterval(progInterval);
      }
      if (isMounted) setProgress(Math.floor(prog));
    }, 50);

    // Guaranteed finish transition after ~1.8s
    completeTimer = setTimeout(() => {
      if (isMounted) {
        setProgress(100);
        setFadeOut(true);
      }
      setTimeout(() => {
        if (isMounted) onComplete();
      }, 500);
    }, 1800);

    // Asynchronously initialize Three.js particles
    const initThree = async () => {
      const el = mountRef.current;
      if (!el || !isMounted) return;

      try {
        const THREE = await import('three');
        if (!isMounted || !el) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          el.appendChild(renderer.domElement);
        } catch {
          // WebGL unavailable, CSS fallback continues
          return;
        }

        // Particles
        const geometry = new THREE.BufferGeometry();
        const count = 1200;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          positions[i * 3]     = (Math.random() - 0.5) * 30;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

          const t = Math.random();
          colors[i * 3]     = t < 0.5 ? 0.0  : 0.48;
          colors[i * 3 + 1] = t < 0.5 ? 0.83 : 0.33;
          colors[i * 3 + 2] = t < 0.5 ? 1.0  : 0.93;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: 0.06,
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
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
        const clock = new THREE.Clock();

        const animate = () => {
          if (!isMounted) return;
          frameId = requestAnimationFrame(animate);
          const t = clock.getElapsedTime();

          particles.rotation.x = t * 0.04;
          particles.rotation.y = t * 0.06;
          ico.rotation.x = t * 0.3;
          ico.rotation.y = t * 0.5;

          if (renderer) renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
          if (!renderer) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (e) {
        console.warn('Three.js initialization skipped during loading:', e);
      }
    };

    initThree();

    return () => {
      isMounted = false;
      clearInterval(progInterval);
      clearTimeout(completeTimer);
      if (frameId) cancelAnimationFrame(frameId);
      if (renderer && renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#050508] flex flex-col items-center justify-center transition-opacity duration-500 ease-out"
      style={{ opacity: fadeOut ? 0 : 1, pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      <div ref={mountRef} className="absolute inset-0" />

      {/* Cyberpunk subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-7 select-none">
        {/* Name */}
        <div className="flex gap-1.5">
          {'PULKIT'.split('').map((char, i) => (
            <span
              key={i}
              className="text-5xl md:text-7xl font-black tracking-[0.25em] text-white inline-block"
              style={{
                fontFamily: "'Courier New', monospace",
                animation: `fadeInLetter 0.2s ease-out ${i * 0.06}s both`,
                textShadow: '0 0 30px rgba(0, 212, 255, 0.75)',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <p className="text-[#00d4ff] text-xs md:text-sm font-mono tracking-[0.5em] uppercase opacity-75">
          Initializing Portfolio
        </p>

        {/* Progress bar */}
        <div className="w-64 h-[3px] bg-white/10 rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full rounded-full transition-all duration-75 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
              boxShadow: '0 0 12px #00d4ff',
            }}
          />
        </div>

        <span className="text-white/40 text-xs font-mono">{progress}%</span>
      </div>

      <style>{`
        @keyframes fadeInLetter {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

