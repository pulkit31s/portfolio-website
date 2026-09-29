'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Sparkles, Maximize2, RotateCcw, Compass, ArrowUpRight } from 'lucide-react';
import type { Experience } from '@/components/sections/Experience';
import {
  calculateExperienceTreeLayout,
  TreeLayoutNode,
  TreeLayoutResult,
} from '@/lib/experienceTreeLayout';

interface ExperienceTreeProps {
  experiences: Experience[];
  selectedId: string;
  onSelectExperience: (id: string, positionIdx?: number) => void;
  typeConfigMap: Record<string, { color: string; label: string; bg: string }>;
  scrollProgress?: number;
  className?: string;
}

export default function ExperienceTree({
  experiences,
  selectedId,
  onSelectExperience,
  typeConfigMap,
  scrollProgress = 0,
  className = '',
}: ExperienceTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredNode, setHoveredNode] = useState<TreeLayoutNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);

  // Compute 3D tree layout from experiences
  const treeLayout: TreeLayoutResult = useMemo(() => {
    return calculateExperienceTreeLayout(experiences, typeConfigMap);
  }, [experiences, typeConfigMap]);

  // Internal Three.js scene references
  const threeRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    animFrameId?: number;
    nodeMeshes: Map<string, THREE.Mesh>;
    subNodeMeshes: Map<string, THREE.Mesh>;
    branchLines: Map<string, THREE.Line>;
    pulseObjects: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; progress: number; speed: number; id: string }[];
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    targetCameraY: number;
    currentCameraY: number;
    parallaxTarget: { x: number; y: number };
    parallaxCurrent: { x: number; y: number };
    activeHaloMesh?: THREE.Mesh;
    trunkMesh?: THREE.Line | THREE.Mesh;
    presentDayMesh?: THREE.Mesh;
  }>({
    nodeMeshes: new Map(),
    subNodeMeshes: new Map(),
    branchLines: new Map(),
    pulseObjects: [],
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(-999, -999),
    targetCameraY: 0,
    currentCameraY: 0,
    parallaxTarget: { x: 0, y: 0 },
    parallaxCurrent: { x: 0, y: 0 },
  });

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Update target camera Y whenever selectedId changes or scroll changes
  useEffect(() => {
    const activeNode = treeLayout.nodes.find(n => n.id === selectedId);
    if (activeNode) {
      threeRef.current.targetCameraY = activeNode.nodePoint[1];
    } else if (treeLayout.nodes.length > 0) {
      // Map scroll progress to camera Y range if no specific node is selected
      const topY = treeLayout.nodes[0]?.nodePoint[1] || 0;
      const bottomY = treeLayout.nodes[treeLayout.nodes.length - 1]?.nodePoint[1] || 0;
      threeRef.current.targetCameraY = topY - scrollProgress * (topY - bottomY);
    }
  }, [selectedId, scrollProgress, treeLayout]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    if (!webGLSupported || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;

    // 1. Scene
    const scene = new THREE.Scene();
    threeRef.current.scene = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    threeRef.current.camera = camera;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      threeRef.current.renderer = renderer;
    } catch {
      setWebGLSupported(false);
      return;
    }

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00d4ff, 1.5);
    dirLight1.position.set(5, 10, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xec4899, 1.2);
    dirLight2.position.set(-5, -10, 5);
    scene.add(dirLight2);

    // 5. Central Trunk Construction
    const trunkPoints: THREE.Vector3[] = [];
    const trunkSteps = 40;
    const startY = treeLayout.trunkStart[1];
    const endY = treeLayout.trunkEnd[1];

    for (let i = 0; i <= trunkSteps; i++) {
      const t = i / trunkSteps;
      const y = startY + t * (endY - startY);
      // Subtle organic wave along the trunk
      const x = Math.sin(y * 0.8) * 0.08;
      const z = Math.cos(y * 0.8) * 0.08;
      trunkPoints.push(new THREE.Vector3(x, y, z));
    }

    const trunkCurve = new THREE.CatmullRomCurve3(trunkPoints);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 60, 0.035, 8, false);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.8,
    });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    scene.add(trunkMesh);
    threeRef.current.trunkMesh = trunkMesh;

    // Glowing Trunk Rings at intervals
    for (let y = startY + 1; y < endY; y += 1.6) {
      const ringGeo = new THREE.TorusGeometry(0.09, 0.012, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(Math.sin(y * 0.8) * 0.08, y, Math.cos(y * 0.8) * 0.08);
      scene.add(ringMesh);
    }

    // 6. Present Day Beacon at top of the tree
    const beaconGeo = new THREE.OctahedronGeometry(0.2, 0);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.set(...treeLayout.presentDayPoint);
    scene.add(beaconMesh);
    threeRef.current.presentDayMesh = beaconMesh;

    const beaconHaloGeo = new THREE.RingGeometry(0.26, 0.32, 32);
    const beaconHaloMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const beaconHalo = new THREE.Mesh(beaconHaloGeo, beaconHaloMat);
    beaconHalo.position.set(...treeLayout.presentDayPoint);
    scene.add(beaconHalo);

    // 7. Build Branches and Nodes for each experience
    const nodeMeshes = new Map<string, THREE.Mesh>();
    const subNodeMeshes = new Map<string, THREE.Mesh>();
    const branchLines = new Map<string, THREE.Line>();
    const pulseObjects: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; progress: number; speed: number; id: string }[] = [];

    treeLayout.nodes.forEach(node => {
      const colorHex = new THREE.Color(node.color);

      // Curve for branch
      const points = node.curvePoints.map(p => new THREE.Vector3(...p));
      const branchCurve = new THREE.CatmullRomCurve3(points);
      const curvePointsCount = 30;
      const branchPoints = branchCurve.getPoints(curvePointsCount);
      const branchGeo = new THREE.BufferGeometry().setFromPoints(branchPoints);

      const branchMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: node.id === selectedId ? 0.95 : 0.35,
        linewidth: 2,
      });

      const branchLine = new THREE.Line(branchGeo, branchMat);
      scene.add(branchLine);
      branchLines.set(node.id, branchLine);

      // Main Node Orb
      const nodeGeo = new THREE.DodecahedronGeometry(0.18, 1);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: node.id === selectedId ? 0.8 : 0.3,
        roughness: 0.2,
        metalness: 0.5,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(...node.nodePoint);
      (nodeMesh as any).userData = { id: node.id, isMainNode: true, nodeData: node };
      scene.add(nodeMesh);
      nodeMeshes.set(node.id, nodeMesh);

      // Outer Glow Ring for Node
      const haloGeo = new THREE.TorusGeometry(0.28, 0.015, 8, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: node.id === selectedId ? 0.7 : 0.2,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(...node.nodePoint);
      haloMesh.rotation.x = Math.PI / 3;
      scene.add(haloMesh);

      // Energy Pulse traveling along branch
      const pulseGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.copy(points[0]);
      scene.add(pulseMesh);

      pulseObjects.push({
        mesh: pulseMesh,
        curve: branchCurve,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.004,
        id: node.id,
      });

      // Multi-Position Sub-Branches
      if (node.positionsLayout && node.positionsLayout.length > 1) {
        node.positionsLayout.forEach(subPos => {
          const subPoint = new THREE.Vector3(...subPos.position);
          const parentPoint = new THREE.Vector3(...node.nodePoint);

          // Sub connector line
          const subGeo = new THREE.BufferGeometry().setFromPoints([parentPoint, subPoint]);
          const subLineMat = new THREE.LineBasicMaterial({
            color: colorHex,
            transparent: true,
            opacity: 0.4,
          });
          const subLine = new THREE.Line(subGeo, subLineMat);
          scene.add(subLine);

          // Sub node mesh
          const subMeshGeo = new THREE.SphereGeometry(0.09, 16, 16);
          const subMeshMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: colorHex,
            emissiveIntensity: 0.4,
          });
          const subMesh = new THREE.Mesh(subMeshGeo, subMeshMat);
          subMesh.position.copy(subPoint);
          (subMesh as any).userData = {
            id: node.id,
            isSubNode: true,
            posIdx: subPos.posIdx,
            nodeData: node,
          };
          scene.add(subMesh);
          subNodeMeshes.set(`${node.id}_${subPos.posIdx}`, subMesh);
        });
      }
    });

    threeRef.current.nodeMeshes = nodeMeshes;
    threeRef.current.subNodeMeshes = subNodeMeshes;
    threeRef.current.branchLines = branchLines;
    threeRef.current.pulseObjects = pulseObjects;

    // 8. Active Selection Highlight Ring
    const activeHaloGeo = new THREE.RingGeometry(0.35, 0.42, 32);
    const activeHaloMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const activeHaloMesh = new THREE.Mesh(activeHaloGeo, activeHaloMat);
    activeHaloMesh.visible = false;
    scene.add(activeHaloMesh);
    threeRef.current.activeHaloMesh = activeHaloMesh;

    // 9. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !threeRef.current.renderer || !threeRef.current.camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      threeRef.current.camera.aspect = w / h;
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 10. Mouse Move Handler for Raycasting and Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      threeRef.current.mouse.x = x;
      threeRef.current.mouse.y = y;
      threeRef.current.parallaxTarget = { x: x * 0.4, y: y * 0.3 };

      // Tooltip position in DOM
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => setIsHoveringCanvas(true);
    const handleMouseLeave = () => {
      setIsHoveringCanvas(false);
      threeRef.current.mouse.set(-999, -999);
      setHoveredNode(null);
    };

    // 11. Click Handler for 3D Nodes
    const handleClick = () => {
      const { raycaster, mouse, camera, nodeMeshes, subNodeMeshes } = threeRef.current;
      if (!raycaster || !camera || mouse.x === -999) return;

      raycaster.setFromCamera(mouse, camera);
      const allInteractiveMeshes = [
        ...Array.from(nodeMeshes.values()),
        ...Array.from(subNodeMeshes.values()),
      ];
      const intersects = raycaster.intersectObjects(allInteractiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as any;
        if (hit.userData?.id) {
          onSelectExperience(hit.userData.id, hit.userData.posIdx);
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    // 12. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.016;

      // Smooth camera interpolation towards target Y
      const currentY = threeRef.current.currentCameraY;
      const targetY = threeRef.current.targetCameraY;
      threeRef.current.currentCameraY += (targetY - currentY) * 0.06;

      // Smooth parallax
      const parCur = threeRef.current.parallaxCurrent;
      const parTar = threeRef.current.parallaxTarget;
      parCur.x += (parTar.x - parCur.x) * 0.05;
      parCur.y += (parTar.y - parCur.y) * 0.05;

      camera.position.y = threeRef.current.currentCameraY + parCur.y;
      camera.position.x = parCur.x;
      camera.lookAt(0, threeRef.current.currentCameraY, 0);

      // Beacon rotation & pulse
      if (beaconMesh) {
        beaconMesh.rotation.y += 0.02;
        beaconMesh.rotation.x += 0.01;
      }
      if (beaconHalo) {
        beaconHalo.rotation.z += 0.015;
        const scale = 1 + Math.sin(time * 3) * 0.1;
        beaconHalo.scale.set(scale, scale, 1);
      }

      // Animate branch pulses
      pulseObjects.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        const pt = p.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      });

      // Animate active halo position & pulse
      const activeNode = treeLayout.nodes.find(n => n.id === selectedId);
      if (activeNode && activeHaloMesh) {
        activeHaloMesh.visible = true;
        activeHaloMesh.position.set(...activeNode.nodePoint);
        activeHaloMesh.rotation.z = time * 2;
        const pulse = 1 + Math.sin(time * 4) * 0.12;
        activeHaloMesh.scale.set(pulse, pulse, 1);
        (activeHaloMesh.material as THREE.MeshBasicMaterial).color.set(activeNode.color);
      } else if (activeHaloMesh) {
        activeHaloMesh.visible = false;
      }

      // Raycasting for Hover Detection
      const currentMouse = threeRef.current.mouse;
      const currentRaycaster = threeRef.current.raycaster;
      if (isHoveringCanvas && currentMouse.x !== -999 && currentRaycaster) {
        currentRaycaster.setFromCamera(currentMouse, camera);
        const allInteractiveMeshes = [
          ...Array.from(nodeMeshes.values()),
          ...Array.from(subNodeMeshes.values()),
        ];
        const intersects = currentRaycaster.intersectObjects(allInteractiveMeshes);

        if (intersects.length > 0) {
          const hit = intersects[0].object as any;
          if (hit.userData?.nodeData) {
            setHoveredNode(hit.userData.nodeData);
            canvas.style.cursor = 'pointer';
          }
        } else {
          setHoveredNode(null);
          canvas.style.cursor = 'default';
        }
      }

      renderer.render(scene, camera);
      threeRef.current.animFrameId = requestAnimationFrame(animate);
    };

    threeRef.current.animFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);

      if (threeRef.current.animFrameId) {
        cancelAnimationFrame(threeRef.current.animFrameId);
      }

      // Dispose Three.js objects
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [webGLSupported, treeLayout, selectedId, isHoveringCanvas, onSelectExperience]);

  // Update branch line opacities and node emissive glow when selectedId changes
  useEffect(() => {
    const { branchLines, nodeMeshes } = threeRef.current;
    if (!branchLines || !nodeMeshes) return;

    treeLayout.nodes.forEach(node => {
      const line = branchLines.get(node.id);
      if (line) {
        (line.material as THREE.LineBasicMaterial).opacity = node.id === selectedId ? 0.95 : 0.3;
      }

      const mesh = nodeMeshes.get(node.id);
      if (mesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = node.id === selectedId ? 0.85 : 0.25;
        mesh.scale.setScalar(node.id === selectedId ? 1.25 : 1.0);
      }
    });
  }, [selectedId, treeLayout]);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center text-xs font-mono text-white/40">
        WebGL 3D canvas is resting. Interactive fallback stream is active.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Floating 3D Hover Tooltip */}
      {hoveredNode && (
        <div
          className="pointer-events-none absolute z-20 px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 shadow-2xl transition-transform duration-75 text-left transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: hoveredNode.color, color: hoveredNode.color }}
            />
            <span className="text-xs font-bold font-mono text-white tracking-wide">
              {hoveredNode.experience.company}
            </span>
          </div>
          <p className="text-[11px] text-white/70 font-sans mt-0.5 max-w-[200px] truncate">
            {hoveredNode.experience.role}
          </p>
          <div className="flex items-center justify-between text-[9px] font-mono text-white/40 mt-1 border-t border-white/10 pt-1">
            <span>{hoveredNode.experience.startDate} — {hoveredNode.experience.endDate || 'Present'}</span>
            <span className="text-[#00d4ff] flex items-center gap-0.5">Click to view <ArrowUpRight className="w-2.5 h-2.5" /></span>
          </div>
        </div>
      )}

      {/* Quick Navigation Legend / Status Overlay */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/60">
        <Compass className="w-3 h-3 text-[#00d4ff] animate-spin" style={{ animationDuration: '8s' }} />
        <span>3D Tree · Scroll or click nodes</span>
      </div>
    </div>
  );
}
