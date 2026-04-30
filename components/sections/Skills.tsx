'use client';
import { useEffect, useRef, useState } from 'react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

const categoryColors: Record<string, string> = {
  technical: '#00d4ff',
  frontend:  '#7c3aed',
  backend:   '#ec4899',
  ml:        '#f59e0b',
  data:      '#10b981',
};

const categoryLabels: Record<string, string> = {
  technical: 'Technical',
  frontend:  'Frontend',
  backend:   'Backend',
  ml:        'Machine Learning',
  data:      'Data & Analytics',
};

// Default skills from resume if DB is empty
const defaultSkills: Skill[] = [
  { _id:'1',  name:'Java',               category:'technical', proficiency:85 },
  { _id:'2',  name:'Python',             category:'technical', proficiency:90 },
  { _id:'3',  name:'C/C++',              category:'technical', proficiency:80 },
  { _id:'4',  name:'SQL',                category:'technical', proficiency:82 },
  { _id:'5',  name:'AWS',                category:'technical', proficiency:75 },
  { _id:'6',  name:'Azure',              category:'technical', proficiency:78 },
  { _id:'7',  name:'GCP',                category:'technical', proficiency:70 },
  { _id:'8',  name:'React.js',           category:'frontend',  proficiency:90 },
  { _id:'9',  name:'Next.js',            category:'frontend',  proficiency:88 },
  { _id:'10', name:'TypeScript',         category:'frontend',  proficiency:85 },
  { _id:'11', name:'Tailwind',           category:'frontend',  proficiency:92 },
  { _id:'12', name:'HTML/CSS',           category:'frontend',  proficiency:95 },
  { _id:'13', name:'Node.js',            category:'backend',   proficiency:88 },
  { _id:'14', name:'Express.js',         category:'backend',   proficiency:85 },
  { _id:'15', name:'MongoDB',            category:'backend',   proficiency:85 },
  { _id:'16', name:'Redis',              category:'backend',   proficiency:70 },
  { _id:'17', name:'PyTorch Geometric',  category:'ml',        proficiency:85 },
  { _id:'18', name:'scikit-learn',       category:'ml',        proficiency:88 },
  { _id:'19', name:'NumPy/Pandas',       category:'ml',        proficiency:90 },
  { _id:'20', name:'MATLAB',             category:'data',      proficiency:75 },
  { _id:'21', name:'R Studio',           category:'data',      proficiency:72 },
  { _id:'22', name:'Matplotlib',         category:'data',      proficiency:80 },
];

function SkillBar({ skill, visible }: { skill: Skill; visible: boolean }) {
  const color = categoryColors[skill.category] || '#00d4ff';
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-white/70 font-mono group-hover:text-white transition-colors">{skill.name}</span>
        <span className="text-xs font-mono" style={{ color }}>{skill.proficiency}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${skill.proficiency}%` : '0%',
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}44`,
            transitionDelay: '0.1s',
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills]     = useState<Skill[]>(defaultSkills);
  const [visible, setVisible]   = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setSkills(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const categories = ['all', ...Array.from(new Set(skills.map(s => s.category)))];
  const filtered = activeTab === 'all' ? skills : skills.filter(s => s.category === activeTab);
  const grouped  = filtered.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-32 px-6 max-w-6xl mx-auto" ref={ref}>
      {/* Section header */}
      <div className="mb-16">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">02 — Skills</p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Tech Arsenal
        </h2>
        <div className="mt-4 w-24 h-px" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map(cat => {
          const color = categoryColors[cat] || '#00d4ff';
          const active = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300"
              style={{
                background:  active ? `${color}18` : 'transparent',
                border:      `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                color:       active ? color : 'rgba(255,255,255,0.4)',
                boxShadow:   active ? `0 0 16px ${color}22` : 'none',
              }}
            >
              {cat === 'all' ? 'All' : categoryLabels[cat] || cat}
            </button>
          );
        })}
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div
            key={cat}
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(13,13,26,0.6)',
              border: `1px solid ${categoryColors[cat] || '#00d4ff'}18`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full" style={{ background: categoryColors[cat] || '#00d4ff' }} />
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: categoryColors[cat] || '#00d4ff' }}>
                {categoryLabels[cat] || cat}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {items.map(s => <SkillBar key={s._id} skill={s} visible={visible} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
