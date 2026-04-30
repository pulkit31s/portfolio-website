'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HeroBackground = dynamic(() => import('@/components/three/HeroBackground'), { ssr: false });

const roles = [
  'Full Stack Developer',
  'ML Engineer',
  'Graph Neural Networks Researcher',
  'Web Dev Lead @ NSCC VIT',
  'Hackathon Finalist',
];

export default function Hero() {
  const [roleIdx, setRoleIdx]   = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping]     = useState(true);

  useEffect(() => {
    const current = roles[roleIdx];
    let i = typing ? 0 : current.length;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (typing) {
        setDisplayed(current.slice(0, i + 1));
        i++;
        if (i > current.length) {
          setTimeout(() => setTyping(false), 1800);
          return;
        }
      } else {
        setDisplayed(current.slice(0, i - 1));
        i--;
        if (i <= 0) {
          setRoleIdx(r => (r + 1) % roles.length);
          setTyping(true);
          return;
        }
      }
      timer = setTimeout(tick, typing ? 60 : 35);
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [roleIdx, typing]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(0,212,255,0.04) 0%, transparent 60%)' }}
    >
      <HeroBackground />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Status badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
          style={{ border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.05)' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
          <span className="text-[#00d4ff] text-xs tracking-widest uppercase font-mono">
            Open to Opportunities
          </span>
        </div>

        {/* Name */}
        <h1 className="mb-4 leading-none">
          <span
            className="block text-6xl md:text-8xl lg:text-9xl font-black text-white"
            style={{
              fontFamily: "'Courier New', monospace",
              letterSpacing: '-0.02em',
            }}
          >
            PULKIT
          </span>
          <span
            className="block text-6xl md:text-8xl lg:text-9xl font-black"
            style={{
              fontFamily: "'Courier New', monospace",
              letterSpacing: '-0.02em',
              WebkitTextStroke: '1px rgba(0,212,255,0.4)',
              color: 'transparent',
            }}
          >
            SINGH
          </span>
        </h1>

        {/* Typing role */}
        <div className="h-10 flex items-center justify-center mb-8">
          <span
            className="text-xl md:text-2xl font-mono"
            style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.5)' }}
          >
            {displayed}
            <span className="animate-pulse">|</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed tracking-wide">
          B.Tech CSE @ VIT Chennai · CGPA 8.99 · Building the future one commit at a time.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => scrollTo('projects')}
            className="px-8 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              boxShadow: '0 0 30px rgba(0,212,255,0.3)',
            }}
          >
            View Projects
          </button>
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com'}`}
            className="px-8 py-3 text-sm font-mono tracking-widest uppercase text-white/70 rounded-full transition-all duration-300 hover:text-white hover:border-[#00d4ff]/50"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Get In Touch
          </a>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-6 mt-14">
          {[
            { label: 'GitHub',   href: 'https://github.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
            { label: 'Email',    href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com'}` },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono tracking-widest uppercase text-white/30 hover:text-[#00d4ff] transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/20 text-xs font-mono tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#00d4ff]/40 to-transparent" />
      </div>
    </section>
  );
}
