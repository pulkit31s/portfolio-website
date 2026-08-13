'use client';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const sections = [
  { label: 'Projects',        href: '/admin/projects',        icon: '◈', desc: 'Add / edit / delete projects',       color: '#00d4ff' },
  { label: 'Experience',      href: '/admin/experience',      icon: '◉', desc: 'Manage work & club experience',      color: '#7c3aed' },
  { label: 'Skills',          href: '/admin/skills',          icon: '◎', desc: 'Update skill proficiencies',          color: '#ec4899' },
  { label: 'Achievements',    href: '/admin/achievements',    icon: '★', desc: 'Record hackathon wins',              color: '#f59e0b' },
  { label: 'Profile',         href: '/admin/profile',         icon: '◐', desc: 'Edit name, bio, links & social',     color: '#10b981' },
  { label: 'Education',       href: '/admin/education',       icon: '▦', desc: 'Manage degrees & coursework',        color: '#6366f1' },
  { label: 'Certifications',  href: '/admin/certifications',  icon: '◆', desc: 'Add certificates & credentials',     color: '#f97316' },
  { label: 'Messages',        href: '/admin/messages',        icon: '📬', desc: 'Read & reply to contact submissions', color: '#00d4ff' },
  { label: 'Terminal',        href: '/admin/terminal',        icon: '⌨', desc: 'Add & remove custom terminal commands', color: '#10b981' },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string,number>>({});
  const [sectionStatus, setSectionStatus] = useState<Record<string,boolean>>({
    education: true,
    skills: true,
    experience: true,
    projects: true,
    achievements: true,
    certifications: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const endpoints = ['projects', 'experience', 'skills', 'achievements', 'education', 'certifications'];
    Promise.all(endpoints.map(e => fetch(`/api/${e}`).then(r => r.json()).catch(() => [])))
      .then(results => {
        const c: Record<string,number> = {};
        endpoints.forEach((e, i) => { c[e] = Array.isArray(results[i]) ? results[i].length : 0; });
        setCounts(c);
      });

    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data && data.sections) {
          setSectionStatus(data.sections);
        }
      })
      .catch(() => {});
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#00d4ff] font-mono text-sm animate-pulse">Authenticating...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
              P<span style={{ color: '#00d4ff' }}>.</span> Admin
            </div>
            <p className="text-white/30 text-xs font-mono mt-1">Welcome back, {session.user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-xs font-mono tracking-widest uppercase text-white/40 hover:text-[#00d4ff] transition-colors rounded-xl border border-white/10 hover:border-[#00d4ff]/30"
            >
              ← View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-4 py-2 text-xs font-mono tracking-widest uppercase text-white/40 hover:text-red-400 transition-colors rounded-xl border border-white/10 hover:border-red-500/30"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map(s => {
            const secKey = s.label.toLowerCase();
            const isHidden = secKey !== 'profile' && sectionStatus[secKey] === false;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
                style={{
                  background: 'rgba(13,13,26,0.8)',
                  border: `1px solid rgba(255,255,255,0.06)`,
                  backdropFilter: 'blur(10px)',
                  opacity: isHidden ? 0.75 : 1,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = s.color + '30';
                  (e.currentTarget as HTMLElement).style.background = `${s.color}06`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13,13,26,0.8)';
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl" style={{ color: s.color }}>{s.icon}</span>
                  <div className="flex items-center gap-2">
                    {isHidden && (
                      <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        Hidden
                      </span>
                    )}
                    <span
                      className="text-2xl font-black"
                      style={{ fontFamily: "'Courier New', monospace", color: `${s.color}20` }}
                    >
                      {counts[secKey] ?? '—'}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-white mb-1 group-hover:text-white transition-colors" style={{ fontFamily: "'Courier New', monospace" }}>
                  {s.label}
                </h3>
                <p className="text-xs text-white/30 font-mono">{s.desc}</p>
                <div className="mt-5 text-xs font-mono tracking-widest uppercase transition-colors" style={{ color: `${s.color}60` }}>
                  Manage →
                </div>
              </Link>
            );
          })}
        </div>

        {/* Analytics & System Health Overview Card */}
        <div className="mt-10 p-7 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5">
            <div>
              <span className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest font-bold">
                ⚡ System Health & Recruiter Traffic Overview
              </span>
              <h3 className="text-xl font-black text-white mt-1" style={{ fontFamily: "'Courier New', monospace" }}>
                Portfolio Telemetry
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">System Online & Connected</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-xs font-mono text-white/40 mb-1">Total DB Records</div>
              <div className="text-2xl font-black text-white font-mono">
                {Object.values(counts).reduce((a, b) => a + b, 0)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-xs font-mono text-white/40 mb-1">Active Sections</div>
              <div className="text-2xl font-black text-[#00d4ff] font-mono">
                {Object.values(sectionStatus).filter(Boolean).length} / 6
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-xs font-mono text-white/40 mb-1">SEO Indexing</div>
              <div className="text-xs font-mono text-emerald-400 font-bold mt-2">
                ✓ Sitemap & Robots Ready
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-xs font-mono text-white/40 mb-1">Quick Links</div>
              <div className="flex flex-col text-xs font-mono text-[#00d4ff] mt-1 space-y-1">
                <a href="/resume" target="_blank" className="hover:underline">📄 ATS Resume</a>
                <a href="/sitemap.xml" target="_blank" className="hover:underline">🗺️ sitemap.xml</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
