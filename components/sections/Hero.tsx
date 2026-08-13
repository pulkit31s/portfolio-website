'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import GithubStatsWidget from '@/components/sections/GithubStatsWidget';

const HeroBackground = dynamic(() => import('@/components/three/HeroBackground'), { ssr: false });

interface Profile {
  name: string;
  surname: string;
  statusBadge: string;
  openToWork?: boolean;
  roles: string[];
  tagline: string;
  githubUrl: string;
  githubUsername?: string;
  leetcodeUsername?: string;
  linkedinUrl: string;
  email: string;
  resumeUrl: string;
  avatarUrl?: string;
  showCodingStats?: boolean;
  showLeetcodeStats?: boolean;
  showGithubStats?: boolean;
  showAtsResume?: boolean;
}

const defaultProfile: Profile = {
  name: 'PULKIT',
  surname: 'SINGHROHA',
  statusBadge: 'Open to Opportunities',
  openToWork: true,
  roles: [
    'Full Stack Developer',
    'ML Engineer',
    'Graph Neural Networks Researcher',
    'Web Dev Lead @ NSCC VIT',
    'Hackathon Finalist',
  ],
  tagline: 'B.Tech CSE @ VIT Chennai · CGPA 9.02 · Building the future one commit at a time.',
  githubUrl: 'https://github.com/pulkit31s',
  githubUsername: 'pulkit31s',
  leetcodeUsername: 'pulkit31s',
  linkedinUrl: 'https://linkedin.com',
  email: 'hello@example.com',
  resumeUrl: '',
};

