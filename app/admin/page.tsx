'use client';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const sections = [
  { label: 'Projects',     href: '/admin/projects',     icon: '◈', desc: 'Add / edit / delete projects', color: '#00d4ff' },
  { label: 'Experience',   href: '/admin/experience',   icon: '◉', desc: 'Manage work & club experience', color: '#7c3aed' },
  { label: 'Skills',       href: '/admin/skills',       icon: '◎', desc: 'Update skill proficiencies',    color: '#ec4899' },
  { label: 'Achievements', href: '/admin/achievements', icon: '★', desc: 'Record hackathon wins',          color: '#f59e0b' },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string,number>>({});

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const endpoints = ['projects', 'experience', 'skills', 'achievements'];
    Promise.all(endpoints.map(e => fetch(`/api/${e}`).then(r => r.json()).catch(() => [])))
      .then(results => {
        const c: Record<string,number> = {};
        endpoints.forEach((e, i) => { c[e] = Array.isArray(results[i]) ? results[i].length : 0; });
        setCounts(c);
      });
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
          {sections.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: 'rgba(13,13,26,0.8)',
                border: `1px solid rgba(255,255,255,0.06)`,
                backdropFilter: 'blur(10px)',
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
                <span
                  className="text-2xl font-black"
                  style={{ fontFamily: "'Courier New', monospace", color: `${s.color}20` }}
                >
                  {counts[s.label.toLowerCase()] ?? '—'}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mb-1 group-hover:text-white transition-colors" style={{ fontFamily: "'Courier New', monospace" }}>
                {s.label}
              </h3>
              <p className="text-xs text-white/30 font-mono">{s.desc}</p>
              <div className="mt-5 text-xs font-mono tracking-widest uppercase transition-colors" style={{ color: `${s.color}60` }}>
                Manage →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
