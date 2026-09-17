'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Clock, 
  Grid, 
  ListTree,
  Building2,
  Award,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Code2,
  Briefcase,
  GitFork,
  Milestone,
  CheckCircle2,
  FolderGit2
} from 'lucide-react';

export interface Position {
  _id?: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack?: string[];
  description?: string;
}

export interface RelatedProject {
  id: string;
  title: string;
  category?: string;
  description: string;
}

export interface Experience {
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
  featured?: boolean;
  positions?: Position[];
  relatedProjects?: RelatedProject[];
}

export interface DynamicCategory {
  _id?: string;
  name: string;
  slug: string;
  color: string;
  bg?: string;
  isActive?: boolean;
  showInFilters?: boolean;
  order?: number;
}

const typeConfig: Record<string, { color: string; label: string; bg: string }> = {
  internship:  { color: '#00d4ff', label: 'Internship',  bg: 'rgba(0,212,255,0.1)' },
  research:    { color: '#f59e0b', label: 'Research',    bg: 'rgba(245,158,11,0.1)' },
  leadership:  { color: '#ec4899', label: 'Leadership',  bg: 'rgba(236,72,153,0.1)' },
  club:        { color: '#a855f7', label: 'Club / Org',  bg: 'rgba(168,85,247,0.1)' },
  'part-time': { color: '#10b981', label: 'Part-Time',   bg: 'rgba(16,185,129,0.1)' },
};

