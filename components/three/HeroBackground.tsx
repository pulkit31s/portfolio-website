'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL unavailable for Hero background, using CSS fallback:', err);
      return;
    }

    // Torus knot — main sculpture
    const knotGeo = new THREE.TorusKnotGeometry(2.5, 0.6, 200, 32);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(4, 0, -3);
    scene.add(knot);

    // Second smaller torus
    const torus2Geo = new THREE.TorusGeometry(1.5, 0.3, 16, 100);
    const torus2Mat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.position.set(-4, 1, -4);
    scene.add(torus2);

    // Floating particle field
    const count = 800;
    const pGeo = new THREE.BufferGeometry();
    const pos  = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.04, transparent: true, opacity: 0.4 });
    scene.add(new THREE.Points(pGeo, pMat));

    camera.position.z = 8;

    // Mouse parallax
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      my = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', onMouse);

    let frame: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      knot.rotation.x   = t * 0.15;
      knot.rotation.y   = t * 0.2;
      torus2.rotation.x = t * 0.3;
      torus2.rotation.z = t * 0.2;

      camera.position.x += (mx - camera.position.x) * 0.03;
      camera.position.y += (-my - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      if (renderer) renderer.render(scene, camera);
    };
    if (renderer) animate();

    const handleResize = () => {
      if (!el || !renderer) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      if (renderer) {
        renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
