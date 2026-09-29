'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProjectMetric {
  value: string;
  label: string;
  description?: string;
  visible?: boolean;
}

interface RelatedExperience {
  id: string;
  role: string;
  company: string;
}

interface Project {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  tags: string[];
  status: 'Live' | 'In Development' | 'MVP' | 'Research' | 'Private' | 'Archived';
  liveUrl: string;
  githubUrl: string;
  documentationUrl: string;
  highlights: string[];
  order: number;
  featured: boolean;
  featuredOrder?: number;
  imageUrl?: string;
  gallery: string[];
  videoUrl?: string;
  category?: string;
  problem?: string;
  solution?: string;
  features: string[];
  contributions: string[];
  challenges?: string;
  decisions?: string;
  learnings?: string;
  architectureClient?: string;
  architectureApi?: string;
  architectureDb?: string;
  architectureDiagram?: string;
  architectureDescription?: string;
  metrics: ProjectMetric[];
  relatedExperiences: RelatedExperience[];
  published: boolean;
}

const empty: Project = {
  title: '', slug: '', shortDescription: '', description: '', techStack: [], tags: [],
  status: 'In Development', liveUrl: '', githubUrl: '', documentationUrl: '', highlights: [],
  order: 0, featured: false, gallery: [], features: [], contributions: [], metrics: [], relatedExperiences: [],
  published: true, category: 'fullstack'
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

export default function AdminProjects() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [projects, setProjects]       = useState<Project[]>([]);
  const [form, setForm]               = useState<Project>(empty);
  const [editing, setEditing]         = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [msg, setMsg]                 = useState('');
  const [adminFilter, setAdminFilter] = useState<string>('all');
  const [activeTab, setActiveTab]     = useState('General');

  // Input states for arrays
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [contributionInput, setContributionInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  // Experiences for relationships
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => { if (sessionStatus === 'unauthenticated') router.push('/admin/login'); }, [sessionStatus, router]);

  const load = () => {
    fetch('/api/projects').then(r => r.json()).then(data => { if (Array.isArray(data)) setProjects(data); }).catch(() => {});
    fetch('/api/experience').then(r => r.json()).then(data => { if (Array.isArray(data)) setExperiences(data); }).catch(() => {});
  };

  useEffect(() => { if (sessionStatus === 'authenticated') load(); }, [sessionStatus]);

  const slugify = (text: string) => text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editing && form.title === form.slug || !form.slug) {
      setForm(f => ({ ...f, title, slug: slugify(title) }));
    } else {
      setForm(f => ({ ...f, title }));
    }
  };

  const save = async () => {
    setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/projects/${editing}` : '/api/projects';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(editing ? 'Project updated!' : 'Project created!');
    setForm(empty); setEditing(null);
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
    await fetch(`/api/projects/${p._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, order: newOrder }) });
    load();
  };

  const startEdit = (p: Project) => {
    setForm({ 
      ...empty, 
      ...p, 
      techStack: p.techStack || [], 
      tags: p.tags || [], 
      highlights: p.highlights || [],
      gallery: p.gallery || [],
      features: p.features || [],
      contributions: p.contributions || [],
      metrics: p.metrics || [],
      relatedExperiences: p.relatedExperiences || []
    });
    setEditing(p._id!);
    setActiveTab('General');
  };

  const addArrayItem = (field: 'techStack' | 'tags' | 'highlights' | 'features' | 'contributions' | 'gallery', input: string, setInput: (v: string) => void) => {
    if (input.trim()) { setForm(f => ({ ...f, [field]: [...f[field], input.trim()] })); setInput(''); }
  };

  const removeArrayItem = (field: 'techStack' | 'tags' | 'highlights' | 'features' | 'contributions' | 'gallery', idx: number) => {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  };

  if (sessionStatus === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-white/30 hover:text-[#00d4ff] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Projects <span style={{ color: '#00d4ff' }}>CRUD</span>
        </h1>
      </div>

      {msg && <div className="mb-6 px-4 py-3 rounded-xl text-xs font-mono text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20">{msg}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Form */}
        <div className="xl:col-span-7 rounded-2xl flex flex-col" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(0,212,255,0.12)' }}>
          <div className="p-4 border-b border-white/10 flex flex-wrap gap-2">
            {['General', 'Content', 'Tech & Tags', 'Links & Media', 'Architecture', 'Relationships'].map(t => (
              <button 
                key={t} onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${activeTab === t ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-white/40 hover:text-white'}`}
              >{t}</button>
            ))}
          </div>

          <div className="p-7 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            <h2 className="text-sm font-mono tracking-widest uppercase text-[#00d4ff] mb-6">{editing ? 'Edit Project' : 'New Project'}</h2>
            
            <div className="flex flex-col gap-5">
              {activeTab === 'General' && (
                <>
                  <Field label="Title"><input className={inputCls} value={form.title} onChange={handleTitleChange} placeholder="Project title" /></Field>
                  <Field label="Slug"><input className={inputCls} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} placeholder="project-slug" /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Category">
                      <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        {Object.keys(categoryLabels).map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
                      </select>
                    </Field>
                    <Field label="Status">
                      <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                        {['Live', 'In Development', 'MVP', 'Research', 'Private', 'Archived'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Order (Lower = First)"><input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} /></Field>
                    <Field label="Featured Order"><input type="number" className={inputCls} value={form.featuredOrder || ''} onChange={e => setForm(f => ({ ...f, featuredOrder: +e.target.value }))} /></Field>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-cyan-400" />
                      <span className="text-sm font-mono">Featured Project</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-cyan-400" />
                      <span className="text-sm font-mono">Published</span>
                    </label>
                  </div>
                </>
              )}

              {activeTab === 'Content' && (
                <>
                  <Field label="Short Description (Cards)"><textarea className={`${inputCls} h-20 resize-none`} value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="One liner for cards" /></Field>
                  <Field label="Long Description (Case Study)"><textarea className={`${inputCls} h-32`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detailed description" /></Field>
                  <Field label="The Problem"><textarea className={`${inputCls} h-24`} value={form.problem || ''} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} /></Field>
                  <Field label="The Solution"><textarea className={`${inputCls} h-24`} value={form.solution || ''} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} /></Field>
                  <Field label="Challenges"><textarea className={`${inputCls} h-24`} value={form.challenges || ''} onChange={e => setForm(f => ({ ...f, challenges: e.target.value }))} /></Field>
                  <Field label="Decisions & Trade-offs"><textarea className={`${inputCls} h-24`} value={form.decisions || ''} onChange={e => setForm(f => ({ ...f, decisions: e.target.value }))} /></Field>
                  <Field label="Learnings"><textarea className={`${inputCls} h-24`} value={form.learnings || ''} onChange={e => setForm(f => ({ ...f, learnings: e.target.value }))} /></Field>
                  
                  <ArrayField label="Highlights (Card Bullets)" items={form.highlights} input={highlightInput} setInput={setHighlightInput} onAdd={() => addArrayItem('highlights', highlightInput, setHighlightInput)} onRemove={(i: number) => removeArrayItem('highlights', i)} />
                  <ArrayField label="Features (Case Study)" items={form.features} input={featureInput} setInput={setFeatureInput} onAdd={() => addArrayItem('features', featureInput, setFeatureInput)} onRemove={(i: number) => removeArrayItem('features', i)} />
                  <ArrayField label="My Contributions" items={form.contributions} input={contributionInput} setInput={setContributionInput} onAdd={() => addArrayItem('contributions', contributionInput, setContributionInput)} onRemove={(i: number) => removeArrayItem('contributions', i)} />
                </>
              )}

              {activeTab === 'Tech & Tags' && (
                <>
                  <ArrayField label="Tech Stack (e.g. Next.js, MongoDB)" items={form.techStack} input={techInput} setInput={setTechInput} onAdd={() => addArrayItem('techStack', techInput, setTechInput)} onRemove={(i: number) => removeArrayItem('techStack', i)} />
                  <ArrayField label="Tags (e.g. Full Stack, AI, Real-time)" items={form.tags} input={tagInput} setInput={setTagInput} onAdd={() => addArrayItem('tags', tagInput, setTagInput)} onRemove={(i: number) => removeArrayItem('tags', i)} />
                </>
              )}

              {activeTab === 'Links & Media' && (
                <>
                  <Field label="Hero Image URL"><input className={inputCls} value={form.imageUrl || ''} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." /></Field>
                  {form.imageUrl && <div className="h-32 rounded-xl overflow-hidden border border-white/10"><img src={form.imageUrl} className="w-full h-full object-cover" /></div>}
                  <Field label="Video URL (Optional)"><input className={inputCls} value={form.videoUrl || ''} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://..." /></Field>
                  <ArrayField label="Gallery Image URLs" items={form.gallery} input={galleryInput} setInput={setGalleryInput} onAdd={() => addArrayItem('gallery', galleryInput, setGalleryInput)} onRemove={(i: number) => removeArrayItem('gallery', i)} />
                  <Field label="GitHub URL"><input className={inputCls} value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." /></Field>
                  <Field label="Live Demo URL"><input className={inputCls} value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." /></Field>
                  <Field label="Documentation URL"><input className={inputCls} value={form.documentationUrl || ''} onChange={e => setForm(f => ({ ...f, documentationUrl: e.target.value }))} placeholder="https://..." /></Field>
                </>
              )}

              {activeTab === 'Architecture' && (
                <>
                  <Field label="Client Layer Label"><input className={inputCls} value={form.architectureClient || ''} onChange={e => setForm(f => ({ ...f, architectureClient: e.target.value }))} placeholder="e.g. React / Next.js" /></Field>
                  <Field label="API / Engine Layer Label"><input className={inputCls} value={form.architectureApi || ''} onChange={e => setForm(f => ({ ...f, architectureApi: e.target.value }))} placeholder="e.g. Node.js / PyTorch" /></Field>
                  <Field label="Database / Infrastructure Label"><input className={inputCls} value={form.architectureDb || ''} onChange={e => setForm(f => ({ ...f, architectureDb: e.target.value }))} placeholder="e.g. MongoDB" /></Field>
                  <Field label="Architecture Diagram URL"><input className={inputCls} value={form.architectureDiagram || ''} onChange={e => setForm(f => ({ ...f, architectureDiagram: e.target.value }))} placeholder="https://..." /></Field>
                  <Field label="Architecture Description"><textarea className={`${inputCls} h-24`} value={form.architectureDescription || ''} onChange={e => setForm(f => ({ ...f, architectureDescription: e.target.value }))} /></Field>
                </>
              )}

              {activeTab === 'Relationships' && (
                <>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <label className="block text-xs font-mono text-white/30 mb-3 tracking-widest uppercase">Metrics</label>
                    {form.metrics.map((m, i) => (
                      <div key={i} className="flex gap-2 mb-2 items-center">
                        <input className={inputCls} style={{ width: '80px' }} value={m.value} onChange={e => { const nm = [...form.metrics]; nm[i].value = e.target.value; setForm({ ...form, metrics: nm })}} placeholder="Value" />
                        <input className={inputCls} style={{ width: '120px' }} value={m.label} onChange={e => { const nm = [...form.metrics]; nm[i].label = e.target.value; setForm({ ...form, metrics: nm })}} placeholder="Label" />
                        <input className={inputCls} style={{ flex: 1 }} value={m.description || ''} onChange={e => { const nm = [...form.metrics]; nm[i].description = e.target.value; setForm({ ...form, metrics: nm })}} placeholder="Description" />
                        <button onClick={() => setForm({ ...form, metrics: form.metrics.filter((_, j) => j !== i)})} className="text-red-400">×</button>
                      </div>
                    ))}
                    <button onClick={() => setForm({ ...form, metrics: [...form.metrics, { value: '', label: '', description: '', visible: true }]})} className={btnSm}>+ Add Metric</button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <label className="block text-xs font-mono text-white/30 mb-3 tracking-widest uppercase">Related Experiences</label>
                    <select className={inputCls} onChange={e => {
                      const ex = experiences.find(x => x._id === e.target.value);
                      if (ex && !form.relatedExperiences.some(re => re.id === ex._id)) {
                        setForm({ ...form, relatedExperiences: [...form.relatedExperiences, { id: ex._id, role: ex.role, company: ex.company }]});
                      }
                      e.target.value = '';
                    }}>
                      <option value="">Select Experience...</option>
                      {experiences.map(ex => <option key={ex._id} value={ex._id}>{ex.role} @ {ex.company}</option>)}
                    </select>
                    <div className="mt-3 flex flex-col gap-2">
                      {form.relatedExperiences.map((re, i) => (
                        <div key={re.id} className="flex justify-between items-center p-2 rounded bg-white/10 text-xs font-mono">
                          <span>{re.role} @ {re.company}</span>
                          <button onClick={() => setForm({ ...form, relatedExperiences: form.relatedExperiences.filter((_, j) => j !== i)})} className="text-red-400">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-3 mt-8">
              <button onClick={save} disabled={loading || !form.title || !form.slug} className="flex-1 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>
                {loading ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
              </button>
              {editing && (
                <button onClick={() => { setForm(empty); setEditing(null); setActiveTab('General'); }} className="px-4 py-3 text-sm font-mono text-white/40 rounded-xl border border-white/10 hover:border-red-500/30 hover:text-red-400 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="xl:col-span-5 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
            {['all', ...Object.keys(categoryLabels)].map(cat => (
              <button
                key={cat} onClick={() => setAdminFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all capitalize ${adminFilter === cat ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-white/40 hover:text-white'}`}
              >{cat === 'all' ? 'All' : categoryLabels[cat] || cat}</button>
            ))}
          </div>

          {projects.filter(p => adminFilter === 'all' || p.category === adminFilter).map(p => (
            <div key={p._id} className="rounded-2xl p-5 flex flex-col gap-3 border border-white/10 hover:border-[#00d4ff]/30 transition-all bg-black/40">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{p.title}</span>
                    {!p.published && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 rounded">Draft</span>}
                    {p.featured && <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 rounded">Featured</span>}
                  </div>
                  <div className="text-[10px] text-white/40 mt-1">{p.slug}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveOrder(p, 'up')} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded">▲</button>
                  <button onClick={() => moveOrder(p, 'down')} className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded">▼</button>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2 border-t border-white/5 pt-3">
                <button onClick={() => startEdit(p)} className="text-[11px] font-mono text-[#00d4ff] hover:underline">Edit</button>
                <button onClick={() => del(p._id!)} className="text-[11px] font-mono text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
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

function ArrayField({ label, items, input, setInput, onAdd, onRemove }: any) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input className={`${inputCls} flex-1`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())} />
        <button onClick={onAdd} className={btnSm}>+</button>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {items.map((item: string, i: number) => (
          <div key={i} className="flex items-start gap-2 text-xs text-white/50 bg-white/5 p-2 rounded">
            <span className="flex-1 overflow-hidden text-ellipsis">{item}</span>
            <button onClick={() => onRemove(i)} className="text-white/20 hover:text-red-400">×</button>
          </div>
        ))}
      </div>
    </Field>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20';
const btnSm    = 'px-3 py-2.5 text-sm font-mono text-[#00d4ff] rounded-xl border border-[#00d4ff]/20 hover:bg-[#00d4ff]/10 transition-all';
