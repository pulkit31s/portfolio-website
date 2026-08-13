'use client';
import { useEffect, useState } from 'react';

interface Experience {
  _id: string;
  role: string;
  company: string;
  type: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack: string[];
}

const typeColors: Record<string, string> = {
  internship: '#00d4ff',
  research:   '#f59e0b',
  club:       '#7c3aed',
  leadership: '#ec4899',
  'part-time':'#10b981',
};

const defaultExperiences: Experience[] = [
  {
    _id: '1', role: 'Head of Web Development', company: 'Newton School Coding Club (NSCC), VIT Chennai',
    type: 'club', location: 'Chennai, India', startDate: 'Apr 2025', current: true,
    bullets: [
      'Led 5+ large-scale tech and cultural events, driving 1500+ attendee participation and increasing event reach by 40%.',
      'Spearheaded workshops and coding competitions boosting club membership by 35% year-over-year.',
      'Mentored 20+ junior developers, improving code quality and project delivery timelines by 25%.',
    ],
    techStack: ['React', 'Next.js', 'Node.js'],
  },
  {
    _id: '2', role: 'Summer Research Industrial Intern', company: 'Vellore Institute of Technology, Chennai',
    type: 'research', location: 'Chennai, India', startDate: 'May 2025', endDate: 'Jul 2025', current: false,
    bullets: [
      'Trained a Graph Neural Networks Model with an accuracy of 99.94% and 0.9786 AUC Score.',
      'Utilized PyTorch Geometric Library for training models on two GCNConv layers using ReLU activation function.',
    ],
    techStack: ['Python', 'PyTorch Geometric', 'scikit-learn'],
  },
  {
    _id: '3', role: 'Chair-Person', company: 'Haryana Hood Club, VIT Chennai',
    type: 'leadership', location: 'Chennai, India', startDate: 'Nov 2025', current: true,
    bullets: [
      'Coordinated 10+ campus-wide cultural events, strengthening community engagement by 50%.',
      'Streamlined event operations, reducing planning time by 30% through effective task delegation and scheduling.',
    ],
    techStack: [],
  },
  {
    _id: '4', role: 'Intern', company: 'Kriten Enterprises Private Limited',
    type: 'internship', location: 'Chennai, India', startDate: 'Aug 2025', endDate: 'Sep 2025', current: false,
    bullets: [
      'Improved Search Engine Optimization (SEO) for Huslai, achieving a 3-4% increase in site visibility.',
      'Expanded B2B business outreach by connecting with potential business clients.',
      'Enhanced website engagement metrics by 5-10%, driving higher user interaction.',
    ],
    techStack: ['SEO', 'Analytics'],
  },
  {
    _id: '5', role: 'Technical Team Member', company: 'IEEE RAS, VIT Chennai',
    type: 'club', location: 'Chennai, India', startDate: 'Jun 2024', endDate: 'Jul 2025', current: false,
    bullets: [
      'Managed 3+ national-level hackathons with 500+ combined participants, enhancing VIT\'s technical culture.',
      'Developed a MERN event platform with real-time updates, achieving 1000+ unique user visits and improving registration efficiency by 60%.',
      'Supported cross-functional teams to reduce technical issues by 40% during events.',
    ],
    techStack: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
];

function parseFlexibleDate(str?: string): Date | null {
  if (!str || !str.trim()) return null;
  const s = str.trim().toLowerCase();

  const monthMap: Record<string, number> = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
    nov: 10, november: 10, dec: 11, december: 11,
  };

  // Match e.g. "25/05/2025" or "25-05-2025" or "25.05.2025" (DD/MM/YYYY)
  const dmyMatch = s.match(/^([0-9]{1,2})[\/\-\.\s]+([0-9]{1,2})[\/\-\.\s]+([0-9]{4})$/);
  if (dmyMatch) {
    const p1 = parseInt(dmyMatch[1], 10);
    const p2 = parseInt(dmyMatch[2], 10);
    const y  = parseInt(dmyMatch[3], 10);
    let day = p1;
    let month = p2 - 1;
    if (p1 <= 12 && p2 > 12) {
      // MM/DD/YYYY format
      month = p1 - 1;
      day = p2;
    }
    if (month >= 0 && month <= 11 && !isNaN(y)) {
      return new Date(y, month, day || 1);
    }
  }

  // Match e.g. "2025-05-25" (YYYY-MM-DD)
  const ymdMatch = s.match(/^([0-9]{4})[\/\-\.\s]+([0-9]{1,2})[\/\-\.\s]+([0-9]{1,2})$/);
  if (ymdMatch) {
    const y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10) - 1;
    const d = parseInt(ymdMatch[3], 10);
    if (m >= 0 && m <= 11 && !isNaN(y)) {
      return new Date(y, m, d || 1);
    }
  }

  // Match e.g. "25 May 2025" or "May 25 2025"
  const dMyMatch = s.match(/^([0-9]{1,2}|[a-z]{3,9})[\s\/\-\,]+([0-9]{1,2}|[a-z]{3,9})[\s\/\-\,]+([0-9]{4})$/);
  if (dMyMatch) {
    const token1 = dMyMatch[1];
    const token2 = dMyMatch[2];
    const y = parseInt(dMyMatch[3], 10);
    let m = -1;
    if (monthMap[token1] !== undefined) m = monthMap[token1];
    else if (monthMap[token2] !== undefined) m = monthMap[token2];
    else {
      const num1 = parseInt(token1, 10);
      const num2 = parseInt(token2, 10);
      if (num1 > 0 && num1 <= 12) m = num1 - 1;
      else if (num2 > 0 && num2 <= 12) m = num2 - 1;
    }
    if (m !== -1 && !isNaN(y)) {
      return new Date(y, m, 1);
    }
  }

  // Match e.g. "Apr 2025", "April 2025", "Apr-2025", "05/2025"
  const monthYearMatch = s.match(/^([a-z]{3,9}|[0-9]{1,2})[\s\/\-\,\.]+([0-9]{4})$/);
  if (monthYearMatch) {
    const mStr = monthYearMatch[1];
    const year = parseInt(monthYearMatch[2], 10);
    let month = -1;
    if (monthMap[mStr] !== undefined) {
      month = monthMap[mStr];
    } else {
      const numM = parseInt(mStr, 10);
      if (!isNaN(numM) && numM >= 1 && numM <= 12) month = numM - 1;
    }
    if (month !== -1 && !isNaN(year)) {
      return new Date(year, month, 1);
    }
  }

  // Match single year e.g. "2025"
  if (/^[0-9]{4}$/.test(s)) {
    return new Date(parseInt(s, 10), 0, 1);
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function calcDuration(startDateStr: string, endDateStr?: string, current?: boolean): string {
  if (!startDateStr) return '';
  const start = parseFlexibleDate(startDateStr);
  const end   = current || !endDateStr ? new Date() : parseFlexibleDate(endDateStr);

  if (!start || !end) return '';

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  if (months <= 0) months = 1;

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  const parts = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (remMonths > 0) parts.push(`${remMonths} mo${remMonths > 1 ? 's' : ''}`);

  return parts.join(' ');
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    fetch('/api/experience')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setExperiences(data); })
      .catch(() => {});
  }, []);

  const exp = experiences[selected];
  const durationText = exp ? calcDuration(exp.startDate, exp.endDate, exp.current) : '';

  return (
    <section id="experience" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">03 — Experience</p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Where I've Been
        </h2>
        <div className="mt-4 w-24 h-px" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab list */}
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible lg:min-w-[240px] pb-2 lg:pb-0">
          {experiences.map((e, i) => {
            const color = typeColors[e.type] || '#00d4ff';
            const dur   = calcDuration(e.startDate, e.endDate, e.current);
            return (
              <button
                key={e._id}
                onClick={() => setSelected(i)}
                className="flex-shrink-0 lg:w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group"
                style={{
                  background: selected === i ? `${color}12` : 'transparent',
                  border: `1px solid ${selected === i ? color + '40' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div
                  className="text-xs font-mono truncate transition-colors font-bold"
                  style={{ color: selected === i ? color : 'rgba(255,255,255,0.7)' }}
                >
                  {e.company.split(',')[0]}
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-white/30 text-[10px] font-mono capitalize">{e.type}</span>
                  {dur && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${color}15`, color }}>
                      {dur}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {exp && (
          <div
            key={exp._id}
            className="flex-1 rounded-2xl p-8 animate-fade-in"
            style={{
              background: 'rgba(13,13,26,0.6)',
              border: `1px solid ${typeColors[exp.type] || '#00d4ff'}20`,
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1" style={{ fontFamily: "'Courier New', monospace" }}>
                  {exp.role}
                </h3>
                <p className="text-white/50 text-sm">{exp.company}</p>
              </div>
              <div className="text-right">
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-mono capitalize"
                  style={{
                    background: `${typeColors[exp.type] || '#00d4ff'}15`,
                    color: typeColors[exp.type] || '#00d4ff',
                    border: `1px solid ${typeColors[exp.type] || '#00d4ff'}30`,
                  }}
                >
                  {exp.type}
                </div>
                <p className="text-white/40 text-xs font-mono mt-1 font-bold">
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate} {durationText && <span className="text-[#00d4ff] font-normal">· {durationText}</span>}
                </p>
                <p className="text-white/20 text-xs font-mono">{exp.location}</p>
              </div>
            </div>

            {/* Bullets */}
            <ul className="space-y-3 mb-6">
              {exp.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-white/60 text-sm leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 flex-shrink-0 rounded-full" style={{ background: typeColors[exp.type] || '#00d4ff' }} />
                  {b}
                </li>
              ))}
            </ul>

            {/* Tech stack */}
            {exp.techStack && exp.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-5 border-t border-white/5">
                {exp.techStack.map(t => (
                  <span key={t} className="px-2.5 py-1 text-xs font-mono rounded-md" style={{ background: 'rgba(0,212,255,0.06)', color: 'rgba(0,212,255,0.6)', border: '1px solid rgba(0,212,255,0.12)' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