const defaultExperiences: Experience[] = [
  {
    _id: '1',
    role: 'Full Stack Development Intern',
    company: 'Religare Broking Limited',
    type: 'internship',
    location: 'Noida / New Delhi, India',
    startDate: 'May 2026',
    endDate: 'Jun 2026',
    current: false,
    featured: true,
    bullets: [
      'Automated and validated end-to-end trading application user flows using Maestro and Flutter for cross-platform reliability.',
      'Developed and integrated full-stack API services ensuring high throughput, data integrity, and sub-second execution.',
      'Collaborated with engineering teams to enhance testing automation and feature delivery pipelines across staging and production.',
    ],
    techStack: ['Flutter', 'Maestro', 'Node.js', 'REST APIs', 'Full Stack Automation'],
  },
  {
    _id: '2',
    role: 'Summer Research Industrial Intern',
    company: 'Vellore Institute of Technology, Chennai',
    type: 'research',
    location: 'Chennai, India',
    startDate: 'May 2025',
    endDate: 'Jul 2025',
    current: false,
    featured: true,
    bullets: [
      'Trained a Graph Neural Networks (GNN) model for financial anomaly detection with an accuracy of 99.94% and 0.9786 AUC Score.',
      'Utilized PyTorch Geometric Library for training models on two GCNConv layers using ReLU activation function.',
      'Engineered graph node embeddings and feature matrices to detect fraudulent transaction topologies with near-zero false alarms.',
    ],
    techStack: ['Python', 'PyTorch Geometric', 'scikit-learn', 'Graph Neural Networks', 'NumPy'],
  },
  {
    _id: '3',
    role: 'Chairperson & Advisory Member',
    company: 'Haryana Literary Association (HLA), VIT Chennai',
    type: 'leadership',
    location: 'Chennai, India',
    startDate: 'Feb 2025',
    current: true,
    bullets: [
      'Led 10+ campus-wide cultural & literary initiatives, driving 2000+ total participant engagement and campus reach.',
      'Streamlined organizational event workflows, reducing planning time by 30% through effective task delegation and timeline scheduling.',
      'Mentored incoming executive board members on governance, event planning frameworks, and university compliance.',
    ],
    techStack: ['Strategic Leadership', 'Event Operations', 'Team Mentorship', 'Budget Planning'],
    positions: [
      {
        _id: 'pos-1',
        role: 'Chairperson',
        startDate: 'Feb 2025',
        endDate: 'Feb 2026',
        current: false,
        bullets: [
          'Led 10+ campus-wide cultural & literary initiatives, driving 2000+ total participant engagement and campus reach.',
          'Streamlined organizational event workflows, reducing planning time by 30% through effective task delegation and scheduling.',
          'Spearheaded an executive team of 25+ student coordinators across technical, logistics, and outreach domains.',
        ],
        techStack: ['Strategic Leadership', 'Event Operations', 'Budget Planning'],
      },
      {
        _id: 'pos-2',
        role: 'Advisory Member',
        startDate: 'Feb 2026',
        current: true,
        bullets: [
          'Mentoring the incoming executive board on governance, event planning frameworks, and university compliance.',
          'Advising on strategic growth initiatives, alumni outreach, and multi-club collaborative hackathons.',
        ],
        techStack: ['Team Mentorship', 'Strategic Advisory', 'Governance'],
      }
    ],
  },
  {
    _id: '4',
    role: 'Head of Web Development',
    company: 'Newton School Coding Club (NSCC), VIT Chennai',
    type: 'club',
    location: 'Chennai, India',
    startDate: 'Apr 2025',
    current: true,
    bullets: [
      'Led 5+ large-scale tech and cultural events, driving 1500+ attendee participation and increasing event reach by 40%.',
      'Spearheaded workshops and coding competitions boosting club membership by 35% year-over-year.',
      'Mentored 20+ junior developers, improving code quality and project delivery timelines by 25%.',
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Web Architecture'],
    relatedProjects: [
      {
        id: '1',
        title: 'Skill-Bridge',
        category: 'fullstack',
        description: 'AI-based interview simulators & student-investor platform built with Next.js and Node.js.',
      }
    ],
  },
  {
    _id: '5',
    role: 'Full Stack & SEO Intern',
    company: 'HuslAI (Kriten Enterprises Private Limited)',
    type: 'internship',
    location: 'Chennai, India',
    startDate: 'Aug 2025',
    endDate: 'Sep 2025',
    current: false,
    bullets: [
      'Improved Search Engine Optimization (SEO) for Huslai, achieving a 3-4% increase in site visibility.',
      'Expanded B2B business outreach by connecting with potential enterprise clients.',
      'Enhanced website engagement metrics by 5-10%, driving higher user interaction and lower bounce rates.',
    ],
    techStack: ['SEO', 'Google Analytics', 'Next.js', 'B2B Growth'],
  },
  {
    _id: '6',
    role: 'Technical Team Member',
    company: 'IEEE RAS, VIT Chennai',
    type: 'club',
    location: 'Chennai, India',
    startDate: 'Jun 2024',
    endDate: 'Jul 2025',
    current: false,
    bullets: [
      'Managed 3+ national-level hackathons with 500+ combined participants, enhancing VIT\'s technical culture.',
      'Developed a MERN event platform with real-time updates, achieving 1000+ unique user visits and improving registration efficiency by 60%.',
      'Supported cross-functional teams to reduce technical issues by 40% during events.',
    ],
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io'],
    relatedProjects: [
      {
        id: '4',
        title: 'MERN Event Platform',
        category: 'fullstack',
        description: 'Real-time event management platform built for IEEE RAS with live registrations and updates.',
      }
    ],
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

  const dmyMatch = s.match(/^([0-9]{1,2})[\/\-\.\s]+([0-9]{1,2})[\/\-\.\s]+([0-9]{4})$/);
  if (dmyMatch) {
    const p1 = parseInt(dmyMatch[1], 10);
    const p2 = parseInt(dmyMatch[2], 10);
    const y  = parseInt(dmyMatch[3], 10);
    let day = p1;
    let month = p2 - 1;
    if (p1 <= 12 && p2 > 12) {
      month = p1 - 1;
      day = p2;
    }
    if (month >= 0 && month <= 11 && !isNaN(y)) {
      return new Date(y, month, day || 1);
    }
  }

  const ymdMatch = s.match(/^([0-9]{4})[\/\-\.\s]+([0-9]{1,2})[\/\-\.\s]+([0-9]{1,2})$/);
  if (ymdMatch) {
    const y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10) - 1;
    const d = parseInt(ymdMatch[3], 10);
    if (m >= 0 && m <= 11 && !isNaN(y)) {
      return new Date(y, m, d || 1);
    }
  }

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

function getCompanyMonogram(company: string): string {
  const clean = company.replace(/\(.*?\)/g, '').trim();
  const words = clean.split(/[\s,]+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'EXP';
}

function extractMetrics(bullets: string[]): string[] {
  const metrics: string[] = [];
  const regex = /(\d+(?:\.\d+)?%|\d+\+\s*(?:attendees|participants|users|events|developers)?|\b0\.\d+\s*AUC\b|\d+(?:-\d+)?%)/gi;
  
  for (const bullet of bullets) {
    const matches = bullet.match(regex);
    if (matches) {
      for (const m of matches) {
        const trimmed = m.trim();
        if (trimmed.length >= 2 && !metrics.includes(trimmed)) {
          metrics.push(trimmed);
        }
      }
    }
  }
  return metrics.slice(0, 3);
}

function renderHighlightedText(text: string, color: string) {
  const parts = text.split(/(\d+(?:\.\d+)?%|\d+\+(?:\s*[a-zA-Z]+)?|\b0\.\d+\s*AUC\b|\b\d+(?:-\d+)?%\b)/g);
  return parts.map((part, i) => {
    if (/(\d+(?:\.\d+)?%|\d+\+(?:\s*[a-zA-Z]+)?|\b0\.\d+\s*AUC\b|\b\d+(?:-\d+)?%\b)/.test(part)) {
      return (
        <span
          key={i}
          className="font-bold font-mono px-1 py-0.5 rounded mx-0.5"
          style={{
            color: '#ffffff',
            backgroundColor: `${color}25`,
            borderBottom: `1px solid ${color}`,
            textShadow: `0 0 12px ${color}40`,
          }}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [serverCategories, setServerCategories] = useState<DynamicCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string>(defaultExperiences[0]?._id || '1');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'inspector' | 'timeline'>('inspector');
  const [selectedPositionIdx, setSelectedPositionIdx] = useState<Record<string, number>>({});
  const [showJourneyMap, setShowJourneyMap] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/experience').then(r => r.json()).catch(() => null),
      fetch('/api/experience-categories').then(r => r.json()).catch(() => null)
    ]).then(([expData, catData]) => {
      if (Array.isArray(catData) && catData.length > 0) {
        setServerCategories(catData.filter(c => c.isActive !== false));
      }

      if (Array.isArray(expData) && expData.length > 0) {
        // Merge API data with rich default metadata (positions, featured, relatedProjects) where matching
        const merged = expData.map(apiExp => {
          const match = defaultExperiences.find(d => 
            d.company.toLowerCase().includes(apiExp.company?.toLowerCase().slice(0, 8) || '') ||
            d.role.toLowerCase().includes(apiExp.role?.toLowerCase().slice(0, 8) || '')
          );
          return {
            ...apiExp,
            featured: apiExp.featured ?? match?.featured,
            positions: apiExp.positions && apiExp.positions.length > 0 ? apiExp.positions : match?.positions,
            relatedProjects: apiExp.relatedProjects && apiExp.relatedProjects.length > 0 ? apiExp.relatedProjects : match?.relatedProjects,
          };
        });

        // Ensure default experiences not in DB are still preserved if needed
        const finalExperiences = merged.length >= defaultExperiences.length ? merged : defaultExperiences;
        setExperiences(finalExperiences);
        setSelectedId(finalExperiences[0]._id);
      }
    });
  }, []);

  const typeConfigMap = useMemo(() => {
    const map: Record<string, { color: string; label: string; bg: string }> = { ...typeConfig };
    serverCategories.forEach(cat => {
      if (cat.slug) {
        map[cat.slug.toLowerCase()] = {
          color: cat.color || '#00d4ff',
          label: cat.name || cat.slug,
          bg: cat.bg || `${cat.color || '#00d4ff'}15`,
        };
      }
    });
    return map;
  }, [serverCategories]);

  const categories = useMemo(() => {
    if (serverCategories.length > 0) {
      const activeCats = serverCategories
        .filter(c => c.showInFilters !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(c => c.slug.toLowerCase());
      
      const expTypes = Array.from(new Set(experiences.map(e => e.type.toLowerCase())));
      const combined = Array.from(new Set([...activeCats, ...expTypes]));
      return ['all', ...combined];
    }
    const types = Array.from(new Set(experiences.map(e => e.type.toLowerCase())));
    return ['all', ...types];
  }, [experiences, serverCategories]);

  const filteredExperiences = useMemo(() => {
    if (activeCategory === 'all') return experiences;
    return experiences.filter(e => e.type.toLowerCase() === activeCategory.toLowerCase());
  }, [experiences, activeCategory]);

  useEffect(() => {
    if (filteredExperiences.length > 0 && !filteredExperiences.some(e => e._id === selectedId)) {
      setSelectedId(filteredExperiences[0]._id);
    }
  }, [filteredExperiences, selectedId]);

  const selectedExp = experiences.find(e => e._id === selectedId) || filteredExperiences[0] || experiences[0];
  const typeStyle = selectedExp ? (typeConfigMap[selectedExp.type?.toLowerCase()] || typeConfig[selectedExp.type] || { color: '#00d4ff', label: selectedExp.type, bg: 'rgba(0,212,255,0.1)' }) : typeConfig.internship;
  
  // Handle Multi-position selection within an organization
  const currentPosIdx = selectedExp && selectedPositionIdx[selectedExp._id] !== undefined ? selectedPositionIdx[selectedExp._id] : 0;
  const activePosition = selectedExp?.positions && selectedExp.positions[currentPosIdx] ? selectedExp.positions[currentPosIdx] : null;

  const displayRole = activePosition ? activePosition.role : (selectedExp?.role || '');
  const displayBullets = activePosition ? activePosition.bullets : (selectedExp?.bullets || []);
  const displayTech = activePosition?.techStack || selectedExp?.techStack || [];
  const displayStartDate = activePosition ? activePosition.startDate : selectedExp?.startDate;
  const displayEndDate = activePosition ? activePosition.endDate : selectedExp?.endDate;
  const displayCurrent = activePosition ? activePosition.current : selectedExp?.current;

  const durationText = selectedExp ? calcDuration(displayStartDate || '', displayEndDate, displayCurrent) : '';
  const activeMetrics = extractMetrics(displayBullets);

  // Recruiter Quick Summary Statistics
  const recruiterStats = useMemo(() => {
    const totalRolesCount = experiences.reduce((acc, e) => acc + (e.positions ? e.positions.length : 1), 0);
    const orgsCount = new Set(experiences.map(e => e.company.split(',')[0].trim())).size;
    const researchCount = experiences.filter(e => e.type?.toLowerCase() === 'research').length;
    const leadershipCount = experiences.filter(e => e.type?.toLowerCase() === 'leadership' || e.type?.toLowerCase() === 'club').length;
    return { totalRolesCount, orgsCount, researchCount, leadershipCount };
  }, [experiences]);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="experience" className="py-28 px-6 max-w-6xl mx-auto relative">
      {/* Background ambient neon glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none blur-[140px] opacity-20 transition-colors duration-700"
        style={{ background: typeStyle.color }}
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-[#00d4ff]" />
            <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase">03 — Career & Leadership</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Courier New', monospace" }}>
            Experience & Journey
          </h2>
          <div className="mt-4 w-24 h-0.5" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />
        </div>

        {/* View Mode Switcher Toggle & Career Journey Button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Career Journey Map Toggle */}
          <button
            onClick={() => setShowJourneyMap(prev => !prev)}
            aria-label="Toggle career journey timeline overview"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-300 border ${
              showJourneyMap
                ? 'bg-[#7c3aed]/20 text-[#a855f7] border-[#7c3aed]/50 shadow-[0_0_15px_rgba(124,58,237,0.25)]'
                : 'text-white/60 bg-white/[0.03] border-white/[0.08] hover:text-white hover:border-white/20'
            }`}
          >
            <Milestone className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>{showJourneyMap ? 'Hide Journey Roadmap' : 'Career Roadmap'}</span>
          </button>

          {/* View Modes */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <button
              onClick={() => setViewMode('inspector')}
              aria-label="Switch to Interactive Tab Inspector view"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${
                viewMode === 'inspector'
                  ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#7c3aed]/20 text-white border border-[#00d4ff]/40 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>Interactive Tab</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              aria-label="Switch to Full Timeline Stream view"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${
                viewMode === 'timeline'
                  ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#7c3aed]/20 text-white border border-[#00d4ff]/40 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <ListTree className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>Timeline Stream</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recruiter Quick Summary Bar (Phase 7 & Phase 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md mb-8 relative z-10">
        <div className="flex flex-col">
          <span className="text-white/40 text-[11px] font-mono uppercase tracking-wider">Total Positions</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 flex items-center gap-1.5">
            {recruiterStats.totalRolesCount}
            <span className="text-xs font-normal text-[#00d4ff]">Roles</span>
          </span>
        </div>
        <div className="flex flex-col border-l border-white/[0.06] pl-3">
          <span className="text-white/40 text-[11px] font-mono uppercase tracking-wider">Organizations</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 flex items-center gap-1.5">
            {recruiterStats.orgsCount}
            <span className="text-xs font-normal text-[#a855f7]">Entities</span>
          </span>
        </div>
        <div className="flex flex-col border-l border-white/[0.06] pl-3">
          <span className="text-white/40 text-[11px] font-mono uppercase tracking-wider">Research & ML</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 flex items-center gap-1.5">
            {recruiterStats.researchCount}
            <span className="text-xs font-normal text-[#f59e0b]">Project</span>
          </span>
        </div>
        <div className="flex flex-col border-l border-white/[0.06] pl-3">
          <span className="text-white/40 text-[11px] font-mono uppercase tracking-wider">Leadership & Lead</span>
          <span className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 flex items-center gap-1.5">
            {recruiterStats.leadershipCount}
            <span className="text-xs font-normal text-[#ec4899]">Orgs</span>
          </span>
        </div>
      </div>

      {/* Interactive Career Journey Roadmap View (Phase 4) */}
      <AnimatePresence>
        {showJourneyMap && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden relative z-10"
          >
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0e0e1e]/90 to-[#070712]/90 border border-[#7c3aed]/30 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Milestone className="w-4 h-4 text-[#a855f7]" />
                  <h3 className="text-sm font-mono uppercase font-bold text-white tracking-widest">
                    Career & Leadership Growth Trajectory
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#a855f7] bg-[#7c3aed]/10 px-2.5 py-1 rounded-full border border-[#7c3aed]/20">
                  2024 — 2026 Milestone Map
                </span>
              </div>

              {/* Responsive Visual Milestones Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {/* 2024 Column */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                    <span className="text-base font-black font-mono text-[#00d4ff]">2024</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">Foundation & MERN</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <span className="text-[10px] font-mono text-[#a855f7] uppercase font-bold">IEEE RAS VIT</span>
                      <p className="text-xs font-bold text-white mt-0.5">Technical Team Member</p>
                      <p className="text-[11px] text-white/40 font-mono mt-1">MERN Event Platform · Hackathons</p>
                    </div>
                  </div>
                </div>

                {/* 2025 Column */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                    <span className="text-base font-black font-mono text-[#f59e0b]">2025</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">Research & Scale</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/20">
                      <span className="text-[10px] font-mono text-[#f59e0b] uppercase font-bold">VIT Chennai Research</span>
                      <p className="text-xs font-bold text-white mt-0.5">ML Research Intern</p>
                      <p className="text-[11px] text-white/40 font-mono mt-1">99.94% Acc · GNN Fraud Detection</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#a855f7]/5 border border-[#a855f7]/20">
                      <span className="text-[10px] font-mono text-[#a855f7] uppercase font-bold">NSCC Coding Club</span>
                      <p className="text-xs font-bold text-white mt-0.5">Head of Web Development</p>
                      <p className="text-[11px] text-white/40 font-mono mt-1">1500+ Attendees · Next.js · React</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#ec4899]/5 border border-[#ec4899]/20">
                      <span className="text-[10px] font-mono text-[#ec4899] uppercase font-bold">Haryana Lit. Assoc.</span>
                      <p className="text-xs font-bold text-white mt-0.5">Chairperson (2025–26)</p>
                      <p className="text-[11px] text-white/40 font-mono mt-1">2000+ Reach · 10+ Major Events</p>
                    </div>
                  </div>
                </div>

                {/* 2026 Column */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                    <span className="text-base font-black font-mono text-[#10b981]">2026</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">Industry & Advisory</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-[#00d4ff]/5 border border-[#00d4ff]/20">
                      <span className="text-[10px] font-mono text-[#00d4ff] uppercase font-bold">Religare Broking Ltd</span>
                      <p className="text-xs font-bold text-white mt-0.5">Full Stack Dev Intern</p>
                      <p className="text-[11px] text-white/40 font-mono mt-1">Flutter · Maestro · Trading Automation</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#ec4899]/5 border border-[#ec4899]/20">
                      <span className="text-[10px] font-mono text-[#ec4899] uppercase font-bold">Haryana Lit. Assoc.</span>
                      <p className="text-xs font-bold text-white mt-0.5">Advisory Member</p>
                      <p className="text-[11px] text-white/40 font-mono mt-1">Executive Mentorship & Governance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar relative z-10">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          const conf = typeConfigMap[cat] || typeConfig[cat] || { color: '#00d4ff', label: cat, bg: 'rgba(0,212,255,0.1)' };
          const count = cat === 'all' ? experiences.length : experiences.filter(e => e.type?.toLowerCase() === cat.toLowerCase()).length;
          
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 border flex-shrink-0 ${
                isSelected
                  ? 'text-white border-white/30 shadow-lg scale-[1.02]'
                  : 'text-white/40 border-white/[0.06] bg-white/[0.02] hover:text-white/70 hover:border-white/15'
              }`}
              style={{
                background: isSelected ? (cat === 'all' ? 'rgba(255,255,255,0.1)' : conf.bg) : undefined,
                borderColor: isSelected ? (cat === 'all' ? '#ffffff40' : `${conf.color}60`) : undefined,
                boxShadow: isSelected ? `0 0 20px ${cat === 'all' ? 'rgba(255,255,255,0.1)' : conf.color + '25'}` : undefined,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cat === 'all' ? '#00d4ff' : conf.color }}
              />
              <span className="capitalize">{cat === 'all' ? 'All Roles' : (conf.label || cat)}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-white/70 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: INSPECTOR TAB VIEW */}
      {viewMode === 'inspector' && (
        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Left: Connected Glowing Timeline Tab Rail */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="relative flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0">
              {/* Vertical connector track (Desktop) */}
              <div 
                className="hidden lg:block absolute left-[26px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none"
              />

              {filteredExperiences.map((e) => {
                const isSelected = e._id === selectedExp?._id;
                const conf = typeConfigMap[e.type?.toLowerCase()] || typeConfig[e.type] || { color: '#00d4ff', label: e.type, bg: 'rgba(0,212,255,0.1)' };
                const dur = calcDuration(e.startDate, e.endDate, e.current);
                const monogram = getCompanyMonogram(e.company);
                const hasMultiPositions = Boolean(e.positions && e.positions.length > 1);

                return (
                  <button
                    key={e._id}
                    onClick={() => setSelectedId(e._id)}
                    className={`group relative text-left p-4 rounded-2xl transition-all duration-300 w-72 lg:w-full flex-shrink-0 flex items-start gap-4 border ${
                      isSelected
                        ? 'bg-white/[0.07] border-white/20 shadow-xl backdrop-blur-xl'
                        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10'
                    }`}
                    style={{
                      borderColor: isSelected ? `${conf.color}50` : undefined,
                      boxShadow: isSelected ? `0 4px 24px -6px ${conf.color}30` : undefined,
                    }}
                  >
                    {/* Active highlight bar indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="active-timeline-indicator"
                        className="absolute -left-[1px] top-3 bottom-3 w-1 rounded-r-full"
                        style={{ backgroundColor: conf.color, boxShadow: `0 0 10px ${conf.color}` }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    {/* Monogram Badge with Status Dot */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center font-mono font-black text-xs transition-transform duration-300 group-hover:scale-105"
                        style={{
                          background: isSelected ? `${conf.color}20` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? conf.color + '60' : 'rgba(255,255,255,0.08)'}`,
                          color: isSelected ? conf.color : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {monogram}
                      </div>

                      {/* Live pulse dot for current roles */}
                      {e.current && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0d0d1a]" />
                        </span>
                      )}
                    </div>

                    {/* Role Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            color: conf.color,
                            backgroundColor: `${conf.color}15`,
                            border: `1px solid ${conf.color}30`,
                          }}
                        >
                          {conf.label}
                        </span>
                        
                        {e.featured && (
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20 flex items-center gap-1">
                            ★ Top
                          </span>
                        )}

                        {dur && (
                          <span className="text-[10px] font-mono text-white/40">
                            {dur}
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-bold truncate transition-colors ${
                          isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                        }`}
                      >
                        {e.role}
                      </h4>
                      <p className="text-white/40 text-xs truncate mt-0.5">
                        {e.company.split(',')[0]}
                      </p>

                      {hasMultiPositions && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#ec4899]">
                          <GitFork className="w-3 h-3" />
                          <span>{e.positions?.length} Positions (Progression)</span>
                        </div>
                      )}

                      <div className="text-[10px] font-mono text-white/30 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3 inline-block" />
                        <span>{e.startDate} — {e.current ? 'Present' : e.endDate}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Experience Card with Animation (Phase 2, 3, 5, 8, 9) */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selectedExp && (
                <motion.div
                  key={`${selectedExp._id}-${currentPosIdx}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="rounded-3xl p-6 md:p-9 relative overflow-hidden backdrop-blur-2xl border"
                  style={{
                    background: selectedExp.featured 
                      ? 'linear-gradient(145deg, rgba(20,18,38,0.92) 0%, rgba(10,10,22,0.8) 100%)'
                      : 'linear-gradient(145deg, rgba(16,16,32,0.85) 0%, rgba(10,10,22,0.7) 100%)',
                    borderColor: selectedExp.featured ? `${typeStyle.color}50` : `${typeStyle.color}30`,
                    boxShadow: `0 20px 50px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px ${typeStyle.color}15`,
                  }}
                >
                  {/* Decorative Corner Glow */}
                  <div
                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-40"
                    style={{ background: typeStyle.color }}
                  />

                  {/* Header Info */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/[0.08] relative z-10">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap mb-2">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-mono capitalize tracking-wide font-medium flex items-center gap-1.5"
                          style={{
                            background: `${typeStyle.color}15`,
                            color: typeStyle.color,
                            border: `1px solid ${typeStyle.color}40`,
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: typeStyle.color }} />
                          {typeStyle.label}
                        </span>

                        {selectedExp.featured && (
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            Featured Experience Spotlight
                          </span>
                        )}

                        {displayCurrent && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active Position
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        {displayRole}
                      </h3>
                      <p className="text-white/80 text-base font-medium mt-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-white/40 inline-block" />
                        {selectedExp.company}
                      </p>
                    </div>

                    {/* Date & Location Pill Info */}
                    <div className="flex flex-col md:items-end gap-1.5 text-xs font-mono flex-shrink-0 bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.05]">
                      <div className="flex items-center gap-2 text-white/90 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-[#00d4ff]" />
                        <span>{displayStartDate} — {displayCurrent ? 'Present' : displayEndDate}</span>
                      </div>
                      {durationText && (
                        <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                          <Clock className="w-3 h-3 text-[#00d4ff]/70" />
                          <span style={{ color: typeStyle.color }}>{durationText}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-white/40 text-[11px] pt-1 border-t border-white/[0.05] w-full md:justify-end">
                        <MapPin className="w-3 h-3 text-white/30" />
                        <span>{selectedExp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Position Progression Sub-Navigator (Phase 2) */}
                  {selectedExp.positions && selectedExp.positions.length > 1 && (
                    <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-[#ec4899]/10 via-white/[0.02] to-transparent border border-[#ec4899]/25 relative z-10">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-xs font-mono text-[#ec4899] font-bold uppercase tracking-wider">
                          <GitFork className="w-4 h-4" />
                          <span>Role Progression Journey</span>
                        </div>
                        <span className="text-[11px] font-mono text-white/40">Select position to inspect</span>
                      </div>

                      {/* Connected Interactive Steps */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        {selectedExp.positions.map((pos, pIdx) => {
                          const isPosActive = currentPosIdx === pIdx;
                          return (
                            <button
                              key={pIdx}
                              onClick={() => setSelectedPositionIdx(prev => ({ ...prev, [selectedExp._id]: pIdx }))}
                              className={`flex-1 flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-300 ${
                                isPosActive
                                  ? 'bg-[#ec4899]/20 border-[#ec4899]/60 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                                  : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 text-white/60'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${isPosActive ? 'bg-[#ec4899]' : 'bg-white/30'}`} />
                                  <span className={`text-xs font-bold font-mono ${isPosActive ? 'text-white' : 'text-white/70'}`}>
                                    {pos.role}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-white/40 block mt-0.5 ml-4">
                                  {pos.startDate} — {pos.current ? 'Present' : pos.endDate}
                                </span>
                              </div>
                              {isPosActive && (
                                <span className="text-[10px] font-mono font-bold text-[#ec4899] px-2 py-0.5 rounded bg-[#ec4899]/20">
                                  Active
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Impact Metric KPI Chips */}
                  {activeMetrics.length > 0 && (
                    <div className="my-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] relative z-10">
                      <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-widest mb-3">
                        <TrendingUp className="w-3.5 h-3.5" style={{ color: typeStyle.color }} />
                        <span>Key Quantitative Impacts</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {activeMetrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold"
                            style={{
                              background: `${typeStyle.color}12`,
                              border: `1px solid ${typeStyle.color}35`,
                              color: '#ffffff',
                              boxShadow: `0 0 15px ${typeStyle.color}15`,
                            }}
                          >
                            <Sparkles className="w-3 h-3" style={{ color: typeStyle.color }} />
                            <span>{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bullet Highlights */}
                  <div className="space-y-4 my-6 relative z-10">
                    <p className="text-xs font-mono text-white/40 tracking-widest uppercase flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-white/40" />
                      <span>Responsibilities & Achievements</span>
                    </p>
                    <ul className="space-y-3">
                      {displayBullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3.5 text-white/70 text-sm leading-relaxed">
                          <span
                            className="mt-1.5 w-2 h-2 flex-shrink-0 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: typeStyle.color,
                              boxShadow: `0 0 8px ${typeStyle.color}`,
                            }}
                          />
                          <div className="flex-1">
                            {renderHighlightedText(bullet, typeStyle.color)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Related Portfolio Projects Connection (Phase 9) */}
                  {selectedExp.relatedProjects && selectedExp.relatedProjects.length > 0 && (
                    <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-[#00d4ff]/10 to-transparent border border-[#00d4ff]/20 relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff] font-bold uppercase tracking-wider">
                          <FolderGit2 className="w-3.5 h-3.5" />
                          <span>Related Project Output</span>
                        </div>
                        <button
                          onClick={scrollToProjects}
                          className="text-[11px] font-mono text-[#00d4ff] hover:underline flex items-center gap-1"
                        >
                          <span>View in Projects</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {selectedExp.relatedProjects.map(proj => (
                          <div
                            key={proj.id}
                            onClick={scrollToProjects}
                            className="group/proj p-3 rounded-xl bg-black/40 border border-white/10 hover:border-[#00d4ff]/40 transition-all cursor-pointer flex items-center justify-between gap-4"
                          >
                            <div>
                              <span className="text-xs font-bold font-mono text-white group-hover/proj:text-[#00d4ff] transition-colors">
                                {proj.title}
                              </span>
                              <p className="text-xs text-white/50 mt-0.5">{proj.description}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-white/30 group-hover/proj:text-[#00d4ff] flex-shrink-0 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech Stack Chips */}
                  {displayTech && displayTech.length > 0 && (
                    <div className="pt-6 border-t border-white/[0.08] relative z-10">
                      <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Core Technologies & Frameworks</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {displayTech.map(tech => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs font-mono rounded-lg transition-all duration-300 hover:border-white/30 hover:scale-105"
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              color: 'rgba(255,255,255,0.85)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FULL TIMELINE STREAM */}
      {viewMode === 'timeline' && (
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Continuous vertical timeline center line */}
          <div className="absolute left-6 md:left-8 top-4 bottom-8 w-[2px] bg-gradient-to-b from-[#00d4ff] via-[#7c3aed] to-white/10" />

          <div className="space-y-10">
            {filteredExperiences.map((exp, idx) => {
              const conf = typeConfigMap[exp.type?.toLowerCase()] || typeConfig[exp.type] || { color: '#00d4ff', label: exp.type, bg: 'rgba(0,212,255,0.1)' };
              const dur = calcDuration(exp.startDate, exp.endDate, exp.current);
              const metrics = extractMetrics(exp.bullets);
              const monogram = getCompanyMonogram(exp.company);

              return (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative pl-14 md:pl-20 group"
                >
                  {/* Timeline Milestone Node */}
                  <div
                    className="absolute left-3.5 md:left-5.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                    style={{
                      backgroundColor: '#0d0d1a',
                      border: `2px solid ${conf.color}`,
                      boxShadow: `0 0 15px ${conf.color}80`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: conf.color }}
                    />
                  </div>

                  {/* Card Body */}
                  <div
                    className="rounded-3xl p-6 md:p-8 backdrop-blur-xl border transition-all duration-300 hover:border-white/20 hover:shadow-2xl"
                    style={{
                      background: exp.featured
                        ? 'linear-gradient(145deg, rgba(20,18,38,0.85) 0%, rgba(10,10,22,0.6) 100%)'
                        : 'linear-gradient(145deg, rgba(16,16,32,0.7) 0%, rgba(10,10,22,0.5) 100%)',
                      borderColor: exp.featured ? `${conf.color}40` : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3.5">
                        {/* Company Monogram */}
                        <div
                          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-black text-xs"
                          style={{
                            background: `${conf.color}15`,
                            border: `1px solid ${conf.color}40`,
                            color: conf.color,
                          }}
                        >
                          {monogram}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold"
                              style={{
                                background: `${conf.color}15`,
                                color: conf.color,
                                border: `1px solid ${conf.color}30`,
                              }}
                            >
                              {conf.label}
                            </span>

                            {exp.featured && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/30 font-bold">
                                ★ Featured
                              </span>
                            )}

                            {exp.current && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Present
                              </span>
                            )}
                          </div>

                          <h3
                            className="text-xl md:text-2xl font-black text-white"
                            style={{ fontFamily: "'Courier New', monospace" }}
                          >
                            {exp.role}
                          </h3>
                          <p className="text-white/60 text-sm font-medium mt-0.5">{exp.company}</p>
                        </div>
                      </div>

                      {/* Date & Location */}
                      <div className="text-left md:text-right font-mono text-xs flex-shrink-0">
                        <div className="text-white/80 font-bold flex items-center md:justify-end gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#00d4ff]" />
                          <span>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <div className="text-white/40 text-[11px] mt-1 flex items-center md:justify-end gap-1.5">
                          {dur && <span style={{ color: conf.color }}>{dur} · </span>}
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Role Progression breakdown in stream if multi-position */}
                    {exp.positions && exp.positions.length > 1 && (
                      <div className="my-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                        <span className="text-[10px] font-mono text-[#ec4899] uppercase font-bold tracking-wider flex items-center gap-1.5">
                          <GitFork className="w-3.5 h-3.5" />
                          Role Progression History
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {exp.positions.map((p, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <p className="text-xs font-bold text-white font-mono">{p.role}</p>
                              <span className="text-[10px] font-mono text-white/40">
                                {p.startDate} — {p.current ? 'Present' : p.endDate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metric Chips */}
                    {metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 my-4">
                        {metrics.map((m, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold"
                            style={{
                              background: `${conf.color}10`,
                              border: `1px solid ${conf.color}30`,
                              color: '#fff',
                            }}
                          >
                            <Sparkles className="w-3 h-3" style={{ color: conf.color }} />
                            {m}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bullets */}
                    <ul className="space-y-2.5 my-4">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                          <span
                            className="mt-2 w-1.5 h-1.5 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: conf.color }}
                          />
                          <div>{renderHighlightedText(b, conf.color)}</div>
                        </li>
                      ))}
                    </ul>

                    {/* Tech Stack */}
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-white/[0.06]">
                        {exp.techStack.map(t => (
                          <span
                            key={t}
                            className="px-2.5 py-0.5 text-xs font-mono rounded-md"
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              color: 'rgba(255,255,255,0.7)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section Ending Call to Action (Phase 10) */}
      <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <h4 className="text-lg font-black text-white font-mono">
            Want to see my code and architecture in action?
          </h4>
          <p className="text-sm text-white/50 font-mono mt-0.5">
            Explore live deployments, repositories, and technical breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={scrollToProjects}
            className="px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-black bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-transform duration-300 flex items-center gap-2"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <a
            href="/resume"
            className="px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-white bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-2"
          >
            <span>View Resume</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/60" />
          </a>
        </div>
      </div>
    </section>
  );
}

