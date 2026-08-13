'use client';
import { useEffect, useState } from 'react';

interface Profile {
  leetcodeUsername?: string;
  codeforcesUsername?: string;
  codechefUsername?: string;
  gfgUsername?: string;
  githubUsername?: string;
  githubUrl?: string;
  sections?: {
    showLeetcode?: boolean;
    showCodeforces?: boolean;
    showGithub?: boolean;
    showGfg?: boolean;
    showCodechef?: boolean;
  };
}

interface LeetCodeStats {
  totalSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  ranking?: number;
}

interface CodeforcesStats {
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
}

interface GFGStats {
  totalSolved?: number;
  codingScore?: number;
  monthlyScore?: number;
  instituteRank?: string | number;
  currentStreak?: number;
  longestStreak?: number;
  globalStreak?: number;
  error?: string;
}

interface GitHubStats {
  publicRepos?: number;
  followers?: number;
  following?: number;
  name?: string;
}

function StatRow({ label, value, color = 'text-white' }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
      <span className="text-white/50 font-mono text-xs">{label}</span>
      <span className={`font-bold font-mono text-xs ${color}`}>{value}</span>
    </div>
  );
}

export default function CodingStats() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leetcode, setLeetcode] = useState<LeetCodeStats | null>(null);
  const [codeforces, setCodeforces] = useState<CodeforcesStats | null>(null);
  const [gfg, setGfg] = useState<GFGStats | null>(null);
  const [github, setGithub] = useState<GitHubStats | null>(null);
  const [codechef, setCodechef] = useState<{ rating?: number; maxRating?: number; stars?: string; globalRank?: number; totalSolved?: number } | null>(null);
  const [gfgLoading, setGfgLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(profData => {
        if (!profData) return;
        setProfile(profData);

        const lcUser  = profData.leetcodeUsername   || 'pulkit31s';
        const cfUser  = profData.codeforcesUsername  || '';
        const gfgUser = profData.gfgUsername         || '';
        const ghUser  = profData.githubUsername      || 'pulkit31s';
        const ccUser  = profData.codechefUsername    || '';

        // Fetch all platforms in parallel
        Promise.all([
          fetch(`/api/leetcode?username=${encodeURIComponent(lcUser)}`).then(r => r.json()).catch(() => null),
          cfUser  ? fetch(`/api/codeforces?username=${encodeURIComponent(cfUser)}`).then(r => r.json()).catch(() => null) : Promise.resolve(null),
          gfgUser ? fetch(`/api/gfg?username=${encodeURIComponent(gfgUser)}`).then(r => r.json()).catch(() => null) : Promise.resolve(null),
          fetch(`/api/github?username=${encodeURIComponent(ghUser)}`).then(r => r.json()).catch(() => null),
          ccUser  ? fetch(`/api/codechef?username=${encodeURIComponent(ccUser)}`).then(r => r.json()).catch(() => null) : Promise.resolve(null),
        ]).then(([lcData, cfData, gfgData, ghData, ccData]) => {
          if (lcData   && !lcData.error)   setLeetcode(lcData);
          if (cfData   && !cfData.error)   setCodeforces(cfData);
          if (gfgData  && !gfgData.error)  setGfg(gfgData);
          if (ghData   && !ghData.error)   setGithub(ghData);
          if (ccData   && !ccData.error)   setCodechef(ccData);
          setGfgLoading(false);
        });
      })
      .catch(() => setGfgLoading(false));
  }, []);

  const lcUser  = profile?.leetcodeUsername   || 'pulkit31s';
  const cfUser  = profile?.codeforcesUsername  || '';
  const gfgUser = profile?.gfgUsername         || '';
  const ghUser  = profile?.githubUsername      || 'pulkit31s';
  const ghUrl   = profile?.githubUrl           || `https://github.com/${ghUser}`;
  const ccUser  = profile?.codechefUsername    || '';

  // Per-platform visibility (default true if not set)
  const sec = profile?.sections;
  const showLeetcode   = sec?.showLeetcode   !== false;
  const showCodeforces = sec?.showCodeforces !== false;
  const showGithub     = sec?.showGithub     !== false;
  const showGfg        = sec?.showGfg        !== false;
  const showCodechef   = sec?.showCodechef   !== false;

  const gfgAvailable = showGfg && !!gfgUser && gfg && !gfg.error;

  // Count actually-visible cards to set correct column count
  const visibleCount = [
    showLeetcode,
    showCodeforces && !!cfUser,
    showGithub,
    gfgAvailable,
    showCodechef && !!ccUser,
  ].filter(Boolean).length;

  const gridCols =
    visibleCount <= 1 ? 'grid-cols-1 max-w-sm mx-auto'
    : visibleCount === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
    : visibleCount === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : visibleCount === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';

  return (
    <section id="coding-stats" className="py-24 relative overflow-hidden bg-[#050508]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gradient-to-r from-amber-500/4 via-cyan-500/4 to-purple-500/4 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
            <span>⚡</span>
            <span>Competitive Programming &amp; SDE Matrix</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
            Coding Platform Stats
          </h2>
          <p className="text-white/40 text-sm md:text-base mt-4 max-w-xl mx-auto font-mono">
            Live problem-solving metrics from top competitive programming and algorithm platforms.
          </p>
        </div>

        {/* Platform Cards Grid */}
        <div className={`grid gap-6 ${gridCols}`}>

          {/* ── LeetCode Card ── */}
          {showLeetcode && (<a
            href={`https://leetcode.com/${lcUser}`}
            target="_blank" rel="noreferrer"
            className="group relative p-6 rounded-3xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5"
            style={{
              background: 'linear-gradient(145deg, rgba(255,161,22,0.08) 0%, rgba(13,13,26,0.9) 100%)',
              border: '1px solid rgba(255,161,22,0.28)',
              boxShadow: '0 10px 30px rgba(255,161,22,0.08)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#ffa116]/15 border border-[#ffa116]/40 flex items-center justify-center font-mono font-black text-[#ffa116] text-lg">
                  ⟨/⟩
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/25">
                  LEETCODE
                </span>
              </div>

              <h3 className="text-base font-mono font-bold text-white group-hover:text-[#ffa116] transition-colors truncate">
                @{lcUser}
              </h3>
              <div className="flex items-baseline gap-2 mt-1.5 mb-6">
                <span className="text-4xl font-mono font-black text-white">
                  {leetcode?.totalSolved ?? '—'}
                </span>
                <span className="text-xs text-white/40 font-mono">solved</span>
              </div>

              {/* Difficulty bars */}
              <div className="space-y-2.5 text-xs font-mono">
                {[
                  { label: 'Easy',   val: leetcode?.easySolved,   color: '#10b981', pct: `${Math.round(((leetcode?.easySolved || 0) / (leetcode?.totalSolved || 1)) * 100)}%` },
                  { label: 'Medium', val: leetcode?.mediumSolved, color: '#f59e0b', pct: `${Math.round(((leetcode?.mediumSolved || 0) / (leetcode?.totalSolved || 1)) * 100)}%` },
                  { label: 'Hard',   val: leetcode?.hardSolved,   color: '#ef4444', pct: `${Math.round(((leetcode?.hardSolved || 0) / (leetcode?.totalSolved || 1)) * 100)}%` },
                ].map(d => (
                  <div key={d.label}>
                    <div className="flex justify-between mb-1" style={{ color: d.color }}>
                      <span>{d.label}</span>
                      <span className="font-bold">{d.val ?? '—'}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: `${d.color}20` }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: d.pct, background: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-[#ffa116] transition-colors">
              <span>
                {leetcode?.ranking ? `Rank #${leetcode.ranking.toLocaleString()}` : 'View Profile'}
              </span>
              <span>→</span>
            </div>
          </a>
          )}

          {/* ── Codeforces Card ── */}
          {showCodeforces && (<a
            href={cfUser ? `https://codeforces.com/profile/${cfUser}` : '#'}
            target="_blank" rel="noreferrer"
            className="group relative p-6 rounded-3xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5"
            style={{
              background: 'linear-gradient(145deg, rgba(0,212,255,0.08) 0%, rgba(13,13,26,0.9) 100%)',
              border: '1px solid rgba(0,212,255,0.28)',
              boxShadow: '0 10px 30px rgba(0,212,255,0.08)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#00d4ff]/15 border border-[#00d4ff]/40 flex items-center justify-center font-mono font-black text-[#00d4ff] text-sm">
                  CF
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/25">
                  CODEFORCES
                </span>
              </div>

              <h3 className="text-base font-mono font-bold text-white group-hover:text-[#00d4ff] transition-colors truncate">
                @{cfUser || 'not set'}
              </h3>
              <div className="flex items-baseline gap-2 mt-1.5 mb-6">
                <span className="text-4xl font-mono font-black text-white">
                  {codeforces?.rating ?? (cfUser ? '—' : 'N/A')}
                </span>
                <span className="text-xs text-white/40 font-mono">{codeforces?.rating ? 'rating' : ''}</span>
              </div>

              <div className="space-y-2">
                <StatRow
                  label="Current Rank"
                  value={codeforces?.rank || (cfUser ? 'Loading…' : 'Not configured')}
                  color="text-[#00d4ff]"
                />
                <StatRow
                  label="Max Rating"
                  value={codeforces?.maxRating ?? '—'}
                  color="text-cyan-300"
                />
                <StatRow
                  label="Max Rank"
                  value={codeforces?.maxRank || '—'}
                  color="text-cyan-200"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-[#00d4ff] transition-colors">
              <span>View Profile</span>
              <span>→</span>
            </div>
          </a>
          )}

          {/* ── GitHub Card ── */}
          {showGithub && (<a
            href={ghUrl}
            target="_blank" rel="noreferrer"
            className="group relative p-6 rounded-3xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5"
            style={{
              background: 'linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(13,13,26,0.9) 100%)',
              border: '1px solid rgba(16,185,129,0.28)',
              boxShadow: '0 10px 30px rgba(16,185,129,0.08)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center font-mono font-black text-[#10b981] text-sm">
                  GH
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/25">
                  GITHUB
                </span>
              </div>

              <h3 className="text-base font-mono font-bold text-white group-hover:text-[#10b981] transition-colors truncate">
                @{ghUser}
              </h3>
              <div className="flex items-baseline gap-2 mt-1.5 mb-6">
                <span className="text-4xl font-mono font-black text-white">
                  {github?.publicRepos ?? '—'}
                </span>
                <span className="text-xs text-white/40 font-mono">repos</span>
              </div>

              <div className="space-y-2">
                <StatRow
                  label="Followers"
                  value={github?.followers ?? '—'}
                  color="text-[#10b981]"
                />
                <StatRow
                  label="Following"
                  value={github?.following ?? '—'}
                  color="text-emerald-300"
                />
                <StatRow
                  label="Status"
                  value="Open Source Active"
                  color="text-emerald-200"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-[#10b981] transition-colors">
              <span>View Repositories</span>
              <span>→</span>
            </div>
          </a>
          )}

          {/* ── GFG Card ── */}
          {(gfgAvailable || (gfgLoading && showGfg && gfgUser)) && (<a
              href={gfgUser ? `https://www.geeksforgeeks.org/user/${gfgUser}` : '#'}
              target="_blank" rel="noreferrer"
              className="group relative p-6 rounded-3xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5"
              style={{
                background: 'linear-gradient(145deg, rgba(34,197,94,0.08) 0%, rgba(13,13,26,0.9) 100%)',
                border: '1px solid rgba(34,197,94,0.28)',
                boxShadow: '0 10px 30px rgba(34,197,94,0.08)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-green-500/15 border border-green-500/40 flex items-center justify-center font-mono font-black text-green-400 text-[11px]">
                    GFG
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-green-500/10 text-green-400 border border-green-500/25">
                    GEEKSFORGEEKS
                  </span>
                </div>

                <h3 className="text-base font-mono font-bold text-white group-hover:text-green-400 transition-colors truncate">
                  @{gfgUser}
                </h3>
                <div className="flex items-baseline gap-2 mt-1.5 mb-6">
                  <span className="text-4xl font-mono font-black text-white">
                    {gfgLoading ? '…' : (gfg?.totalSolved ?? '—')}
                  </span>
                  <span className="text-xs text-white/40 font-mono">problems</span>
                </div>

                <div className="space-y-2">
                  <StatRow
                    label="Coding Score"
                    value={gfgLoading ? '…' : (gfg?.codingScore ?? '—')}
                    color="text-green-400"
                  />
                  <StatRow
                    label="Monthly Score"
                    value={gfgLoading ? '…' : (gfg?.monthlyScore ?? '—')}
                    color="text-green-300"
                  />
                  <StatRow
                    label="Current Streak 🔥"
                    value={gfgLoading ? '…' : (gfg?.currentStreak != null ? `${gfg.currentStreak} days` : '—')}
                    color="text-orange-400"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-green-400 transition-colors">
                <span>View Profile</span>
                <span>→</span>
              </div>
            </a>
          )}

          {/* ── CodeChef Card ── */}
          {showCodechef && ccUser && (
            <a
              href={`https://www.codechef.com/users/${ccUser}`}
              target="_blank" rel="noreferrer"
              className="group relative p-6 rounded-3xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5"
              style={{
                background: 'linear-gradient(145deg, rgba(168,85,247,0.08) 0%, rgba(13,13,26,0.9) 100%)',
                border: '1px solid rgba(168,85,247,0.28)',
                boxShadow: '0 10px 30px rgba(168,85,247,0.08)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center font-mono font-black text-purple-400 text-[11px]">
                    CC
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-purple-500/10 text-purple-400 border border-purple-500/25">
                    CODECHEF
                  </span>
                </div>

                <h3 className="text-base font-mono font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                  @{ccUser}
                </h3>
                <div className="flex items-baseline gap-2 mt-1.5 mb-6">
                  <span className="text-4xl font-mono font-black text-white">
                    {codechef?.rating ?? '—'}
                  </span>
                  <span className="text-xs text-white/40 font-mono">{codechef?.rating ? 'rating' : 'no data'}</span>
                </div>

                <div className="space-y-2">
                  <StatRow
                    label="Stars"
                    value={codechef?.stars || '—'}
                    color="text-purple-400"
                  />
                  <StatRow
                    label="Max Rating"
                    value={codechef?.maxRating ?? '—'}
                    color="text-purple-300"
                  />
                  <StatRow
                    label="Global Rank"
                    value={codechef?.globalRank ? `#${codechef.globalRank}` : '—'}
                    color="text-purple-200"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-purple-400 transition-colors">
                <span>View Profile</span>
                <span>→</span>
              </div>
            </a>
          )}

        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] font-mono text-white/20 mt-10">
          ⚡ Live data fetched from platform APIs · Updates every hour · Set usernames in Admin → Profile
        </p>
      </div>
    </section>
  );
}
