'use client';
import { useEffect, useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  category?: string;
  architectureClient?: string;
  architectureApi?: string;
  architectureDb?: string;
  architectureDiagram?: string;
  highlights: string[];
  featured: boolean;
}

const defaultProjects: Project[] = [
  {
    _id: '1', title: 'Skill-Bridge', featured: true, category: 'fullstack',
    description: 'A funding platform connecting student-investor pairs with AI-based interview simulators and skill assessments.',
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'Express.js', 'AI/ML'],
    highlights: [
      'Launched platform connecting 50+ simulated student-investor pairs',
      'Integrated AI-based interview simulators raising credibility scores by 20%',
      'Reduced onboarding time by 50% with intuitive UX',
    ],
  },
  {
    _id: '2', title: 'CloudSave', featured: false, category: 'cloud',
    description: 'Secure expense tracking platform using Microsoft Azure with custom authentication flows.',
    techStack: ['Microsoft Azure', 'React.js', 'Node.js'],
    highlights: [
      'Reduced server response times by 40% using Azure',
      'Designed custom auth flows improving data privacy compliance',
      'Eliminated 100% of unauthorized access attempts in testing',
    ],
  },
  {
    _id: '3', title: 'Digital-Ardhti', featured: false, category: 'blockchain',
    description: 'AI-enabled marketplace for direct farmer-to-buyer sales with blockchain smart contracts.',
    techStack: ['Blockchain', 'Smart Contracts', 'AI/ML', 'React.js'],
    highlights: [
      'Cut intermediary costs by 25-30% for farmers',
      'Integrated price prediction models and blockchain for 100+ automated transactions',
      'Increased projected farmer earnings by up to 30%',
    ],
  },
  {
    _id: '4', title: 'MERN Event Platform', featured: false, category: 'fullstack',
    description: 'Real-time event management platform built for IEEE RAS with live registration and updates.',
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    highlights: [
      'Achieved 1000+ unique user visits',
      'Improved registration efficiency by 60%',
      'Managed 3+ national hackathons with 500+ participants',
    ],
  },
];

