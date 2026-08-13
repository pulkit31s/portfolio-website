'use client';
import { useEffect, useRef, useState } from 'react';

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  category: string;
  description?: string;
}

const categoryColors: Record<string, string> = {
  cloud:       '#00d4ff',
  programming: '#7c3aed',
  'ml-ai':     '#f59e0b',
  web:         '#ec4899',
  database:    '#10b981',
  other:       '#6b7280',
};

const categoryIcons: Record<string, string> = {
  cloud:       '☁',
  programming: '⟨/⟩',
  'ml-ai':     '◈',
  web:         '◎',
  database:    '◉',
  other:       '★',
};

const defaultCertifications: Certification[] = [
  { _id: '1', title: 'Microsoft Azure Fundamentals (AZ-900)', issuer: 'Microsoft', date: 'Jun 2025', category: 'cloud', description: 'Core Azure services, cloud concepts, security and compliance.' },
  { _id: '2', title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: 'May 2025', category: 'cloud', description: 'Foundational AWS services, pricing, support and architecture.' },
];

export default function Certifications() {
  const [certs, setCerts]   = useState<Certification[]>(defaultCertifications);
  const [visible, setVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/certifications')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setCerts(data); })
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

  const categories = ['all', ...Array.from(new Set(certs.map(c => c.category)))];
  const filtered   = activeFilter === 'all' ? certs : certs.filter(c => c.category === activeFilter);

  return (
    <section id="certifications" className="py-32 px-6 max-w-6xl mx-auto" ref={ref}>
      {/* Section header */}
      <div className="mb-16">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">06 — Certifications</p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Credentials
        </h2>
        <div className="mt-4 w-24 h-px" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
      </div>

      {/* Category filters */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => {
            const color  = categoryColors[cat] || '#00d4ff';
            const active = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 capitalize"
                style={{
                  background: active ? `${color}18` : 'transparent',
                  border:     `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                  color:      active ? color : 'rgba(255,255,255,0.4)',
                  boxShadow:  active ? `0 0 16px ${color}22` : 'none',
                }}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cert, i) => {
          const color = categoryColors[cert.category] || '#00d4ff';
          const icon  = categoryIcons[cert.category] || '★';
          return (
            <div
              key={cert._id}
              className="group rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1"
              style={{
                background:     'rgba(13,13,26,0.6)',
                border:         `1px solid ${color}15`,
                backdropFilter: 'blur(10px)',
                opacity:        visible ? 1 : 0,
                transform:      visible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 80}ms`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${color}35`;
                (e.currentTarget as HTMLElement).style.boxShadow  = `0 8px 32px ${color}10`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${color}15`;
                (e.currentTarget as HTMLElement).style.boxShadow  = 'none';
              }}
            >
              {/* Icon + category */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl" style={{ color }}>{icon}</span>
                <span className="text-xs font-mono capitalize px-2 py-0.5 rounded-full" style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}>
                  {cert.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-black text-white mb-1 leading-snug group-hover:text-[#00d4ff] transition-colors" style={{ fontFamily: "'Courier New', monospace" }}>
                {cert.title}
              </h3>

              {/* Issuer + date */}
              <p className="text-xs text-white/40 font-mono mb-2">{cert.issuer}</p>
              <p className="text-xs font-mono mb-3" style={{ color: `${color}80` }}>{cert.date}</p>

              {/* Description */}
              {cert.description && (
                <p className="text-xs text-white/30 leading-relaxed mb-4">{cert.description}</p>
              )}

              {/* Credential link */}
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono tracking-widest uppercase transition-colors mt-auto pt-3 border-t border-white/5 w-full"
                  style={{ color: `${color}60` }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = color)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = `${color}60`)}
                >
                  Verify Credential →
                </a>
              ) : (
                <div className="text-xs font-mono text-white/15 mt-auto pt-3 border-t border-white/5 w-full">
                  No credential link
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
