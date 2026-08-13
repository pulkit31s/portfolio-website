'use client';
import { useEffect, useRef, useState } from 'react';

interface Education {
  _id: string;
  degree: string;
  branch: string;
  institution: string;
  location: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  cgpa?: number;
  percentage?: number;
  coursework: string[];
}

const defaultEducation: Education[] = [
  {
    _id: '1',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    institution: 'Vellore Institute of Technology',
    location: 'Chennai, India',
    startYear: 2023,
    current: true,
    cgpa: 9.02,
    coursework: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Machine Learning', 'Software Engineering'],
  },
];

export default function Education() {
  const [education, setEducation] = useState<Education[]>(defaultEducation);
  const [visible, setVisible]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/education')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setEducation(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="education" className="py-32 px-6 max-w-6xl mx-auto" ref={ref}>
      {/* Section header */}
      <div className="mb-16">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">02 — Education</p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Academic Background
        </h2>
        <div className="mt-4 w-24 h-px" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
      </div>

      <div className="flex flex-col gap-6">
        {education.map((edu, i) => (
          <div
            key={edu._id}
            className="rounded-2xl p-8 transition-all duration-700"
            style={{
              background: 'rgba(13,13,26,0.6)',
              border: '1px solid rgba(0,212,255,0.1)',
              backdropFilter: 'blur(10px)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: `${i * 120}ms`,
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left: Main info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
                    {edu.degree}
                  </h3>
                  {edu.current && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[#00d4ff] text-sm font-mono mb-1">{edu.branch}</p>
                <p className="text-white/50 text-sm mb-1">{edu.institution}</p>
                <p className="text-white/30 text-xs font-mono">
                  {edu.location} · {edu.startYear} — {edu.current ? 'Present' : edu.endYear}
                </p>
              </div>

              {/* Right: Score */}
              {(edu.cgpa || edu.percentage) && (
                <div className="flex-shrink-0 text-center lg:text-right">
                  <div
                    className="inline-flex flex-col items-center lg:items-end justify-center rounded-2xl px-6 py-4"
                    style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
                  >
                    {edu.cgpa && (
                      <>
                        <span className="text-3xl font-black text-white" style={{ fontFamily: "'Courier New', monospace", textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>
                          {edu.cgpa}
                        </span>
                        <span className="text-xs font-mono text-white/30 mt-0.5">CGPA / 10.0</span>
                      </>
                    )}
                    {!edu.cgpa && edu.percentage && (
                      <>
                        <span className="text-3xl font-black text-white" style={{ fontFamily: "'Courier New', monospace", textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>
                          {edu.percentage}%
                        </span>
                        <span className="text-xs font-mono text-white/30 mt-0.5">Percentage</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Coursework */}
            {edu.coursework && edu.coursework.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/5">
                <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-3">Relevant Coursework</p>
                <div className="flex flex-wrap gap-2">
                  {edu.coursework.map(c => (
                    <span
                      key={c}
                      className="px-2.5 py-1 text-xs font-mono rounded-lg"
                      style={{ background: 'rgba(0,212,255,0.06)', color: 'rgba(0,212,255,0.65)', border: '1px solid rgba(0,212,255,0.12)' }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
