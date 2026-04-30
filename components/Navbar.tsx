'use client';
import { useState, useEffect } from 'react';

const links = ['About', 'Skills', 'Experience', 'Projects', 'Achievements', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('');
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xl font-black tracking-widest text-white"
          style={{ fontFamily: "'Courier New', monospace", textShadow: '0 0 20px rgba(0,212,255,0.6)' }}
        >
          P<span style={{ color: '#00d4ff' }}>.</span>
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
