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
  ArrowRight
} from 'lucide-react';

interface Position {
  _id?: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack?: string[];
  description?: string;
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
};

const emptyExperience: Experience = {
  role: '',
  company: '',
  shortName: '',
  websiteUrl: '',
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

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl text-xs font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/50 focus:outline-none transition-colors placeholder:text-white/20';
const btnPrimary = 'px-4 py-2.5 text-xs font-mono tracking-widest uppercase font-bold text-black rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:opacity-50';
const btnSecondary = 'px-4 py-2.5 text-xs font-mono text-white/50 hover:text-white rounded-xl border border-white/10 hover:border-white/30 transition-all';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-mono text-white/40 mb-1.5 tracking-wider uppercase">{label}</label>
      {children}
    </div>
  );
}

export default function AdminExperience() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [categories, setCategories] = useState<ExperienceCategory[]>([]);
  const [availableProjects, setAvailableProjects] = useState<ProjectSummary[]>([]);
  
  const [form, setForm] = useState<Experience>(emptyExperience);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sub-inputs
  const [isMultiPosition, setIsMultiPosition] = useState(false);
  const [bulletInput, setBulletInput] = useState('');
  const [techInput, setTechInput] = useState('');

  // Position editing sub-state
  const [posForm, setPosForm] = useState<Position>(emptyPosition);
  const [posBulletInput, setPosBulletInput] = useState('');
  const [posTechInput, setPosTechInput] = useState('');

  // Modals & Panels
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [previewExp, setPreviewExp] = useState<Experience | null>(null);
  const [previewPosIdx, setPreviewPosIdx] = useState(0);

  // Category Manager form state
  const [catForm, setCatForm] = useState<ExperienceCategory>(emptyCategory);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  const loadData = async () => {
    try {
      const [expRes, catRes, projRes] = await Promise.all([
        fetch('/api/experience?status=all').then(r => r.json()),
        fetch('/api/experience-categories').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()).catch(() => []),
      ]);
      if (Array.isArray(expRes)) setExperiences(expRes);
      if (Array.isArray(catRes)) setCategories(catRes);
      if (Array.isArray(projRes)) setAvailableProjects(projRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') loadData();
  }, [status]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  // ── Experience CRUD ─────────────────────────────────────────

  const handleSaveExperience = async () => {
    if (!form.company.trim()) {
      showToast('Organization name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload: Experience = {
        ...form,
        positions: isMultiPosition ? form.positions : [],
      };

      // If in single position mode, sync primary fields
      if (!isMultiPosition && !payload.role.trim()) {
        showToast('Position role is required', 'error');
        setLoading(false);
        return;
      }

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/experience/${editingId}` : '/api/experience';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save experience');
      }

      showToast(editingId ? 'Experience updated successfully!' : 'Experience created successfully!');
      setForm(emptyExperience);
      setEditingId(null);
      setIsMultiPosition(false);
      setBulletInput('');
      setTechInput('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditExperience = (e: Experience) => {
    setForm({
      ...e,
      endDate: e.endDate || '',
      positions: e.positions || [],
      relatedProjects: e.relatedProjects || [],
    });
    setEditingId(e._id || null);
    setIsMultiPosition(Boolean(e.positions && e.positions.length > 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Experience deleted');
        loadData();
      } else {
        showToast('Failed to delete', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  // ── Position Management within Multi-Position Form ──────────

  const addPositionToForm = () => {
    if (!posForm.role.trim() || !posForm.startDate.trim()) {
      showToast('Position role and start date are required', 'error');
      return;
    }
    setForm(prev => ({
      ...prev,
      positions: [...(prev.positions || []), { ...posForm }],
    }));
    setPosForm(emptyPosition);
    setPosBulletInput('');
    setPosTechInput('');
  };

  const removePositionFromForm = (idx: number) => {
    setForm(prev => ({
      ...prev,
      positions: prev.positions?.filter((_, i) => i !== idx),
    }));
  };

  // ── Category Management ─────────────────────────────────────

  const handleSaveCategory = async () => {
    if (!catForm.name.trim() || !catForm.slug.trim()) {
      showToast('Category name and slug are required', 'error');
      return;
    }
    try {
      const method = editingCatId ? 'PUT' : 'POST';
      const url = editingCatId ? `/api/experience-categories/${editingCatId}` : '/api/experience-categories';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save category');
      }

      showToast(editingCatId ? 'Category updated!' : 'Category created!');
      setCatForm(emptyCategory);
      setEditingCatId(null);
      loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/experience-categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete category', 'error');
      } else {
        showToast('Category deleted');
        loadData();
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin" className="text-white/40 hover:text-[#00d4ff] text-xs font-mono uppercase tracking-widest transition-colors">
              ← Admin Hub
            </Link>
            <span className="text-white/20 font-mono">/</span>
            <span className="text-xs font-mono text-[#a855f7] uppercase tracking-wider">Experience Management</span>
          </div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
            Experience <span style={{ color: '#a855f7' }}>& Roles Master</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-white/70 bg-white/5 border border-white/10 hover:border-[#a855f7]/40 hover:text-white transition-all"
          >
            <Tag className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => {
              setForm(emptyExperience);
              setEditingId(null);
              setIsMultiPosition(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-black bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>New Experience</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {msg && (
        <div className={`mb-6 p-4 rounded-2xl text-xs font-mono border flex items-center justify-between ${
          msg.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-white/40 hover:text-white">×</button>
        </div>
      )}

      {/* Main Grid: Form on Left (5 cols) & List on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Experience Editor Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl p-6 md:p-8 bg-[#0d0d1a]/80 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h2 className="text-base font-mono uppercase font-bold text-white tracking-widest flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00d4ff]" />
                <span>{editingId ? 'Edit Experience Record' : 'Create Experience Record'}</span>
              </h2>

              <button
                type="button"
                onClick={() => setPreviewExp({ ...form, positions: isMultiPosition ? form.positions : [] })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/30 hover:bg-[#00d4ff]/20 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Organization & Monogram */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Field label="Company / Organisation Name *">
                    <input
                      className={inputCls}
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      placeholder="e.g. Religare Broking Limited"
                    />
                  </Field>
                </div>
                <div>
                  <Field label="Monogram / Short">
                    <input
                      className={inputCls}
                      value={form.shortName || ''}
                      onChange={e => setForm(f => ({ ...f, shortName: e.target.value.toUpperCase() }))}
                      placeholder="e.g. RBL / VIT"
                    />
                  </Field>
                </div>
              </div>

              {/* Category, Location & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Field label="Category / Type *">
                    <select
                      className={inputCls}
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    >
                      {categories.map(c => (
                        <option key={c.slug} value={c.slug} className="bg-[#0d0d1a]">{c.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div>
                  <Field label="Location">
                    <input
                      className={inputCls}
                      value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. Chennai, India"
                    />
                  </Field>
                </div>

                <div>
                  <Field label="Website URL">
                    <input
                      className={inputCls}
                      value={form.websiteUrl || ''}
                      onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </Field>
                </div>
              </div>

              {/* Featured Spotlight & Publishing Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featToggle"
                    checked={form.featured || false}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-amber-400"
                  />
                  <label htmlFor="featToggle" className="text-xs font-mono text-amber-300 font-bold cursor-pointer">
                    ★ Featured Spotlight
                  </label>
                </div>

                <div>
                  <Field label="Status">
                    <select
                      className={inputCls}
                      value={form.status || 'published'}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                    >
                      <option value="published" className="bg-[#0d0d1a]">Published (Live)</option>
                      <option value="draft" className="bg-[#0d0d1a]">Draft (Hidden)</option>
                      <option value="archived" className="bg-[#0d0d1a]">Archived</option>
                    </select>
                  </Field>
                </div>

                <div>
                  <Field label="Sort Order Index">
                    <input
                      type="number"
                      className={inputCls}
                      value={form.order}
                      onChange={e => setForm(f => ({ ...f, order: +e.target.value }))}
                    />
                  </Field>
                </div>
              </div>

              {/* Single vs Multi-Position Mode Switcher */}
              <div className="pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#ec4899]/10 to-transparent border border-[#ec4899]/30">
                  <div className="flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-[#ec4899]" />
                    <span className="text-xs font-mono font-bold text-white">Multi-Position Role Progression</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMultiPosition}
                      onChange={e => setIsMultiPosition(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ec4899]" />
                  </label>
                </div>
              </div>

              {/* ── CONDITIONAL: SINGLE POSITION FORM ── */}
              {!isMultiPosition ? (
                <div className="space-y-4 pt-2">
                  <Field label="Position Role Title *">
                    <input
                      className={inputCls}
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      placeholder="e.g. Full Stack Development Intern"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Start Date">
                      <input
                        className={inputCls}
                        value={form.startDate}
                        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                        placeholder="e.g. May 2026"
                      />
                    </Field>
                    <Field label="End Date">
                      <input
                        className={inputCls}
                        value={form.endDate || ''}
                        onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                        placeholder="e.g. Jun 2026"
                        disabled={form.current}
                      />
                    </Field>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="currentToggle"
                      checked={form.current}
                      onChange={e => setForm(f => ({ ...f, current: e.target.checked }))}
                      className="w-4 h-4 accent-emerald-400"
                    />
                    <label htmlFor="currentToggle" className="text-xs font-mono text-emerald-400 font-bold cursor-pointer">
                      Ongoing / Currently Active Role
                    </label>
                  </div>

                  {/* Bullets */}
                  <Field label="Responsibilities & Achievements">
                    <div className="flex gap-2">
                      <input
                        className={`${inputCls} flex-1`}
                        value={bulletInput}
                        onChange={e => setBulletInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), bulletInput.trim() && (setForm(f => ({ ...f, bullets: [...f.bullets, bulletInput.trim()] })), setBulletInput('')))}
                        placeholder="Add bullet (metrics like 99.94% will auto-highlight)..."
                      />
                      <button
                        type="button"
                        onClick={() => bulletInput.trim() && (setForm(f => ({ ...f, bullets: [...f.bullets, bulletInput.trim()] })), setBulletInput(''))}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-xl"
                      >
                        + Add
                      </button>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {form.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs text-white/70">
                          <span className="flex-1">{b}</span>
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, bullets: f.bullets.filter((_, i) => i !== idx) }))}
                            className="text-white/30 hover:text-red-400"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Field>

                  {/* Tech Stack */}
                  <Field label="Tools & Technologies">
                    <div className="flex gap-2">
                      <input
                        className={`${inputCls} flex-1`}
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), techInput.trim() && (setForm(f => ({ ...f, techStack: [...f.techStack, techInput.trim()] })), setTechInput('')))}
                        placeholder="e.g. Flutter, PyTorch, React..."
                      />
                      <button
                        type="button"
                        onClick={() => techInput.trim() && (setForm(f => ({ ...f, techStack: [...f.techStack, techInput.trim()] })), setTechInput(''))}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-xl"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.techStack.map((t, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-white/80">
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, techStack: f.techStack.filter((_, i) => i !== idx) }))}
                            className="text-white/30 hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </Field>
                </div>
              ) : (
                /* ── CONDITIONAL: MULTI-POSITION PROGRESSION BUILDER ── */
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                    <span className="text-xs font-mono font-bold text-[#ec4899] uppercase tracking-wider block">
                      Add Position to Progression Track
                    </span>

                    <Field label="Role Title">
                      <input
                        className={inputCls}
                        value={posForm.role}
                        onChange={e => setPosForm(p => ({ ...p, role: e.target.value }))}
                        placeholder="e.g. Chairperson"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Start Date">
                        <input
                          className={inputCls}
                          value={posForm.startDate}
                          onChange={e => setPosForm(p => ({ ...p, startDate: e.target.value }))}
                          placeholder="e.g. Feb 2025"
                        />
                      </Field>
                      <Field label="End Date">
                        <input
                          className={inputCls}
                          value={posForm.endDate || ''}
                          onChange={e => setPosForm(p => ({ ...p, endDate: e.target.value }))}
                          placeholder="e.g. Feb 2026"
                          disabled={posForm.current}
                        />
                      </Field>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="posCurrent"
                        checked={posForm.current}
                        onChange={e => setPosForm(p => ({ ...p, current: e.target.checked }))}
                        className="w-4 h-4 accent-emerald-400"
                      />
                      <label htmlFor="posCurrent" className="text-xs font-mono text-emerald-400 font-bold">
                        Current Position in this Organization
                      </label>
                    </div>

                    {/* Position Bullets */}
                    <Field label="Position Bullet Points">
                      <div className="flex gap-2">
                        <input
                          className={`${inputCls} flex-1`}
                          value={posBulletInput}
                          onChange={e => setPosBulletInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), posBulletInput.trim() && (setPosForm(p => ({ ...p, bullets: [...p.bullets, posBulletInput.trim()] })), setPosBulletInput('')))}
                          placeholder="Add bullet..."
                        />
                        <button
                          type="button"
                          onClick={() => posBulletInput.trim() && (setPosForm(p => ({ ...p, bullets: [...p.bullets, posBulletInput.trim()] })), setPosBulletInput(''))}
                          className="px-3 py-2 bg-[#ec4899]/20 hover:bg-[#ec4899]/30 text-[#ec4899] font-mono text-xs rounded-xl"
                        >
                          + Add
                        </button>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {posForm.bullets.map((b, i) => (
                          <li key={i} className="text-xs text-white/60 flex items-start justify-between">
                            <span>• {b}</span>
                            <button type="button" onClick={() => setPosForm(p => ({ ...p, bullets: p.bullets.filter((_, idx) => idx !== i) }))} className="text-red-400 ml-2">×</button>
                          </li>
                        ))}
                      </ul>
                    </Field>

                    <button
                      type="button"
                      onClick={addPositionToForm}
                      className="w-full py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#ec4899]/30 hover:bg-[#ec4899]/40 border border-[#ec4899]/50 transition-colors"
                    >
                      + Append Position to List
                    </button>
                  </div>

                  {/* Current Positions in this Org */}
                  <div>
                    <label className="text-xs font-mono text-white/50 tracking-wider uppercase block mb-2">
                      Configured Progression Steps ({form.positions?.length || 0})
                    </label>
                    <div className="space-y-2">
                      {form.positions?.map((pos, pIdx) => (
                        <div key={pIdx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-[#ec4899]/30 flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#ec4899]" />
                              <span className="text-xs font-bold font-mono text-white">{pos.role}</span>
                              {pos.current && <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">Active</span>}
                            </div>
                            <span className="text-[11px] font-mono text-white/40 block mt-0.5">
                              {pos.startDate} — {pos.current ? 'Present' : pos.endDate} · {pos.bullets.length} bullets
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePositionFromForm(pIdx)}
                            className="p-1.5 text-white/40 hover:text-red-400 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Portfolio Projects Connector */}
              <div className="pt-2">
                <Field label="Link Portfolio Project Output (Phase 9)">
                  <select
                    className={inputCls}
                    onChange={e => {
                      const selectedProjId = e.target.value;
                      if (!selectedProjId) return;
                      const proj = availableProjects.find(p => p._id === selectedProjId);
                      if (proj && !form.relatedProjects?.some(r => r.id === proj._id)) {
                        setForm(f => ({
                          ...f,
                          relatedProjects: [
                            ...(f.relatedProjects || []),
                            {
                              id: proj._id,
                              title: proj.title,
                              category: proj.category,
                              description: proj.description.slice(0, 100),
                            },
                          ],
                        }));
                      }
                    }}
                    value=""
                  >
                    <option value="">+ Connect a Project...</option>
                    {availableProjects.map(p => (
                      <option key={p._id} value={p._id} className="bg-[#0d0d1a]">
                        {p.title} ({p.category || 'project'})
                      </option>
                    ))}
                  </select>

                  {form.relatedProjects && form.relatedProjects.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {form.relatedProjects.map((rp, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
                          <span className="text-[#00d4ff] font-bold">{rp.title}</span>
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, relatedProjects: f.relatedProjects?.filter((_, idx) => idx !== i) }))}
                            className="text-white/30 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleSaveExperience}
                  disabled={loading}
                  className={`${btnPrimary} flex-1 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed]`}
                >
                  {loading ? 'Saving...' : editingId ? 'Update Experience' : 'Create Experience'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyExperience);
                      setEditingId(null);
                      setIsMultiPosition(false);
                    }}
                    className={btnSecondary}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Experience List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono uppercase font-bold text-white/60 tracking-wider">
              Existing Records ({experiences.length})
            </h3>
            <span className="text-xs font-mono text-white/30">Drag / sort by order</span>
          </div>

          {experiences.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/5 text-white/30 font-mono text-xs">
              No experience records found. Create one using the form!
            </div>
          )}

          {experiences.map(exp => {
            const cat = categories.find(c => c.slug === exp.type) || { color: '#00d4ff', name: exp.type };
            const isFeatured = exp.featured;
            const hasProgression = Boolean(exp.positions && exp.positions.length > 1);

            return (
              <div
                key={exp._id}
                className="p-5 rounded-2xl bg-[#0d0d1a]/70 border transition-all duration-300 hover:border-white/20"
                style={{ borderColor: isFeatured ? `${cat.color}50` : 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold"
                        style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}
                      >
                        {cat.name}
                      </span>

                      {isFeatured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/25">
                          ★ Featured
                        </span>
                      )}

                      {exp.current && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                          Active
                        </span>
                      )}

                      {exp.status === 'draft' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20">
                          Draft
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white font-mono truncate">{exp.role}</h4>
                    <p className="text-xs text-white/60 font-medium">{exp.company}</p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-white/40 mt-2">
                      <span>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                      <span>·</span>
                      <span>{exp.location}</span>
                    </div>

                    {hasProgression && (
                      <div className="mt-2 text-[10px] font-mono text-[#ec4899] flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        <span>{exp.positions?.length} Positions Progression configured</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewExp(exp)}
                      className="p-2 text-white/40 hover:text-[#00d4ff] rounded-xl hover:bg-white/5 transition-colors"
                      title="Preview Card"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditExperience(exp)}
                      className="p-2 text-white/40 hover:text-[#7c3aed] rounded-xl hover:bg-white/5 transition-colors"
                      title="Edit Experience"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(exp._id!)}
                      className="p-2 text-white/40 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL 1: LIVE CARD PREVIEW (Phase 9) ── */}
      {previewExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 bg-[#0d0d1a] border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <span className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest font-bold">
                Live Experience Card Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewExp(null)}
                className="p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Card */}
            {(() => {
              const cat = categories.find(c => c.slug === previewExp.type) || { color: '#00d4ff', name: previewExp.type };
              const currentPos = previewExp.positions && previewExp.positions[previewPosIdx] ? previewExp.positions[previewPosIdx] : null;
              const displayRole = currentPos ? currentPos.role : previewExp.role;
              const displayBullets = currentPos ? currentPos.bullets : previewExp.bullets;
              const displayTech = currentPos?.techStack || previewExp.techStack;
              const displayStart = currentPos ? currentPos.startDate : previewExp.startDate;
              const displayEnd = currentPos ? currentPos.endDate : previewExp.endDate;
              const displayCurrent = currentPos ? currentPos.current : previewExp.current;

              return (
                <div
                  className="rounded-3xl p-6 md:p-8 border"
                  style={{
                    background: 'linear-gradient(145deg, rgba(16,16,32,0.9) 0%, rgba(10,10,22,0.8) 100%)',
                    borderColor: `${cat.color}40`,
                    boxShadow: `0 20px 50px -10px rgba(0,0,0,0.5), 0 0 30px ${cat.color}20`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold" style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}40` }}>
                      {cat.name}
                    </span>
                    {previewExp.featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30">
                        ★ Featured Spotlight
                      </span>
                    )}
                    {displayCurrent && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                        Active Position
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white font-mono mt-2">{displayRole}</h3>
                  <p className="text-white/70 text-sm mt-1">{previewExp.company}</p>

                  <div className="text-xs font-mono text-white/40 mt-1">
                    {displayStart} — {displayCurrent ? 'Present' : displayEnd} · {previewExp.location}
                  </div>

                  {/* Multi-position tabs if applicable */}
                  {previewExp.positions && previewExp.positions.length > 1 && (
                    <div className="my-4 p-3 rounded-2xl bg-[#ec4899]/10 border border-[#ec4899]/30">
                      <span className="text-[10px] font-mono text-[#ec4899] uppercase font-bold block mb-2">
                        Role Progression Track:
                      </span>
                      <div className="flex gap-2">
                        {previewExp.positions.map((p, i) => (
                          <button
                            key={i}
                            onClick={() => setPreviewPosIdx(i)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
                              previewPosIdx === i ? 'bg-[#ec4899] text-white border-[#ec4899]' : 'bg-white/5 border-white/10 text-white/60'
                            }`}
                          >
                            {p.role}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bullets */}
                  <ul className="space-y-2 mt-4">
                    {displayBullets.map((b, i) => (
                      <li key={i} className="text-xs text-white/70 flex items-start gap-2 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  {displayTech && displayTech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-white/10">
                      {displayTech.map(t => (
                        <span key={t} className="px-2.5 py-1 text-xs font-mono rounded bg-white/5 text-white/80 border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── MODAL 2: DYNAMIC CATEGORY MANAGER (Phase 4) ── */}
      {showCategoryManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl p-6 md:p-8 bg-[#0d0d1a] border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="text-base font-mono uppercase font-bold text-white tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#a855f7]" />
                <span>Dynamic Category & Filter Manager</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryManager(false)}
                className="p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Form */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 mb-6">
              <span className="text-xs font-mono font-bold text-[#a855f7] uppercase tracking-wider block">
                {editingCatId ? 'Edit Category' : 'Create New Category'}
              </span>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Display Label *">
                  <input
                    className={inputCls}
                    value={catForm.name}
                    onChange={e => setCatForm(c => ({ ...c, name: e.target.value }))}
                    placeholder="e.g. Internships"
                  />
                </Field>
                <Field label="Slug / Key *">
                  <input
                    className={inputCls}
                    value={catForm.slug}
                    onChange={e => setCatForm(c => ({ ...c, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="e.g. internship"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Hex Accent Color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={catForm.color}
                      onChange={e => setCatForm(c => ({ ...c, color: e.target.value }))}
                      className="w-10 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      className={inputCls}
                      value={catForm.color}
                      onChange={e => setCatForm(c => ({ ...c, color: e.target.value }))}
                    />
                  </div>
                </Field>

                <Field label="Order">
                  <input
                    type="number"
                    className={inputCls}
                    value={catForm.order}
                    onChange={e => setCatForm(c => ({ ...c, order: +e.target.value }))}
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#a855f7] hover:bg-[#c084fc] transition-colors"
                >
                  {editingCatId ? 'Update Category' : 'Add Category'}
                </button>
                {editingCatId && (
                  <button
                    type="button"
                    onClick={() => {
                      setCatForm(emptyCategory);
                      setEditingCatId(null);
                    }}
                    className="px-3 py-2 text-xs font-mono text-white/50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Existing Categories List */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider block">
                Active Categories ({categories.length})
              </span>
              {categories.map(c => (
                <div key={c._id || c.slug} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-xs font-bold font-mono text-white">{c.name}</span>
                    <span className="text-[10px] font-mono text-white/40">slug: {c.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCatForm({ ...c });
                        setEditingCatId(c._id || null);
                      }}
                      className="text-xs font-mono text-[#00d4ff] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(c._id!)}
                      className="text-xs font-mono text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

