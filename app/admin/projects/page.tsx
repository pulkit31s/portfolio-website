'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  _id?: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl?: string;
  category?: string;
  architectureClient?: string;
  architectureApi?: string;
  architectureDb?: string;
  architectureDiagram?: string;
  highlights: string[];
  featured: boolean;
  order: number;
}

const empty: Project = {
  title: '', description: '', techStack: [], liveUrl: '', githubUrl: '',
  imageUrl: '', category: 'fullstack', highlights: [], featured: false, order: 0,
};

const categoryColors: Record<string, string> = {
  fullstack:  '#00d4ff',
  ml:         '#f59e0b',
  cloud:      '#7c3aed',
  web:        '#ec4899',
  blockchain: '#10b981',
};

const categoryLabels: Record<string, string> = {
  fullstack:  'Full Stack & MERN',
  ml:         'AI / ML & Research',
  cloud:      'Cloud & DevOps',
  web:        'Web Development',
  blockchain: 'Blockchain',
};

function CustomCategorySelect({
  value,
  onChange,
  onAddCustom,
  allCategories,
}: {
  value: string;
  onChange: (val: string) => void;
  onAddCustom: (val: string) => void;
  allCategories: string[];
}) {
  const [open, setOpen]                 = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customText, setCustomText]     = useState('');

  const currentCat   = value || 'fullstack';
  const currentColor = categoryColors[currentCat] || '#00d4ff';
  const currentLabel = categoryLabels[currentCat] || currentCat;

  const presetCats   = ['fullstack', 'ml', 'cloud', 'web', 'blockchain'];
  const combinedCats = Array.from(new Set([...presetCats, ...allCategories]));

  return (
    <div className="relative flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-between text-white transition-all select-none"
        style={{
          background: 'rgba(13, 13, 26, 0.95)',
          border: `1px solid ${open ? currentColor : 'rgba(255, 255, 255, 0.12)'}`,
          boxShadow: open ? `0 0 15px ${currentColor}30` : 'none',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: currentColor }} />
          <span style={{ color: currentColor }}>
            {currentLabel}
          </span>
          <span className="text-[10px] text-white/30 font-mono">({currentColor})</span>
        </div>
        <span className="text-white/40 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 overflow-hidden backdrop-blur-2xl"
          style={{
            background: '#0d0d1a',
            border: '1px solid rgba(0,212,255,0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
          }}
        >
          {combinedCats.map(cat => {
            const color = categoryColors[cat] || '#00d4ff';
            const label = categoryLabels[cat] || cat;
            const isSelected = value === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onChange(cat);
                  setIsCustomMode(false);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all"
                style={{
                  background: isSelected ? `${color}25` : 'transparent',
                  color: isSelected ? color : 'rgba(255, 255, 255, 0.85)',
                  border: isSelected ? `1px solid ${color}50` : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span>{label}</span>
                </div>
                <span className="text-[10px] font-mono text-white/30">{color}</span>
              </button>
            );
          })}

          <div className="my-1 border-t border-white/10" />

          <button
            type="button"
            onClick={() => {
              setIsCustomMode(true);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all font-bold flex items-center gap-2"
          >
            <span>✏️</span>
            <span>+ Add Custom Category Tag...</span>
          </button>
        </div>
      )}

      {(isCustomMode || (!presetCats.includes(value) && value !== '')) && (
        <div className="flex gap-2 mt-1">
          <input
            className={inputCls}
            value={customText || (!presetCats.includes(value) ? value : '')}
            onChange={e => {
              setCustomText(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Type custom category tag name..."
          />
          <button
            type="button"
            onClick={() => {
              if (customText.trim()) {
                onAddCustom(customText.trim());
                onChange(customText.trim());
                setIsCustomMode(false);
              }
            }}
            className="px-4 py-2.5 text-xs font-mono text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-xl font-bold hover:bg-[#00d4ff]/20 transition-all flex-shrink-0"
          >
            Save Tag
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminProjects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects]       = useState<Project[]>([]);
  const [form, setForm]               = useState<Project>(empty);
  const [editing, setEditing]         = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [msg, setMsg]                 = useState('');
  const [techInput, setTechInput]           = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [adminFilter, setAdminFilter]       = useState<string>('all');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
          const dbCats = Array.from(new Set(data.map((p: Project) => p.category).filter(Boolean))) as string[];
          setCustomCategories(dbCats);
        }
      })
      .catch(() => {});

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const save = async () => {
    setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/projects/${editing}` : '/api/projects';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(editing ? 'Project updated!' : 'Project created!');
    setForm(empty); setEditing(null); setTechInput(''); setHighlightInput('');
    load();
    setTimeout(() => setMsg(''), 3000);
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    load();
  };

  const moveOrder = async (p: Project, dir: 'up' | 'down') => {
    const newOrder = dir === 'up' ? Math.max(0, (p.order || 0) - 1) : (p.order || 0) + 1;
    await fetch(`/api/projects/${p._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, order: newOrder }),
    });
    load();
  };

  const startEdit = (p: Project) => {
    setForm({ ...p, liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '' });
    setEditing(p._id!);
  };

  const addTech = () => {
    if (techInput.trim()) { setForm(f => ({ ...f, techStack: [...f.techStack, techInput.trim()] })); setTechInput(''); }
  };

  const addHighlight = () => {
    if (highlightInput.trim()) { setForm(f => ({ ...f, highlights: [...f.highlights, highlightInput.trim()] })); setHighlightInput(''); }
  };

  const allAdminCats = Array.from(new Set([
    'fullstack', 'ml', 'cloud', 'web', 'blockchain',
    ...customCategories,
    ...projects.map(p => p.category).filter(Boolean) as string[],
  ]));

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-white/30 hover:text-[#00d4ff] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Projects <span style={{ color: '#00d4ff' }}>CRUD</span>
        </h1>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl text-xs font-mono text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="rounded-2xl p-7" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(0,212,255,0.12)' }}>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#00d4ff] mb-6">
            {editing ? 'Edit Project' : 'New Project'}
          </h2>

          <div className="flex flex-col gap-4">
            {/* Title */}
            <Field label="Title">
              <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title" />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea className={`${inputCls} h-24 resize-none`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
            </Field>

            {/* Tech Stack */}
            <Field label="Tech Stack">
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="Add tech (press Enter)" />
                <button onClick={addTech} className={btnSm}>+</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.techStack.map((t, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded" style={{ background: 'rgba(0,212,255,0.08)', color: 'rgba(0,212,255,0.7)' }}>
                    {t}
                    <button onClick={() => setForm(f => ({ ...f, techStack: f.techStack.filter((_, j) => j !== i) }))} className="text-white/30 hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            </Field>

            {/* Highlights */}
            <Field label="Highlights">
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} value={highlightInput} onChange={e => setHighlightInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())} placeholder="Add bullet point" />
                <button onClick={addHighlight} className={btnSm}>+</button>
              </div>
              <ul className="mt-2 space-y-1">
                {form.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="text-[#00d4ff] mt-0.5">›</span>
                    <span className="flex-1">{h}</span>
                    <button onClick={() => setForm(f => ({ ...f, highlights: f.highlights.filter((_, j) => j !== i) }))} className="text-white/20 hover:text-red-400">×</button>
                  </li>
                ))}
              </ul>
            </Field>

            {/* URLs */}
            <Field label="GitHub URL">
              <input className={inputCls} value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
            </Field>
            <Field label="Live URL">
              <input className={inputCls} value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." />
            </Field>
            <Field label="Image / Banner Screenshot URL">
              <input className={inputCls} value={form.imageUrl || ''} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://images.unsplash.com/..." />
              {form.imageUrl && (
                <div className="mt-2 h-24 rounded-lg overflow-hidden border border-white/10 relative bg-black/40">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => ((e.currentTarget as HTMLElement).style.display = 'none')} />
                </div>
              )}
            </Field>

            {/* System Architecture Customize Fields */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
              <span className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest font-bold">
                📐 Architecture Diagram Customizer
              </span>
              <Field label="Client Layer Label">
                <input className={inputCls} value={form.architectureClient || ''} onChange={e => setForm(f => ({ ...f, architectureClient: e.target.value }))} placeholder="e.g. React / Next.js 14 SSR" />
              </Field>
              <Field label="API / Engine Layer Label">
                <input className={inputCls} value={form.architectureApi || ''} onChange={e => setForm(f => ({ ...f, architectureApi: e.target.value }))} placeholder="e.g. Node.js / PyTorch REST API" />
              </Field>
              <Field label="Database / Infrastructure Label">
                <input className={inputCls} value={form.architectureDb || ''} onChange={e => setForm(f => ({ ...f, architectureDb: e.target.value }))} placeholder="e.g. MongoDB Atlas / Azure App Service" />
              </Field>
              <Field label="Architecture Diagram Image URL (Optional)">
                <input className={inputCls} value={form.architectureDiagram || ''} onChange={e => setForm(f => ({ ...f, architectureDiagram: e.target.value }))} placeholder="https://..." />
              </Field>
            </div>

            {/* Category Custom Dropdown Selector */}
            <Field label="Category Tag (Color Code Filter)">
              <CustomCategorySelect
                value={form.category || 'fullstack'}
                onChange={cat => setForm(f => ({ ...f, category: cat }))}
                onAddCustom={newCat => setCustomCategories(c => Array.from(new Set([...c, newCat])))}
                allCategories={customCategories}
              />
            </Field>

            {/* Order & Featured */}
            <div className="flex gap-4">
              <Field label="Order">
                <input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
              </Field>
              <Field label="Featured">
                <div className="flex items-center h-[42px]">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-cyan-400" />
                </div>
              </Field>
            </div>

            <div className="flex gap-3 mt-2">
              <button onClick={save} disabled={loading || !form.title} className="flex-1 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>
                {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              {editing && (
                <button onClick={() => { setForm(empty); setEditing(null); }} className="px-4 py-3 text-sm font-mono text-white/40 rounded-xl border border-white/10 hover:border-red-500/30 hover:text-red-400 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {/* Admin list category filter bar */}
          <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
            {['all', ...allAdminCats].map(cat => {
              const active = adminFilter === cat;
              const color  = categoryColors[cat] || '#00d4ff';
              return (
                <button
                  key={cat}
                  onClick={() => setAdminFilter(cat)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono transition-all capitalize"
                  style={{
                    background: active ? `${color}25` : 'transparent',
                    color:      active ? color : 'rgba(255,255,255,0.4)',
                    border:     `1px solid ${active ? color + '40' : 'transparent'}`,
                  }}
                >
                  {cat === 'all' ? 'All' : categoryLabels[cat] || cat}
                </button>
              );
            })}
          </div>

          {projects.length === 0 && (
            <div className="text-white/20 text-xs font-mono text-center py-10">No projects yet. Create one!</div>
          )}

          {projects
            .filter(p => adminFilter === 'all' || (p.category || 'fullstack') === adminFilter)
            .map(p => {
              const catKey   = p.category || 'fullstack';
              const catColor = categoryColors[catKey] || '#00d4ff';
              const catName  = categoryLabels[catKey] || catKey;
              return (
                <div
                  key={p._id}
                  className="rounded-2xl p-5 flex items-start justify-between gap-4 group transition-all hover:border-[#00d4ff]/30"
                  style={{
                    background: 'rgba(13,13,26,0.6)',
                    border: `1px solid ${catColor}20`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-sm font-black text-white truncate" style={{ fontFamily: "'Courier New', monospace" }}>{p.title}</span>
                      {p.featured && <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>★ Featured</span>}
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{
                          background: `${catColor}15`,
                          color: catColor,
                          border: `1px solid ${catColor}35`,
                        }}
                      >
                        ● {catName}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 line-clamp-2 mb-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.techStack.slice(0, 5).map(t => (
                        <span key={t} className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => moveOrder(p, 'up')} title="Move Up" className="px-2 py-1 text-xs font-mono text-white/60 rounded-lg border border-white/10 hover:bg-white/10 transition-all">▲</button>
                    <button onClick={() => moveOrder(p, 'down')} title="Move Down" className="px-2 py-1 text-xs font-mono text-white/60 rounded-lg border border-white/10 hover:bg-white/10 transition-all">▼</button>
                    <button onClick={() => startEdit(p)} className="px-3 py-1.5 text-xs font-mono text-[#00d4ff] rounded-lg border border-[#00d4ff]/20 hover:bg-[#00d4ff]/10 transition-all">Edit</button>
                    <button onClick={() => del(p._id!)} className="px-3 py-1.5 text-xs font-mono text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Del</button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20';
const btnSm    = 'px-3 py-2.5 text-sm font-mono text-[#00d4ff] rounded-xl border border-[#00d4ff]/20 hover:bg-[#00d4ff]/10 transition-all';