const formatExternalUrl = (url?: string) => {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const categoryColors: Record<string, string> = {
  fullstack:  '#00d4ff',
  ml:         '#f59e0b',
  cloud:      '#7c3aed',
  web:        '#ec4899',
  blockchain: '#10b981',
};

const categoryLabels: Record<string, string> = {
  fullstack:  'Full Stack & MERN',
  ml:         'AI / ML & Research',
  cloud:      'Cloud & DevOps',
  web:        'Web Development',
  blockchain: 'Blockchain',
};

export default function Projects() {
  const [projects, setProjects]                         = useState<Project[]>(defaultProjects);
  const [activeCategory, setActiveCategory]             = useState<string>('all');
  const [searchQuery, setSearchQuery]                   = useState('');
  const [selectedTech, setSelectedTech]                 = useState<string | null>(null);
  const [hover, setHover]                               = useState<string | null>(null);
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setProjects(data); })
      .catch(() => {});
  }, []);

  // Build categories and tech tags dynamically
  const uniqueCats = Array.from(new Set(projects.map(p => p.category || 'fullstack')));
  const categories = [
    { id: 'all', label: 'All Projects' },
    ...uniqueCats.map(c => ({ id: c, label: categoryLabels[c] || c })),
  ];

  const allTechStack = Array.from(new Set(projects.flatMap(p => p.techStack || [])));

  const filteredProjects = projects.filter(p => {
    const catMatch = activeCategory === 'all' || (p.category || 'fullstack') === activeCategory;
    const q        = searchQuery.toLowerCase().trim();
    const searchMatch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.techStack.some(t => t.toLowerCase().includes(q));
    const techMatch   = !selectedTech || p.techStack.includes(selectedTech);
    return catMatch && searchMatch && techMatch;
  });

  return (
    <section id="projects" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">04 — Projects</p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          What I've Built
        </h2>
        <div className="mt-4 w-24 h-px mb-8" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />

        {/* Search input & Tech pills */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-mono text-xs">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, description, or technology (e.g. Next.js, PyTorch)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-xs font-mono"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(c => {
            const isActive = activeCategory === c.id;
            const color    = categoryColors[c.id] || '#00d4ff';
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className="px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-2"
                style={{
                  background: isActive ? `${color}20` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? color + '60' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? color : 'rgba(255,255,255,0.5)',
                  boxShadow: isActive ? `0 0 20px ${color}30` : 'none',
                }}
              >
                {c.id !== 'all' && (
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                )}
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Tech stack pills filter bar */}
        {allTechStack.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mr-1">Filter Tech:</span>
            {allTechStack.map(t => {
              const isSelected = selectedTech === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTech(isSelected ? null : t)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all"
                  style={{
                    background: isSelected ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.03)',
                    color: isSelected ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${isSelected ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {t} {isSelected && '✓'}
                </button>
              );
            })}
            {selectedTech && (
              <button
                onClick={() => setSelectedTech(null)}
                className="text-[10px] font-mono text-red-400 hover:underline ml-2"
              >
                Clear tech filter
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 px-8 rounded-3xl text-center flex flex-col items-center justify-center border border-white/10 bg-white/[0.02]">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-white/5 border border-white/10 text-white/40 font-mono">
              📂
            </div>
            <h4 className="text-xl font-bold text-white font-mono mb-2" style={{ fontFamily: "'Courier New', monospace" }}>
              No Projects Found
            </h4>
            <p className="text-sm font-mono text-white/40 max-w-md mb-6">
              There are currently no projects categorized under &quot;{categoryLabels[activeCategory] || activeCategory}&quot;.
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-6 py-2.5 rounded-xl text-xs font-mono tracking-widest uppercase font-bold text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 25px rgba(0,212,255,0.3)' }}
            >
              ← View All Projects
            </button>
          </div>
        ) : (
          filteredProjects.map((p, idx) => {
            const isHovered = hover === p._id;
            const githubHref = formatExternalUrl(p.githubUrl);
            const liveHref   = formatExternalUrl(p.liveUrl);
            const catKey     = p.category || 'fullstack';
            const catColor   = categoryColors[catKey] || '#00d4ff';
            const catLabel   = categoryLabels[catKey] || catKey;

          return (
            <div
              key={p._id}
              onMouseEnter={() => setHover(p._id)}
              onMouseLeave={() => setHover(null)}
              className="rounded-2xl p-7 cursor-default transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
              style={{
                background: isHovered ? 'rgba(0,212,255,0.04)' : 'rgba(13,13,26,0.6)',
                border: `1px solid ${isHovered ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                backdropFilter: 'blur(10px)',
                transform: isHovered ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered ? '0 20px 60px rgba(0,212,255,0.08)' : 'none',
              }}
            >
              <div>
                {/* Badges container */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5"
                    style={{
                      background: `${catColor}15`,
                      color: catColor,
                      border: `1px solid ${catColor}35`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
                    {catLabel}
                  </span>

                  {p.featured && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
                      style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}
                    >
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Project Image Banner */}
                {p.imageUrl && (
                  <div className="mb-5 h-44 rounded-xl overflow-hidden border border-white/10 relative bg-black/40 group-hover:border-[#00d4ff]/30 transition-colors">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent opacity-80" />
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
              </div>

              {/* Links */}
              <div className="flex items-center justify-between gap-4 pt-5 border-t border-white/5">
                <div className="flex items-center gap-4">
                  {githubHref && (
                    <a href={githubHref} target="_blank" rel="noreferrer" className="text-xs font-mono text-white/40 hover:text-[#00d4ff] transition-colors tracking-widest uppercase flex items-center gap-1">
                      GitHub →
                    </a>
                  )}
                  {liveHref && (
                    <a href={liveHref} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#00d4ff] hover:text-white transition-colors tracking-widest uppercase flex items-center gap-1 font-bold">
                      Live Demo ↗
                    </a>
                  )}
                  {!githubHref && !liveHref && (
                    <span className="text-xs font-mono text-white/20 tracking-widest uppercase">Private Project</span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedModalProject(p)}
                  className="text-xs font-mono text-white/50 hover:text-[#00d4ff] transition-colors flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10"
                >
                  📐 Architecture
                </button>
              </div>
            </div>
          );
        }))}
      </div>

      {/* System Architecture Modal */}
      {selectedModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-3xl rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border"
            style={{
              background: '#0d0d1a',
              borderColor: 'rgba(0,212,255,0.3)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.9)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedModalProject(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-mono transition-colors"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-xs font-mono text-[#00d4ff] tracking-widest uppercase font-bold">
                System Design & Architecture Overview
              </span>
              <h3 className="text-2xl font-black text-white mt-1" style={{ fontFamily: "'Courier New', monospace" }}>
                {selectedModalProject.title}
              </h3>
              <p className="text-xs text-white/50 font-mono mt-1">
                Category: {categoryLabels[selectedModalProject.category || 'fullstack'] || selectedModalProject.category}
              </p>
            </div>

            {/* Modal Content Scrollable */}
            <div className="overflow-y-auto pr-2 space-y-6 flex-1">
              {/* Image banner preview */}
              {selectedModalProject.imageUrl && (
                <div className="h-56 rounded-2xl overflow-hidden border border-white/10 relative">
                  <img src={selectedModalProject.imageUrl} alt={selectedModalProject.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2 font-bold">Project Summary</h4>
                <p className="text-sm text-white/70 leading-relaxed font-sans bg-white/5 p-4 rounded-2xl border border-white/5">
                  {selectedModalProject.description}
                </p>
              </div>

              {/* System Architecture Diagram Image if provided */}
              {selectedModalProject.architectureDiagram && (
                <div>
                  <h4 className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-3 font-bold">System Architecture Diagram</h4>
                  <div className="rounded-2xl overflow-hidden border border-white/10 p-2 bg-black/40">
                    <img src={selectedModalProject.architectureDiagram} alt="Architecture Diagram" className="w-full h-auto object-contain rounded-xl" />
                  </div>
                </div>
              )}

              {/* System Architecture Flow Visualizer */}
              <div>
                <h4 className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-3 font-bold">System Flow & Data Pipeline</h4>
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-around gap-4 text-center font-mono text-xs">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 min-w-[120px]">
                    <div className="font-bold">Client Layer</div>
                    <div className="text-[10px] text-white/60 mt-0.5">{selectedModalProject.architectureClient || 'React / Next.js'}</div>
                  </div>
                  <span className="text-white/30 text-lg">➔</span>
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 min-w-[120px]">
                    <div className="font-bold">API / Engine</div>
                    <div className="text-[10px] text-white/60 mt-0.5">{selectedModalProject.architectureApi || 'REST / Node.js'}</div>
                  </div>
                  <span className="text-white/30 text-lg">➔</span>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 min-w-[120px]">
                    <div className="font-bold">Database / Infrastructure</div>
                    <div className="text-[10px] text-white/60 mt-0.5">{selectedModalProject.architectureDb || 'MongoDB / Azure'}</div>
                  </div>
                </div>
              </div>

              {/* Key Technical Highlights */}
              {selectedModalProject.highlights && selectedModalProject.highlights.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-3 font-bold">Engineering Highlights</h4>
                  <ul className="space-y-2">
                    {selectedModalProject.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/70 bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[#00d4ff] font-bold">⚡</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Badges */}
              <div>
                <h4 className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-3 font-bold">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModalProject.techStack.map(t => (
                    <span key={t} className="px-3 py-1 rounded-xl text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer CTAs */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setSelectedModalProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-white/40 hover:text-white transition-colors"
              >
                Close
              </button>
              <div className="flex gap-3">
                {selectedModalProject.githubUrl && (
                  <a
                    href={formatExternalUrl(selectedModalProject.githubUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-mono bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    GitHub Code
                  </a>
                )}
                {selectedModalProject.liveUrl && (
                  <a
                    href={formatExternalUrl(selectedModalProject.liveUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-black bg-[#00d4ff] hover:bg-[#00d4ff]/80 transition-all"
                  >
                    Launch Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
