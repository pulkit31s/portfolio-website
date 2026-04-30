'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Experience {
  _id?: string;
  role: string;
  company: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  techStack: string[];
  order: number;
}

const empty: Experience = {
  role: '', company: '', type: 'internship', location: '', startDate: '',
  endDate: '', current: false, bullets: [], techStack: [], order: 0,
};

const typeColors: Record<string, string> = {
  internship: '#00d4ff', research: '#f59e0b', club: '#7c3aed',
  leadership: '#ec4899', 'part-time': '#10b981',
};

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20';
const btnSm    = 'px-3 py-2.5 text-sm font-mono text-[#00d4ff] rounded-xl border border-[#00d4ff]/20 hover:bg-[#00d4ff]/10 transition-all';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

export default function AdminExperience() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm]               = useState<Experience>(empty);
  const [editing, setEditing]         = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [msg, setMsg]                 = useState('');
  const [bulletInput, setBulletInput] = useState('');
  const [techInput, setTechInput]     = useState('');

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/experience').then(r => r.json()).then(setExperiences).catch(() => {});

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const save = async () => {
    setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/experience/${editing}` : '/api/experience';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(editing ? 'Experience updated!' : 'Experience created!');
    setForm(empty); setEditing(null); setBulletInput(''); setTechInput('');
    load();
    setTimeout(() => setMsg(''), 3000);
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    load();
  };

  const startEdit = (e: Experience) => { setForm({ ...e, endDate: e.endDate || '' }); setEditing(e._id!); };

  const addBullet = () => {
    if (bulletInput.trim()) { setForm(f => ({ ...f, bullets: [...f.bullets, bulletInput.trim()] })); setBulletInput(''); }
  };
  const addTech = () => {
    if (techInput.trim()) { setForm(f => ({ ...f, techStack: [...f.techStack, techInput.trim()] })); setTechInput(''); }
  };

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-white/30 hover:text-[#00d4ff] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Experience <span style={{ color: '#7c3aed' }}>CRUD</span>
        </h1>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl text-xs font-mono text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="rounded-2xl p-7" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#7c3aed] mb-6">
            {editing ? 'Edit Experience' : 'New Experience'}
          </h2>

          <div className="flex flex-col gap-4">
            <Field label="Role / Title">
              <input className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Head of Web Development" />
            </Field>

            <Field label="Company / Organisation">
              <input className={inputCls} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. NSCC VIT Chennai" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {['internship', 'research', 'club', 'leadership', 'part-time'].map(t => (
                    <option key={t} value={t} className="bg-[#0d0d1a]">{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Order">
                <input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
              </Field>
            </div>

            <Field label="Location">
              <input className={inputCls} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Chennai, India" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date">
                <input className={inputCls} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} placeholder="e.g. Apr 2025" />
              </Field>
              <Field label="End Date">
                <input className={inputCls} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} placeholder="e.g. Jul 2025" disabled={form.current} />
              </Field>
            </div>

            <Field label="Currently Active">
              <div className="flex items-center gap-2 h-[38px]">
                <input type="checkbox" checked={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.checked }))} className="w-4 h-4 accent-purple-400" />
                <span className="text-xs font-mono text-white/40">Mark as ongoing</span>
              </div>
            </Field>

            {/* Bullets */}
            <Field label="Bullet Points">
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} value={bulletInput} onChange={e => setBulletInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addBullet())} placeholder="Add achievement bullet..." />
                <button onClick={addBullet} className={btnSm}>+</button>
              </div>
              <ul className="mt-2 space-y-1.5">
                {form.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">›</span>
                    <span className="flex-1">{b}</span>
                    <button onClick={() => setForm(f => ({ ...f, bullets: f.bullets.filter((_, j) => j !== i) }))} className="text-white/20 hover:text-red-400 flex-shrink-0">×</button>
                  </li>
                ))}
              </ul>
            </Field>

            {/* Tech stack */}
            <Field label="Tech Stack">
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="Add technology..." />
                <button onClick={addTech} className={btnSm}>+</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.techStack.map((t, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded" style={{ background: 'rgba(124,58,237,0.1)', color: 'rgba(168,85,247,0.7)' }}>
                    {t}
                    <button onClick={() => setForm(f => ({ ...f, techStack: f.techStack.filter((_, j) => j !== i) }))} className="text-white/30 hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            </Field>

            <div className="flex gap-3 mt-2">
              <button onClick={save} disabled={loading || !form.role || !form.company} className="flex-1 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
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
          {experiences.length === 0 && (
            <div className="text-white/20 text-xs font-mono text-center py-10">No experiences yet. Create one!</div>
          )}
          {experiences.map(exp => {
            const color = typeColors[exp.type] || '#00d4ff';
            return (
              <div key={exp._id} className="rounded-xl p-5 transition-all" style={{ background: 'rgba(13,13,26,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>{exp.role}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded font-mono capitalize" style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}>{exp.type}</span>
                      {exp.current && <span className="text-xs px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">Active</span>}
                    </div>
                    <p className="text-xs text-white/40 font-mono">{exp.company}</p>
                    <p className="text-xs text-white/25 font-mono mt-0.5">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                    <p className="text-xs text-white/25 mt-1">{exp.bullets.length} bullet{exp.bullets.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(exp)} className="px-3 py-1.5 text-xs font-mono text-[#7c3aed] rounded-lg border border-[#7c3aed]/20 hover:bg-[#7c3aed]/10 transition-all">Edit</button>
                    <button onClick={() => del(exp._id!)} className="px-3 py-1.5 text-xs font-mono text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Del</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
