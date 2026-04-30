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
  highlights: string[];
  featured: boolean;
  order: number;
}

const empty: Project = {
  title: '', description: '', techStack: [], liveUrl: '', githubUrl: '',
  highlights: [], featured: false, order: 0,
};

export default function AdminProjects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm]         = useState<Project>(empty);
  const [editing, setEditing]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState('');
  const [techInput, setTechInput]           = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {});

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
        <div className="flex flex-col gap-3">
          {projects.length === 0 && (
            <div className="text-white/20 text-xs font-mono text-center py-10">No projects yet. Create one!</div>
          )}
          {projects.map(p => (
            <div key={p._id} className="rounded-xl p-5 flex items-start justify-between gap-4 group transition-all hover:border-[#00d4ff]/20" style={{ background: 'rgba(13,13,26,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-black text-white truncate" style={{ fontFamily: "'Courier New', monospace" }}>{p.title}</span>
                  {p.featured && <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>★</span>}
                </div>
                <p className="text-xs text-white/30 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.techStack.slice(0, 4).map(t => (
                    <span key={t} className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: 'rgba(168,85,247,0.7)' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(p)} className="px-3 py-1.5 text-xs font-mono text-[#00d4ff] rounded-lg border border-[#00d4ff]/20 hover:bg-[#00d4ff]/10 transition-all">Edit</button>
                <button onClick={() => del(p._id!)} className="px-3 py-1.5 text-xs font-mono text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Del</button>
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

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20';
const btnSm    = 'px-3 py-2.5 text-sm font-mono text-[#00d4ff] rounded-xl border border-[#00d4ff]/20 hover:bg-[#00d4ff]/10 transition-all';
