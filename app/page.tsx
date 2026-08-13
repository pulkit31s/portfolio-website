'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Education from '@/components/sections/Education';
import Skills from '@/components/sections/Skills';
import ExperienceSection from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Achievements from '@/components/sections/Achievements';
import Certifications from '@/components/sections/Certifications';
import CodingStats from '@/components/sections/CodingStats';
import Contact from '@/components/sections/Contact';
import TerminalWidget from '@/components/sections/TerminalWidget';

const LoadingScreen = dynamic(() => import('@/components/three/LoadingScreen'), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [sections, setSections] = useState<Record<string, boolean>>({
    education: true,
    skills: true,
    experience: true,
    projects: true,
    achievements: true,
    certifications: false,
  });

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data && data.sections) {
          setSections(data.sections);
        }
      })
      .catch(() => {});
  }, []);

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

          <TerminalWidget />

          {/* Education */}
          {sections.education !== false && (
            <>
              <div className="max-w-6xl mx-auto px-6">
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }} />
              </div>
              <Education />
            </>
          )}

          {/* Skills */}
          {sections.skills !== false && (
            <>
              <div className="max-w-6xl mx-auto px-6">
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)' }} />
              </div>
              <Skills />
            </>
          )}

          {/* Coding & Competitive Programming Platform Stats */}
          {sections.codingStats !== false && (
            <>
              <div className="max-w-6xl mx-auto px-6">
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.15), transparent)' }} />
              </div>
              <CodingStats />
            </>
          )}

          {/* Experience */}
          {sections.experience !== false && (
            <>
              <div className="max-w-6xl mx-auto px-6">
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.15), transparent)' }} />
              </div>
              <ExperienceSection />
            </>
          )}

          {/* Projects */}
          {sections.projects !== false && (
            <>
              <div className="max-w-6xl mx-auto px-6">
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }} />
              </div>
              <Projects />
            </>
          )}

          {/* Achievements */}
          {sections.achievements !== false && (
            <>
              <div className="max-w-6xl mx-auto px-6">
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.15), transparent)' }} />
              </div>
              <Achievements />
            </>
          )}

          {/* Certifications */}
          {sections.certifications === true && (
            <>
              <div className="max-w-6xl mx-auto px-6">
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.15), transparent)' }} />
              </div>
              <Certifications />
            </>
          )}

          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }} />
          </div>

          <Contact />
        </main>
      </div>
    </>
  );
}
