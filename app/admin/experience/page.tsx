'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Layers, 
  GitFork, 
  FolderGit2, 
  Eye, 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  ExternalLink,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  Search,
  SlidersHorizontal,
  MoveUp,
  MoveDown
} from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
  description?: string;
}

interface Position {
  _id?: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack?: string[];
  description?: string;
  metrics?: MetricItem[];
}

interface RelatedProject {
  id: string;
  title: string;
  category?: string;
  description: string;
}

interface ExperienceCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  bg?: string;
  isActive: boolean;
  showInFilters: boolean;
  order: number;
}

interface Experience {
  _id?: string;
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
  };
  status?: 'published' | 'draft' | 'archived';
  order: number;
}

interface ProjectSummary {
  _id: string;
  title: string;
  description: string;
  category?: string;
}

const emptyPosition: Position = {
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  bullets: [],
  techStack: [],
  metrics: [],
};

const emptyExperience: Experience = {
  role: '',
  company: '',
  shortName: '',
  websiteUrl: '',
  logoUrl: '',
  type: 'internship',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  bullets: [],
  techStack: [],
  featured: false,
  positions: [],
  relatedProjects: [],
  status: 'published',
  order: 0,
};

const emptyCategory: ExperienceCategory = {
  name: '',
  slug: '',
  description: '',
  color: '#00d4ff',
  bg: 'rgba(0,212,255,0.1)',
  isActive: true,
  showInFilters: true,
  order: 0,
};

