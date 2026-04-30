'use client';
import { useEffect, useState } from 'react';

interface Achievement {
  _id: string;
  title: string;
  event: string;
  year: number;
  description: string;
  rank?: string;
  international: boolean;
}

const defaultAchievements: Achievement[] = [
  { _id:'1', title:"3rd Place, Spectrum'25 Hackathon", event:"Spectrum'25", year:2025, description:"Delivered a production-ready web app under 24 hours, demonstrating rapid prototyping and problem-solving skills.", rank:'3rd Place', international:false },
  { _id:'2', title:"IEEE Yesist'12 International Hackathon Finalist 2024", event:"IEEE Yesist'12", year:2024, description:"Top 20 global teams — presented in Tunisia. A landmark international achievement.", rank:'Top 20 Global', international:true },
  { _id:'3', title:"IEEE Yesist'12 International Hackathon Finalist 2025", event:"IEEE Yesist'12", year:2025, description:"Top 20 global teams — presented in Malaysia. Back-to-back international finalist.", rank:'Top 20 Global', international:true },
  { _id:'4', title:"Devshouse'25 National Hackathon Finalist", event:"Devshouse'25", year:2025, description:"Top 60 of 5000+ participants, recognized for innovation and technical excellence.", rank:'Top 60 / 5000+', international:false },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);

  useEffect(() => {
    fetch('/api/achievements')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setAchievements(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="achievements" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">05 — Achievements</p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Milestones
        </h2>
        <div className="mt-4 w-24 h-px" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { value: '3+', label: 'Hackathons Won' },
          { value: '2×', label: 'International Finalist' },
          { value: '5000+', label: 'Competed Against' },
          { value: '8.99', label: 'CGPA' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-2xl p-5 text-center"
            style={{ background: 'rgba(13,13,26,0.6)', border: '1px solid rgba(0,212,255,0.08)' }}
          >
            <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Courier New', monospace", textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
              {s.value}
            </div>
            <div className="text-xs text-white/30 font-mono">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Achievement cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((a, i) => (
          <div
            key={a._id}
            className="rounded-2xl p-7 group transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'rgba(13,13,26,0.6)',
              border: `1px solid ${a.international ? 'rgba(245,158,11,0.15)' : 'rgba(0,212,255,0.1)'}`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div
                className="text-3xl font-black"
                style={{ fontFamily: "'Courier New', monospace", color: a.international ? 'rgba(245,158,11,0.15)' : 'rgba(0,212,255,0.1)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {a.international && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                    🌐 International
                  </span>
                )}
                <span className="text-xs font-mono text-white/30">{a.year}</span>
              </div>
            </div>

            <h3 className="text-base font-black text-white mb-1 group-hover:text-[#00d4ff] transition-colors" style={{ fontFamily: "'Courier New', monospace" }}>
              {a.title}
            </h3>
            <p className="text-white/30 text-xs font-mono mb-3">{a.event}</p>
            <p className="text-white/50 text-sm leading-relaxed">{a.description}</p>

            {a.rank && (
              <div
                className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-mono"
                style={{ background: 'rgba(0,212,255,0.06)', color: 'rgba(0,212,255,0.6)', border: '1px solid rgba(0,212,255,0.15)' }}
              >
                {a.rank}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
