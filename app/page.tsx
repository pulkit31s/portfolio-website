'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Skills from '@/components/sections/Skills';
import ExperienceSection from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Achievements from '@/components/sections/Achievements';
import Contact from '@/components/sections/Contact';

const LoadingScreen = dynamic(() => import('@/components/three/LoadingScreen'), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
          minHeight: '100vh',
        }}
      >
        <Navbar />

        {/* Radial bg glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.03) 0%, transparent 70%)',
          }}
        />

        <main>
          <Hero />

          {/* Divider */}
          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }} />
          </div>

          <Skills />

          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.15), transparent)' }} />
          </div>

          <ExperienceSection />

          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }} />
          </div>

          <Projects />

          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.15), transparent)' }} />
          </div>

          <Achievements />

          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }} />
          </div>

          <Contact />
        </main>
      </div>
    </>
  );
}