const PRESET_COLORS = [
  { name: 'Cyan (Internship)', color: '#00d4ff', bg: 'rgba(0,212,255,0.1)' },
  { name: 'Amber (Research)', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { name: 'Pink (Leadership)', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { name: 'Purple (Club/Org)', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  { name: 'Emerald (Part-Time)', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { name: 'Blue (Full-Time)', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
];

export default function AdminExperiencePage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [categories, setCategories] = useState<ExperienceCategory[]>([]);
  const [availableProjects, setAvailableProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Active edit state
  const [currentExp, setCurrentExp] = useState<Experience>(emptyExperience);
  const [currentCategory, setCurrentCategory] = useState<ExperienceCategory>(emptyCategory);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [previewExp, setPreviewExp] = useState<Experience | null>(null);

  // Form active tab
  const [formTab, setFormTab] = useState<'general' | 'positions' | 'bullets' | 'projects' | 'settings'>('general');

  // Multi-position builder state
  const [editingPosIdx, setEditingPosIdx] = useState<number | null>(null);
  const [tempPos, setTempPos] = useState<Position>(emptyPosition);

  // Inputs for bullets & tags
  const [bulletInput, setBulletInput] = useState('');
  const [techInput, setTechInput] = useState('');

  // Position bullet & tag inputs
  const [posBulletInput, setPosBulletInput] = useState('');
  const [posTechInput, setPosTechInput] = useState('');

  // Metric inputs
  const [metricValueInput, setMetricValueInput] = useState('');
  const [metricLabelInput, setMetricLabelInput] = useState('');

  // Toast / notification
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [authStatus, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, catRes, projRes] = await Promise.all([
        fetch('/api/experience?status=all'),
        fetch('/api/experience-categories'),
        fetch('/api/projects').catch(() => null),
      ]);

      if (expRes.ok) {
        const expData = await expRes.json();
        setExperiences(Array.isArray(expData) ? expData : []);
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : []);
      }

      if (projRes && projRes.ok) {
        const projData = await projRes.json();
        setAvailableProjects(Array.isArray(projData) ? projData : []);
      }
    } catch (err) {
      showToast('Failed to load experience records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const typeConfigMap = useMemo(() => {
    const map: Record<string, { color: string; label: string; bg: string }> = {};
    categories.forEach(cat => {
      map[cat.slug.toLowerCase()] = {
        color: cat.color || '#00d4ff',
        label: cat.name || cat.slug,
        bg: cat.bg || `${cat.color || '#00d4ff'}15`,
      };
    });
    return map;
  }, [categories]);

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      const matchSearch = 
        exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchCategory = filterCategory === 'all' || exp.type.toLowerCase() === filterCategory.toLowerCase();
      const matchStatus = filterStatus === 'all' || (exp.status || 'published') === filterStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [experiences, searchQuery, filterCategory, filterStatus]);

  // Handle Experience CRUD
  const handleOpenCreateExp = () => {
    setCurrentExp({
      ...emptyExperience,
      type: categories[0]?.slug || 'internship',
      order: experiences.length + 1,
    });
    setEditingPosIdx(null);
    setTempPos(emptyPosition);
    setFormTab('general');
    setIsExpModalOpen(true);
  };

  const handleOpenEditExp = (exp: Experience) => {
    setCurrentExp(JSON.parse(JSON.stringify(exp)));
    setEditingPosIdx(null);
    setTempPos(emptyPosition);
    setFormTab('general');
    setIsExpModalOpen(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExp.company.trim() || !currentExp.role.trim()) {
      showToast('Company and Role title are required', 'error');
      return;
    }

    try {
      const isEditing = Boolean(currentExp._id);
      const url = isEditing ? `/api/experience/${currentExp._id}` : '/api/experience';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentExp),
      });

      if (res.ok) {
        showToast(isEditing ? 'Experience updated successfully' : 'Experience created successfully');
        setIsExpModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to save experience', 'error');
      }
    } catch {
      showToast('Server error while saving experience', 'error');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this experience?')) return;

    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Experience deleted');
        fetchData();
      } else {
        showToast('Failed to delete experience', 'error');
      }
    } catch {
      showToast('Server error while deleting', 'error');
    }
  };

  const handleToggleStatus = async (exp: Experience) => {
    const nextStatus = exp.status === 'draft' ? 'published' : 'draft';
    try {
      const res = await fetch(`/api/experience/${exp._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Experience moved to ${nextStatus}`);
        fetchData();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // Position Progression Management in Experience Form
  const handleAddOrUpdatePosition = () => {
    if (!tempPos.role.trim() || !tempPos.startDate.trim()) {
      showToast('Position role and start date are required', 'error');
      return;
    }

    const updatedPositions = [...(currentExp.positions || [])];
    if (editingPosIdx !== null) {
      updatedPositions[editingPosIdx] = { ...tempPos };
    } else {
      updatedPositions.push({ ...tempPos, _id: `pos-${Date.now()}` });
    }

    // Auto update headline role if current or primary
    const active = updatedPositions.find(p => p.current) || updatedPositions[0];
    setCurrentExp(prev => ({
      ...prev,
      positions: updatedPositions,
      role: active ? active.role : prev.role,
      startDate: updatedPositions[0]?.startDate || prev.startDate,
      endDate: active?.endDate || prev.endDate,
      current: active?.current ?? prev.current,
    }));

    setTempPos(emptyPosition);
    setEditingPosIdx(null);
  };

  const handleEditPositionItem = (idx: number) => {
    setEditingPosIdx(idx);
    setTempPos({ ...(currentExp.positions![idx]) });
  };

  const handleDeletePositionItem = (idx: number) => {
    const updated = currentExp.positions!.filter((_, i) => i !== idx);
    setCurrentExp(prev => ({ ...prev, positions: updated }));
    if (editingPosIdx === idx) {
      setEditingPosIdx(null);
      setTempPos(emptyPosition);
    }
  };

  // Add bullet point
  const handleAddBullet = () => {
    if (!bulletInput.trim()) return;
    setCurrentExp(prev => ({ ...prev, bullets: [...prev.bullets, bulletInput.trim()] }));
    setBulletInput('');
  };

  const handleRemoveBullet = (idx: number) => {
    setCurrentExp(prev => ({ ...prev, bullets: prev.bullets.filter((_, i) => i !== idx) }));
  };

  // Add tech stack tag
  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!currentExp.techStack.includes(techInput.trim())) {
      setCurrentExp(prev => ({ ...prev, techStack: [...prev.techStack, techInput.trim()] }));
    }
    setTechInput('');
  };

  const handleRemoveTech = (tag: string) => {
    setCurrentExp(prev => ({ ...prev, techStack: prev.techStack.filter(t => t !== tag) }));
  };

  // Position sub-bullet helpers
  const handleAddPosBullet = () => {
    if (!posBulletInput.trim()) return;
    setTempPos(prev => ({ ...prev, bullets: [...prev.bullets, posBulletInput.trim()] }));
    setPosBulletInput('');
  };

  const handleRemovePosBullet = (idx: number) => {
    setTempPos(prev => ({ ...prev, bullets: prev.bullets.filter((_, i) => i !== idx) }));
  };

  const handleAddPosTech = () => {
    if (!posTechInput.trim()) return;
    const current = tempPos.techStack || [];
    if (!current.includes(posTechInput.trim())) {
      setTempPos(prev => ({ ...prev, techStack: [...current, posTechInput.trim()] }));
    }
    setPosTechInput('');
  };

  const handleRemovePosTech = (tag: string) => {
    setTempPos(prev => ({ ...prev, techStack: (prev.techStack || []).filter(t => t !== tag) }));
  };

  // Position metric helpers
  const handleAddPosMetric = () => {
    if (!metricValueInput.trim() || !metricLabelInput.trim()) return;
    const current = tempPos.metrics || [];
    setTempPos(prev => ({
      ...prev,
      metrics: [...current, { value: metricValueInput.trim(), label: metricLabelInput.trim() }]
    }));
    setMetricValueInput('');
    setMetricLabelInput('');
  };

  const handleRemovePosMetric = (idx: number) => {
    setTempPos(prev => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== idx)
    }));
  };

  // Related project link helpers
  const handleAddRelatedProjectFromList = (proj: ProjectSummary) => {
    const existing = currentExp.relatedProjects || [];
    if (existing.some(p => p.id === proj._id)) return;
    setCurrentExp(prev => ({
      ...prev,
      relatedProjects: [
        ...existing,
        {
          id: proj._id,
          title: proj.title,
          category: proj.category || 'fullstack',
          description: proj.description || '',
        }
      ]
    }));
  };

  const handleRemoveRelatedProject = (id: string) => {
    setCurrentExp(prev => ({
      ...prev,
      relatedProjects: (prev.relatedProjects || []).filter(p => p.id !== id)
    }));
  };

  // Category Management Handlers
  const handleOpenCategoryManager = () => {
    setCurrentCategory({ ...emptyCategory, order: categories.length + 1 });
    setEditingCatId(null);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      const slug = currentCategory.slug.trim() || currentCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = { ...currentCategory, slug };

      const isEditing = Boolean(editingCatId);
      const url = isEditing ? `/api/experience-categories/${editingCatId}` : '/api/experience-categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(isEditing ? 'Category updated' : 'Category created');
        setCurrentCategory(emptyCategory);
        setEditingCatId(null);
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to save category', 'error');
      }
    } catch {
      showToast('Server error saving category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/experience-categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Category deleted');
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete category', 'error');
      }
    } catch {
      showToast('Server error deleting category', 'error');
    }
  };

  const handleOpenPreview = (exp: Experience) => {
    setPreviewExp(exp);
    setIsPreviewModalOpen(true);
  };

  if (authStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508] text-[#00d4ff] font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" />
        <span>Loading Experience & Leadership Manager...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6 md:p-10 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-2 shadow-2xl border transition-all ${
            toastMsg.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-2">
          <Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>
          <span>/</span>
          <span className="text-[#00d4ff]">Experience & Leadership</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white font-sans flex items-center gap-3">
              <Building2 className="w-7 h-7 text-[#00d4ff]" />
              <span>Experience & Journey Management</span>
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Manage organizations, sequential role progressions, project links, dynamic categories, and featured spotlight cards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCategoryManager}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-mono font-medium flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-[#ec4899]" />
              <span>Category Manager</span>
            </button>

            <button
              onClick={handleOpenCreateExp}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div>
            <span className="text-white/40 text-[11px] font-mono uppercase">Total Records</span>
            <p className="text-2xl font-black text-white font-mono mt-0.5">{experiences.length}</p>
          </div>
          <div className="border-l border-white/[0.06] pl-3">
            <span className="text-white/40 text-[11px] font-mono uppercase">Published</span>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {experiences.filter(e => e.status !== 'draft').length}
            </p>
          </div>
          <div className="border-l border-white/[0.06] pl-3">
            <span className="text-white/40 text-[11px] font-mono uppercase">Drafts</span>
            <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              {experiences.filter(e => e.status === 'draft').length}
            </p>
          </div>
          <div className="border-l border-white/[0.06] pl-3">
            <span className="text-white/40 text-[11px] font-mono uppercase">Spotlight Roles</span>
            <p className="text-2xl font-black text-[#ec4899] font-mono mt-0.5">
              {experiences.filter(e => e.featured).length}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by organization, role, or technology..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Experience Cards Grid / List */}
      <div className="max-w-7xl mx-auto space-y-4">
        {filteredExperiences.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/[0.06]">
            <Building2 className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm font-mono text-white/50">No experience records matched your filters.</p>
          </div>
        ) : (
          filteredExperiences.map((exp, idx) => {
            const conf = typeConfigMap[exp.type.toLowerCase()] || { color: '#00d4ff', label: exp.type, bg: 'rgba(0,212,255,0.1)' };
            const hasProgression = Boolean(exp.positions && exp.positions.length > 1);

            return (
              <div
                key={exp._id || idx}
                className="p-5 md:p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                style={{
                  borderLeft: `4px solid ${conf.color}`,
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider"
                      style={{
                        background: conf.bg,
                        color: conf.color,
                        border: `1px solid ${conf.color}40`,
                      }}
                    >
                      {conf.label}
                    </span>

                    {exp.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/30 font-bold flex items-center gap-1">
                        ★ Spotlight
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                        exp.status === 'draft'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {exp.status === 'draft' ? 'Draft' : 'Published'}
                    </span>

                    {exp.current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                        Active Role
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-white font-sans">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-white/70 font-medium mt-0.5 flex items-center gap-2">
                    <span>{exp.company}</span>
                    {exp.shortName && (
                      <span className="text-[10px] font-mono text-white/40 px-1.5 py-0.2 rounded bg-white/5 border border-white/10">
                        {exp.shortName}
                      </span>
                    )}
                  </p>

                  {/* Multi-Position Step Summary Badge */}
                  {hasProgression && (
                    <div className="mt-2.5 flex items-center gap-2 p-2 rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/20 text-xs font-mono text-[#ec4899]">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{exp.positions!.length} Positions (Progression): {exp.positions!.map(p => p.role).join(' ➔ ')}</span>
                    </div>
                  )}

                  {/* Date & Location */}
                  <div className="flex items-center gap-4 text-xs font-mono text-white/40 mt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#00d4ff]" />
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-white/30" />
                      {exp.location}
                    </span>
                  </div>

                  {/* Tech stack chips */}
                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.techStack.map(tech => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => handleOpenPreview(exp)}
                    aria-label="Preview Experience Card"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    title="Live Card Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(exp)}
                    aria-label="Toggle Published/Draft"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-mono"
                    title={exp.status === 'draft' ? 'Publish' : 'Unpublish'}
                  >
                    {exp.status === 'draft' ? 'Publish' : 'Unpublish'}
                  </button>

                  <button
                    onClick={() => handleOpenEditExp(exp)}
                    aria-label="Edit Experience"
                    className="p-2.5 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/20 transition-all"
                    title="Edit Record"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => exp._id && handleDeleteExperience(exp._id)}
                    aria-label="Delete Experience"
                    className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EDIT / CREATE EXPERIENCE MODAL WITH MULTI-POSITION BUILDER */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0b0b14] border border-white/15 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
              <div>
                <h2 className="text-xl font-black font-sans text-white">
                  {currentExp._id ? 'Edit Experience Record' : 'Create Experience Record'}
                </h2>
                <p className="text-xs font-mono text-white/50 mt-0.5">
                  Configure company branding, multi-position career steps, bullet impacts, and project outputs.
                </p>
              </div>
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 p-3 border-b border-white/10 bg-white/[0.01] overflow-x-auto">
              <button
                onClick={() => setFormTab('general')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  formTab === 'general' ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40' : 'text-white/60 hover:text-white'
                }`}
              >
                1. General & Organization
              </button>
              <button
                onClick={() => setFormTab('positions')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                  formTab === 'positions' ? 'bg-[#ec4899]/20 text-[#ec4899] border border-[#ec4899]/40' : 'text-white/60 hover:text-white'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>2. Multi-Position Progression ({(currentExp.positions || []).length})</span>
              </button>
              <button
                onClick={() => setFormTab('bullets')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  formTab === 'bullets' ? 'bg-[#7c3aed]/20 text-[#a855f7] border border-[#7c3aed]/40' : 'text-white/60 hover:text-white'
                }`}
              >
                3. Responsibilities & Tech
              </button>
              <button
                onClick={() => setFormTab('projects')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  formTab === 'projects' ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40' : 'text-white/60 hover:text-white'
                }`}
              >
                4. Related Projects ({(currentExp.relatedProjects || []).length})
              </button>
              <button
                onClick={() => setFormTab('settings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  formTab === 'settings' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-white/60 hover:text-white'
                }`}
              >
                5. Settings & Status
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <form onSubmit={handleSaveExperience} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: GENERAL & ORGANIZATION */}
              {formTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        Company / Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentExp.company}
                        onChange={e => setCurrentExp({ ...currentExp, company: e.target.value })}
                        placeholder="e.g. Religare Broking Limited"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm font-sans text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        Primary / Headline Role Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentExp.role}
                        onChange={e => setCurrentExp({ ...currentExp, role: e.target.value })}
                        placeholder="e.g. Full Stack Development Intern"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm font-sans text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        Short Name / Monogram Override
                      </label>
                      <input
                        type="text"
                        value={currentExp.shortName || ''}
                        onChange={e => setCurrentExp({ ...currentExp, shortName: e.target.value })}
                        placeholder="e.g. RBL, HLA, VIT"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        Category / Employment Type
                      </label>
                      <select
                        value={currentExp.type}
                        onChange={e => setCurrentExp({ ...currentExp, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
                      >
                        {categories.map(cat => (
                          <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        Location String *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentExp.location}
                        onChange={e => setCurrentExp({ ...currentExp, location: e.target.value })}
                        placeholder="e.g. Noida / New Delhi, India"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        Company Website URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={currentExp.websiteUrl || ''}
                        onChange={e => setCurrentExp({ ...currentExp, websiteUrl: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        Custom Logo Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={currentExp.logoUrl || ''}
                        onChange={e => setCurrentExp({ ...currentExp, logoUrl: e.target.value })}
                        placeholder="/logos/company.png or https://..."
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        Start Date *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentExp.startDate}
                        onChange={e => setCurrentExp({ ...currentExp, startDate: e.target.value })}
                        placeholder="e.g. May 2026"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                        End Date
                      </label>
                      <input
                        type="text"
                        disabled={currentExp.current}
                        value={currentExp.current ? 'Present' : (currentExp.endDate || '')}
                        onChange={e => setCurrentExp({ ...currentExp, endDate: e.target.value })}
                        placeholder="e.g. Jun 2026"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50 disabled:opacity-40"
                      />
                    </div>

                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
                        <input
                          type="checkbox"
                          checked={currentExp.current}
                          onChange={e => setCurrentExp({ ...currentExp, current: e.target.checked })}
                          className="rounded bg-black border-white/20 text-[#00d4ff] focus:ring-0"
                        />
                        <span>Currently Active Position</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MULTI-POSITION PROGRESSION */}
              {formTab === 'positions' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-[#ec4899]/10 border border-[#ec4899]/30 text-xs font-mono text-white/80 leading-relaxed">
                    <p className="font-bold text-[#ec4899] mb-1">Career & Role Progression Journey</p>
                    Add sequential positions if you held multiple roles in this organization (e.g. <em>Chairperson ──→ Advisory Member</em>).
                  </div>

                  {/* Position Items List */}
                  <div className="space-y-3">
                    {(currentExp.positions || []).map((pos, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#ec4899]" />
                            <h4 className="text-sm font-bold text-white font-mono">{pos.role}</h4>
                            {pos.current && (
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-1.5 rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-white/50 mt-1">
                            {pos.startDate} — {pos.current ? 'Present' : pos.endDate} · {pos.bullets.length} bullets · {(pos.techStack || []).length} tech tags
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditPositionItem(pIdx)}
                            className="p-2 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/20 text-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePositionItem(pIdx)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Position Item Form Builder */}
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                    <h4 className="text-xs font-mono uppercase font-bold text-[#ec4899]">
                      {editingPosIdx !== null ? `Edit Position #${editingPosIdx + 1}` : '+ Add Sequential Position'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-white/60 mb-1">Role Title *</label>
                        <input
                          type="text"
                          value={tempPos.role}
                          onChange={e => setTempPos({ ...tempPos, role: e.target.value })}
                          placeholder="e.g. Advisory Member"
                          className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-mono text-white/60 mb-1">Start Date *</label>
                          <input
                            type="text"
                            value={tempPos.startDate}
                            onChange={e => setTempPos({ ...tempPos, startDate: e.target.value })}
                            placeholder="Feb 2026"
                            className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-white/60 mb-1">End Date</label>
                          <input
                            type="text"
                            disabled={tempPos.current}
                            value={tempPos.current ? 'Present' : (tempPos.endDate || '')}
                            onChange={e => setTempPos({ ...tempPos, endDate: e.target.value })}
                            placeholder="Present"
                            className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white disabled:opacity-40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="tempCurrent"
                        checked={tempPos.current}
                        onChange={e => setTempPos({ ...tempPos, current: e.target.checked })}
                        className="rounded bg-black border-white/20 text-[#ec4899]"
                      />
                      <label htmlFor="tempCurrent" className="text-xs font-mono text-white/80 cursor-pointer">
                        This is the current active role in the organization
                      </label>
                    </div>

                    {/* Position Bullet Points */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <label className="block text-[11px] font-mono text-white/60">Position Specific Bullet Points</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={posBulletInput}
                          onChange={e => setPosBulletInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddPosBullet(); } }}
                          placeholder="Add accomplishment bullet..."
                          className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-sans text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddPosBullet}
                          className="px-3 py-2 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-1 mt-2">
                        {tempPos.bullets.map((b, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] text-xs text-white/80">
                            <span>• {b}</span>
                            <button type="button" onClick={() => handleRemovePosBullet(i)} className="text-rose-400 hover:text-rose-300">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Position Tech Stack */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <label className="block text-[11px] font-mono text-white/60">Position Tech Stack</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={posTechInput}
                          onChange={e => setPosTechInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddPosTech(); } }}
                          placeholder="e.g. Governance, Leadership, React..."
                          className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddPosTech}
                          className="px-3 py-2 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20"
                        >
                          Add Tag
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(tempPos.techStack || []).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#ec4899]/20 text-[#ec4899] border border-[#ec4899]/30 flex items-center gap-1">
                            {t}
                            <button type="button" onClick={() => handleRemovePosTech(t)}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Position Structured Metrics */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <label className="block text-[11px] font-mono text-white/60">Position Quantitative Metrics (Optional)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={metricValueInput}
                          onChange={e => setMetricValueInput(e.target.value)}
                          placeholder="Value (e.g. 2000+)"
                          className="w-1/3 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                        />
                        <input
                          type="text"
                          value={metricLabelInput}
                          onChange={e => setMetricLabelInput(e.target.value)}
                          placeholder="Label (e.g. Participant Reach)"
                          className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddPosMetric}
                          className="px-3 py-2 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20"
                        >
                          Add Metric
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {(tempPos.metrics || []).map((m, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 flex items-center gap-2">
                            <strong className="text-[#00d4ff]">{m.value}</strong>
                            <span className="text-white/60">{m.label}</span>
                            <button type="button" onClick={() => handleRemovePosMetric(i)}>
                              <X className="w-3 h-3 text-rose-400" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                      <button
                        type="button"
                        onClick={handleAddOrUpdatePosition}
                        className="px-4 py-2 rounded-xl bg-[#ec4899] text-white font-mono text-xs font-bold hover:bg-[#ec4899]/90 transition-all"
                      >
                        {editingPosIdx !== null ? 'Save Position Changes' : '+ Add Position to Organization'}
                      </button>
                      {editingPosIdx !== null && (
                        <button
                          type="button"
                          onClick={() => { setEditingPosIdx(null); setTempPos(emptyPosition); }}
                          className="px-3 py-2 rounded-xl bg-white/5 text-white/60 font-mono text-xs hover:text-white"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RESPONSIBILITIES & TECH STACK (Top Level) */}
              {formTab === 'bullets' && (
                <div className="space-y-6">
                  {/* Responsibilities */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider">
                      Responsibilities & Accomplishment Highlights
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bulletInput}
                        onChange={e => setBulletInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddBullet(); } }}
                        placeholder="Add accomplishment highlight..."
                        className="flex-1 px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm font-sans text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                      <button
                        type="button"
                        onClick={handleAddBullet}
                        className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-2 mt-3">
                      {currentExp.bullets.map((b, i) => (
                        <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-sm text-white/80">
                          <span className="flex-1 mr-3">• {b}</span>
                          <button type="button" onClick={() => handleRemoveBullet(i)} className="text-rose-400 hover:text-rose-300">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider">
                      Core Technologies & Frameworks
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                        placeholder="e.g. Next.js, Flutter, PyTorch, MongoDB..."
                        className="flex-1 px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00d4ff]/50"
                      />
                      <button
                        type="button"
                        onClick={handleAddTech}
                        className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20"
                      >
                        Add Tag
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentExp.techStack.map(tech => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-white flex items-center gap-1.5"
                        >
                          {tech}
                          <button type="button" onClick={() => handleRemoveTech(tech)} className="text-white/40 hover:text-rose-400">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: RELATED PROJECTS */}
              {formTab === 'projects' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-xs font-mono text-white/80 leading-relaxed">
                    <p className="font-bold text-[#00d4ff] mb-1">Portfolio Project Linkage</p>
                    Connect related projects built during this role to allow recruiters to jump straight to live deployments and code.
                  </div>

                  {/* Connected Projects */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase font-bold text-white/60">Currently Linked Projects</h4>
                    {(currentExp.relatedProjects || []).length === 0 ? (
                      <p className="text-xs font-mono text-white/40 italic">No projects linked yet.</p>
                    ) : (
                      (currentExp.relatedProjects || []).map(p => (
                        <div key={p.id} className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-sm font-bold text-white font-mono">{p.title}</span>
                            <p className="text-xs text-white/50">{p.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveRelatedProject(p.id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pick from Available Projects */}
                  {availableProjects.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h4 className="text-xs font-mono uppercase font-bold text-white/60">Pick From Existing Projects</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableProjects.map(proj => (
                          <button
                            key={proj._id}
                            type="button"
                            onClick={() => handleAddRelatedProjectFromList(proj)}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-[#00d4ff]/50 text-left transition-all flex items-center justify-between"
                          >
                            <div>
                              <span className="text-xs font-bold font-mono text-white">{proj.title}</span>
                              <p className="text-[11px] text-white/40 truncate mt-0.5">{proj.description}</p>
                            </div>
                            <Plus className="w-4 h-4 text-[#00d4ff] flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: DISPLAY SETTINGS & STATUS */}
              {formTab === 'settings' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                    <h4 className="text-xs font-mono uppercase font-bold text-white/70">Spotlight & Visibility</h4>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="featuredToggle"
                        checked={currentExp.featured || false}
                        onChange={e => setCurrentExp({ ...currentExp, featured: e.target.checked })}
                        className="rounded bg-black border-white/20 text-[#00d4ff] focus:ring-0"
                      />
                      <label htmlFor="featuredToggle" className="text-xs font-mono text-white cursor-pointer">
                        <strong className="text-amber-300">★ Featured Experience Spotlight</strong> (Renders glowing aura and elevated prominence)
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">Publishing Status</label>
                        <select
                          value={currentExp.status || 'published'}
                          onChange={e => setCurrentExp({ ...currentExp, status: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white"
                        >
                          <option value="published">Published (Visible Publicly)</option>
                          <option value="draft">Draft (Admin Only)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">Sort Order Index</label>
                        <input
                          type="number"
                          value={currentExp.order}
                          onChange={e => setCurrentExp({ ...currentExp, order: parseInt(e.target.value, 10) || 0 })}
                          className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3D Tree Display & Layout Controls */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                    <h4 className="text-xs font-mono uppercase font-bold text-[#00d4ff]">3D Experience Tree Display</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">3D Branch Position Side</label>
                        <select
                          value={currentExp.displaySettings?.displaySide || 'auto'}
                          onChange={e => setCurrentExp({
                            ...currentExp,
                            displaySettings: {
                              ...currentExp.displaySettings,
                              displaySide: e.target.value as any,
                            }
                          })}
                          className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white"
                        >
                          <option value="auto">Auto (Alternating Left/Right)</option>
                          <option value="left">Left Branch</option>
                          <option value="right">Right Branch</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">Progression Stepper Label</label>
                        <input
                          type="text"
                          value={currentExp.displaySettings?.progressionLabel || 'Role Progression'}
                          onChange={e => setCurrentExp({
                            ...currentExp,
                            displaySettings: {
                              ...currentExp.displaySettings,
                              progressionLabel: e.target.value,
                            }
                          })}
                          placeholder="e.g. Role Progression / Leadership Journey"
                          className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
                      <div>
                        <label className="block text-xs font-mono text-white/70 mb-1">Custom Accent Color (Hex)</label>
                        <input
                          type="text"
                          value={currentExp.displaySettings?.accentColor || ''}
                          onChange={e => setCurrentExp({
                            ...currentExp,
                            displaySettings: {
                              ...currentExp.displaySettings,
                              accentColor: e.target.value,
                            }
                          })}
                          placeholder="e.g. #00d4ff (Leave empty to use Category color)"
                          className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <input
                          type="checkbox"
                          id="showProgressionToggle"
                          checked={currentExp.displaySettings?.showRoleProgression !== false}
                          onChange={e => setCurrentExp({
                            ...currentExp,
                            displaySettings: {
                              ...currentExp.displaySettings,
                              showRoleProgression: e.target.checked,
                            }
                          })}
                          className="rounded bg-black border-white/20 text-[#00d4ff] focus:ring-0"
                        />
                        <label htmlFor="showProgressionToggle" className="text-xs font-mono text-white cursor-pointer">
                          Show Role Progression Stepper
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-white/60 font-mono text-xs hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-all"
                >
                  Save Experience Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC CATEGORY MANAGER MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0b0b14] border border-white/15 shadow-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-black font-sans text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#ec4899]" />
                  <span>Dynamic Category Manager</span>
                </h2>
                <p className="text-xs font-mono text-white/50 mt-0.5">
                  Manage category filter tags, custom hex accent colors, and filter visibility.
                </p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Categories List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map(cat => (
                <div
                  key={cat._id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <div>
                      <span className="text-xs font-bold font-mono text-white">{cat.name}</span>
                      <span className="text-[10px] font-mono text-white/40 ml-2">({cat.slug})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentCategory({ ...cat });
                        setEditingCatId(cat._id || null);
                      }}
                      className="p-1.5 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => cat._id && handleDeleteCategory(cat._id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Form */}
            <form onSubmit={handleSaveCategory} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <h3 className="text-xs font-mono uppercase font-bold text-[#ec4899]">
                {editingCatId ? 'Edit Category' : '+ Add New Category'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-white/60 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={currentCategory.name}
                    onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    placeholder="e.g. Open Source"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/60 mb-1">Slug (Identifier)</label>
                  <input
                    type="text"
                    value={currentCategory.slug}
                    onChange={e => setCurrentCategory({ ...currentCategory, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    placeholder="e.g. open-source"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">Preset Palette</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(p => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setCurrentCategory({ ...currentCategory, color: p.color, bg: p.bg })}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 border"
                      style={{
                        borderColor: currentCategory.color === p.color ? '#ffffff' : 'rgba(255,255,255,0.1)',
                        backgroundColor: p.bg,
                        color: p.color,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ec4899] text-white font-mono text-xs font-bold hover:bg-[#ec4899]/90"
                >
                  {editingCatId ? 'Update Category' : '+ Create Category'}
                </button>
                {editingCatId && (
                  <button
                    type="button"
                    onClick={() => { setEditingCatId(null); setCurrentCategory(emptyCategory); }}
                    className="text-xs font-mono text-white/40 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE CARD PREVIEW MODAL */}
      {isPreviewModalOpen && previewExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-3xl bg-[#0b0b14] border border-white/20 shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase font-bold text-[#00d4ff] flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Card Preview
              </span>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Card Body */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#101020]/90 to-[#0a0a16]/80 border border-[#00d4ff]/30 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-[#00d4ff] px-2.5 py-0.5 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                    {previewExp.type}
                  </span>
                  <h3 className="text-2xl font-black text-white font-sans mt-2">{previewExp.role}</h3>
                  <p className="text-sm text-white/70 font-medium">{previewExp.company}</p>
                </div>
                <div className="text-right text-xs font-mono text-white/50">
                  <p>{previewExp.startDate} — {previewExp.current ? 'Present' : previewExp.endDate}</p>
                  <p className="mt-0.5">{previewExp.location}</p>
                </div>
              </div>

              {previewExp.positions && previewExp.positions.length > 1 && (
                <div className="my-4 p-3 rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/20 text-xs font-mono text-[#ec4899]">
                  Role Progression: {previewExp.positions.map(p => p.role).join(' ──→ ')}
                </div>
              )}

              <ul className="space-y-2 my-4 text-sm text-white/80">
                {previewExp.bullets.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                {previewExp.techStack.map(t => (
                  <span key={t} className="px-2.5 py-0.5 rounded text-xs font-mono bg-white/5 border border-white/10 text-white/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