export default function Hero() {
  const [profile, setProfile]   = useState<Profile>(defaultProfile);
  const [roleIdx, setRoleIdx]   = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping]     = useState(true);
  const [leetcodeData, setLeetcodeData] = useState<{ totalSolved?: number; ranking?: number; easySolved?: number; mediumSolved?: number; hardSolved?: number } | null>(null);

  // Fetch profile from DB
  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data && data.name) setProfile(data);
      })
      .catch(() => {});
  }, []);

  const leetcodeUser = profile.leetcodeUsername && profile.leetcodeUsername.trim() !== ''
    ? profile.leetcodeUsername.trim()
    : 'pulkit31s';

  const githubUser = profile.githubUsername && profile.githubUsername.trim() !== ''
    ? profile.githubUsername.trim()
    : 'pulkit31s';

  // Fetch LeetCode stats
  useEffect(() => {
    if (leetcodeUser) {
      fetch(`/api/leetcode?username=${encodeURIComponent(leetcodeUser)}`)
        .then(r => r.json())
        .then(data => {
          if (data && typeof data.totalSolved === 'number') setLeetcodeData(data);
        })
        .catch(() => {});
    }
  }, [leetcodeUser]);

  const roles = profile.roles.length > 0 ? profile.roles : defaultProfile.roles;

  // Typing animation
  useEffect(() => {
    const current = roles[roleIdx % roles.length];
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
  }, [roleIdx, typing, roles]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="about"
      className="relative min-h-screen pt-32 pb-20 md:pt-40 flex items-center justify-center overflow-hidden"
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-6 lg:pt-12">

          {/* LEFT COLUMN: Content (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">

            {/* 1. Status badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 transition-all duration-300 select-none"
              style={{
                border: `1px solid ${profile.openToWork !== false ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.15)'}`,
                background: profile.openToWork !== false ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: profile.openToWork !== false ? '#10b981' : '#9ca3af' }}
              />
              <span
                className="text-xs tracking-widest uppercase font-mono font-bold"
                style={{ color: profile.openToWork !== false ? '#10b981' : '#9ca3af' }}
              >
                {profile.statusBadge}
              </span>
            </div>

            {/* 2. Name Heading */}
            <h1 className="mb-4 leading-none select-none">
              <span
                className="block text-5xl sm:text-7xl md:text-8xl lg:text-[92px] xl:text-[104px] font-black text-white tracking-tight"
                style={{
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '-0.03em',
                }}
              >
                {profile.name}
                <span className="text-[#00d4ff]">.</span>
              </span>
              {profile.surname && (
                <span
                  className="block text-5xl sm:text-7xl md:text-8xl lg:text-[92px] xl:text-[104px] font-black tracking-tight"
                  style={{
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: '-0.03em',
                    WebkitTextStroke: '1px rgba(0,212,255,0.4)',
                    color: 'transparent',
                  }}
                >
                  {profile.surname}
                </span>
              )}
            </h1>

            {/* 3. Typing Role */}
            <div className="h-10 flex items-center justify-center lg:justify-start mb-6">
              <span
                className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold"
                style={{ color: '#00d4ff', textShadow: '0 0 25px rgba(0,212,255,0.4)' }}
              >
                {displayed}
                <span className="animate-pulse">|</span>
              </span>
            </div>

            {/* 4. Description / Tagline */}
            <p className="text-white/50 text-sm sm:text-base max-w-lg mb-8 leading-relaxed font-mono">
              {profile.tagline}
            </p>

            {/* 5. CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center w-full sm:w-auto">
              <button
                onClick={() => scrollTo('projects')}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 35px rgba(0,212,255,0.35)',
                }}
              >
                View Projects
              </button>
              {profile.showAtsResume !== false ? (
                <a
                  href="/resume"
                  className="w-full sm:w-auto text-center px-7 py-3.5 text-sm font-mono tracking-widest uppercase font-bold rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    boxShadow: '0 0 20px rgba(255,255,255,0.05)',
                  }}
                >
                  ↓ Resume
                </a>
              ) : profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="w-full sm:w-auto text-center px-7 py-3.5 text-sm font-mono tracking-widest uppercase font-bold rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.4)',
                    color: '#00d4ff',
                  }}
                >
                  ↓ Resume
                </a>
              ) : null}
            </div>

            {/* 6. Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-6 mt-10">
              {[
                { label: 'GitHub',   href: profile.githubUrl },
                { label: 'LinkedIn', href: profile.linkedinUrl },
                { label: 'Email',    href: `mailto:${profile.email}` },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono tracking-widest uppercase text-white/40 hover:text-[#00d4ff] transition-colors font-bold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Large Profile Hero Portrait (lg:col-span-5) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center z-10">
            {(profile.avatarUrl || 'https://github.com/pulkit31s.png') && (
              <div className="relative group w-[240px] sm:w-[280px] lg:w-[320px] xl:w-[340px] aspect-[4/5]">
                {/* Glowing Outer Neon Ring */}
                <div
                  className="absolute -inset-2 rounded-[36px] transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.9) 0%, rgba(124,58,237,0.7) 50%, rgba(16,185,129,0.8) 100%)',
                    boxShadow: '0 0 50px rgba(0, 212, 255, 0.4)',
                  }}
                />

                {/* Inner Image Frame */}
                <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-[#0d0d1a] border border-white/10 shadow-2xl">
                  <img
                    src={profile.avatarUrl || 'https://github.com/pulkit31s.png'}
                    alt={profile.name || 'Pulkit'}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={e => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* PRO Badge Attached to Bottom Center */}
                <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase bg-[#0d0d1a]/95 text-[#00d4ff] border border-[#00d4ff]/50 shadow-2xl z-20">
                  PRO
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Coding & LeetCode Highlight Panel */}
        <div className="mt-16 max-w-4xl mx-auto flex flex-col gap-6">
          {profile.showLeetcodeStats !== false && (
            <a
              href={`https://leetcode.com/${leetcodeUser}`}
              target="_blank"
              rel="noreferrer"
              className="group block p-6 rounded-3xl transition-all duration-500 relative overflow-hidden text-left hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 161, 22, 0.08) 0%, rgba(13, 13, 26, 0.85) 60%)',
                border: '1px solid rgba(255, 161, 22, 0.35)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(255, 161, 22, 0.12)',
              }}
            >
              {/* Ambient background glow effect on hover */}
              <div
                className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full pointer-events-none transition-opacity duration-500 opacity-20 group-hover:opacity-40"
                style={{ background: 'radial-gradient(circle, rgba(255, 161, 22, 0.5) 0%, transparent 70%)' }}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                {/* Header Info */}
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 font-mono font-black"
                    style={{
                      background: 'rgba(255, 161, 22, 0.15)',
                      border: '1px solid rgba(255, 161, 22, 0.4)',
                      color: '#ffa116',
                      boxShadow: '0 0 20px rgba(255, 161, 22, 0.25)',
                    }}
                  >
                    ⟨/⟩
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono tracking-widest uppercase text-[#ffa116] font-bold">
                        LeetCode Live Stats
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    </div>
                    <h4 className="text-lg font-black text-white font-mono mt-0.5 group-hover:text-[#ffa116] transition-colors">
                      @{leetcodeUser}
                    </h4>
                  </div>
                </div>

                {/* Big Solved Stat */}
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-3xl sm:text-4xl font-black text-white" style={{ textShadow: '0 0 20px rgba(255,161,22,0.5)' }}>
                    {leetcodeData?.totalSolved !== undefined ? leetcodeData.totalSolved : '148'}
                  </span>
                  <div className="text-left leading-none">
                    <div className="text-[11px] font-bold text-[#ffa116] tracking-wider uppercase">Solved</div>
                    <div className="text-[10px] text-white/40">Problems</div>
                  </div>
                </div>
              </div>

              {/* Difficulty breakdown pills */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex flex-wrap gap-2">
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}
                  >
                    <span>Easy</span>
                    <span className="text-white font-black">{leetcodeData?.easySolved ?? 67}</span>
                  </span>
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                    style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
                  >
                    <span>Medium</span>
                    <span className="text-white font-black">{leetcodeData?.mediumSolved ?? 70}</span>
                  </span>
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                    style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    <span>Hard</span>
                    <span className="text-white font-black">{leetcodeData?.hardSolved ?? 11}</span>
                  </span>
                </div>

                <div className="text-xs font-mono text-white/40 group-hover:text-[#ffa116] transition-colors flex items-center gap-1">
                  {leetcodeData?.ranking && (
                    <span>Rank <strong>#{leetcodeData.ranking.toLocaleString()}</strong> · </span>
                  )}
                  <span>View Profile →</span>
                </div>
              </div>
            </a>
          )}

          {profile.showGithubStats !== false && (
            <GithubStatsWidget username={profile.githubUrl || 'pulkit31s'} />
          )}
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
