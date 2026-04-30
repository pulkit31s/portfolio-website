'use client';
import { useEffect, useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
  featured: boolean;
}

const defaultProjects: Project[] = [
  {
    _id: '1', title: 'Skill-Bridge', featured: true,
    description: 'A funding platform connecting student-investor pairs with AI-based interview simulators and skill assessments.',
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'Express.js', 'AI/ML'],
    highlights: [
      'Launched platform connecting 50+ simulated student-investor pairs',
      'Integrated AI-based interview simulators raising credibility scores by 20%',
      'Reduced onboarding time by 50% with intuitive UX',
    ],
  },
  {
    _id: '2', title: 'CloudSave', featured: false,
    description: 'Secure expense tracking platform using Microsoft Azure with custom authentication flows.',
    techStack: ['Microsoft Azure', 'React.js', 'Node.js'],
    highlights: [
      'Reduced server response times by 40% using Azure',
      'Designed custom auth flows improving data privacy compliance',
      'Eliminated 100% of unauthorized access attempts in testing',
    ],
  },
  {
    _id: '3', title: 'Digital-Ardhti', featured: false,
    description: 'AI-enabled marketplace for direct farmer-to-buyer sales with blockchain smart contracts.',
    techStack: ['Blockchain', 'Smart Contracts', 'AI/ML', 'React.js'],
    highlights: [
      'Cut intermediary costs by 25-30% for farmers',
      'Integrated price prediction models and blockchain for 100+ automated transactions',
      'Increased projected farmer earnings by up to 30%',
    ],
  },
  {
    _id: '4', title: 'MERN Event Platform', featured: false,
    description: 'Real-time event management platform built for IEEE RAS with live registration and updates.',
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    highlights: [
      'Achieved 1000+ unique user visits',
      'Improved registration efficiency by 60%',
      'Managed 3+ national hackathons with 500+ participants',
    ],
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [hover, setHover]       = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setProjects(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="projects" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">04 — Projects</p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          What I've Built
        </h2>
        <div className="mt-4 w-24 h-px" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p, idx) => {
          const isHovered = hover === p._id;
          return (
            <div
              key={p._id}
              onMouseEnter={() => setHover(p._id)}
              onMouseLeave={() => setHover(null)}
              className="rounded-2xl p-7 cursor-default transition-all duration-500 group relative overflow-hidden"
              style={{
                background: isHovered ? 'rgba(0,212,255,0.04)' : 'rgba(13,13,26,0.6)',
                border: `1px solid ${isHovered ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                backdropFilter: 'blur(10px)',
                transform: isHovered ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered ? '0 20px 60px rgba(0,212,255,0.08)' : 'none',
              }}
            >
              {/* Featured badge */}
              {p.featured && (
                <div
                  className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-mono"
                  style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}
                >
                  Featured
                </div>
              )}

              {/* Number */}
              <div className="text-6xl font-black mb-4 transition-colors duration-300" style={{ color: isHovered ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)', fontFamily: "'Courier New', monospace" }}>
                {String(idx + 1).padStart(2, '0')}
              </div>

              <h3 className="text-xl font-black text-white mb-2 transition-colors group-hover:text-[#00d4ff]" style={{ fontFamily: "'Courier New', monospace" }}>
                {p.title}
              </h3>

              <p className="text-white/50 text-sm leading-relaxed mb-5">{p.description}</p>

              {/* Highlights */}
              <ul className="space-y-1.5 mb-6">
                {p.highlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/40">
                    <span className="text-[#00d4ff] mt-0.5">›</span>
                    {h}
                  </li>
                ))}
              </ul>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {p.techStack.map(t => (
                  <span key={t} className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: 'rgba(168,85,247,0.8)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4 pt-5 border-t border-white/5">
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-white/30 hover:text-[#00d4ff] transition-colors tracking-widest uppercase">
                    GitHub →
                  </a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-white/30 hover:text-[#00d4ff] transition-colors tracking-widest uppercase">
                    Live →
                  </a>
                )}
                {!p.githubUrl && !p.liveUrl && (
                  <span className="text-xs font-mono text-white/20 tracking-widest uppercase">Private Project</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
