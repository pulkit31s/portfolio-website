'use client';
import { useState, useEffect } from 'react';

const allLinks = ['About', 'Education', 'Skills', 'Stats', 'Experience', 'Projects', 'Achievements', 'Certifications', 'Contact'];

// Map display label → section id
const linkToId: Record<string, string> = {
  About:          'about',
  Education:      'education',
  Skills:         'skills',
  Stats:          'coding-stats',
  Experience:     'experience',
  Projects:       'projects',
  Achievements:   'achievements',
  Certifications: 'certifications',
  Contact:        'contact',
};

export default function Navbar() {
  const [scrolled, setScrolled]             = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [active, setActive]                 = useState('About');
  const [open, setOpen]                     = useState(false);
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>({
    education: true,
    skills: true,
    codingStats: true,
    experience: true,
    projects: true,
    achievements: true,
    certifications: false,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data && data.sections) {
          setEnabledSections(data.sections);
        }
      })
      .catch(() => {});
  }, []);

  const links = allLinks.filter(l => {
    if (l === 'About' || l === 'Contact') return true;
    if (l === 'Stats') return enabledSections['codingStats'] ?? true;
    return enabledSections[l.toLowerCase()] ?? true;
  });

  // IntersectionObserver for active section highlighting on scroll
  useEffect(() => {
    const sectionIds = Object.values(linkToId);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const matchedLabel = allLinks.find(l => linkToId[l] === entry.target.id);
            if (matchedLabel) setActive(matchedLabel);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [enabledSections]);

  const scrollTo = (id: string) => {
    const targetId = linkToId[id] || id.toLowerCase();
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
    setOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5,5,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,212,255,0.08)' : 'none',
      }}
    >
      {/* Scroll Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 pointer-events-none">
        <div
          className="h-full transition-transform duration-75 ease-out origin-left"
          style={{
            transform: `scaleX(${scrollProgress})`,
            background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)',
            boxShadow: '0 0 8px rgba(0,212,255,0.6)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xl font-black tracking-widest text-white"
          style={{ fontFamily: "'Courier New', monospace", textShadow: '0 0 20px rgba(0,212,255,0.6)' }}
        >
          PULKIT<span style={{ color: '#00d4ff' }}>.</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-sm tracking-widest uppercase transition-all duration-300 relative group"
              style={{
                color: active === l ? '#00d4ff' : 'rgba(255,255,255,0.5)',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.15em',
              }}
            >
              {l}
              <span
                className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                style={{
                  width: active === l ? '100%' : '0',
                  background: 'linear-gradient(90deg,#00d4ff,#7c3aed)',
                }}
              />
            </button>
          ))}
        </div>

        {/* Mobile burger */}
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(!open)}>
          {[0,1,2].map(i => (
            <span
              key={i}
              className="block h-px w-6 bg-white/60 transition-all duration-300"
              style={{
                transform: open
                  ? i === 0 ? 'rotate(45deg) translateY(8px)' : i === 2 ? 'rotate(-45deg) translateY(-8px)' : 'scaleX(0)'
                  : 'none',
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#050508]/98 px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-sm tracking-widest uppercase text-white/60 text-left hover:text-[#00d4ff] transition-colors"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
