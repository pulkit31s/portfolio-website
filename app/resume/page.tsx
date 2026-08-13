'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Profile {
  name: string;
  surname: string;
  tagline: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl?: string;
}

interface Education {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  cgpa?: string;
  coursework: string[];
}

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

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
}

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

interface Achievement {
  _id: string;
  title: string;
  event: string;
  year: number;
  description: string;
  rank?: string;
}

export default function ResumePage() {
  const [profile, setProfile]           = useState<Profile | null>(null);
  const [education, setEducation]       = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects]         = useState<Project[]>([]);
  const [skills, setSkills]             = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile').then(r => r.json()).catch(() => null),
      fetch('/api/education').then(r => r.json()).catch(() => []),
      fetch('/api/experience').then(r => r.json()).catch(() => []),
      fetch('/api/projects').then(r => r.json()).catch(() => []),
      fetch('/api/skills').then(r => r.json()).catch(() => []),
      fetch('/api/achievements').then(r => r.json()).catch(() => []),
    ]).then(([profData, eduData, expData, projData, skillData, achData]) => {
      if (profData) setProfile(profData);
      if (Array.isArray(eduData)) setEducation(eduData);
      if (Array.isArray(expData)) setExperiences(expData);
      if (Array.isArray(projData)) setProjects(projData);
      if (Array.isArray(skillData)) setSkills(skillData);
      if (Array.isArray(achData)) setAchievements(achData);
      setLoading(false);
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center text-white/50 font-mono text-sm">
        Loading ATS Resume...
      </div>
    );
  }

  const nameStr = `${profile?.name || 'PULKIT'} ${profile?.surname || 'SINGHROHA'}`;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.name);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans print:bg-white print:text-black">
      {/* Top Floating Bar — Hidden during print */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-3 shadow-xl flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="text-xs font-mono tracking-widest uppercase text-cyan-400 hover:text-white transition-colors"
        >
          ← Back to Portfolio
        </Link>
        <div className="flex items-center gap-3">
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-mono bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              📄 Original PDF
            </a>
          )}
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-mono font-bold tracking-widest uppercase text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg"
          >
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Main Resume Sheet */}
      <div className="max-w-4xl mx-auto my-6 bg-white p-8 md:p-12 shadow-2xl print:shadow-none print:m-0 print:p-0 print:max-w-none">
        {/* Header */}
        <header className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
            {nameStr}
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            {profile?.tagline || 'B.Tech CSE @ VIT Chennai · Full Stack Engineer & ML Researcher'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700 font-mono mt-3">
            {profile?.email && <span>📧 {profile.email}</span>}
            {profile?.phone && <span>📞 {profile.phone}</span>}
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-cyan-700">
                github.com/pulkit31s
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="underline hover:text-cyan-700">
                linkedin.com
              </a>
            )}
          </div>
        </header>

        {/* Education Section */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {education.map(e => (
                <div key={e._id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{e.degree}</h3>
                    <p className="text-xs text-slate-700">{e.institution} {e.location && `· ${e.location}`}</p>
                    {e.coursework && e.coursework.length > 0 && (
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        <strong className="text-slate-800">Relevant Coursework:</strong> {e.coursework.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-700">{e.startYear} – {e.endYear}</span>
                    {e.cgpa && <div className="text-xs font-mono text-cyan-800 font-bold">CGPA: {e.cgpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Technical & Professional Experience
            </h2>
            <div className="space-y-4">
              {experiences.map(e => (
                <div key={e._id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-900">
                      {e.role} <span className="font-normal text-slate-700">| {e.company}</span>
                    </h3>
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {e.startDate} – {e.current ? 'Present' : e.endDate}
                    </span>
                  </div>
                  {e.bullets && e.bullets.length > 0 && (
                    <ul className="list-disc list-inside mt-1.5 space-y-1 text-xs text-slate-700">
                      {e.bullets.map((b, i) => (
                        <li key={i} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Key Projects & Systems
            </h2>
            <div className="space-y-4">
              {projects.map(p => (
                <div key={p._id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-900">
                      {p.title}
                      {p.techStack && p.techStack.length > 0 && (
                        <span className="font-mono text-xs font-normal text-slate-600 ml-2">
                          ({p.techStack.join(', ')})
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">{p.description}</p>
                  {p.highlights && p.highlights.length > 0 && (
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-slate-700">
                      {p.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Technical Skills & Tools
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {Object.entries(skillsByCategory).map(([cat, list]) => (
                <div key={cat} className="flex">
                  <span className="font-bold text-slate-900 w-36 uppercase font-mono flex-shrink-0">{cat}:</span>
                  <span>{list.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <section>
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Honors, Awards & Hackathons
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
              {achievements.map(a => (
                <li key={a._id}>
                  <strong className="text-slate-900">{a.title}</strong> ({a.year}) — {a.description}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
