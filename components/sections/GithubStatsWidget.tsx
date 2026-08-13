'use client';
import { useEffect, useState } from 'react';

interface GithubData {
  username: string;
  name?: string;
  publicRepos: number;
  followers: number;
  following: number;
  avatarUrl: string;
  bio?: string;
}

export default function GithubStatsWidget({ username = 'pulkit31s' }: { username?: string }) {
  const cleanUsername = username.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '') || 'pulkit31s';
  const [data, setData] = useState<GithubData | null>(null);

  useEffect(() => {
    fetch(`/api/github?username=${encodeURIComponent(cleanUsername)}`)
      .then(r => r.json())
      .then(res => {
        if (res && res.username) setData(res);
      })
      .catch(() => {});
  }, [cleanUsername]);

  return (
    <div className="w-full">
      <a
        href={`https://github.com/${cleanUsername}`}
        target="_blank"
        rel="noreferrer"
        className="group block p-6 rounded-3xl transition-all duration-500 relative overflow-hidden text-left hover:-translate-y-1"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(13, 13, 26, 0.85) 60%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.12)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 mb-4">
          <div className="flex items-center gap-3.5">
            {data?.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={cleanUsername}
                className="w-12 h-12 rounded-2xl border border-emerald-500/40 object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 font-mono font-black"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
                }}
              >
                ⌨
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-widest uppercase text-[#10b981] font-bold">
                  GitHub Live Stats
                </span>
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              </div>
              <h4 className="text-lg font-black text-white font-mono mt-0.5 group-hover:text-[#10b981] transition-colors">
                @{cleanUsername}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <div className="text-right">
              <span className="text-2xl font-black text-white" style={{ textShadow: '0 0 15px rgba(16,185,129,0.5)' }}>
                {data?.publicRepos ?? '18+'}
              </span>
              <div className="text-[10px] font-bold text-[#10b981] tracking-wider uppercase">Public Repos</div>
            </div>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="relative z-10 rounded-2xl overflow-hidden bg-black/40 border border-white/10 p-3">
          <img
            src={`https://ghchart.rshah.org/10b981/${cleanUsername}`}
            alt={`${cleanUsername}'s GitHub Contributions`}
            className="w-full h-auto filter contrast-125 opacity-90 group-hover:opacity-100 transition-opacity"
            onError={e => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="mt-4 flex justify-between items-center text-xs font-mono text-white/40 relative z-10">
          <span>{data?.followers ?? 12} Followers · {data?.following ?? 15} Following</span>
          <span className="group-hover:text-[#10b981] transition-colors">View GitHub Profile →</span>
        </div>
      </a>
    </div>
  );
}
