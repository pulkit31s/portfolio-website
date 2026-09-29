'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  techStack: string[];
  tags: string[];
  status: string;
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  category?: string;
  highlights: string[];
  featured: boolean;
  published: boolean;
}

const categoryColors: Record<string, string> = {
  fullstack:  '#00d4ff',
  ml:         '#f59e0b',
  cloud:      '#7c3aed',
  web:        '#ec4899',
  blockchain: '#10b981',
};

const categoryLabels: Record<string, string> = {
  fullstack:  'Full Stack',
  ml:         'AI / ML',
  cloud:      'Cloud',
  web:        'Web Dev',
  blockchain: 'Blockchain',
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'explorer'>('gallery');

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { 
        if (Array.isArray(data)) {
          setProjects(data.filter(p => p.published !== false));
        }
      })
      .catch(() => {});
  }, []);

  const uniqueCats = Array.from(new Set(projects.map(p => p.category || 'fullstack')));
  const categories = [
    { id: 'all', label: 'All Projects' },
    ...uniqueCats.map(c => ({ id: c, label: categoryLabels[c] || c })),
  ];

  const allTechStack = Array.from(new Set(projects.flatMap(p => p.techStack || [])));

  const filteredProjects = projects.filter(p => {
    const catMatch = activeCategory === 'all' || (p.category || 'fullstack') === activeCategory;
    const q        = searchQuery.toLowerCase().trim();
    const searchMatch = !q || p.title.toLowerCase().includes(q) || p.shortDescription?.toLowerCase().includes(q) || p.techStack?.some(t => t.toLowerCase().includes(q));
    const techMatch   = !selectedTech || p.techStack?.includes(selectedTech);
    return catMatch && searchMatch && techMatch;
  });

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  // Simple Constellation Logic
  const nodes = useMemo(() => {
    if (viewMode !== 'explorer') return { pNodes: [], tNodes: [], links: [] };
    const pNodes = filteredProjects.map((p, i) => ({
      id: p._id, type: 'project', title: p.title, slug: p.slug, category: p.category,
      x: 300 + 200 * Math.cos(i * (Math.PI * 2) / filteredProjects.length),
      y: 300 + 200 * Math.sin(i * (Math.PI * 2) / filteredProjects.length),
    }));
    
    const activeTech = Array.from(new Set(filteredProjects.flatMap(p => p.techStack || [])));
    const tNodes = activeTech.map((t, i) => ({
      id: t, type: 'tech', title: t,
      x: 300 + 100 * Math.cos(i * (Math.PI * 2) / activeTech.length + 0.5),
      y: 300 + 100 * Math.sin(i * (Math.PI * 2) / activeTech.length + 0.5),
    }));

    const links: any[] = [];
    pNodes.forEach(p => {
      const proj = filteredProjects.find(fp => fp._id === p.id);
      proj?.techStack?.forEach(t => {
        const tNode = tNodes.find(tn => tn.id === t);
        if (tNode) links.push({ source: p, target: tNode });
      });
    });

    return { pNodes, tNodes, links };
  }, [filteredProjects, viewMode]);

  return (
    <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">04 — Projects</p>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
              Things I've Built
            </h2>
            <div className="mt-4 w-24 h-px" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
          </div>
          <div className="flex gap-4 items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setViewMode('gallery')}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${viewMode === 'gallery' ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30' : 'text-white/40 hover:text-white'}`}
            >
              Gallery
            </button>
            <button 
              onClick={() => setViewMode('explorer')}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${viewMode === 'explorer' ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30' : 'text-white/40 hover:text-white'}`}
            >
              Explorer
            </button>
          </div>
        </div>

        {/* Dynamic Summary */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-2xl font-black text-white font-mono">{projects.length}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Total Projects</div>
          </div>
          {uniqueCats.slice(0, 3).map(c => (
            <div key={c} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-black text-white font-mono">{projects.filter(p => p.category === c).length}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">{categoryLabels[c] || c}</div>
            </div>
          ))}
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-2xl font-black text-[#00d4ff] font-mono">{allTechStack.length}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Technologies Used</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-mono text-xs">🔍</span>
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full max-w-md pl-10 pr-4 py-3 rounded-2xl text-xs font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(c => {
              const isActive = activeCategory === c.id;
              const color    = categoryColors[c.id] || '#00d4ff';
              return (
                <button
                  key={c.id} onClick={() => setActiveCategory(c.id)}
                  className="px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2"
                  style={{
                    background: isActive ? `${color}20` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? color + '60' : 'rgba(255,255,255,0.08)'}`,
                    color: isActive ? color : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {c.id !== 'all' && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
                  {c.label}
                </button>
              );
            })}
          </div>

          {allTechStack.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10 mt-2">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mr-2">Explore by Technology:</span>
              {allTechStack.map(t => (
                <button
                  key={t} onClick={() => setSelectedTech(selectedTech === t ? null : t)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all"
                  style={{
                    background: selectedTech === t ? 'rgba(0,212,255,0.2)' : 'transparent',
                    color: selectedTech === t ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${selectedTech === t ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-white/10 rounded-3xl bg-white/5">
            <div className="text-4xl mb-4">📂</div>
            <h4 className="text-xl font-mono font-bold text-white mb-2">No Projects Found</h4>
            <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSelectedTech(null); }} className="text-xs text-[#00d4ff] font-mono hover:underline">Clear Filters</button>
          </div>
        ) : viewMode === 'explorer' ? (
          <div className="w-full h-[600px] border border-white/10 rounded-3xl bg-[#050508] relative overflow-hidden flex items-center justify-center">
            <svg width="600" height="600" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {nodes.links.map((link: any, i) => (
                <line key={i} x1={link.source.x} y1={link.source.y} x2={link.target.x} y2={link.target.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              {nodes.tNodes.map(n => (
                <g key={n.id} transform={`translate(${n.x},${n.y})`} className="cursor-pointer" onClick={() => setSelectedTech(n.id)}>
                  <circle r="6" fill="rgba(168,85,247,0.5)" />
                  <text y="-10" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">{n.title}</text>
                </g>
              ))}
              {nodes.pNodes.map(n => {
                const color = categoryColors[n.category || 'fullstack'] || '#00d4ff';
                return (
                  <Link href={`/projects/${n.slug}`} key={n.id}>
                    <g transform={`translate(${n.x},${n.y})`} className="cursor-pointer hover:scale-110 transition-transform">
                      <circle r="12" fill={color} opacity="0.8" />
                      <circle r="16" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
                      <text y="24" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace" fontWeight="bold">{n.title}</text>
                    </g>
                  </Link>
                )
              })}
            </svg>
            <div className="absolute bottom-6 left-6 text-xs font-mono text-white/30 uppercase">Interactive Tech Constellation</div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* FEATURED WORK */}
            {featuredProjects.length > 0 && (
              <div>
                <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6">Featured Work</h3>
                <div className="grid grid-cols-1 gap-8">
                  {featuredProjects.map((p, idx) => {
                    const catColor = categoryColors[p.category || 'fullstack'] || '#00d4ff';
                    const num = String(idx + 1).padStart(2, '0');
                    return (
                      <div key={p._id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {p.imageUrl ? (
                          <div className="relative aspect-video lg:aspect-auto h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#050508] to-transparent opacity-80" />
                          </div>
                        ) : (
                          <div className="relative aspect-video lg:aspect-auto h-full bg-black/40 border-b lg:border-b-0 lg:border-r border-white/10 flex items-center justify-center">
                            <span className="text-4xl font-mono text-white/10">{num}</span>
                          </div>
                        )}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-4xl font-black text-white/10 font-mono">{num}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border text-cyan-400 border-cyan-400/30 bg-cyan-400/10">
                              ★ Featured
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-white/10 bg-white/5 text-white/60">
                              ● {p.status || 'Live'}
                            </span>
                          </div>
                          
                          <h4 className="text-3xl font-black text-white mb-4 group-hover:text-[#00d4ff] transition-colors" style={{ fontFamily: "'Courier New', monospace" }}>{p.title}</h4>
                          <p className="text-white/60 text-sm leading-relaxed mb-6">{p.shortDescription}</p>
                          
                          {p.highlights?.length > 0 && (
                            <ul className="space-y-2 mb-8">
                              {p.highlights.slice(0, 3).map((h, i) => (
                                <li key={i} className="flex gap-2 text-xs text-white/50"><span className="text-[#00d4ff]">›</span>{h}</li>
                              ))}
                            </ul>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mb-10">
                            {p.techStack?.slice(0, 5).map(t => <span key={t} className="text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70">{t}</span>)}
                            {p.techStack?.length > 5 && <span className="text-xs font-mono px-2 py-1 text-white/40">+{p.techStack.length - 5}</span>}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-auto">
                            <Link href={`/projects/${p.slug}`} className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-black bg-[#00d4ff] hover:bg-[#00d4ff]/80 transition-all flex items-center gap-2">
                              Case Study →
                            </Link>
                            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="px-6 py-2.5 rounded-xl text-xs font-mono text-white/80 border border-white/10 hover:bg-white/5 transition-all">Live Demo ↗</a>}
                            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="px-6 py-2.5 rounded-xl text-xs font-mono text-white/80 border border-white/10 hover:bg-white/5 transition-all">GitHub ↗</a>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MORE PROJECTS */}
            {regularProjects.length > 0 && (
              <div>
                <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6">More Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularProjects.map((p, idx) => {
                    const catColor = categoryColors[p.category || 'fullstack'] || '#00d4ff';
                    const num = String((featuredProjects.length) + idx + 1).padStart(2, '0');
                    return (
                      <div key={p._id} className="rounded-2xl p-6 md:p-8 flex flex-col transition-all group bg-white/[0.02] border border-white/10 hover:border-[#00d4ff]/30 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-6">
                          <div className="text-3xl font-black text-white/10 font-mono group-hover:text-[#00d4ff]/20 transition-colors">{num}</div>
                          <div className="flex gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase border border-white/10 text-white/40">{p.status || 'Live'}</span>
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d4ff] transition-colors font-mono">{p.title}</h4>
                        <p className="text-white/50 text-xs leading-relaxed mb-6 flex-1">{p.shortDescription}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {p.techStack?.slice(0, 4).map(t => <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">{t}</span>)}
                          {p.techStack?.length > 4 && <span className="text-[10px] font-mono px-1 text-white/40">+{p.techStack.length - 4}</span>}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <Link href={`/projects/${p.slug}`} className="text-xs font-mono text-[#00d4ff] hover:text-white transition-colors">Case Study →</Link>
                          <div className="flex gap-3">
                            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-white/40 hover:text-white">GitHub ↗</a>}
                            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-white/40 hover:text-[#00d4ff]">Demo ↗</a>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
