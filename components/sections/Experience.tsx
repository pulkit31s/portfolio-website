'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Layers, 
  ListTree, 
  Building2, 
  ArrowRight, 
  ExternalLink, 
  ChevronDown, 
  FolderGit2, 
  Compass, 
  FileText, 
  Workflow, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  TrendingUp, 
  Boxes, 
  Cpu, 
  ShieldCheck, 
  Target, 
  Flame, 
  Award, 
  Zap, 
  Globe, 
  Code2, 
  Check, 
  GitBranch, 
  Terminal,
  Activity
} from 'lucide-react';
import ExperienceTree from '@/components/three/ExperienceTree';
import { calculateExperienceTreeLayout } from '@/lib/experienceTreeLayout';

export interface IMetricItem {
  value: string;
  label: string;
  description?: string;
}

export interface Position {
  _id?: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack?: string[];
  description?: string;
  metrics?: IMetricItem[];
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
  shortName?: string;
  websiteUrl?: string;
  logoUrl?: string;
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
  displaySettings?: {
    showInTimeline?: boolean;
    showInStream?: boolean;
    showMetrics?: boolean;
    showRoleProgression?: boolean;
    showRelatedProjects?: boolean;
    showCTA?: boolean;
    accentColor?: string;
    promotionalLabel?: string;
    displaySide?: 'auto' | 'left' | 'right';
    nodeLabel?: string;
    roleProgressionEnabled?: boolean;
    progressionLabel?: string;
    domain?: string;
    executiveSummary?: string;
    keyTakeaway?: string;
  };
  status?: 'published' | 'draft' | 'archived';
  order?: number;
}

export interface DynamicCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  bg?: string;
  isActive?: boolean;
  showInFilters?: boolean;
  order?: number;
}

const defaultTypeConfig: Record<string, { color: string; label: string; bg: string }> = {
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
    shortName: 'RBL',
    websiteUrl: 'https://www.religareonline.com',
    type: 'internship',
    location: 'Noida, India (Hybrid)',
    startDate: 'May 2026',
    endDate: 'Jun 2026',
    current: true,
    featured: true,
    bullets: [
      'Automated end-to-end trading user journeys using Maestro and Flutter, integrating test execution into Jenkins CI/CD pipelines.',
      'Authored modular flow definitions and resilient edge-case handlers for critical production flows (e.g. KYC verification, instant funds withdrawal, order books).',
      'Engineered cross-platform mobile & web client architecture handling high-concurrency real-time market data WebSocket feeds.',
      'Constructed isolated mock staging environments ensuring 100% test reproducibility across iOS and Android runtime layers.',
      'Developed automated regression test harnesses reducing manual release sign-off time from 4 hours to under 30 minutes.'
    ],
    techStack: ['Flutter', 'Maestro', 'Jenkins', 'Dart', 'CI/CD', 'REST APIs', 'Automation', 'Docker', 'WebSockets'],
    positions: [
      {
        role: 'Full Stack Development Intern',
        startDate: 'May 2026',
        endDate: 'Jun 2026',
        current: true,
        bullets: [
          'Automated end-to-end user journeys using Maestro, integrating test runs with Jenkins pipelines to accelerate release feedback cycles.',
          'Authored modular flow definitions and resilient edge-case handlers for critical production flows.'
        ],
        techStack: ['Flutter', 'Maestro', 'Jenkins', 'Dart', 'CI/CD'],
        metrics: [
          { value: '45%', label: 'Coverage Boost', description: 'Across critical KYC & trading flows' },
          { value: '3x', label: 'Pipeline Speed', description: 'Automated release verification cycles' },
          { value: '0', label: 'Regression Leaks', description: 'Zero critical defect escapes in staging' },
          { value: '100%', label: 'Reproducibility', description: 'Deterministic mock test harnesses' }
        ]
      }
    ],
    relatedProjects: [
      { id: 'religare-qa', title: 'Maestro E2E Test Suite', category: 'DevOps & QA', description: 'Automated test suite integrated with Jenkins CI pipelines' }
    ],
    displaySettings: {
      displaySide: 'left',
      showMetrics: true,
      showRoleProgression: true,
      accentColor: '#00d4ff',
      domain: 'FinTech & High-Frequency Trading',
      executiveSummary: 'Engineered enterprise cross-platform trading automation workflows, mobile client components, and resilient CI/CD verification harnesses for high-throughput financial transactions.',
      keyTakeaway: 'Reduced release verification overhead by 65% through automated end-to-end user journeys and Jenkins pipeline integrations.'
    },
    status: 'published',
    order: 0
  },
  {
    _id: '2',
    role: 'Machine Learning Research Intern',
    company: 'VIT Research Lab',
    shortName: 'VIT-R',
    websiteUrl: 'https://chennai.vit.ac.in',
    type: 'research',
    location: 'Chennai, India',
    startDate: 'Dec 2025',
    endDate: 'Mar 2026',
    current: false,
    featured: true,
    bullets: [
      'Investigated deep learning architectures for multimodal biometric signal analysis and synthetic dataset generation.',
      'Optimized transformer self-attention mechanisms with FlashAttention-2, achieving 2.8x faster inference speeds on NVIDIA RTX GPUs.',
      'Drafted manuscript for peer-reviewed IEEE conference submission on low-latency edge AI models and attention pruning.',
      'Trained Graph Neural Network (GNN) embeddings achieving 99.94% accuracy in high-dimensional financial anomaly detection benchmarks.',
      'Engineered CUDA-accelerated preprocessing pipelines scaling data batching throughput by 4.2x.'
    ],
    techStack: ['PyTorch', 'Hugging Face', 'CUDA', 'Python', 'Weights & Biases', 'ONNX', 'GNN', 'Scikit-Learn', 'FlashAttention-2'],
    positions: [
      {
        role: 'Machine Learning Research Intern',
        startDate: 'Dec 2025',
        endDate: 'Mar 2026',
        current: false,
        bullets: [
          'Investigated deep learning architectures for multimodal biometric signal analysis and synthetic dataset generation.',
          'Optimized transformer self-attention mechanisms with FlashAttention-2, achieving 2.8x faster inference speeds.'
        ],
        techStack: ['PyTorch', 'CUDA', 'Python', 'ONNX'],
        metrics: [
          { value: '2.8x', label: 'Inference Speedup', description: 'FlashAttention-2 custom kernel optimization' },
          { value: '99.94%', label: 'GNN Accuracy', description: 'Graph neural network anomaly detection' },
          { value: '0.9786', label: 'ROC-AUC Score', description: 'Robust classification against noisy inputs' },
          { value: '1', label: 'IEEE Manuscript', description: 'Peer-reviewed conference paper submission' }
        ]
      }
    ],
    relatedProjects: [
      { id: 'neuro-edge', title: 'Edge Attention Kernel', category: 'Deep Learning', description: 'Low-latency attention layer optimized for edge AI devices' }
    ],
    displaySettings: {
      displaySide: 'right',
      showMetrics: true,
      accentColor: '#f59e0b',
      domain: 'Deep Learning & Edge AI Research',
      executiveSummary: 'Conducted advanced research on transformer optimizations, custom CUDA kernel acceleration, and graph neural network embeddings for edge devices.',
      keyTakeaway: 'Authored an IEEE manuscript demonstrating 2.8x attention inference speedups without sacrificing model precision.'
    },
    status: 'published',
    order: 1
  },
  {
    _id: '3',
    role: 'Chairperson / Advisory Board Member',
    company: 'Haryana Literary Association',
    shortName: 'HLA',
    websiteUrl: 'https://hla-vitc.org',
    type: 'leadership',
    location: 'Chennai, India',
    startDate: 'Jul 2025',
    endDate: 'Present',
    current: true,
    featured: true,
    bullets: [
      'Spearheaded 120+ student executive body, overseeing budgeting, creative direction, and technical operations for regional cultural conclaves.',
      'Scaled annual flagship event participation to 3,500+ attendees across 18 universities with zero logistical incidents.',
      'Transitioned into Advisory Board Member to mentor incoming executive committee on strategic partnerships and fundraising.',
      'Managed financial allocation exceeding ₹4.5L with complete institutional transparency and zero budget overruns.',
      'Established digital registration infrastructure handling peak concurrency of 800+ requests per minute.'
    ],
    techStack: ['Executive Leadership', 'Operations', 'Event Architecture', 'Public Speaking', 'Budget Management', 'Strategic Advisory'],
    positions: [
      {
        role: 'Advisory Board Member',
        startDate: 'Jan 2026',
        endDate: 'Present',
        current: true,
        bullets: [
          'Mentoring incoming executive board on institutional partnerships, alumni outreach, and sponsorships.',
          'Advising on long-term technological infrastructure for student event registrations.'
        ],
        techStack: ['Strategic Advisory', 'Mentorship', 'Partnerships'],
        metrics: [
          { value: '120+', label: 'Leaders Mentored', description: 'Executive board & committee members' }
        ]
      },
      {
        role: 'Chairperson',
        startDate: 'Jul 2025',
        endDate: 'Dec 2025',
        current: false,
        bullets: [
          'Directed operations for regional literary and cultural festivals with 3,500+ attendees.',
          'Managed financial budgets exceeding ₹4.5L with transparent milestone accounting.'
        ],
        techStack: ['Executive Leadership', 'Budget Management', 'Event Architecture'],
        metrics: [
          { value: '3.5k+', label: 'Attendees', description: 'Across 18 regional universities' },
          { value: '₹4.5L+', label: 'Budget Managed', description: 'Delivered with 100% audit compliance' },
          { value: '18', label: 'Universities', description: 'Participating regional institutions' },
          { value: '100%', label: 'Incident Free', description: 'Seamless operations & event execution' }
        ]
      }
    ],
    displaySettings: {
      displaySide: 'left',
      showRoleProgression: true,
      progressionLabel: 'Leadership Journey',
      accentColor: '#ec4899',
      domain: 'Institutional Governance & Conclave Architecture',
      executiveSummary: 'Led a 120+ member organizational board, directing regional mega-conclaves, managing multi-lakh financial allocations, and mentoring future student leadership.',
      keyTakeaway: 'Delivered an 85% year-over-year increase in event attendance and managed ₹4.5L+ budgets with zero audit discrepancies.'
    },
    status: 'published',
    order: 2
  },
  {
    _id: '4',
    role: 'Head of Web Development',
    company: 'Newton School Coding Club',
    shortName: 'NSCC',
    websiteUrl: 'https://nscc-vitc.tech',
    type: 'club',
    location: 'Chennai, India',
    startDate: 'Apr 2025',
    endDate: 'Feb 2026',
    current: false,
    featured: false,
    bullets: [
      'Architected club portal and real-time coding contest platform serving 2,000+ active student developers.',
      'Conducted 6+ technical bootcamps on Next.js, WebSockets, and distributed systems architecture.',
      'Mentored 25+ junior engineers in modern full-stack development practices, Docker setups, and Git workflows.',
      'Integrated real-time leaderboard WebSocket engines supporting sub-50ms live ranking updates during hackathons.'
    ],
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Redis', 'WebSockets', 'Docker'],
    positions: [
      {
        role: 'Head of Web Development',
        startDate: 'Apr 2025',
        endDate: 'Feb 2026',
        current: false,
        bullets: [
          'Architected club portal and real-time coding contest platform serving 2,000+ active student developers.',
          'Conducted 6+ technical bootcamps on Next.js, WebSockets, and distributed systems architecture.'
        ],
        techStack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
        metrics: [
          { value: '2k+', label: 'Active Developers', description: 'Platform developer community' },
          { value: '6+', label: 'Bootcamps Led', description: 'Full-stack engineering sessions' },
          { value: '<50ms', label: 'Leaderboard Latency', description: 'Real-time WebSocket event feeds' },
          { value: '35%', label: 'Membership Surge', description: 'Year-over-year community growth' }
        ]
      }
    ],
    relatedProjects: [
      { id: '1', title: 'Skill-Bridge Platform', category: 'Full Stack', description: 'Interactive student skill assessment & interview simulation engine' }
    ],
    displaySettings: {
      displaySide: 'right',
      accentColor: '#a855f7',
      domain: 'Developer Community & Platform Engineering',
      executiveSummary: 'Engineered high-performance web platforms for competitive programming tournaments, technical workshops, and real-time developer community engagement.',
      keyTakeaway: 'Built a real-time contest system serving 2,000+ active developers with sub-50ms score synchronization.'
    },
    status: 'published',
    order: 3
  }
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

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [categories, setCategories] = useState<DynamicCategory[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'3d' | 'tabs' | 'timeline'>('3d');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch experiences and dynamic categories from MongoDB
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [expRes, catRes] = await Promise.all([
          fetch('/api/experience', { cache: 'no-store' }),
          fetch('/api/experience-categories', { cache: 'no-store' }),
        ]);

        if (expRes.ok && isMounted) {
          const expData = await expRes.json();
          if (Array.isArray(expData) && expData.length > 0) {
            setExperiences(expData);
            setSelectedId(expData[0]._id);
          } else {
            setExperiences(defaultExperiences);
            setSelectedId(defaultExperiences[0]._id);
          }
        } else if (isMounted) {
          setExperiences(defaultExperiences);
          setSelectedId(defaultExperiences[0]._id);
        }

        if (catRes.ok && isMounted) {
          const catData = await catRes.json();
          if (Array.isArray(catData) && catData.length > 0) {
            setCategories(catData);
          }
        }
      } catch {
        if (isMounted) {
          setExperiences(defaultExperiences);
          setSelectedId(defaultExperiences[0]._id);
        }
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Compute merged category styling map
  const typeConfigMap = useMemo(() => {
    const map = { ...defaultTypeConfig };
    categories.forEach(cat => {
      if (cat.slug && cat.color) {
        map[cat.slug.toLowerCase()] = {
          color: cat.color,
          label: cat.name || cat.slug,
          bg: cat.bg || `${cat.color}15`,
        };
      }
    });
    return map;
  }, [categories]);

  // Filter experiences by active category
  const filteredExperiences = useMemo(() => {
    if (activeFilter === 'all') return experiences;
    return experiences.filter(exp => exp.type?.toLowerCase() === activeFilter.toLowerCase());
  }, [experiences, activeFilter]);

  // Keep selectedId valid when filter changes
  useEffect(() => {
    if (filteredExperiences.length > 0) {
      if (!filteredExperiences.some(e => e._id === selectedId)) {
        setSelectedId(filteredExperiences[0]._id);
      }
    }
  }, [filteredExperiences, selectedId]);

  // Selected experience object for Tab Mode
  const selectedExperience = useMemo(() => {
    return filteredExperiences.find(e => e._id === selectedId) || filteredExperiences[0] || experiences[0];
  }, [filteredExperiences, selectedId, experiences]);

  // Calculate Experience Summary Metrics dynamically
  const summaryMetrics = useMemo(() => {
    const totalOrgs = new Set(experiences.map(e => e.company.toLowerCase())).size;
    let totalRoles = 0;
    let internshipsAndResearch = 0;
    let leadershipAndClubs = 0;

    experiences.forEach(e => {
      totalRoles += (e.positions && e.positions.length > 0) ? e.positions.length : 1;
      const t = (e.type || '').toLowerCase();
      if (t === 'internship' || t === 'research') internshipsAndResearch++;
      if (t === 'leadership' || t === 'club') leadershipAndClubs++;
    });

    return {
      totalOrgs: totalOrgs || experiences.length,
      totalRoles: totalRoles || experiences.length,
      internshipsAndResearch,
      leadershipAndClubs,
    };
  }, [experiences]);

  // Calculate 3D Tree Layout
  const treeLayout = useMemo(() => {
    return calculateExperienceTreeLayout(filteredExperiences, typeConfigMap);
  }, [filteredExperiences, typeConfigMap]);

  // Track scroll position inside section for 3D Camera progression
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable > 0) {
        const currentProgress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectExperience = (id: string) => {
    setSelectedId(id);
    if (viewMode === '3d') {
      const cardEl = document.getElementById(`exp-card-${id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative py-32 px-6 max-w-6xl mx-auto text-white"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00d4ff]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#ec4899]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* SECTION HEADER (Standard Portfolio Layout) */}
      <div className="relative z-10 mb-16">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">
          03 — Experience
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Career &amp; Leadership
        </h2>
        <div className="mt-4 w-24 h-px mb-6" style={{ background: 'linear-gradient(90deg, #00d4ff, transparent)' }} />

        <p className="text-sm sm:text-base text-white/60 font-sans max-w-2xl leading-relaxed">
          Engineering high-scale mobile &amp; web platforms, leading multidisciplinary teams, and pushing edge machine learning boundaries.
        </p>

        {/* Dynamic Recruiter Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
          <div className="text-center p-2">
            <span className="block text-2xl font-black font-mono text-[#00d4ff]">{summaryMetrics.totalOrgs}</span>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Organizations</span>
          </div>
          <div className="text-center p-2">
            <span className="block text-2xl font-black font-mono text-[#ec4899]">{summaryMetrics.totalRoles}</span>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Roles Held</span>
          </div>
          <div className="text-center p-2">
            <span className="block text-2xl font-black font-mono text-[#f59e0b]">{summaryMetrics.internshipsAndResearch}</span>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Intern / Research</span>
          </div>
          <div className="text-center p-2">
            <span className="block text-2xl font-black font-mono text-[#10b981]">{summaryMetrics.leadershipAndClubs}</span>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Leadership / Orgs</span>
          </div>
        </div>
      </div>

      {/* CONTROLS BAR: CATEGORY FILTER PILLS + VIEW MODE TOGGLE */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-white/15 text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'bg-white/[0.03] text-white/60 border border-white/[0.06] hover:bg-white/[0.08]'
            }`}
          >
            <span>All Roles</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">{experiences.length}</span>
          </button>

          {Object.entries(typeConfigMap).map(([key, config]) => {
            const count = experiences.filter(e => e.type?.toLowerCase() === key.toLowerCase()).length;
            if (count === 0) return null;
            const isActive = activeFilter.toLowerCase() === key.toLowerCase();

            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'border text-white shadow-lg'
                    : 'bg-white/[0.03] text-white/60 border border-white/[0.06] hover:bg-white/[0.08]'
                }`}
                style={{
                  borderColor: isActive ? config.color : undefined,
                  backgroundColor: isActive ? `${config.color}25` : undefined,
                  boxShadow: isActive ? `0 0 15px ${config.color}30` : undefined,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                <span>{config.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">{count}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher: 3D Journey vs Interactive Tabs vs Timeline Stream */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#a855f7]/20 border border-[#00d4ff]/40 text-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.2)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Journey</span>
          </button>

          <button
            onClick={() => setViewMode('tabs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'tabs'
                ? 'bg-white/15 border border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Tabs</span>
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'timeline'
                ? 'bg-white/15 border border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Timeline Stream</span>
          </button>
        </div>
      </div>

      {/* MAIN VIEWPORT: 3 CUSTOMIZED PRESENTATION SCREENS */}
      {viewMode === '3d' && (
        /* ============================================================ */
        /* MODE 1: INTERACTIVE 3D EXPERIENCE TREE + DUAL-SIDED CARDS    */
        /* ============================================================ */
        <div className="relative min-h-[900px] w-full">
          {/* Sticky 3D Tree Canvas in Center (Desktop) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-auto">
            <div className="sticky top-20 h-[85vh] w-full flex items-center justify-center">
              <ExperienceTree
                experiences={filteredExperiences}
                selectedId={selectedId}
                onSelectExperience={handleSelectExperience}
                typeConfigMap={typeConfigMap}
                scrollProgress={scrollProgress}
              />
            </div>
          </div>

          {/* Alternating 3D Cards Container */}
          <div className="relative z-10 space-y-12 lg:space-y-24 py-8">
            {treeLayout.nodes.map((nodeItem, idx) => {
              const exp = nodeItem.experience;
              const isSelected = selectedId === exp._id;
              const isLeft = nodeItem.side === 'left';
              const catConf = typeConfigMap[exp.type?.toLowerCase()] || { color: '#00d4ff', label: exp.type };
              const accentColor = exp.displaySettings?.accentColor || catConf.color || '#00d4ff';
              const isExpanded = expandedDetails[exp._id];

              return (
                <div
                  key={exp._id}
                  id={`exp-card-${exp._id}`}
                  onClick={() => setSelectedId(exp._id)}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center cursor-pointer transition-all duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-95'
                  }`}
                >
                  {/* Left Column Card */}
                  <div
                    className={`${
                      isLeft ? 'lg:col-start-1 lg:pr-8' : 'lg:col-start-1 hidden lg:block pointer-events-none'
                    }`}
                  >
                    {isLeft && (
                      <TreeJourneyCard
                        experience={exp}
                        accentColor={accentColor}
                        isSelected={isSelected}
                        isExpanded={isExpanded}
                        side="left"
                        onToggleExpand={() => toggleExpand(exp._id)}
                      />
                    )}
                  </div>

                  {/* Right Column Card */}
                  <div
                    className={`${
                      !isLeft ? 'lg:col-start-2 lg:pl-8' : 'lg:col-start-2 hidden lg:block pointer-events-none'
                    }`}
                  >
                    {!isLeft && (
                      <TreeJourneyCard
                        experience={exp}
                        accentColor={accentColor}
                        isSelected={isSelected}
                        isExpanded={isExpanded}
                        side="right"
                        onToggleExpand={() => toggleExpand(exp._id)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'tabs' && (
        /* ============================================================ */
        /* MODE 2: INTERACTIVE SPLIT TABS VIEW (DEDICATED FULL DETAIL) */
        /* ============================================================ */
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full">
          {/* Left: Interactive Company Selector Sidebar */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible w-full lg:w-[360px] xl:w-[400px] pb-2 lg:pb-0 flex-shrink-0">
            {filteredExperiences.map((e, i) => {
              const isSelected = selectedId === e._id;
              const catConf = typeConfigMap[e.type?.toLowerCase()] || { color: '#00d4ff', label: e.type };
              const color = e.displaySettings?.accentColor || catConf.color || '#00d4ff';
              const dur = calcDuration(e.startDate, e.endDate, e.current);
              const monogram = e.shortName || e.company.split(' ').map(w => w[0]).slice(0, 3).join('').toUpperCase();

              return (
                <button
                  key={e._id}
                  onClick={() => setSelectedId(e._id)}
                  className={`text-left p-5 rounded-2xl transition-all duration-300 border flex items-center gap-4 w-full group relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-white/[0.09] via-white/[0.05] to-transparent shadow-2xl border-opacity-80 scale-[1.01]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/20'
                  }`}
                  style={{
                    borderColor: isSelected ? color : undefined,
                    boxShadow: isSelected ? `0 0 30px ${color}25` : undefined,
                  }}
                >
                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r"
                      style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
                    />
                  )}

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-sm bg-white/5 border flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{ borderColor: `${color}50`, color }}
                  >
                    {monogram}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-base font-bold font-sans text-white truncate group-hover:text-white">{e.company}</span>
                      {e.featured && <span className="text-amber-300 text-xs flex-shrink-0">★</span>}
                    </div>
                    <p className="text-xs text-white/70 font-sans truncate mt-0.5 font-medium">{e.role}</p>
                    <div className="flex items-center justify-between gap-2 mt-2.5">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{catConf.label}</span>
                      {dur && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold" style={{ background: `${color}18`, color }}>
                          {dur}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Dedicated Comprehensive Tabs Detail Card */}
          <div className="flex-1 w-full min-w-0">
            {selectedExperience && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedExperience._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <InteractiveTabsDetailCard
                    experience={selectedExperience}
                    accentColor={
                      selectedExperience.displaySettings?.accentColor ||
                      typeConfigMap[selectedExperience.type?.toLowerCase()]?.color ||
                      '#00d4ff'
                    }
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      )}

      {viewMode === 'timeline' && (
        /* ============================================================ */
        /* MODE 3: ACCESSIBLE VERTICAL TIMELINE STREAM (DEDICATED)     */
        /* ============================================================ */
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Central Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00d4ff]/40 via-[#ec4899]/30 to-transparent -translate-x-1/2" />

          <div className="space-y-16 relative z-10">
            {filteredExperiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              const catConf = typeConfigMap[exp.type?.toLowerCase()] || { color: '#00d4ff', label: exp.type };
              const accentColor = exp.displaySettings?.accentColor || catConf.color || '#00d4ff';
              const isSelected = selectedId === exp._id;
              const isExpanded = expandedDetails[exp._id] ?? true;
              const dur = calcDuration(exp.startDate, exp.endDate, exp.current);

              return (
                <div
                  key={exp._id}
                  id={`exp-stream-${exp._id}`}
                  onClick={() => setSelectedId(exp._id)}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-14`}
                >
                  {/* Center Node Badge */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-mono font-bold bg-[#0b0b14] border-2 shadow-2xl transition-transform duration-300 hover:scale-110"
                      style={{
                        borderColor: accentColor,
                        boxShadow: isSelected ? `0 0 30px ${accentColor}` : `0 0 12px ${accentColor}40`,
                        color: accentColor,
                      }}
                    >
                      {idx + 1}
                    </div>
                  </div>

                  {/* Opposite Column Date Marker */}
                  <div
                    className={`hidden md:block w-1/2 text-sm font-mono text-white/60 pt-3 ${
                      isEven ? 'text-left pl-14' : 'text-right pr-14'
                    }`}
                  >
                    <div className="font-bold text-white text-base tracking-wide flex items-center gap-2" style={{ justifyContent: isEven ? 'flex-start' : 'flex-end' }}>
                      <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                      <span>{exp.startDate} — {exp.endDate || 'Present'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-1.5 font-normal" style={{ justifyContent: isEven ? 'flex-start' : 'flex-end' }}>
                      {isEven ? (
                        <>
                          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">{catConf.label}</span>
                          {dur && <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold" style={{ background: `${accentColor}18`, color: accentColor }}>{dur}</span>}
                        </>
                      ) : (
                        <>
                          {dur && <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold" style={{ background: `${accentColor}18`, color: accentColor }}>{dur}</span>}
                          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">{catConf.label}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Dedicated Timeline Stream Card */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0">
                    <TimelineStreamCard
                      experience={exp}
                      accentColor={accentColor}
                      isSelected={isSelected}
                      isExpanded={isExpanded}
                      side={isEven ? 'right' : 'left'}
                      onToggleExpand={() => toggleExpand(exp._id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* END OF TREE VISUAL CROWNING & CTAS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 mt-20 text-center max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.1] backdrop-blur-2xl shadow-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PRESENT DAY</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-white">
          Building What&apos;s Next
        </h3>
        <p className="text-sm sm:text-base text-white/60 font-sans mt-2 max-w-lg mx-auto leading-relaxed">
          Open to high-impact software engineering roles, full-stack platform architecture, and machine learning research initiatives.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-7">
          <a
            href="#projects"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] via-[#a855f7] to-[#ec4899] text-black font-mono font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_25px_rgba(0,212,255,0.35)]"
          >
            <span>Explore Portfolio Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-medium text-xs hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-2 shadow-md"
          >
            <FileText className="w-4 h-4 text-[#00d4ff]" />
            <span>View Complete Resume</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * =========================================================================
 * 1. DEDICATED INTERACTIVE TABS DETAIL CARD (Full Workspace Deep Dive)
 * =========================================================================
 */
function InteractiveTabsDetailCard({
  experience,
  accentColor,
}: {
  experience: Experience;
  accentColor: string;
}) {
  const monogram =
    experience.shortName ||
    experience.company
      .split(' ')
      .map(w => w[0])
      .slice(0, 3)
      .join('')
      .toUpperCase();

  const positions = experience.positions || [];
  const hasMultiRoles = positions.length > 1;
  const domain = experience.displaySettings?.domain;
  const executiveSummary = experience.displaySettings?.executiveSummary;
  const keyTakeaway = experience.displaySettings?.keyTakeaway;
  const dur = calcDuration(experience.startDate, experience.endDate, experience.current);

  return (
    <div
      className="relative rounded-3xl p-8 sm:p-10 md:p-12 backdrop-blur-2xl border transition-all duration-300 shadow-2xl bg-gradient-to-br from-[#0f0f1c]/95 via-[#090914]/92 to-[#040409]/95"
      style={{
        borderColor: accentColor,
        boxShadow: `0 0 50px ${accentColor}25`,
      }}
    >
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="flex items-start gap-5">
          {/* Monogram Badge */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-mono font-black text-xl sm:text-2xl bg-white/5 border flex-shrink-0 transition-transform hover:scale-105 shadow-inner"
            style={{
              borderColor: `${accentColor}60`,
              color: accentColor,
            }}
          >
            {monogram}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans text-white tracking-tight">
                {experience.company}
              </h3>
              {experience.websiteUrl && (
                <a
                  href={experience.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title="Visit Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <p className="text-base sm:text-lg font-bold text-white/90 font-sans mt-1">
              {experience.role}
            </p>

            {domain && (
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/25">
                  <Activity className="w-3 h-3" />
                  <span>{domain}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 flex-shrink-0">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-bold border shadow-sm"
            style={{
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}50`,
              color: accentColor,
            }}
          >
            {experience.type}
          </span>
          {experience.featured && (
            <span className="text-xs font-mono text-amber-300 flex items-center gap-1 font-bold">
              ★ Featured Spotlight
            </span>
          )}
          {experience.current && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active Position</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Metadata Timeline Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-b border-white/[0.08] text-xs sm:text-sm font-mono text-white/60">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-[#00d4ff]" />
          <div>
            <span className="text-white/40 block text-[10px] uppercase tracking-wider">Timeframe</span>
            <span className="font-semibold text-white/90">{experience.startDate} — {experience.endDate || 'Present'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-[#f59e0b]" />
          <div>
            <span className="text-white/40 block text-[10px] uppercase tracking-wider">Duration</span>
            <span className="font-semibold text-white/90">{dur || 'Current'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-[#ec4899]" />
          <div>
            <span className="text-white/40 block text-[10px] uppercase tracking-wider">Location & Mode</span>
            <span className="font-semibold text-white/90">{experience.location}</span>
          </div>
        </div>
      </div>

      {/* ── Executive Scope Summary ── */}
      {executiveSummary && (
        <div className="mt-7 p-5 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/[0.08] text-sm text-white/80 font-sans leading-relaxed">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-[#00d4ff] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Mandate & Scope</span>
          </div>
          <p>{executiveSummary}</p>
        </div>
      )}

      {/* ── Multi-Position Trajectory (If Available) ── */}
      {hasMultiRoles && experience.displaySettings?.showRoleProgression !== false && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 mb-5">
            <Workflow className="w-4 h-4 text-[#ec4899]" />
            <span className="font-bold uppercase tracking-wider text-[#ec4899]">
              {experience.displaySettings?.progressionLabel || 'Role Progression & Milestone Trajectory'}
            </span>
          </div>

          <div className="space-y-6 relative pl-6 border-l-2 border-white/15 ml-3">
            {positions.map((pos, pIdx) => (
              <div key={pIdx} className="relative">
                <span
                  className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#0b0b14]"
                  style={{ borderColor: accentColor }}
                />
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <span className="text-base sm:text-lg font-bold font-sans text-white">{pos.role}</span>
                  <span className="text-xs font-mono text-white/50">
                    {pos.startDate} — {pos.endDate || 'Present'}
                  </span>
                </div>
                {pos.bullets && pos.bullets.length > 0 && (
                  <p className="text-xs sm:text-sm text-white/70 font-sans mt-2 leading-relaxed">
                    {pos.bullets[0]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Core Contributions & Technical Highlights ── */}
      <div className="mt-8 space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-white/50 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00d4ff]" />
          <span>Core Contributions & Engineering Highlights</span>
        </h4>
        <div className="space-y-3 text-sm text-white/85 font-sans leading-relaxed">
          {experience.bullets.map((bullet, bIdx) => (
            <div key={bIdx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[#00d4ff] mt-0.5 text-sm font-bold flex-shrink-0">▸</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quantitative Benchmark Metrics Grid ── */}
      {positions.some(p => p.metrics && p.metrics.length > 0) && (
        <div className="mt-8">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-white/50 flex items-center gap-2 mb-3.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Key Quantitative Metrics & Benchmarks</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {positions.flatMap(p => p.metrics || []).map((m, mIdx) => (
              <div
                key={mIdx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center transition-all hover:bg-white/[0.06] hover:border-white/20"
              >
                <span className="block text-2xl sm:text-3xl font-black font-mono text-[#00d4ff]">{m.value}</span>
                <span className="text-xs font-mono text-white/90 font-bold block truncate mt-1.5">{m.label}</span>
                {m.description && (
                  <span className="text-xs font-sans text-white/45 block mt-1 leading-snug">{m.description}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Key Strategic Takeaway Callout ── */}
      {keyTakeaway && (
        <div className="mt-8 p-5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 text-sm text-emerald-300 font-sans flex items-start gap-3.5">
          <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-400 font-mono text-xs uppercase tracking-wider block mb-1">
              Strategic Takeaway & Value Delivered
            </strong>
            <p className="text-white/85 leading-relaxed">{keyTakeaway}</p>
          </div>
        </div>
      )}

      {/* ── Linked Projects & Case Studies ── */}
      {experience.relatedProjects && experience.relatedProjects.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <span className="text-xs font-mono text-white/50 uppercase tracking-wider block mb-3 font-semibold">
            Linked Projects & Case Studies
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {experience.relatedProjects.map(proj => (
              <a
                key={proj.id}
                href={`#projects`}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#00d4ff]/50 text-xs font-mono text-white/90 hover:text-white flex items-center justify-between gap-3 transition-all hover:scale-[1.01] shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FolderGit2 className="w-5 h-5 text-[#00d4ff] flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-white text-sm block truncate">{proj.title}</span>
                    {proj.description && (
                      <span className="text-white/50 text-xs block truncate mt-0.5">{proj.description}</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Technical Stack & Ecosystem Tags ── */}
      {experience.techStack && experience.techStack.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <span className="text-xs font-mono text-white/50 uppercase tracking-wider block mb-3 font-semibold">
            Technical Stack & Ecosystem
          </span>
          <div className="flex flex-wrap gap-2">
            {experience.techStack.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-white/80 hover:border-white/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * =========================================================================
 * 2. DEDICATED TIMELINE STREAM CARD (Chronological Flow Layout)
 * =========================================================================
 */
function TimelineStreamCard({
  experience,
  accentColor,
  isSelected,
  isExpanded,
  side,
  onToggleExpand,
}: {
  experience: Experience;
  accentColor: string;
  isSelected: boolean;
  isExpanded: boolean;
  side: 'left' | 'right';
  onToggleExpand: () => void;
}) {
  const monogram =
    experience.shortName ||
    experience.company
      .split(' ')
      .map(w => w[0])
      .slice(0, 3)
      .join('')
      .toUpperCase();

  const positions = experience.positions || [];
  const hasMultiRoles = positions.length > 1;
  const domain = experience.displaySettings?.domain;

  return (
    <div
      className={`relative rounded-3xl p-7 sm:p-8 backdrop-blur-2xl border transition-all duration-300 shadow-2xl ${
        isSelected
          ? 'bg-gradient-to-br from-[#0e0e1a]/95 via-[#080812]/92 to-[#040408]/95 border-opacity-90 shadow-2xl'
          : 'bg-black/60 border-white/10 hover:border-white/25 hover:bg-black/75'
      }`}
      style={{
        borderColor: isSelected ? accentColor : undefined,
        boxShadow: isSelected ? `0 0 40px ${accentColor}25` : undefined,
      }}
    >
      {/* ── Top Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center font-mono font-bold text-sm bg-white/5 border flex-shrink-0"
            style={{ borderColor: `${accentColor}50`, color: accentColor }}
          >
            {monogram}
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black font-sans text-white hover:text-[#00d4ff] transition-colors">
              {experience.company}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-white/80 font-sans mt-0.5">
              {experience.role}
            </p>
            {domain && (
              <span className="text-[10px] font-mono text-[#00d4ff] block mt-0.5 uppercase tracking-wider">
                {domain}
              </span>
            )}
          </div>
        </div>

        <span
          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border flex-shrink-0"
          style={{
            backgroundColor: `${accentColor}15`,
            borderColor: `${accentColor}40`,
            color: accentColor,
          }}
        >
          {experience.type}
        </span>
      </div>

      {/* ── Dates & Location ── */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50 mt-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#00d4ff]" />
          <span>{experience.startDate} — {experience.endDate || 'Present'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#ec4899]" />
          <span>{experience.location}</span>
        </div>
      </div>

      {/* ── Multi-Position Stepper ── */}
      {hasMultiRoles && experience.displaySettings?.showRoleProgression !== false && (
        <div className="mt-5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/60 mb-3">
            <Workflow className="w-3.5 h-3.5 text-[#ec4899]" />
            <span className="font-semibold uppercase tracking-wider text-[#ec4899]">
              {experience.displaySettings?.progressionLabel || 'Role Progression'}
            </span>
          </div>

          <div className="space-y-3 relative pl-4 border-l-2 border-white/10 ml-2">
            {positions.map((pos, pIdx) => (
              <div key={pIdx} className="relative">
                <span
                  className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-black"
                  style={{ borderColor: accentColor }}
                />
                <span className="text-xs font-bold font-sans text-white block">{pos.role}</span>
                <span className="text-[10px] font-mono text-white/40 block">
                  {pos.startDate} — {pos.endDate || 'Present'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Accomplishments ── */}
      <div className="mt-4 space-y-2 text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
        {experience.bullets.slice(0, isExpanded ? undefined : 3).map((bullet, bIdx) => (
          <div key={bIdx} className="flex items-start gap-2">
            <span className="text-[#00d4ff] mt-0.5 text-xs">▸</span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>

      {/* ── Metrics Grid ── */}
      {positions.some(p => p.metrics && p.metrics.length > 0) && (
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          {positions.flatMap(p => p.metrics || []).map((m, mIdx) => (
            <div
              key={mIdx}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
            >
              <span className="block text-base sm:text-lg font-bold font-mono text-[#00d4ff]">{m.value}</span>
              <span className="text-[10px] font-mono text-white/70 block truncate mt-0.5">{m.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Linked Projects & Tech Stack ── */}
      {experience.techStack && experience.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/[0.06]">
          {experience.techStack.map((tech, tIdx) => (
            <span
              key={tIdx}
              className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * =========================================================================
 * 3. DEDICATED 3D TREE JOURNEY CARD (Alternating Left/Right Scene Flow)
 * =========================================================================
 */
function TreeJourneyCard({
  experience,
  accentColor,
  isSelected,
  isExpanded,
  side,
  onToggleExpand,
}: {
  experience: Experience;
  accentColor: string;
  isSelected: boolean;
  isExpanded: boolean;
  side: 'left' | 'right';
  onToggleExpand: () => void;
}) {
  const monogram =
    experience.shortName ||
    experience.company
      .split(' ')
      .map(w => w[0])
      .slice(0, 3)
      .join('')
      .toUpperCase();

  const positions = experience.positions || [];
  const hasMultiRoles = positions.length > 1;

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-7 backdrop-blur-2xl border transition-all duration-300 shadow-xl ${
        isSelected
          ? 'bg-gradient-to-br from-[#0e0e1a]/95 via-[#080812]/92 to-[#040408]/95 border-opacity-90 shadow-2xl'
          : 'bg-black/50 border-white/10 hover:border-white/25 hover:bg-black/70'
      }`}
      style={{
        borderColor: isSelected ? accentColor : undefined,
        boxShadow: isSelected ? `0 0 35px ${accentColor}25` : undefined,
      }}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-bold text-sm bg-white/5 border flex-shrink-0"
            style={{ borderColor: `${accentColor}50`, color: accentColor }}
          >
            {monogram}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold font-sans text-white hover:text-[#00d4ff] transition-colors">
              {experience.company}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-white/80 font-sans mt-0.5">
              {experience.role}
            </p>
          </div>
        </div>

        <span
          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border"
          style={{
            backgroundColor: `${accentColor}15`,
            borderColor: `${accentColor}40`,
            color: accentColor,
          }}
        >
          {experience.type}
        </span>
      </div>

      {/* Dates & Location */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50 mt-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#00d4ff]" />
          <span>{experience.startDate} — {experience.endDate || 'Present'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#ec4899]" />
          <span>{experience.location}</span>
        </div>
      </div>

      {/* Multi-Position Stepper */}
      {hasMultiRoles && experience.displaySettings?.showRoleProgression !== false && (
        <div className="mt-5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/60 mb-2.5">
            <Workflow className="w-3.5 h-3.5 text-[#ec4899]" />
            <span className="font-semibold uppercase tracking-wider text-[#ec4899]">
              {experience.displaySettings?.progressionLabel || 'Role Progression'}
            </span>
          </div>

          <div className="space-y-3 relative pl-4 border-l border-white/10 ml-2">
            {positions.map((pos, pIdx) => (
              <div key={pIdx} className="relative">
                <span
                  className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-black"
                  style={{ borderColor: accentColor }}
                />
                <span className="text-xs font-bold font-sans text-white">{pos.role}</span>
                <span className="text-[10px] font-mono text-white/40 block">
                  {pos.startDate} — {pos.endDate || 'Present'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accomplishment highlights */}
      <div className="mt-4 space-y-2 text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
        {experience.bullets.slice(0, isExpanded ? undefined : 2).map((bullet, bIdx) => (
          <div key={bIdx} className="flex items-start gap-2">
            <span className="text-[#00d4ff] mt-1 text-xs">▸</span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>

      {/* Metrics */}
      {positions.some(p => p.metrics && p.metrics.length > 0) && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {positions.flatMap(p => p.metrics || []).map((m, mIdx) => (
            <div
              key={mIdx}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
            >
              <span className="block text-sm sm:text-base font-bold font-mono text-[#00d4ff]">{m.value}</span>
              <span className="text-[10px] font-mono text-white/60 block truncate">{m.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tech Stack */}
      {experience.techStack && experience.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/[0.06]">
          {experience.techStack.map((tech, tIdx) => (
            <span
              key={tIdx}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
